'use client'

// Page for creating a new listing.
import ListingForm from '@/components/ListingForm'

export default function NewListingPage() {
  return (
    <div className="mx-auto max-w-screen-xl space-y-6 px-4 md:px-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold">Sell an Item</h1>
        <p className="text-sm text-neutral-300">You must be signed in to post.</p>
      </div>
      <ListingForm />
    </div>
  )
}
