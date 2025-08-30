import { createServerClient } from '@/lib/supabase/server'

export type ThreadSummary = {
  id: string
  listing_id: string | null
  created_at: string
  updated_at: string
}

export async function getOrCreateThread(opts: { buyerId: string; sellerId: string; listingId?: string }) {
  const supabase = createServerClient()
  const { data: threadId, error } = await supabase.rpc('create_or_get_thread', {
    buyer_id: opts.buyerId,
    seller_id: opts.sellerId,
    in_listing_id: opts.listingId ?? null,
  })
  if (error) throw error
  return threadId as string
}

export async function listThreadsForUser(userId: string) {
  const supabase = createServerClient()
  // Fetch threads the user participates in, with participant ids
  const { data: threads, error } = await supabase
    .from('message_threads')
    .select(
      `id, created_at, updated_at, listing_id,
       message_thread_participants(user_id, role)`
    )
    .order('updated_at', { ascending: false })
  if (error) throw error

  // For each thread, fetch latest message and basic listing/profile data
  const results = await Promise.all(
    (threads ?? []).map(async (t) => {
      const { data: latest } = await supabase
        .from('messages')
        .select('id, body, created_at, sender_id')
        .eq('thread_id', t.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      let listing: { id: string; title: string; image_url: string | null } | null = null
      if (t.listing_id) {
        const { data: l } = await supabase
          .from('listings')
          .select('id, title, image_url')
          .eq('id', t.listing_id)
          .maybeSingle()
        listing = l ?? null
      }

      // Determine the other participant id
      const otherId = (t.message_thread_participants || [])
        .map((p: any) => p.user_id)
        .find((id: string) => id !== userId)

      let otherProfile: { id: string; username: string | null; display_name: string | null; avatar_url: string | null } | null = null
      if (otherId) {
        const { data: p } = await supabase
          .from('profiles')
          .select('id, username, display_name, avatar_url')
          .eq('id', otherId)
          .maybeSingle()
        otherProfile = p ?? null
      }

      return { thread: t, latest, listing, other: otherProfile }
    })
  )
  return results
}

export async function listMessages(threadId: string, _userId: string, opts: { limit?: number; before?: string } = {}) {
  const supabase = createServerClient()
  let q = supabase
    .from('messages')
    .select('id, body, created_at, edited_at, sender_id')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true })
  if (opts.before) q = q.lt('created_at', opts.before)
  if (opts.limit) q = q.limit(opts.limit)
  const { data, error } = await q
  if (error) throw error
  return data ?? []
}

export async function sendMessage(threadId: string, senderId: string, body: string) {
  const supabase = createServerClient()
  const { error } = await supabase.from('messages').insert({ thread_id: threadId, sender_id: senderId, body })
  if (error) throw error
  return { ok: true }
}

