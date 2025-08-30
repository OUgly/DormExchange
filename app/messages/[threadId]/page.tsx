import { notFound, redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { listThreadsForUser, listMessages } from '@/lib/server/repos/messages'
import MessagesLayout from '@/components/messages/MessagesLayout'
import { actionSendMessage } from '@/app/(actions)/messages'

export default async function ThreadPage({ params }: { params: { threadId: string } }) {
  const { threadId } = params
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/auth/signin?next=/messages/${threadId}`)

  const threads = await listThreadsForUser(user.id)
  const hasThread = threads.some((t) => t.thread.id === threadId)
  if (!hasThread) notFound()
  const messages = await listMessages(threadId, user.id, { limit: 100 })

  const send = actionSendMessage.bind(null, threadId)

  return (
    <MessagesLayout threads={threads} currentThreadId={threadId} messages={messages} sendAction={send} currentUserId={user.id} />
  )
}
