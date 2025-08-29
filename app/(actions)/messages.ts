"use server"

import { createServerClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { redirect } from 'next/navigation'

const ListingIdSchema = z.object({ listingId: z.string().uuid() })

export async function actionCreateOrGetThread(formData: FormData) {
  return actionCreateMessage(formData)
}

export async function actionCreateMessage(formData: FormData) {
  const parsed = ListingIdSchema.safeParse({ listingId: String(formData.get('listingId') || '') })
  if (!parsed.success) throw new Error('Invalid listingId')
  const { listingId } = parsed.data

  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: listing, error: lerr } = await supabase
    .from('listings')
    .select('id, user_id, title')
    .eq('id', listingId)
    .maybeSingle()
  if (lerr || !listing) throw new Error('Listing not found')
  if (listing.user_id === user.id) throw new Error('Cannot message yourself')

  // For now, redirect to messages page with a simple implementation
  // In the future, this could create an initial message or thread
  redirect(`/messages?listing=${listingId}&seller=${listing.user_id}&title=${encodeURIComponent(listing.title || '')}`)
}

export async function actionSendMessage(listingId: string, formData: FormData) {
  const body = String(formData.get('body') || '').trim()
  const explicitRecipient = String(formData.get('recipientId') || '').trim()
  if (!body) return { ok: false }

  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Get listing info for the message
  const { data: listing } = await supabase
    .from('listings')
    .select('user_id, title')
    .eq('id', listingId)
    .maybeSingle()
  
  if (!listing) throw new Error('Listing not found')
  // Determine recipient: prefer explicit recipient from form; otherwise fallback to listing owner
  const toUserId = explicitRecipient || listing.user_id
  if (toUserId === user.id) throw new Error('Cannot message yourself')

  // Insert the message directly into the messages table
  const { error } = await supabase.from('messages').insert({
    listing_id: listingId,
    from_user_id: user.id,
    to_user_id: toUserId,
    body,
    listing_title: listing.title
  })

  if (error) throw new Error(error.message)
  // After successful send, redirect to the main messages page
  redirect('/messages')
}
