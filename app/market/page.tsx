import { redirect } from 'next/navigation'
import { requireAuthAndCampus } from '@/lib/guards'
import { createServerSupabase } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import FavButton from './FavButton'
import stockListings from '@/data/listings.json'

export default async function MarketPage() {
  const { user, campus } = await requireAuthAndCampus()
  if (!user) redirect('/auth?next=/market')
  if (!campus) redirect('/campus')

  const supabase = await createServerSupabase()
  const { data: campusRow } = await supabase
    .from('campuses')
    .select('id')
    .eq('slug', campus)
    .maybeSingle()
  const campusId = campusRow?.id

  const { data: listings } = await supabase
    .from('listings')
    .select('id, title, price_cents, image_url, condition')
    .eq('campus_id', campusId)
    .order('created_at', { ascending: false })

  const { data: favs } = await supabase
    .from('favorites')
    .select('listing_id')
    .eq('user_id', user.id)
  const favSet = new Set((favs ?? []).map((f) => f.listing_id))

  let display = listings ?? []
  let showFav = true
  if (!display.length) {
    display = (stockListings as any[])
      .filter(
        (l) =>
          l.campus &&
          l.campus.toLowerCase().replace(/\s+/g, '-') === campus
      )
      .map((l) => ({
        id: l.id,
        title: l.title,
        price_cents: (l.price ?? 0) * 100,
        image_url: l.imageUrls?.[0] ?? null,
        condition: l.condition,
      }))
    showFav = false
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Buy & Sell on Campus</h1>
        <Link href="/profile" className="rounded-xl bg-white/10 px-4 py-2">Profile</Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {display.map((l) => (
          <ListingCard key={l.id} listing={l} isFav={favSet.has(l.id)} showFav={showFav} />
        ))}
      </div>
    </main>
  )
}

function Price({ cents }: { cents: number }) {
  return <span>${(cents / 100).toFixed(0)}</span>
}

function ListingCard({ listing, isFav, showFav }: { listing: any; isFav: boolean; showFav: boolean }) {
  return (
    <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10">
      <div className="relative h-44">
        <Image src={listing.image_url || '/placeholder.jpg'} alt={listing.title} fill className="object-cover" />
      </div>
      <div className="p-4 flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">{listing.title}</div>
          <div className="text-sm opacity-80">{listing.condition}</div>
          <div className="mt-1 font-bold"><Price cents={listing.price_cents} /></div>
        </div>
        {showFav && <FavButton listingId={listing.id} initial={isFav} />}
      </div>
    </div>
  )
}
