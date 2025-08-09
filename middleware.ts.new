// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function hasSession(req: NextRequest) {
  return (
    req.cookies.has('sb-access-token') ||
    req.cookies.has('sb-refresh-token') ||
    req.cookies.has('sb:token')
  )
}

export function middleware(req: NextRequest) {
  const path = new URL(req.url).pathname
  const authed = hasSession(req)

  if (path.startsWith('/campus') && authed) {
    return NextResponse.redirect(new URL('/market', req.url))
  }

  const protectedPaths = ['/market', '/profile']
  if (protectedPaths.some(p => path.startsWith(p)) && !authed) {
    const to = new URL('/campus', req.url)
    to.searchParams.set('next', path)
    return NextResponse.redirect(to)
  }
  return NextResponse.next()
}

export const config = { matcher: ['/campus', '/market/:path*', '/profile/:path*'] }
