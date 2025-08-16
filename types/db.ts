// types/db.ts
// Basic TypeScript interfaces for our Supabase tables.
// Having strongly typed data makes working with Supabase safer and easier.

export interface Profile {
  id: string
  username: string | null
  avatar_url: string | null
}

export interface Listing {
  id: string
  user_id: string
  title: string
  description: string
  price: number
  image_url: string | null
  created_at: string
  status?: string
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
