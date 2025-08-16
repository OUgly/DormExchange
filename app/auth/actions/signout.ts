'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getSupabaseServer } from '@/lib/supabase/server'

export async function signOutAction() {
  const supabase = await getSupabaseServer()
  await supabase.auth.signOut()

  // Clear campus cookie by setting it to expire immediately
  const jar = await cookies()
  jar.set('dx-campus', '', {
    maxAge: 0,
    path: '/'
  })
  
  redirect('/')
}
