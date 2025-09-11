import { notFound } from 'next/navigation'
import ImageCarousel from '@/components/ImageCarousel'
import BuyNowButton from '@/components/BuyNowButton'
import { createServerClient } from '@/lib/supabase/server'
import { deleteListingAction } from './actions'
import { actionCreateOrGetThread } from '@/app/(actions)/messages'

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
      created_at
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

  // Fetch seller profile separately; ignore errors (RLS may block when unauthenticated)
  let profile: { username?: string | null; display_name?: string | null; avatar_url?: string | null } | null = null
  try {
    const { data: prof } = await supabase
      .from('profiles')
      .select('username, display_name, avatar_url')
      .eq('id', listing.user_id)
      .maybeSingle()
    profile = prof ?? null
  } catch {}
  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = !!user && user.id === listing.user_id

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
          <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6 space-y-3">
            <div className="text-3xl font-bold text-white">${Number(listing.price).toFixed(0)}</div>
            {!isOwner ? (
              <>
                <BuyNowButton listingId={listing.id} />
                <form
                  action={async (fd: FormData) => {
                    'use server'
                    await actionCreateOrGetThread(fd)
                  }}
                >
                  <input type="hidden" name="listingId" value={listing.id} />
                  <button className="mt-2 w-full rounded-xl bg-accent px-4 py-3 font-semibold text-black hover:bg-accent/90">
                    Message Seller
                  </button>
                </form>
              </>
            ) : (
              <form action={deleteListingAction}>
                <input type="hidden" name="listingId" value={listing.id} />
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition">
                  Delete Listing
                </button>
              </form>
            )}
          </div>

          {/* Seller Card */}
          <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6">
            <h3 className="text-lg font-semibold mb-3">Seller</h3>
            <div className="flex items-center gap-3">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url || ''} 
                  alt={profile?.username || 'Seller'}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {(profile?.username || 'U')[0].toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-gray-300">
                {profile?.display_name || profile?.username || 'Anonymous Seller'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
