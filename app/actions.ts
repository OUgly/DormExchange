'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'

export async function signOut() {
  const supabase = await createServerSupabase()
  await supabase.auth.signOut()
  
  // Clear campus cookie
  cookies().set('dx-campus', '', { 
    maxAge: 0,
    path: '/'
  })
  
  redirect('/')}
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createRouteSupabase } from '@/lib/supabase/server'

export async function signOut() {
  const supabase = await createRouteSupabase()
  await supabase.auth.signOut()
  
  // Clear cookies
  const cookieStore = cookies()
  cookieStore.delete('dx-campus')
  
  redirect('/')
}
