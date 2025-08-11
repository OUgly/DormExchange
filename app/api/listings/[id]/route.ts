import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const dataPath = path.join(process.cwd(), 'data', 'listings.json')

export async function GET(_request: Request, { params }: any) {
  const data = JSON.parse(await fs.readFile(dataPath, 'utf-8'))
  const listing = data.find((l: any) => l.id === params.id)
  if (!listing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(listing)
}
