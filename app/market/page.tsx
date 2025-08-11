import { redirect } from 'next/navigation'
import { requireAuthAndCampus } from '@/lib/guards'
import ListingCard from '@/components/ListingCard'
import MarketFilters from './MarketFilters'
import type { Metadata } from 'next'
import { unstable_noStore as noStore } from 'next/cache'

export const metadata: Metadata = { title: 'Market • DormExchange' }

type SearchParams = {
  q?: string
  category?: string
  condition?: string
  min?: string
  max?: string
}

export default async function MarketPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  noStore();

  const { user, campus, supabase } = await requireAuthAndCampus()
  if (!user) redirect('/login')
  if (!campus) redirect('/campus')

  const params = await searchParams

  let query = supabase
    .from('listings')
    .select('id,title,price,condition,image_url,category')
    .eq('campus_slug', campus)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(60)

  const q = (params.q ?? '').trim()
  if (q) {
    // simple text search across title/description via ilike
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
  }
  if (params.category) query = query.eq('category', params.category)
  if (params.condition) query = query.eq('condition', params.condition)
  if (params.min) query = query.gte('price', Number(params.min))
  if (params.max) query = query.lte('price', Number(params.max))

  const { data: listings, error } = await query
  if (error) throw new Error(error.message)

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Buy &amp; Sell on Campus</h1>
      </header>

      <MarketFilters />

      {!listings?.length ? (
        <div className="rounded-2xl bg-surface/40 p-8 text-center">
          <p className="text-lg">No listings yet for this campus.</p>
          <p className="opacity-80">Try adjusting filters or be the first to post a listing.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      )}
    </main>
  )
}

