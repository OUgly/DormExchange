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
    <article className="rounded-2xl bg-surface/40 shadow p-5 hover:bg-white/5 transition">
      <img
        src={listing.image_url ?? '/placeholder.jpg'}
        alt={listing.title}
        className="h-72 w-full object-cover rounded-xl mb-5"
        loading="lazy"
      />
      <div className="space-y-3">
        <div className="flex justify-between items-start gap-3">
          <h3 className="font-semibold text-xl leading-tight">{listing.title}</h3>
          <div className="text-xl font-bold whitespace-nowrap">${Number(listing.price).toFixed(0)}</div>
        </div>
        <div className="flex items-center gap-2 text-sm opacity-80">
          <span>{listing.condition ?? '—'}</span>
          {listing.category && (
            <>
              <span className="opacity-50">•</span>
              <span>{listing.category}</span>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
