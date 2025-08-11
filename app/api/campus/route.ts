import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const { slug } = await req.json()
  if (!slug || typeof slug !== 'string') {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
  }
  const cookieStore = await cookies()
  cookieStore.set('dx-campus', slug, {
    path: '/',
    sameSite: 'lax',
    maxAge: 31536000,
  })
  return NextResponse.json({ ok: true })
}
