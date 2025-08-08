"use client"

import { useState } from 'react'
import FilterPills from '@/components/ui/FilterPills'
import ListingCard from '@/components/ListingCard'
import listingsData from '../data/listings.json'

export default function HomePage() {
  const [category, setCategory] = useState('All')
  const listings =
    category === 'All'
      ? listingsData
      : listingsData.filter((l) => l.category === category)

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-4">
      <section className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Buy & Sell on Campus</h1>
        <p className="text-white/70">Find great deals from fellow students</p>
      </section>
      <FilterPills value={category} onChange={setCategory} />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {listings.map((item) => (
          <ListingCard
            key={item.id}
            id={item.id}
            title={item.title}
            price={item.price}
            campus={item.campus}
            imageUrl={item.imageUrls[0]}
            featured={item.featured}
            condition={item.condition}
          />
        ))}
      </div>
    </main>
  )
}
