'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'

interface Campus {
  slug: string
  name: string
  hero_image_url: string | null
}

const HERO_BANNER = '/hero/campusbanner.jpg'
const DEFAULT_BANNER = HERO_BANNER
const CAMPUS_BANNERS: Record<string, string> = {
  babson: '/hero/babson.jpg',
  ualbany: '/hero/ualbany.jpg',
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
    try {
      const response = await fetch('/api/campus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })

      if (!response.ok) {
        throw new Error('Failed to set campus')
      }

      router.push('/auth/signin')
    } catch (error) {
      console.error('Failed to set campus:', error)
    }
  }

  return (
    <main className="container mx-auto px-4 py-10 space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-black">
        <div className="absolute inset-0">
          <Image
            src={HERO_BANNER}
            alt="Campus selection banner"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1200px"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative px-6 py-20 text-center text-white sm:px-12">
          <p className="text-xs uppercase tracking-[0.4em] text-white/70">DormXchange Campuses</p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Choose your campus</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/80 sm:text-lg">
            Pick your school to browse local listings, message classmates, and join a trusted marketplace built just for your campus community.
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-center text-2xl font-semibold sm:text-3xl">Available campuses</h2>
        {campuses.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-sm text-white/80">
            No campuses available yet. Check back soon!
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campuses.map((campus) => {
              const imageSrc =
                campus.hero_image_url || CAMPUS_BANNERS[campus.slug] || DEFAULT_BANNER

              return (
                <li key={campus.slug}>
                  <button
                    type="button"
                    onClick={() => choose(campus.slug)}
                    className="group relative block h-48 w-full overflow-hidden rounded-2xl border border-white/10 bg-white/10 text-left transition hover:-translate-y-1 hover:shadow-xl"
                    aria-label={'Choose ' + campus.name}
                  >
                    <Image
                      src={imageSrc}
                      alt={campus.name + ' banner'}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />
                    <div className="absolute inset-x-4 bottom-4">
                      <p className="text-lg font-semibold text-white">{campus.name}</p>
                      <p className="text-sm text-white/70">Tap to join this campus</p>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </main>
  )
}




