'use client'

import { useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import listings from '../../../data/listings.json'
import Badge from '@/components/ui/Badge'
import MessageModal from '@/components/ui/MessageModal'

export default function ListingPage({ params }: any) {
  const listing = listings.find((l) => l.id === params.id)
  const [open, setOpen] = useState(false)

  if (!listing) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-screen-xl space-y-6 px-4 md:px-6">
      <Link href="/" className="text-sm text-neutral-300 hover:text-white">
        ← Back
      </Link>
      <div className="flex gap-4 overflow-x-auto">
        {listing.imageUrls.map((src) => (
          <img
            key={src}
            src={src}
            alt={listing.title}
            className="aspect-video w-full flex-shrink-0 rounded-2xl object-cover sm:w-[500px]"
          />
        ))}
      </div>
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-extrabold md:text-3xl">{listing.title}</h1>
        <span className="rounded-full bg-accent/20 px-3 py-1 text-sm font-semibold text-accent">
          ${listing.price}
        </span>
      </div>
      <div className="flex gap-2">
        <Badge variant="outline">{listing.campus}</Badge>
        {listing.condition && <Badge variant="outline">{listing.condition}</Badge>}
      </div>
      <div className="rounded-2xl border border-line bg-panel p-4 text-neutral-300">
        {listing.description}
      </div>
      <button
        className="rounded-xl bg-accent px-4 py-2 font-medium text-white hover:bg-accent/90"
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
