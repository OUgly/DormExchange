"use server"

import { createServerClient } from '@/lib/supabase/server'

export async function deleteListingAction(formData: FormData) {
  const listingId = formData.get('listingId') as string
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }
  // Ensure this listing belongs to the user (RLS also enforces this)
  const { error } = await supabase.from('listings').delete().eq('id', listingId)
  if (error) throw error
}

