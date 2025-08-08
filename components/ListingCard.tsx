import Link from 'next/link'
import Badge from './ui/Badge'

interface ListingCardProps {
  id: string
  title: string
  price: number
  campus: string
  imageUrl: string
  featured?: boolean
  condition?: string
}

export default function ListingCard({
  id,
  title,
  price,
  campus,
  imageUrl,
  featured,
  condition,
}: ListingCardProps) {
  return (
    <Link
      href={`/listings/${id}`}
      className="group overflow-hidden rounded-lg border border-line bg-panel shadow-card"
    >
      <div className="relative aspect-video w-full">
        <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent" />
        {featured && (
          <Badge variant="accent" className="absolute left-2 top-2">
            FEATURED
          </Badge>
        )}
        <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-semibold leading-tight">{title}</h3>
          <span className="rounded-full bg-bg/80 px-2 py-0.5 text-xs font-medium">
            ${price}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-line p-2">
        <div className="flex gap-2">
          <Badge variant="outline">{campus}</Badge>
          {condition && <Badge variant="outline">{condition}</Badge>}
        </div>
        <button className="text-line transition-colors hover:text-accent" aria-label="Save listing">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>
    </Link>
  )
}
