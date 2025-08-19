import { notFound } from 'next/navigation'
import ImageCarousel from '@/components/ImageCarousel'
import { getSupabaseServer } from '@/lib/supabase/server'

export default async function ListingPage({ params }: { params: { id: string } }) {
  const { id } = params
  const supabase = await getSupabaseServer()
  const { data: listing } = await supabase
    .from('listings')
    .select('id,title,description,price,user_id,profiles(username)')
    .eq('id', id)
    .maybeSingle()
  if (!listing) notFound()

  const { data: images } = await supabase
    .from('listing_images')
    .select('url,sort_order')
    .eq('listing_id', id)
    .order('sort_order')

  const urls = (images ?? []).map((i) => i.url)

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      <ImageCarousel images={urls} alt={listing.title} />
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-extrabold md:text-3xl">{listing.title}</h1>
        <span className="text-xl font-bold">${Number(listing.price).toFixed(0)}</span>
      </div>
      <div className="rounded-2xl border border-line bg-panel p-4 text-neutral-300">
        {listing.description}
      </div>
      <div className="text-sm opacity-80">
        Seller: {listing.profiles?.[0]?.username ?? listing.user_id}
      </div>
    </div>
  )
}
