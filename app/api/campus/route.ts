import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const { slug } = await req.json()
  if (!slug || typeof slug !== 'string') {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
  }
  const jar = await cookies()
  jar.set('dx-campus', slug, { path: '/', maxAge: 60*60*24*365, sameSite: 'lax' })
  return NextResponse.json({ ok: true })
}
