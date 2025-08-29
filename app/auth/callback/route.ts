// app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/market'

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error && data?.user) {
        const user = data.user
        const md = (user.user_metadata ?? {}) as {
          username?: string
          grade?: string
          campus_slug?: string
        }

        // Get campus ID if available
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

        // Try to create/update profile - ignore errors for now since RLS is disabled
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: user.id,
          campus_id: campusId,
          username: md.username ?? user.email?.split('@')[0] ?? 'User',
          grade: md.grade ?? null,
        })
        
        if (profileError) {
          console.log('Profile upsert error (continuing anyway):', profileError)
        }
      } else {
        console.log('Auth error:', error)
        return NextResponse.redirect(`${requestUrl.origin}/auth/signin?error=auth_failed`)
      }
    } catch (error) {
      console.log('Auth callback error:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth/signin?error=callback_error`)
    }
  }

  // Use absolute URL for redirect to success page
  const redirectUrl = new URL(`/auth/success?next=${encodeURIComponent(next)}`, requestUrl.origin)
  return NextResponse.redirect(redirectUrl.toString())
}

export async function POST(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const next = requestUrl.searchParams.get('next') ?? '/market'
  const accessToken = request.headers.get('x-sb-access-token')
  const refreshToken = request.headers.get('x-sb-refresh-token')

  if (!accessToken || !refreshToken) {
    console.warn('No tokens in auth callback')
    return NextResponse.redirect(`${requestUrl.origin}/auth/signin`)
  }

  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  
  try {
    const { data, error: setError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })

    if (!setError && data?.session) {
      const user = data.session.user
      const md = (user.user_metadata ?? {}) as {
        username?: string
        grade?: string
        campus_slug?: string
      }

      // Get campus ID if available
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

      // Try to create/update profile
      const { error: upsertError } = await supabase.from('profiles').upsert({
        id: user.id,
        campus_id: campusId,
        username: md.username ?? user.email?.split('@')[0] ?? 'User',
        grade: md.grade ?? null,
      })
      
      if (upsertError) {
        console.log('Profile upsert error (continuing anyway):', upsertError)
      }
    } else {
      console.log('Auth callback error:', setError)
      return NextResponse.redirect(`${requestUrl.origin}/auth/signin`)
    }
  } catch (error) {
    console.log('Auth callback error:', error)
    return NextResponse.redirect(`${requestUrl.origin}/auth/signin`)
  }

  return NextResponse.redirect(`${requestUrl.origin}/auth/success?next=${encodeURIComponent(next)}`)
}
