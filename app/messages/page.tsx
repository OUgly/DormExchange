import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { actionSendMessage } from '@/app/(actions)/messages'
import MarkMessagesSeen from '@/components/messages/MarkMessagesSeen'

type SearchParams = {
  listing?: string
  seller?: string
  title?: string
}

export default async function MessagesIndexPage({ 
  searchParams 
}: { 
  searchParams: Promise<SearchParams>
}) {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin?next=/messages')

  const params = await searchParams

  // Load recent messages to build simple conversation list
  let hasMessages = false
  let messageCount = 0
  let recentMessages: Array<{
    id: string
    listing_id: string
    from_user_id: string
    to_user_id: string
    body: string
    listing_title: string | null
    created_at: string
  }> = []
  try {
    const { data, count } = await supabase
      .from('messages')
      .select('id, listing_id, from_user_id, to_user_id, body, listing_title, created_at', { count: 'exact' })
      .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
      .order('created_at', { ascending: false })
      .limit(100)
    recentMessages = data || []
    hasMessages = recentMessages.length > 0
    messageCount = count || recentMessages.length
  } catch (error) {
    console.error('Error checking messages:', error)
  }

  // If someone clicked "Message Seller", show a compose interface
  const isComposing = params.listing && params.seller && params.title

  // When composing, load basic conversation history for this listing
  let conversation: typeof recentMessages = []
  let recipientId: string | null = null
  if (isComposing) {
    try {
      const { data } = await supabase
        .from('messages')
        .select('id, listing_id, from_user_id, to_user_id, body, listing_title, created_at')
        .eq('listing_id', String(params.listing))
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
        .order('created_at', { ascending: true })
      conversation = data || []
      // Compute the other participant; default to the seller id from params
      recipientId = String(params.seller)
      if (recipientId === user.id && conversation.length > 0) {
        const first = conversation[0]
        recipientId = first.from_user_id === user.id ? first.to_user_id : first.from_user_id
      }
    } catch (e) {
      // ignore
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <MarkMessagesSeen />
      <h1 className="text-2xl font-semibold mb-4">Messages</h1>
      
      {isComposing && (
        <div className="mb-6 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-6">
          <h2 className="text-lg font-semibold mb-3 text-blue-300">
            Send message about: {decodeURIComponent(params.title)}
          </h2>
          {conversation.length > 0 && (
            <div className="mb-4 max-h-64 overflow-y-auto rounded-lg border border-blue-500/20 bg-black/20 p-3 space-y-2">
              {conversation.map((m) => (
                <div key={m.id} className={m.from_user_id === user.id ? 'text-right' : 'text-left'}>
                  <div className={`inline-block rounded-lg px-3 py-2 text-sm ${m.from_user_id === user.id ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-100'}`}>
                    <div>{m.body}</div>
                    <div className="mt-1 text-[10px] opacity-70">
                      {new Date(m.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <form
            action={async (fd: FormData) => {
              'use server'
              // params.listing is present because isComposing is truthy
              await actionSendMessage(String(params.listing), fd)
            }}
            className="space-y-4"
          >
            <input type="hidden" name="listingId" value={params.listing} />
            <input type="hidden" name="listingTitle" value={params.title} />
            {recipientId && (
              <input type="hidden" name="recipientId" value={recipientId} />
            )}
            <textarea
              name="body"
              placeholder="Type your message here..."
              className="w-full h-24 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        {hasMessages ? (
          <>
            <h3 className="text-xl font-semibold mb-4">Your conversations</h3>
            <ul className="space-y-3 text-left">
              {(() => {
                const seen = new Set<string>()
                const items: Array<{ key: string; listingId: string; otherId: string; title: string; preview: string; at: string }>=[]
                for (const m of recentMessages) {
                  const otherId = m.from_user_id === user.id ? m.to_user_id : m.from_user_id
                  const key = `${m.listing_id}:${otherId}`
                  if (seen.has(key)) continue
                  seen.add(key)
                  items.push({
                    key,
                    listingId: m.listing_id,
                    otherId,
                    title: m.listing_title || 'Listing',
                    preview: m.body.slice(0, 80),
                    at: new Date(m.created_at).toLocaleString(),
                  })
                }
                return items.slice(0, 20).map((c) => (
                  <li key={c.key} className="rounded-lg border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-medium">{c.title}</div>
                        <div className="text-sm text-gray-400">{c.preview}</div>
                        <div className="text-xs text-gray-500 mt-1">{c.at}</div>
                      </div>
                      <a
                        className="shrink-0 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                        href={`/messages?listing=${c.listingId}&seller=${c.otherId}&title=${encodeURIComponent(c.title)}`}
                      >
                        View
                      </a>
                    </div>
                  </li>
                ))
              })()}
            </ul>
          </>
        ) : (
          <>
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.001 8.001 0 01-7.29-4.678L3 21l5.322-2.71A8.001 8.001 0 0721 12z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No messages yet</h3>
            <p className="text-gray-400 mb-4">When you start conversations with other users, they&apos;ll appear here.</p>
            <p className="text-sm text-gray-500">Browse the marketplace to find items you&apos;re interested in!</p>
          </>
        )}
      </div>
    </main>
  )
}
