import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    const { sessionId } = (await request.json().catch(() => ({}))) as { sessionId?: string }
    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId required' }, { status: 400 })
    }

    const stripe = new Stripe(key, { apiVersion: '2023-10-16' })

    const supabase = createServerClient()
    let buyerId: string | null = null
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      buyerId = user?.id ?? null
    } catch (authErr) {
      console.error('Failed to read Supabase user during checkout confirmation', authErr)
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (!session) {
      return NextResponse.json({ error: 'Checkout session not found' }, { status: 404 })
    }

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Checkout session not paid' }, { status: 400 })
    }

    const metadata = (session.metadata ?? {}) as Record<string, string>
    const listingId = metadata.listing_id
    const metadataBuyerId = metadata.buyer_id
    const metadataSellerId = metadata.seller_id

    if (!listingId) {
      return NextResponse.json({ error: 'Missing listing metadata' }, { status: 400 })
    }

    if (buyerId && metadataBuyerId && buyerId !== metadataBuyerId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const admin = createAdminClient()
    const { data: listing, error } = await admin
      .from('listings')
      .select('id, user_id, status')
      .eq('id', listingId)
      .maybeSingle()

    if (error) {
      console.error('Failed to load listing during checkout confirmation', error)
      return NextResponse.json({ error: 'Unable to load listing' }, { status: 500 })
    }
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    if (metadataSellerId && metadataSellerId !== listing.user_id) {
      console.warn('Seller mismatch during checkout confirmation', {
        sessionId,
        metadataSellerId,
        listingOwner: listing.user_id,
      })
    }

    const paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id ?? null

    try {
      await admin
        .from('listings')
        .update({
          status: 'sold',
          payment_intent_id: paymentIntentId,
        })
        .eq('id', listingId)
    } catch (updateErr) {
      console.error('Failed to mark listing as sold during checkout confirmation', updateErr)
      return NextResponse.json({ error: 'Unable to update listing' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Error confirming checkout session', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
