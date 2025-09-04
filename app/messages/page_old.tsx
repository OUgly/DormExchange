import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'

export default async function MessagesIndexPage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin?next=/messages')

  // Try to get recent conversations from the messages table
  let hasMessages = false
  try {
    const { data: messages } = await supabase
      .from('messages')
      .select('id, listing_id, created_at')
      .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
      .order('created_at', { ascending: false })
      .limit(1)
    
    hasMessages = messages && messages.length > 0
  } catch (error) {
    console.error('Error checking messages:', error)
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Messages</h1>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        {hasMessages ? (
          <>
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.001 8.001 0 01-7.29-4.678L3 21l5.322-2.71A8.001 8.001 0 0121 12z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">You have messages!</h3>
            <p className="text-gray-400 mb-4">Your message history is available, but the full messaging interface is still being built.</p>
            <p className="text-sm text-gray-500">Check back soon for the complete messaging experience.</p>
          </>
        ) : (
          <>
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.001 8.001 0 01-7.29-4.678L3 21l5.322-2.71A8.001 8.001 0 0121 12z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No messages yet</h3>
            <p className="text-gray-400 mb-4">When you start conversations with other users, they’ll appear here.</p>
            <p className="text-sm text-gray-500">Browse the marketplace to find items you’re interested in!</p>
          </>
        )}
      </div>
    </main>
  )
}
