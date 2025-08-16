import { getSupabaseServer } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await getSupabaseServer()
  await supabase.auth.signOut()
  
  // Clear campus cookie by setting it to expire immediately
  const response = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL))
  response.cookies.set('dx-campus', '', { 
    maxAge: 0,
    path: '/' 
  })
  
  return response
  
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL))
}
