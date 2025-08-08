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
      <div className="w-full max-w-md rounded-lg border border-line bg-panel p-4">
        <h2 className="mb-2 text-lg font-semibold">Message Seller</h2>
        <textarea
          className="mb-4 w-full rounded-md border border-line bg-muted p-2 text-sm text-white"
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            className="rounded-md border border-line px-4 py-2 text-sm"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-accent px-4 py-2 text-sm text-white disabled:opacity-50"
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
