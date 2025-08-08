"use client"

import { useState } from 'react'
import FilterPills from '@/components/ui/FilterPills'
import ListingCard from '@/components/ListingCard'
import Footer from '@/components/Footer'
import listingsData from '../data/listings.json'

export default function HomePage() {
  const [category, setCategory] = useState('All')
  const listings =
    category === 'All'
      ? listingsData
      : listingsData.filter((l) => l.category === category)

  return (
    <>
      <main className="mx-auto max-w-screen-xl space-y-8 px-4 md:px-6">
        <section className="mx-auto max-w-[1100px] space-y-3 py-10 text-center">
          <h1 className="text-4xl font-extrabold md:text-5xl">Buy & Sell on Campus</h1>
          <p className="text-neutral-300">Find great deals from fellow students</p>
        </section>
        <FilterPills value={category} onChange={setCategory} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
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
      <Footer />
    </>
  )
}
