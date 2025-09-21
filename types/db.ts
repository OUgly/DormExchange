// types/db.ts
// Basic TypeScript interfaces for our Supabase tables.
// Having strongly typed data makes working with Supabase safer and easier.

export interface Profile {
  id: string
  username: string | null
  avatar_url: string | null
  member_status: 'founder' | 'cofounder' | 'member'
  listings_count: number
  messages_sent: number
  ratings_received: number
  bio: string | null
  campus_id: string | null
  grade: string | null
  display_name: string | null
  edu_verified: boolean
  contact_email: string | null
  phone: string | null
  created_at: string
  // Stripe Connect (seller payouts)
  seller_stripe_account_id?: string | null
  seller_charges_enabled?: boolean
}

export interface Listing {
  id: string
  user_id: string
  title: string
  description: string
  price: number
  image_url: string | null
  created_at: string
  status: 'active' | 'sold' | 'draft' | 'hidden'
  saved_count?: number
}

export interface ProfileStats {
  active_count: number
  sold_count: number
  saved_count: number
  unread_count: number
  profile_completion: number
}

export interface ListingParams {
  status?: string
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'most_saved'
  page?: number
  pageSize?: number
}

export interface ListingImage {
  id: string
  listing_id: string
  url: string
  sort_order: number
  created_at: string
}

export type ListingWithImages = Listing & { images: ListingImage[] }

export interface Comment {
  id: string
  listing_id: string
  user_id: string
  content: string
  created_at: string
}
