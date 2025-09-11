import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

async function doOnboard(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Get current seller account id if exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('seller_stripe_account_id')
    .eq('id', user.id)
    .maybeSingle()

  let acctId = profile?.seller_stripe_account_id as string | undefined
  if (!acctId) {
    // Create an Express connected account for this seller
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      email: user.email ?? undefined,
      capabilities: {
        transfers: { requested: true },
        card_payments: { requested: true },
      },
      business_type: 'individual',
    })
    acctId = account.id

    // Save to profile (RLS allows user to update own profile)
    await supabase
      .from('profiles')
      .update({ seller_stripe_account_id: acctId })
      .eq('id', user.id)
  }

  const origin = process.env.APP_URL || new URL(request.url).origin
  const link = await stripe.accountLinks.create({
    account: acctId,
    type: 'account_onboarding',
    refresh_url: `${origin}/payouts?refresh=1`,
    return_url: `${origin}/payouts?return=1`,
  })

  return NextResponse.redirect(link.url, 303)
}

export async function POST(request: Request) {
  return doOnboard(request)
}

// Also allow GET for convenience (form-less navigation)
export async function GET(request: Request) {
  return doOnboard(request)
}
