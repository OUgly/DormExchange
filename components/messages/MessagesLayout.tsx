import ThreadList from '@/components/messages/ThreadList'
import ChatPane from '@/components/messages/ChatPane'

export default function MessagesLayout({
  threads,
  currentThreadId,
  messages,
  sendAction,
  currentUserId,
}: {
  threads: any[]
  currentThreadId: string
  messages: any[]
  sendAction: (formData: FormData) => void | Promise<void>
  currentUserId?: string
}) {
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 p-4 md:grid-cols-3">
      <aside className="rounded-2xl border border-white/10 bg-white/5 p-2 md:col-span-1">
        <ThreadList threads={threads} currentThreadId={currentThreadId} />
      </aside>
      <section className="rounded-2xl border border-white/10 bg-white/5 p-0 md:col-span-2">
        <ChatPane messages={messages} sendAction={sendAction} currentUserId={currentUserId} />
      </section>
    </div>
  )
}
