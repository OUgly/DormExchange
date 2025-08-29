// components/ListingCard.tsx
'use client'
import { useState } from 'react'
import type { ListingWithImages } from '@/types/db'

export type Listing = ListingWithImages & {
  condition?: string | null
  category?: string | null
}

const CONDITION_LABELS: Record<string, string> = {
  new: 'New',
  like_new: 'Like New',
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
  used: 'Used',
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const [imageIndex, setImageIndex] = useState(0)

  // Get all available images
  const images = listing.images?.map((img) => img.url) || []
  if (listing.image_url && !images.includes(listing.image_url)) {
    images.unshift(listing.image_url)
  }

  const currentImage = images[imageIndex] || '/placeholder.jpg'
  const hasMultipleImages = images.length > 1

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <article className="rounded-2xl bg-white/5 shadow p-5 hover:bg-white/5 transition">
      <div className="relative group">
        {currentImage === '/placeholder.jpg' ? (
          <div className="h-72 w-full rounded-xl mb-5 bg-gray-800 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-4.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              <p className="text-xs">No image</p>
            </div>
          </div>
        ) : (
          <div className="relative h-72 w-full rounded-xl mb-5 overflow-hidden">
            <img src={currentImage} alt={listing.title} className="h-full w-full object-cover" loading="lazy" />

            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 hover:bg-black/80 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Previous image"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 hover:bg-black/80 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Next image"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, i) => (
                    <div key={i} className={`h-1.5 w-1.5 rounded-full ${i === imageIndex ? 'bg-white' : 'bg-white/50'}`} />
                  ))}
                </div>

                <div className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
                  {imageIndex + 1}/{images.length}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-start gap-3">
          <h3 className="font-semibold text-xl leading-tight">{listing.title}</h3>
          <div className="text-xl font-bold whitespace-nowrap">${Number(listing.price).toFixed(0)}</div>
        </div>
        <div className="flex items-center gap-2 text-sm opacity-80">
          <span>{listing.condition ? CONDITION_LABELS[listing.condition] ?? listing.condition : '—'}</span>
          {listing.category && (
            <>
              <span className="opacity-50">•</span>
              <span>{listing.category}</span>
            </>
          )}
        </div>
      </div>
    </article>
  )
}


