'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function SignInPage() {
  const params = useSearchParams()
  const router = useRouter()
  const next = params.get('next') ?? '/market'

  const [campusSlug, setCampusSlug] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [campusDomains, setCampusDomains] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )dx-campus=([^;]*)/)
    setCampusSlug(match ? decodeURIComponent(match[1]) : '')
  }, [])

  useEffect(() => {
    if (!campusSlug) return
    supabase
      .from('campuses')
      .select('allowed_domains')
      .eq('slug', campusSlug)
      .maybeSingle()
      .then(({ data }) => setCampusDomains((data?.allowed_domains as string[]) ?? []))
  }, [campusSlug])

  const emailDomain = useMemo(() => email.split('@')[1]?.toLowerCase() ?? '', [email])
  const domainOk = campusDomains.length === 0 || campusDomains.includes(emailDomain)

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    if (!domainOk) return setMsg(`Use your school email (${campusDomains.join(', ')})`)
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return setMsg(error.message)
    const session = data.session
    if (session) {
      await fetch(`/auth/callback?next=${encodeURIComponent(next)}`, {
        method: 'POST',
        headers: {
          'x-sb-access-token': session.access_token,
          'x-sb-refresh-token': session.refresh_token,
        },
      })
      router.push(next)
    }
  }

  return (
    <main className="container mx-auto max-w-md px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold">Sign in</h1>
      <p className="mb-6 opacity-80">Campus: <span className="font-medium">{campusSlug}</span></p>
      <form onSubmit={handleSignIn} className="space-y-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={`yourname@${campusDomains[0] ?? 'school.edu'}`}
          className={`w-full rounded-xl px-4 py-3 bg-white/10 outline-none placeholder:opacity-70 ${domainOk || !email ? '' : 'ring-2 ring-red-500'}`}
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-xl px-4 py-3 bg-white/10 outline-none placeholder:opacity-70"
        />
        {!domainOk && email && (
          <p className="text-sm text-red-400">Use your school email: {campusDomains.join(', ')}</p>
        )}
        <button
          disabled={loading}
          className="w-full rounded-xl bg-yellow-400 px-4 py-3 font-semibold text-black disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        {msg && <p className="text-sm opacity-80">{msg}</p>}
      </form>
      <p className="mt-6 text-center text-sm opacity-80">
        Need an account? <a href="/auth" className="underline">Sign up</a>
      </p>
    </main>
  )
}
