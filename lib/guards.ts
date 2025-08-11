import { cookies } from 'next/headers'
import { createServerSupabase } from '@/lib/supabase/server'

export async function requireAuthAndCampus() {
  const cookieStore = await cookies()
  const campus = cookieStore.get('dx-campus')?.value || null

  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { user, campus }
}
