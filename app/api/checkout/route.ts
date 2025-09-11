import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })

    const supabase = createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { listingId } = (await request.json().catch(() => ({}))) as { listingId?: string }
    if (!listingId) return NextResponse.json({ error: 'listingId required' }, { status: 400 })

    // Fetch listing data
    const { data: listing, error } = await supabase
      .from('listings')
      .select('id, title, price, user_id, status')
      .eq('id', listingId)
      .maybeSingle()

    if (error || !listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    if (listing.user_id === user.id)
      return NextResponse.json({ error: 'Cannot buy your own listing' }, { status: 400 })
    if (listing.status && listing.status !== 'active')
      return NextResponse.json({ error: 'Listing is not available' }, { status: 400 })

  const stripe = new Stripe(key, { apiVersion: '2023-10-16' })

    const amountCents = Math.max(0, Math.round(Number(listing.price) * 100))
    if (!Number.isFinite(amountCents) || amountCents <= 0)
      return NextResponse.json({ error: 'Invalid listing price' }, { status: 400 })

  // If Stripe Connect is enabled, require seller to have onboarded and split funds at charge time
  const useConnect = (process.env.USE_STRIPE_CONNECT || '').toLowerCase() === 'true'

  let session: Stripe.Checkout.Session
  if (useConnect) {
    // Pull seller's connected account and status
    const { data: sellerProfile } = await supabase
      .from('profiles')
      .select('seller_stripe_account_id, seller_charges_enabled')
      .eq('id', listing.user_id)
      .maybeSingle()

    const destination = sellerProfile?.seller_stripe_account_id as string | undefined
    const chargesEnabled = !!sellerProfile?.seller_charges_enabled
    if (!destination || !chargesEnabled) {
      return NextResponse.json({ error: 'Seller has not set up payouts' }, { status: 400 })
    }

    // Compute application fee (default 7%) in cents
    const bps = Number(process.env.PLATFORM_FEE_BPS ?? '700') // 700 bps = 7%
    const buyerFee = Math.max(0, Math.round((amountCents * bps) / 10_000))
    const total = amountCents + buyerFee

    const origin = process.env.APP_URL || new URL(request.url).origin

    session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: total,
            product_data: {
              name: listing.title,
            },
          },
        },
      ],
      success_url: `${origin}/listing/${listing.id}?success=1`,
      cancel_url: `${origin}/listing/${listing.id}?canceled=1`,
      payment_intent_data: {
        application_fee_amount: buyerFee,
        transfer_data: { destination },
      },
      metadata: {
        listing_id: listing.id,
        seller_id: listing.user_id || '',
        buyer_id: user.id,
      },
    })
  } else {
    // Platform-only charge (no Connect)
    const origin = process.env.APP_URL || new URL(request.url).origin
    session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: amountCents,
            product_data: {
              name: listing.title,
              metadata: { listing_id: listing.id },
            },
          },
        },
      ],
      metadata: {
        listing_id: listing.id,
        buyer_id: user.id,
        seller_id: listing.user_id || '',
      },
      success_url: `${origin}/listing/${listing.id}?success=1`,
      cancel_url: `${origin}/listing/${listing.id}?canceled=1`,
    })
  }

    return NextResponse.json({ url: session.url, id: session.id })
  } catch (err) {
    console.error('Error creating checkout session', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
