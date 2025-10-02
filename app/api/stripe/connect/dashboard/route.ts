import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

async function handleDashboard(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const supabase = createRouteClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('seller_stripe_account_id')
    .eq('id', user.id)
    .maybeSingle()
  if (error) {
    console.error('Failed to load profile for Stripe dashboard link', error)
    return NextResponse.json({ error: 'Unable to load profile' }, { status: 500 })
  }

  const accountId = profile?.seller_stripe_account_id as string | undefined
  if (!accountId) {
    return NextResponse.json({ error: 'No connected account' }, { status: 400 })
  }

  try {
    const link = await stripe.accounts.createLoginLink(accountId)
    return NextResponse.redirect(link.url, 303)
  } catch (err) {
    console.error('Failed to create Stripe dashboard login link', err)
    return NextResponse.json({ error: 'Unable to create dashboard link' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  return handleDashboard(request)
}

export async function GET(request: Request) {
  return handleDashboard(request)
}
