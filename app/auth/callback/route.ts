import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/market'

  if (!code) return NextResponse.redirect(origin + '/campus')

  const supabase = await createServerSupabase()
  const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
  if (error || !session) return NextResponse.redirect(origin + '/campus')

  // Ensure profile row exists and attach campus by inferring from email domain
  const emailDomain = session.user.email!.split('@')[1]?.toLowerCase()
  const { data: campus } = await supabase
    .from('campuses')
    .select('id, allowed_domains')
    .contains('allowed_domains', [emailDomain])
    .maybeSingle()

  await supabase.from('profiles').upsert({ id: session.user.id, campus_id: campus?.id }).select()

  return NextResponse.redirect(origin + next)
}
