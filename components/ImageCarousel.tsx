'use client'
import { useState } from 'react'

export default function ImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0)
  
  if (!images.length) {
    return (
      <div className="aspect-[4/3] w-full rounded-2xl bg-gray-800 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <svg className="mx-auto h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-4.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <p className="text-sm">No image available</p>
        </div>
      </div>
    )
  }

  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1))
  
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-900">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`${alt} - Image ${i + 1}`}
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-300 ${
            i === index ? 'translate-x-0' : i < index ? '-translate-x-full' : 'translate-x-full'
          }`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      ))}
      
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 hover:bg-black/80 p-2 text-white transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 hover:bg-black/80 p-2 text-white transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === index ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>

          <div className="absolute top-4 right-4 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
            {index + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  )
}
