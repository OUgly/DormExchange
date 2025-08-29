import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  await supabase.auth.signOut()

  const response = NextResponse.redirect('/')
  response.cookies.set('dx-campus', '', { maxAge: 0, path: '/' })
  response.cookies.set('dx-campus-public', '', { maxAge: 0, path: '/' })
  return response
}
