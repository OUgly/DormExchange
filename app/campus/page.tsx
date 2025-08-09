import Image from 'next/image'
import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase/server'

async function getCampuses() {
  const supabase = await createServerSupabase()
  const { data } = await supabase.from('campuses').select('id, name, slug, hero_image_url')
  return data ?? []
}

export default async function CampusPage({ searchParams }: any) {
  const campuses = await getCampuses()
  const next = searchParams?.next ?? '/market'

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6">Choose your campus</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {campuses.map((c) => (
          <Link
            key={c.id}
            href={`/auth?campus=${c.slug}&next=${encodeURIComponent(next)}`}
            className="group relative h-52 rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
          >
            <Image
              src={c.hero_image_url ?? '/placeholder.jpg'}
              alt={c.name}
              fill
              className="object-cover opacity-80 group-hover:opacity-90"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute bottom-0 p-4">
              <h2 className="text-2xl font-semibold">{c.name}</h2>
              <p className="text-sm opacity-80">Tap to continue</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
