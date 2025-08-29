export type Profile = {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  campus_slug: string | null
  edu_verified: boolean
  created_at: string
}

export type Listing = {
  id: string
  user_id: string
  title: string
  description: string | null
  price: number
  image_url: string | null
  images: string[]
  status: 'active' | 'pending' | 'sold' | 'hidden'
  saved_count: number
  created_at: string
}

export type SavedListing = {
  user_id: string
  listing_id: string
  created_at: string
}

// Return type for profile stats
export type ProfileStats = {
  active_count: number
  sold_count: number
  saved_count: number
  unread_count: number
  profile_completion: number
}

// Listing query params
export type ListingParams = {
  status?: Listing['status']
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'most_saved'
  page?: number
  pageSize?: number
}
