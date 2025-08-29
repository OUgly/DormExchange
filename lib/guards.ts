import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase/server'
import { SupabaseClient } from '@supabase/supabase-js'

export type GuardResult = {
  user: { id: string; email?: string | null } | null
  campus: string | null
  supabase: SupabaseClient
}

export async function requireAuthAndCampus(): Promise<GuardResult> {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  const cookieStore = cookies()
  const campus = cookieStore.get('dx-campus')?.value ?? null

  // Don't throw error - let the calling component handle the redirect
  return { user, campus, supabase }
}
