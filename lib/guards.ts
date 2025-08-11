import { cookies } from 'next/headers'
import { getSupabaseServer } from '@/lib/supabase/server'

export type GuardResult = {
  user: { id: string; email?: string | null } | null
  campus: string | null
  supabase: Awaited<ReturnType<typeof getSupabaseServer>>
}

export async function requireAuthAndCampus(): Promise<GuardResult> {
  const jar = await cookies()
  const campus = jar.get('dx-campus')?.value ?? null
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  return { user, campus, supabase }
}
