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
    <article className="rounded-2xl bg-surface/40 border border-white/5 overflow-hidden">
      <div className="h-48 w-full bg-white/5">
        {ok && img ? (
          <img
            src={img}
            alt={name}
            className="h-48 w-full object-cover"
            onError={() => setOk(false)}
          />
        ) : (
          <div className="h-48 w-full flex items-center justify-center text-sm opacity-70">
            Photo coming soon
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="text-lg font-semibold">{name}</div>
        <div className="text-sm opacity-80">{role}</div>
        <p className="mt-2 text-sm opacity-90">{blurb}</p>
      </div>
    </article>
  )
}
