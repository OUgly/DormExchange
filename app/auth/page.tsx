'use client'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

const GRADES = ['Freshman','Sophomore','Junior','Senior','Graduate','Other'] as const

export default function AuthPage() {
  const params = useSearchParams()
  const router = useRouter()
  const campusSlug = params.get('campus') ?? ''
  const next = params.get('next') ?? '/market'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [username, setUsername] = useState('')
  const [grade, setGrade] = useState<(typeof GRADES)[number] | ''>('')
  const [campusDomains, setCampusDomains] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  // load allowed email domains for selected campus
  useEffect(() => {
    async function run() {
      const { data, error } = await supabase
        .from('campuses')
        .select('allowed_domains')
        .eq('slug', campusSlug)
        .maybeSingle()
      if (error || !data) return setCampusDomains([])
      setCampusDomains(data.allowed_domains as string[])
    }
    run()
  }, [campusSlug])

  const emailDomain = useMemo(() => email.split('@')[1]?.toLowerCase() ?? '', [email])
  const domainOk = campusDomains.length === 0 || campusDomains.includes(emailDomain)
  const pwMatch = password.length > 0 && password === confirm

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)

    if (!domainOk) return setMsg(`Use your school email (${campusDomains.join(', ')})`)
    if (!pwMatch) return setMsg('Passwords do not match.')
    if (!username) return setMsg('Choose a username.')
    if (!grade) return setMsg('Select your school year.')

    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // we’ll read these in /auth/callback to create the profile row
        data: { username, grade, campus_slug: campusSlug },
        emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    setLoading(false)

    if (error) return setMsg(error.message)

    // If we received a session immediately, pass the tokens to the
    // callback route so that it can set auth cookies and create the
    // profile row on the server. Otherwise (e.g. email confirmation
    // required) show a notice to the user.
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
    } else {
      setMsg('Check your email for a confirmation link to finish sign-up.')
    }
  }

  return (
    <main className="container mx-auto px-4 py-10 max-w-md">
      <h1 className="text-3xl font-bold mb-2">Create your account</h1>
      <p className="opacity-80 mb-6">Campus: <span className="font-medium">{campusSlug}</span></p>

      <form onSubmit={handleSignUp} className="space-y-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={`yourname@${campusDomains[0] ?? 'school.edu'}`}
          className={`w-full rounded-xl px-4 py-3 bg-white/10 outline-none placeholder:opacity-70 ${domainOk || !email ? '' : 'ring-2 ring-red-500'}`}
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 8 chars)"
            className="w-full rounded-xl px-4 py-3 bg-white/10 outline-none placeholder:opacity-70"
          />
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm password"
            className={`w-full rounded-xl px-4 py-3 bg-white/10 outline-none placeholder:opacity-70 ${!confirm || pwMatch ? '' : 'ring-2 ring-red-500'}`}
          />
        </div>

        <input
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value.trim())}
          placeholder="Username"
          className="w-full rounded-xl px-4 py-3 bg-white/10 outline-none placeholder:opacity-70"
        />

        <select
          required
          value={grade}
          onChange={(e) => setGrade(e.target.value as any)}
          className="w-full rounded-xl px-4 py-3 bg-white/10 outline-none"
        >
          <option value="" disabled>School year</option>
          {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>

        {!domainOk && email && (
          <p className="text-sm text-red-400">Use your school email: {campusDomains.join(', ')}</p>
        )}

        <button
          disabled={loading}
          className="w-full rounded-xl px-4 py-3 bg-yellow-400 text-black font-semibold disabled:opacity-60"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>

        {msg && <p className="text-sm opacity-80">{msg}</p>}
      </form>
    </main>
  )
}
