'use client'
import { useState } from 'react'

type Props = {
  name: string
  role: string
  blurb: string
  img?: string
}

export default function FounderCard({ name, role, blurb, img }: Props) {
  const [ok, setOk] = useState(true)

  return (
    <article className="rounded-2xl bg-white/5 border border-white/5 overflow-hidden hover:bg-white/10 transition duration-200">
      <div className="h-80 w-full bg-white/5">
        {ok && img ? (
          <img
            src={img}
            alt={name}
            className="h-80 w-full object-cover"
            onError={() => setOk(false)}
          />
        ) : (
          <div className="h-80 w-full flex items-center justify-center text-sm opacity-70">
            Photo coming soon
          </div>
        )}
      </div>
      <div className="p-6 space-y-3">
        <div>
          <div className="text-xl font-semibold">{name}</div>
          <div className="text-sm opacity-80 mt-1">{role}</div>
        </div>
        <p className="text-sm opacity-90 leading-relaxed">{blurb}</p>
      </div>
    </article>
  )
}

