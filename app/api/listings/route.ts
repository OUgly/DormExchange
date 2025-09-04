import { NextResponse } from 'next/server'
import listings from '@/data/listings.json'

export async function GET() {
  return NextResponse.json(listings)
}

export async function POST(request: Request) {
  if (!request.headers.get('x-user-id')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  if (!body.title || !body.price) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const newListing = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    userId: request.headers.get('x-user-id'),
    ...body,
  }
  // Edge runtime has no filesystem; simulate success but mark non-persistent
  return NextResponse.json({ ...newListing, persist: false })
}
