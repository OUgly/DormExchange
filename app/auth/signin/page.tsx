'use client'
export const dynamic = 'force-dynamic'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { requestPasswordResetEmail } from '@/lib/auth/reset'

function SignInPageInner() {
  const params = useSearchParams()
  const router = useRouter()
  const next = params.get('next') ?? '/market'

  const [campusSlug, setCampusSlug] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [campusDomains, setCampusDomains] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [resetMsg, setResetMsg] = useState<string | null>(null)
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )dx-campus-public=([^;]*)/)
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

  async function handlePasswordReset() {
    setResetMsg(null)
    if (!email) {
      setResetMsg('Enter your school email first.')
      return
    }
    if (!domainOk) {
      setResetMsg(`Use your school email (${campusDomains.join(', ')})`)
      return
    }
    setResetting(true)
    try {
      const redirect = `${window.location.origin}/auth/reset?next=${encodeURIComponent(next)}`
      await requestPasswordResetEmail(email, redirect)
      setResetMsg('Reset link sent! Check your inbox.')
    } catch (error: any) {
      setResetMsg(error?.message ?? 'Something went wrong. Please try again.')
    } finally {
      setResetting(false)
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
          onChange={(e) => {
            setEmail(e.target.value)
            if (resetMsg) setResetMsg(null)
          }}
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
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handlePasswordReset}
            disabled={resetting}
            className="text-sm text-yellow-200 underline hover:text-yellow-100 disabled:opacity-60"
          >
            {resetting ? 'Sending reset...' : 'Forgot password?'}
          </button>
        </div>
        {msg && <p className="text-sm opacity-80">{msg}</p>}
        {resetMsg && <p className="text-sm opacity-80">{resetMsg}</p>}
      </form>
      <p className="mt-6 text-center text-sm opacity-80">
        Need an account? <a href="/auth" className="underline">Sign up</a>
      </p>
    </main>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInPageInner />
    </Suspense>
  )
}
