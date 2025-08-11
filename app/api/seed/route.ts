import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (token !== process.env.SEED_TOKEN) return new NextResponse('forbidden', { status: 403 })

  const supabase = await createServerSupabase()
  const { data: campuses } = await supabase.from('campuses').select('id, slug').limit(1)
  const campusId = campuses?.[0]?.id
  if (!campusId) return new NextResponse('no campus', { status: 400 })

  const sample = [
    { title: 'Calculus Textbook', price_cents: 3000, condition: 'Used', image_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba' },
    { title: 'Dorm Desk Lamp', price_cents: 1500, condition: 'Like New', image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85' },
    { title: 'Mini Fridge', price_cents: 8000, condition: 'Used', image_url: 'https://images.unsplash.com/photo-1556909190-eccf4a8bf97d' }
  ].map((x) => ({ ...x, campus_id: campusId }))

  await supabase.from('listings').insert(sample)
  return NextResponse.json({ ok: true, inserted: sample.length })
}
