'use client'
import { useState } from 'react'
import MessageModal from '@/components/ui/MessageModal'

export default function MessageSellerButton({ listingId, listingTitle }: { listingId: string; listingTitle: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-accent hover:bg-accent/90 text-black font-semibold py-3 px-4 rounded-xl transition"
      >
        Contact Seller
      </button>
      <MessageModal open={open} onClose={() => setOpen(false)} listingId={listingId} listingTitle={listingTitle} />
    </>
  )
}

