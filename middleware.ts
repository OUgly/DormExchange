// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Add paths that require authentication and campus selection
const PROTECTED_PATHS = ['/market', '/profile', '/listings']
// Add paths that are public (no auth required)
const PUBLIC_PATHS = ['/about', '/careers', '/privacy', '/terms']
// Add paths that require special handling
const AUTH_PATHS = ['/auth', '/campus']

function hasSession(req: NextRequest) {
  return (
    req.cookies.has('sb-access-token') ||
    req.cookies.has('sb-refresh-token') ||
    req.cookies.has('sb:token')
  )
}

function isProtectedPath(path: string) {
  return PROTECTED_PATHS.some(p => path.startsWith(p))
}

function isPublicPath(path: string) {
  return PUBLIC_PATHS.some(p => path.startsWith(p))
}

function isAuthPath(path: string) {
  return AUTH_PATHS.some(p => path.startsWith(p))
}

export async function middleware(req: NextRequest) {
  const path = new URL(req.url).pathname
  const authed = hasSession(req)

  // Always allow public paths and auth-related paths
  if (isPublicPath(path) || isAuthPath(path)) {
    return NextResponse.next()
  }

  // If user is not authenticated and tries to access protected path, redirect to campus
  if (!authed && isProtectedPath(path)) {
    const to = new URL('/campus', req.url)
    to.searchParams.set('next', path)
    return NextResponse.redirect(to)
  }

  // For authenticated users accessing protected paths, check campus selection
  if (authed && isProtectedPath(path)) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value
          },
          set() { /* We don't set cookies in middleware */ },
          remove() { /* We don't remove cookies in middleware */ }
        }
      }
    )
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('campus_id')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile?.campus_id) {
        const to = new URL('/campus', req.url)
        to.searchParams.set('next', path)
        return NextResponse.redirect(to)
      }
    }
  }

  return NextResponse.next()
}

// Update the matcher to include all relevant paths
export const config = {
  matcher: [
    '/campus',
    '/market/:path*',
    '/profile/:path*',
    '/listings/:path*',
    '/about',
    '/careers',
    '/privacy',
    '/terms'
  ]
}
