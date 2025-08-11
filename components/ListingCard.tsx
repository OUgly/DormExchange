// components/ListingCard.tsx
export type Listing = {
  id: string
  title: string
  price: number
  condition: string | null
  image_url: string | null
  category?: string | null
}

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <article className="rounded-2xl bg-surface/40 shadow p-4 hover:bg-white/5 transition">
      <img
        src={listing.image_url ?? '/placeholder.jpg'}
        alt={listing.title}
        className="h-40 w-full object-cover rounded-xl mb-3"
        loading="lazy"
      />
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{listing.title}</h3>
          <p className="text-sm opacity-80">{listing.condition ?? '—'}</p>
          {listing.category && <p className="text-xs opacity-60 mt-1">{listing.category}</p>}
        </div>
        <div className="text-lg font-bold">${Number(listing.price).toFixed(0)}</div>
      </div>
    </article>
  )
}
