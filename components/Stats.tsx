// components/Stats.tsx
import { createServerClient } from '@/lib/supabase/server'

export default async function Stats() {
  // Fallbacks in case DB fails
  let campuses = 3
  let listings = 0

  try {
    const supabase = createServerClient()
    const { count: cCount } = await supabase.from('campuses').select('slug', { count: 'exact', head: true })
    const { count: lCount } = await supabase.from('listings').select('id', { count: 'exact', head: true })
    campuses = cCount ?? campuses
    listings = lCount ?? listings
  } catch {
    // ignore — show fallbacks
  }

  const items = [
    { label: 'Campuses', value: campuses },
    { label: 'Listings posted', value: listings },
    { label: 'Fee to list', value: '$0' },
  ]

  return (
    <section className="mx-auto max-w-5xl px-6 pb-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map((it) => (
          <div key={it.label} className="rounded-2xl bg-white/5 p-5 text-center border border-white/5">
            <div className="text-2xl font-bold">{it.value}</div>
            <div className="text-sm opacity-80">{it.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

