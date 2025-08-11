'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

interface Campus {
  slug: string
  name: string
  hero_image_url: string | null
}

export default function CampusPage() {
  const router = useRouter()
  const [campuses, setCampuses] = useState<Campus[]>([])

  useEffect(() => {
    supabase
      .from('campuses')
      .select('name, slug, hero_image_url')
      .then(({ data }) => setCampuses(data ?? []))
  }, [])

  async function choose(slug: string) {
    await fetch('/api/campus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })
    router.push('/market')
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="mb-6 text-center text-4xl font-bold">Choose your campus</h1>
      <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {campuses.map((c) => (
          <li key={c.slug}>
            <button
              onClick={() => choose(c.slug)}
              className="w-full overflow-hidden rounded-xl text-left">
              {c.hero_image_url && (
                <img
                  src={c.hero_image_url}
                  alt={c.name}
                  className="h-32 w-full object-cover"
                />
              )}
              <div className="px-4 py-3 bg-white/10 transition hover:bg-white/20">
                {c.name}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
