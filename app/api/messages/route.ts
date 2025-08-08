import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  if (!body.body || !body.listingId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  return NextResponse.json({ ok: true })
}
