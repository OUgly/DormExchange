// app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { createRouteSupabase } from '@/lib/supabase/server'

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/market'

  if (!code) {
    console.warn('No auth code in callback')
    return NextResponse.redirect(`${origin}/`)
  }

  const supabase = await createRouteSupabase()

  const {
    data: { session },
    error: exchangeError,
  } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError || !session) {
    console.error('Auth callback error:', exchangeError)
    return NextResponse.redirect(`${origin}/`)
  }


  const user = session.user
  const md = (user.user_metadata ?? {}) as {
    username?: string
    grade?: string
    campus_slug?: string
  }

  // Prefer campus slug from metadata; else fall back to email domain
  let campusId: string | null = null
  if (md.campus_slug) {
    const { data: campusRow } = await supabase
      .from('campuses')
      .select('id')
      .eq('slug', md.campus_slug)
      .maybeSingle()
    campusId = campusRow?.id ?? null
  }
  if (!campusId && user.email) {
    const emailDomain = user.email.split('@')[1]?.toLowerCase()
    const { data: campusRow2 } = await supabase
      .from('campuses')
      .select('id')
      .contains('allowed_domains', [emailDomain])
      .maybeSingle()
    campusId = campusRow2?.id ?? null
  }

  // Upsert profile row with username + grade if provided
  const { error: upsertError } = await supabase.from('profiles').upsert({
    id: user.id,
    campus_id: campusId,
    username: md.username ?? null,
    grade: md.grade ?? null,
  })
  if (upsertError) {
    console.error('Profile upsert error:', upsertError)
  }

  // Redirect to the next page *after* cookies are set
  return NextResponse.redirect(`${origin}${next}`)
}

export async function POST(req: Request) {
  const { searchParams, origin } = new URL(req.url)
  const next = searchParams.get('next') ?? '/market'
  const accessToken = req.headers.get('x-sb-access-token')
  const refreshToken = req.headers.get('x-sb-refresh-token')

  if (!accessToken || !refreshToken) {
    console.warn('No tokens in auth callback')
    return NextResponse.redirect(`${origin}/`)
  }

  const supabase = await createRouteSupabase()
  const {
    data: { session },
    error: setError,
  } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  })

  if (setError || !session) {
    console.error('Auth callback error:', setError)
    return NextResponse.redirect(`${origin}/`)
  }

  const user = session.user
  const md = (user.user_metadata ?? {}) as {
    username?: string
    grade?: string
    campus_slug?: string
  }

  // Prefer campus slug from metadata; else fall back to email domain
  let campusId: string | null = null
  if (md.campus_slug) {
    const { data: campusRow } = await supabase
      .from('campuses')
      .select('id')
      .eq('slug', md.campus_slug)
      .maybeSingle()
    campusId = campusRow?.id ?? null
  }
  if (!campusId && user.email) {
    const emailDomain = user.email.split('@')[1]?.toLowerCase()
    const { data: campusRow2 } = await supabase
      .from('campuses')
      .select('id')
      .contains('allowed_domains', [emailDomain])
      .maybeSingle()
    campusId = campusRow2?.id ?? null
  }

  const { error: upsertError } = await supabase.from('profiles').upsert({
    id: user.id,
    campus_id: campusId,
    username: md.username ?? null,
    grade: md.grade ?? null,
  })
  if (upsertError) {
    console.error('Profile upsert error:', upsertError)
  }

  return NextResponse.redirect(`${origin}${next}`)
}