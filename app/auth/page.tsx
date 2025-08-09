'use client'
import { useEffect, useMemo, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function AuthPageWrapper() {
  return (
    <Suspense fallback={null}>
      <AuthPage />
    </Suspense>
  )
}

function AuthPage() {
  const params = useSearchParams()
  const router = useRouter()
  const campusSlug = params.get('campus') ?? ''
  const next = params.get('next') ?? '/market'

  const [email, setEmail] = useState('')
  const [campusDomains, setCampusDomains] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    // fetch allowed domains for this campus
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

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    if (!domainOk) {
      setMsg(`Use your school email (${campusDomains.join(', ')})`)
      return
    }
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: location.origin + '/auth/callback' } })
    setLoading(false)
    if (error) return setMsg(error.message)
    setMsg('Check your inbox for the sign-in link!')
  }

  return (
    <main className="container mx-auto px-4 py-10 max-w-md">
      <h1 className="text-3xl font-bold mb-2">Sign in with your .edu</h1>
      <p className="opacity-80 mb-6">Campus: <span className="font-medium">{campusSlug}</span></p>

      <form onSubmit={handleMagicLink} className="space-y-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={`yourname@${campusDomains[0] ?? 'school.edu'}`}
          className={`w-full rounded-xl px-4 py-3 bg-white/10 outline-none placeholder:opacity-70 ${domainOk || !email ? '' : 'ring-2 ring-red-500'}`}
        />
        {!domainOk && email && (
          <p className="text-sm text-red-400">Use your school email: {campusDomains.join(', ')}</p>
        )}
        <button disabled={loading} className="w-full rounded-xl px-4 py-3 bg-yellow-400 text-black font-semibold disabled:opacity-60">
          {loading ? 'Sending…' : 'Email me a sign-in link'}
        </button>
        {msg && <p className="text-sm opacity-80">{msg}</p>}
      </form>
    </main>
  )
}
