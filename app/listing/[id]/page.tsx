import { notFound } from 'next/navigation'
import ImageCarousel from '@/components/ImageCarousel'
import { createServerClient } from '@/lib/supabase/server'

export default async function ListingPage({ params }: { params: { id: string } }) {
  const { id } = params
  const supabase = createServerClient()
  
  // Get listing with profile information
  const { data: listing } = await supabase
    .from('listings')
    .select(`
      id,
      title,
      description,
      price,
      condition,
      category,
      image_url,
      user_id,
      created_at,
      profiles(username, avatar_url)
    `)
    .eq('id', id)
    .maybeSingle()
  
  if (!listing) notFound()

  // Get listing images
  const { data: images } = await supabase
    .from('listing_images')
    .select('url,sort_order')
    .eq('listing_id', id)
    .order('sort_order')

  // Use listing_images if available, fallback to image_url, then placeholder
  let imageUrls = (images ?? []).map((i) => i.url)
  if (imageUrls.length === 0 && listing.image_url) {
    imageUrls = [listing.image_url]
  }

  const conditionLabels: Record<string, string> = {
    new: 'New',
    like_new: 'Like New', 
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor'
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-6">
      {/* Image Carousel */}
      <div className="w-full">
        <ImageCarousel images={imageUrls} alt={listing.title} />
      </div>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              {listing.condition && (
                <span className="px-3 py-1 bg-gray-800 rounded-full">
                  {conditionLabels[listing.condition] || listing.condition}
                </span>
              )}
              {listing.category && (
                <span className="px-3 py-1 bg-gray-800 rounded-full">
                  {listing.category}
                </span>
              )}
              <span>Listed {new Date(listing.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {listing.description && (
            <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6">
              <h2 className="text-lg font-semibold mb-3">Description</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{listing.description}</p>
            </div>
          )}
        </div>

        {/* Right Column - Price & Seller */}
        <div className="space-y-6">
          {/* Price Card */}
          <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6">
            <div className="text-3xl font-bold text-white mb-4">
              ${Number(listing.price).toFixed(0)}
            </div>
            <button className="w-full bg-accent hover:bg-accent/90 text-black font-semibold py-3 px-4 rounded-xl transition">
              Contact Seller
            </button>
          </div>

          {/* Seller Card */}
          <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6">
            <h3 className="text-lg font-semibold mb-3">Seller</h3>
            <div className="flex items-center gap-3">
              {listing.profiles?.avatar_url ? (
                <img 
                  src={listing.profiles.avatar_url} 
                  alt={listing.profiles.username || 'Seller'}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {(listing.profiles?.username || 'U')[0].toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-gray-300">
                {listing.profiles?.username || 'Anonymous Seller'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
