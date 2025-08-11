import { cookies, headers } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

// For Server Components (READ-ONLY cookies)
export async function createServerSupabase() {
  const cookieStore = await cookies()
  const headerStore = await headers()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value ?? ''
        },
        set(name: string, value: string, options: CookieOptions) {
          // No-op in server components
        },
        remove(name: string, options: CookieOptions) {
          // No-op in server components
        }
      },
      global: {
        headers: {
          'x-forwarded-host': headerStore.get('host') ?? ''
        }
      }
    }
  )
}

// For Route Handlers / Server Actions (can SET/REMOVE cookies)
export async function createRouteSupabase() {
  const cookieStore = await cookies()
  const headerStore = await headers()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value ?? ''
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        }
      },
      global: {
        headers: {
          'x-forwarded-host': headerStore.get('host') ?? ''
        }
      }
    }
  )
}
