'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import ListingCard from '@/components/ListingCard'
import type { Listing } from '@/components/ListingCard'

interface MyListingsProps {
  userId: string
}

export function MyListings({ userId }: MyListingsProps) {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const supabase = createClientComponentClient()
        
        const { data, error } = await supabase
          .from('listings')
          .select(`
            id,
            title,
            description,
            price,
            condition,
            image_url,
            category,
            status,
            created_at,
            user_id,
            listing_images(id, url, sort_order, created_at, listing_id)
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (error) throw error

        // Transform the data to match our Listing type
        const transformedListings: Listing[] = (data || []).map(listing => ({
          ...listing,
          images: listing.listing_images || []
        }))

        setListings(transformedListings)
      } catch (err) {
        console.error('Error fetching user listings:', err)
        setError(err instanceof Error ? err.message : 'Failed to load listings')
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchListings()
    }
  }, [userId])

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">My Listings</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-gray-800/50 p-5 animate-pulse">
              <div className="h-72 w-full rounded-xl bg-gray-700 mb-5" />
              <div className="space-y-3">
                <div className="h-6 bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">My Listings</h2>
        <div className="rounded-2xl bg-red-900/20 border border-red-800 p-6 text-center">
          <p className="text-red-400">Error loading listings: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-red-300 hover:text-red-200 underline"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">My Listings</h2>
        <Link 
          href="/listing/new"
          className="rounded-xl bg-accent hover:bg-accent/90 px-4 py-2 text-black font-medium transition-colors"
        >
          Create Listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-2xl bg-gray-800/50 p-8 text-center">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-5.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
          <p className="text-gray-400 mb-4">Start selling by creating your first listing!</p>
          <Link 
            href="/listing/new"
            className="inline-block rounded-xl bg-accent hover:bg-accent/90 px-6 py-3 text-black font-medium transition-colors"
          >
            Create Your First Listing
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <Link key={listing.id} href={`/listing/${listing.id}`} className="block">
              <ListingCard listing={listing} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
