<<<<<<< HEAD
import { createServerSupabase } from '@/lib/supabase/server'
import CampusList from './CampusList'

export default async function CampusPage() {
  const supabase = await createServerSupabase()
  const { data } = await supabase
    .from('campuses')
    .select('slug, name, hero_image_url')
    .order('name')
  return <CampusList campuses={data ?? []} />
=======
'use client'

import { useRouter } from 'next/navigation'

const CAMPUSES = [
  { slug: 'demo-university', name: 'Demo University' },
  { slug: 'example-college', name: 'Example College' },
]

export default function CampusPage() {
  const router = useRouter()

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
      <h1 className="text-4xl font-bold mb-6">Choose your campus</h1>
      <ul className="space-y-4">
        {CAMPUSES.map((c) => (
          <li key={c.slug}>
            <button
              onClick={() => choose(c.slug)}
              className="w-full text-left px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
            >
              {c.name}
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
>>>>>>> dev
}
