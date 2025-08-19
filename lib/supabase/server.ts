import { cookies as nextCookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

const isDev = process.env.NODE_ENV !== 'production'
function warnSkipped(op: 'set' | 'delete', name: string) {
  if (!isDev) return
  const trace = new Error().stack?.split('\n').slice(2, 6).join('\n') ?? ''
  // eslint-disable-next-line no-console
  console.warn(
    `[cookies:${op}] Skipped outside a Server Action/Route Handler for "${name}". ` +
      `Move this mutation into a Server Action or API route.\n${trace}`,
  )
}

export async function cookies() {
  const cookieStore = await nextCookies()
  return {
    get(name: string) {
      return cookieStore.get(name)?.value
    },
    getAll() {
      return cookieStore.getAll().map((c) => c.name)
    },
    // set accepts either (name, value, options) or a single ResponseCookie-like object in some supabase versions.
    set(nameOrCookie: any, value?: string, options?: any) {
      try {
        if (typeof nameOrCookie === 'string') {
          cookieStore.set({ name: nameOrCookie, value: value ?? '', ...(options || {}) })
        } else if (nameOrCookie && typeof nameOrCookie === 'object' && 'name' in nameOrCookie) {
          cookieStore.set(nameOrCookie)
        }
      } catch {
        // best effort warning
        const cookieName = typeof nameOrCookie === 'string' ? nameOrCookie : nameOrCookie?.name ?? ''
        warnSkipped('set', cookieName)
      }
    },
    // setAll: accept array of { name, value, options }
    setAll(items: Array<any>) {
      for (const it of items) {
        try {
          if (it && typeof it === 'object' && 'name' in it) cookieStore.set(it as any)
        } catch {
          warnSkipped('set', it?.name ?? '')
        }
      }
    },
    remove(name: string, options?: any) {
      try {
        cookieStore.delete({ name, ...(options || {}) })
      } catch {
        warnSkipped('delete', name)
      }
    },
  }
}

export async function getSupabaseServer() {
  const jar = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: jar,
    },
  )
}
