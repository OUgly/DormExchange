'use client'

import { useState } from 'react'

interface MessageModalProps {
  open: boolean
  onClose: () => void
  listingTitle: string
  listingId: string
  toUser?: string
}

export default function MessageModal({
  open,
  onClose,
  listingTitle,
  listingId,
}: MessageModalProps) {
  const [body, setBody] = useState('')

  if (!open) return null

  const handleSend = async () => {
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body, listingId, listingTitle }),
    })
    setBody('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 p-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-panel p-4">
        <h2 className="mb-2 text-lg font-semibold">Message Seller</h2>
        <textarea
          className="mb-4 w-full rounded-xl border border-line bg-muted p-2 text-sm text-neutral-300 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/50 min-h-[120px]"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            className="rounded-xl border border-line px-4 py-2 text-sm text-neutral-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded-xl bg-accent px-4 py-2 text-sm text-white hover:bg-accent/90 disabled:opacity-50"
            disabled={!body}
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
