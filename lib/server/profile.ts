import { createServerClient } from '@/lib/supabase/server'
import { Profile, ProfileStats, Listing, ListingParams } from '@/types/db'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Get current user and their profile, or redirect to sign in
export async function getCurrentUser() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/signin?next=/profile')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  return { user, profile }
}

// Get a user's profile by ID
export async function getProfile(userId: string) {
  const supabase = createServerClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  return profile
}

// Calculate profile stats including completion %
export async function getProfileStats(userId: string): Promise<ProfileStats> {
  const supabase = createServerClient()
  
  // Parallel queries for efficiency
  const [
    { data: profile },
    { data: activeListings },
    { data: soldListings },
    { data: savedListings },
    // TODO: implement messages table and unread count
    // { data: unreadMessages }
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('listings').select('id').eq('user_id', userId).eq('status', 'active'),
    supabase.from('listings').select('id').eq('user_id', userId).eq('status', 'sold'),
    supabase.from('saved_listings').select('listing_id').eq('user_id', userId),
  ])

  // Calculate profile completion (20% each: avatar, display name, bio, first listing, edu verified)
  let completion = 0
  if (profile) {
    if (profile.avatar_url) completion += 20
    if (profile.display_name) completion += 20
    if (profile.bio) completion += 20
    if (profile.edu_verified) completion += 20
    if (activeListings?.length || soldListings?.length) completion += 20
  }

  return {
    active_count: activeListings?.length ?? 0,
    sold_count: soldListings?.length ?? 0,
    saved_count: savedListings?.length ?? 0,
    unread_count: 0, // TODO: implement messages
    profile_completion: completion
  }
}

// Get user's listings with filters, sorting, and pagination
export async function getUserListings(
  userId: string,
  { status, sort = 'newest', page = 1, pageSize = 12 }: ListingParams = {}
) {
  const supabase = createServerClient()
  let query = supabase
    .from('listings')
    .select('*')
    .eq('user_id', userId)

  // Apply status filter if provided
  if (status) {
    query = query.eq('status', status)
  }

  // Apply sorting
  switch (sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price', { ascending: false })
      break
    case 'most_saved':
      query = query.order('saved_count', { ascending: false })
      break
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false })
  }

  // Apply pagination
  const from = (page - 1) * pageSize
  query = query.range(from, from + pageSize - 1)

  const { data: listings, count } = await query

  return {
    listings,
    hasMore: (count ?? 0) > page * pageSize
  }
}

// Get user's saved listings with pagination
export async function getSavedListings(
  userId: string,
  { page = 1, pageSize = 12 } = {}
) {
  const supabase = createServerClient()
  const from = (page - 1) * pageSize

  const { data: saved, count } = await supabase
    .from('saved_listings')
    .select('listing_id, listings(*)', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, from + pageSize - 1)

  return {
    listings: saved?.map(s => s.listings) ?? [],
    hasMore: (count ?? 0) > page * pageSize
  }
}

// Mutations

export async function updateProfile(
  userId: string,
  data: Partial<Profile>
) {
  const supabase = createServerClient()
  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId)
  
  if (error) throw error
  return { success: true }
}

export async function updateListingStatus(
  listingId: string,
  status: Listing['status']
) {
  const supabase = createServerClient()
  const { error } = await supabase
    .from('listings')
    .update({ status })
    .eq('id', listingId)
  
  if (error) throw error
  return { success: true }
}

export async function deleteListing(listingId: string) {
  const supabase = createServerClient()
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', listingId)
  
  if (error) throw error
  return { success: true }
}

export async function toggleSaved(
  userId: string,
  listingId: string
) {
  const supabase = createServerClient()
  
  // Check if already saved
  const { data: existing } = await supabase
    .from('saved_listings')
    .select()
    .eq('user_id', userId)
    .eq('listing_id', listingId)
    .maybeSingle()

  if (existing) {
    // Unsave
    const { error } = await supabase
      .from('saved_listings')
      .delete()
      .eq('user_id', userId)
      .eq('listing_id', listingId)
    
    if (error) throw error
    return { saved: false }
  } else {
    // Save
    const { error } = await supabase
      .from('saved_listings')
      .insert({ user_id: userId, listing_id: listingId })
    
    if (error) throw error
    return { saved: true }
  }
}
