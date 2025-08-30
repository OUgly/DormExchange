'use client'
import { useEffect, useRef } from 'react'
import MessageBubble from '@/components/messages/MessageBubble'

export default function ChatPane({
  messages,
  sendAction,
  currentUserId,
}: {
  messages: { id: string; body: string; created_at: string; sender_id: string }[]
  sendAction: (formData: FormData) => void | Promise<void>
  currentUserId?: string
}) {
  const listRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex h-[70vh] flex-col">
      <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto p-4">
        {messages.map((m) => (
          <MessageBubble key={m.id} body={m.body} mine={m.sender_id === currentUserId} createdAt={m.created_at} />
        ))}
      </div>
      <form action={sendAction} className="flex items-end gap-2 border-t border-white/10 p-3">
        <textarea
          name="body"
          required
          placeholder="Write a message…"
          className="h-16 flex-1 resize-none rounded-xl border border-white/10 bg-white/5 p-2 text-sm focus:border-yellow-400 focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              const form = e.currentTarget.form
              form?.requestSubmit()
            }
          }}
        />
        <button type="submit" className="rounded-xl bg-accent px-4 py-2 font-medium text-black">
          Send
        </button>
      </form>
    </div>
  )
}
