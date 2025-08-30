import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') || ''
  let body: string | null = null
  let listingId: string | null = null
  let listingTitle: string | null = null
  let toUserId: string | null = null

  try {
    if (contentType.includes('application/json')) {
      const json = await request.json()
      body = json.body ?? null
      listingId = json.listingId ?? null
      listingTitle = json.listingTitle ?? null
      toUserId = json.to_user_id ?? json.recipientId ?? null
    } else {
      const form = await request.formData()
      body = String(form.get('body') ?? '')
      listingId = String(form.get('listingId') ?? '')
      listingTitle = (form.get('listingTitle') as string) ?? null
      toUserId = (form.get('to_user_id') as string) || (form.get('recipientId') as string) || null
      if (!body) body = null
      if (!listingId) listingId = null
    }
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!body || !listingId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Lookup listing to determine recipient
  const { data: listing } = await supabase
    .from('listings')
    .select('user_id')
    .eq('id', listingId)
    .maybeSingle()
  if (!listing?.user_id) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  const recipient = toUserId || listing.user_id
  if (recipient === user.id) {
    return NextResponse.json({ error: 'Cannot message yourself' }, { status: 400 })
  }

  const { error } = await supabase.from('messages').insert({
    listing_id: listingId,
    from_user_id: user.id,
    to_user_id: recipient,
    body,
    listing_title: listingTitle ?? null,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
