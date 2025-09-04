import { NextResponse } from 'next/server'
import listings from '@/data/listings.json'

export async function GET(_request: Request, { params }: any) {
  const listing = (listings as any[]).find((l: any) => l.id === params.id)
  if (!listing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(listing)
}
