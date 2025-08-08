'use client'

// Page for creating a new listing.
import ListingForm from '@/components/ListingForm'

export default function NewListingPage() {
  return (
    <div className="space-y-2 p-4">
      <h1 className="text-2xl font-bold">New Listing</h1>
      <p className="text-sm text-white/70">You must be signed in to post.</p>
      <ListingForm />
    </div>
  )
}
