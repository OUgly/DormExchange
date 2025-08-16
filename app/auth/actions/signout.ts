'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'

export async function signOutAction() {
  const supabase = await createServerSupabase()
  await supabase.auth.signOut()
  
  // Clear campus cookie by setting it to expire immediately
  cookies().set('dx-campus', '', { 
    maxAge: 0,
    path: '/'
  })
  
  redirect('/')
}
