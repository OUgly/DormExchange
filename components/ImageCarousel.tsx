'use client'
import { useState } from 'react'

export default function ImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0)
  if (!images.length) {
    return (
      <img
        src="/placeholder.jpg"
        alt={alt}
        className="aspect-[4/3] w-full object-cover rounded-2xl"
      />
    )
  }
  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1))
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-300 ${i === index ? 'translate-x-0' : i < index ? '-translate-x-full' : 'translate-x-full'}`}
        />
      ))}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white"
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white"
          >
            ›
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`h-2 w-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
