import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const url = new URL(req.url)
  const path = url.pathname

  const protectedPaths = ['/market', '/profile']
  const isProtected = protectedPaths.some((p) => path.startsWith(p))

  if (!isProtected) return NextResponse.next()

  // Use the presence of the supabase cookie. If missing, send to /campus
  const hasSession = req.cookies.has('sb:token') || req.cookies.has('sb-access-token')
  if (!hasSession) {
    const redirectUrl = new URL('/campus', req.url)
    redirectUrl.searchParams.set('next', path)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/market/:path*', '/profile/:path*'],
}
