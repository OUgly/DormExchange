'use client'

import { useState } from 'react'
import listings from '../../../data/listings.json'
import Badge from '@/components/ui/Badge'
import MessageModal from '@/components/ui/MessageModal'
import { notFound } from 'next/navigation'

export default function ListingPage({ params }: any) {
  const listing = listings.find((l) => l.id === params.id)
  const [open, setOpen] = useState(false)

  if (!listing) {
    notFound()
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex gap-4 overflow-x-auto">
        {listing.imageUrls.map((src) => (
          <img
            key={src}
            src={src}
            alt={listing.title}
            className="h-64 w-full flex-shrink-0 rounded-md object-cover sm:w-80"
          />
        ))}
      </div>
      <h1 className="text-2xl font-bold">{listing.title}</h1>
      <p className="text-xl font-semibold">${listing.price}</p>
      <div className="flex gap-2">
        <Badge variant="outline">{listing.campus}</Badge>
        {listing.condition && <Badge variant="outline">{listing.condition}</Badge>}
      </div>
      <p>{listing.description}</p>
      <button
        className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white"
        onClick={() => setOpen(true)}
      >
        Message Seller
      </button>
      <MessageModal
        open={open}
        onClose={() => setOpen(false)}
        listingTitle={listing.title}
        listingId={listing.id}
      />
    </div>
  )
}
