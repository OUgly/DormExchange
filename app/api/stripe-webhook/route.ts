import Stripe from 'stripe'
import { NextResponse } from 'next/server'

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
