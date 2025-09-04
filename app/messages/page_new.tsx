import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'

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

  // Try to get recent conversations from the messages table
  let hasMessages = false
  let messageCount = 0
  try {
    const { data: messages, count } = await supabase
      .from('messages')
      .select('id, listing_id, created_at', { count: 'exact' })
      .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
      .order('created_at', { ascending: false })
      .limit(10)
    
    hasMessages = messages && messages.length > 0
    messageCount = count || 0
  } catch (error) {
    console.error('Error checking messages:', error)
  }

  // If someone clicked "Message Seller", show a compose interface
  const isComposing = params.listing && params.seller && params.title

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Messages</h1>
      
      {isComposing && (
        <div className="mb-6 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-6">
          <h2 className="text-lg font-semibold mb-3 text-blue-300">
            Send message about: {decodeURIComponent(params.title)}
          </h2>
          <form action="/api/messages" method="POST" className="space-y-4">
            <input type="hidden" name="listingId" value={params.listing} />
            <input type="hidden" name="listingTitle" value={params.title} />
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
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.001 8.001 0 01-7.29-4.678L3 21l5.322-2.71A8.001 8.001 0 0721 12z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">You have {messageCount} message{messageCount !== 1 ? 's' : ''}!</h3>
            <p className="text-gray-400 mb-4">Your message history is available, but the full messaging interface is still being built.</p>
            <p className="text-sm text-gray-500">Check back soon for the complete messaging experience.</p>
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
