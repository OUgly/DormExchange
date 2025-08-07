// components/ListingCard.tsx
// Displays a single listing in a card format.
import Link from 'next/link'
import { Listing } from '@/types/db'

interface Props {
  listing: Listing
}

export default function ListingCard({ listing }: Props) {
  return (
    <div className="rounded-lg border p-4 shadow-sm">
      {listing.image_url && (
        <img
          src={listing.image_url}
          alt={listing.title}
          className="mb-2 h-40 w-full rounded object-cover"
        />
      )}
      <h3 className="text-lg font-semibold">
        <Link href={`/listings/${listing.id}`}>{listing.title}</Link>
      </h3>
      <p className="text-gray-600">${listing.price}</p>
    </div>
  )
}
