'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'

export async function signOut() {
  const supabase = createServerClient()
  await supabase.auth.signOut()

  const jar = await cookies()
  jar.set('dx-campus', '', { maxAge: 0, path: '/' })

  redirect('/')
}
