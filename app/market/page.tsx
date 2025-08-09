import { createServerSupabase } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import FavButton from './FavButton'

export default async function MarketPage() {
  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('campus_id').eq('id', user.id).maybeSingle()
  const campusId = profile?.campus_id

  const { data: listings } = await supabase
    .from('listings')
    .select('id, title, price_cents, image_url, condition')
    .eq('campus_id', campusId)
    .order('created_at', { ascending: false })

  const { data: favs } = await supabase.from('favorites').select('listing_id').eq('user_id', user.id)
  const favSet = new Set((favs ?? []).map((f) => f.listing_id))

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Buy & Sell on Campus</h1>
        <Link href="/profile" className="rounded-xl px-4 py-2 bg-white/10">Profile</Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(listings ?? []).map((l) => (
          <ListingCard key={l.id} listing={l} isFav={favSet.has(l.id)} />
        ))}
      </div>
    </main>
  )
}

function Price({ cents }: { cents: number }) {
  return <span>${(cents / 100).toFixed(0)}</span>
}

function ListingCard({ listing, isFav }: { listing: any; isFav: boolean }) {
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
        <FavButton listingId={listing.id} initial={isFav} />
      </div>
    </div>
  )
}
