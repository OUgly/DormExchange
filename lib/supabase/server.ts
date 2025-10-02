
import { createRouteHandlerClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export function createServerClient() {
  return createServerComponentClient({
    cookies,
  })
}

export function createRouteClient() {
  const cookieStore = cookies()
  return createRouteHandlerClient({
    cookies: () => cookieStore,
  })
}
