'use client'

// Home page displaying all listings with a search box.
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ListingCard from '@/components/ListingCard'
import Input from '@/components/ui/Input'
import { Listing } from '@/types/db'

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchListings = async () => {
      let query = supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false })
      if (search) {
        query = query.ilike('title', `%${search}%`)
      }
      const { data } = await query
      setListings((data as Listing[]) ?? [])
    }
    fetchListings()
  }, [search])

  return (
    <div>
      <Input
        placeholder="Search listings..."
        className="mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid gap-4">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  )
}
