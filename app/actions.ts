'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getSupabaseServer } from '@/lib/supabase/server'

export async function signOut() {
  const supabase = await getSupabaseServer()
  await supabase.auth.signOut()

  const jar = await cookies()
  jar.set('dx-campus', '', { maxAge: 0, path: '/' })

  redirect('/')
}
