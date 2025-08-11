'use client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Campus = { slug: string; name: string; hero_image_url: string | null }

export default function CampusList({ campuses }: { campuses: Campus[] }) {
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
      <h1 className="text-4xl font-bold mb-6 text-center">Choose your campus</h1>
      <ul className="grid gap-6 sm:grid-cols-2">
        {campuses.map((c) => (
          <li key={c.slug}>
            <button
              onClick={() => choose(c.slug)}
              className="w-full text-left rounded-xl overflow-hidden bg-white/10 hover:bg-white/20 transition"
            >
              {c.hero_image_url && (
                <div className="relative h-32 w-full">
                  <Image src={c.hero_image_url} alt={c.name} fill className="object-cover" />
                </div>
              )}
              <div className="p-4 font-semibold">{c.name}</div>
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
