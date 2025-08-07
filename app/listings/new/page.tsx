'use client'

// Page for creating a new listing.
import ListingForm from '@/components/ListingForm'

export default function NewListingPage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">New Listing</h1>
      <ListingForm />
    </div>
  )
}
