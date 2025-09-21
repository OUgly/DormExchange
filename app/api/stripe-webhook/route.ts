import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Vercel: ensure this route runs on Node.js to access raw body
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const stripe = new Stripe(key, { apiVersion: '2023-10-16' })

  // Read the raw body for signature verification
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  let event: Stripe.Event
  try {
    if (!secret || !signature) {
      // If no secret/signature is provided (e.g., local dev without webhook forwarding),
      // parse as an unverified event to avoid 400s. Do NOT use this in production.
      event = JSON.parse(body)
    } else {
      event = stripe.webhooks.constructEvent(body, signature, secret)
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Checkout completed:', session.id)
        // Mark listing as sold and save payment_intent_id for reconciliation
        const listingId = (session.metadata && (session.metadata as any).listing_id) || null
        const payment_intent_id = (session.payment_intent as string) || null
        if (listingId) {
          try {
            const admin = createAdminClient()
            await admin
              .from('listings')
              .update({ status: 'sold', payment_intent_id })
              .eq('id', listingId)
          } catch (e) {
            console.error('Failed to update listing status to sold', e)
          }
        }
        break
      }
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent
        console.log('Payment succeeded:', pi.id)
        break
      }
      case 'account.updated': {
        const account = event.data.object as Stripe.Account
        console.log('Connect account updated:', account.id)
        // Persist charges_enabled status on the profile for UI gating
        try {
          const admin = createAdminClient()
          await admin
            .from('profiles')
            .update({
              seller_charges_enabled: !!account.charges_enabled,
              seller_stripe_account_id: account.id,
            })
            .eq('seller_stripe_account_id', account.id)
        } catch (e) {
          console.error('Failed to update seller charges_enabled', e)
        }
        break
      }
      default:
        console.log(`Unhandled Stripe event: ${event.type}`)
    }
  } catch (err) {
    console.error('Error handling webhook event', err)
    return NextResponse.json({ received: true, handled: false })
  }

  return NextResponse.json({ received: true })
}
