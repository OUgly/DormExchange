import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { v4 as uuid } from 'uuid'

const dataPath = path.join(process.cwd(), 'data', 'listings.json')

export async function GET() {
  const data = JSON.parse(await fs.readFile(dataPath, 'utf-8'))
  return NextResponse.json(data)
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
    id: uuid(),
    createdAt: new Date().toISOString(),
    userId: request.headers.get('x-user-id'),
    ...body,
  }
  try {
    const data = JSON.parse(await fs.readFile(dataPath, 'utf-8'))
    data.push(newListing)
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2))
    return NextResponse.json(newListing)
  } catch {
    return NextResponse.json({ ...newListing, persist: false })
  }
}
