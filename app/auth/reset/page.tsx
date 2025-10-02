'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

type Stage = 'verifying' | 'ready' | 'success' | 'error'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const next = searchParams.get('next') ?? '/market'
  const searchParamSignature = searchParams.toString()

  const [stage, setStage] = useState<Stage>('verifying')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function verify() {
      if (stage !== 'verifying') return

      let code = searchParams.get('code')
      let accessToken = searchParams.get('access_token')
      let refreshToken = searchParams.get('refresh_token')

      if (typeof window !== 'undefined') {
        const hash = window.location.hash
        const hashParams = hash ? new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash) : null

        if (hashParams) {
          const authKeys = ['access_token', 'refresh_token', 'expires_at', 'expires_in', 'token_type', 'type', 'code']
          const currentSearch = new URLSearchParams(window.location.search)
          let replaced = false

          authKeys.forEach((key) => {
            const hashValue = hashParams.get(key)
            if (!hashValue) return
            if (!currentSearch.has(key)) {
              currentSearch.set(key, hashValue)
              replaced = true
            }
          })

          if (replaced) {
            const base = window.location.pathname
            const queryString = currentSearch.toString()
            const newUrl = queryString ? `${base}?${queryString}` : base
            router.replace(newUrl, { scroll: false })
            return
          }

          code = code ?? hashParams.get('code')
          accessToken = accessToken ?? hashParams.get('access_token')
          refreshToken = refreshToken ?? hashParams.get('refresh_token')
        }
      }

      if (!code && !(accessToken && refreshToken)) {
        if (!cancelled) {
          setMsg('Reset link is invalid or expired. Request a new one.')
          setStage('error')
        }
        return
      }

      try {
        setMsg(null)
        let session = null
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
          session = data.session
        } else if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          if (error) throw error
          session = data.session
        }

        if (session?.access_token && session?.refresh_token) {
          try {
            await fetch(`/auth/callback?next=${encodeURIComponent(next)}`, {
              method: 'POST',
              headers: {
                'x-sb-access-token': session.access_token,
                'x-sb-refresh-token': session.refresh_token,
              },
            })
          } catch (callbackError) {
            console.warn('Failed to sync session after password recovery', callbackError)
          }
        }

        if (!cancelled) {
          setStage('ready')
        }
      } catch (error: any) {
        console.error('Password reset verification failed', error)
        if (!cancelled) {
          setMsg(error?.message ?? 'Reset link is invalid or expired. Request a new one.')
          setStage('error')
        }
      }
    }

    verify()

    return () => {
      cancelled = true
    }
  }, [stage, searchParamSignature, next, router])

  useEffect(() => {
    if (stage !== 'success') return
    const timer = setTimeout(() => {
      router.push(next)
    }, 2000)
    return () => clearTimeout(timer)
  }, [stage, next, router])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMsg(null)

    if (password.length < 8) {
      setMsg('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setMsg('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setPassword('')
      setConfirm('')
      setStage('success')
      setMsg('Password updated! Redirecting...')
    } catch (error: any) {
      console.error('Password update failed', error)
      setMsg(error?.message ?? 'Unable to update password right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto max-w-md px-4 py-10">
      <h1 className="mb-4 text-3xl font-bold">Reset password</h1>

      {stage === 'verifying' && (
        <p className="text-sm opacity-80">Hang tight while we verify your reset link...</p>
      )}

      {stage === 'error' && (
        <div className="space-y-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-200">{msg ?? 'Reset link is invalid or expired. Request a new one.'}</p>
          <button
            type="button"
            className="rounded-md bg-yellow-400 px-3 py-2 text-black font-semibold hover:bg-yellow-300"
            onClick={() => router.push('/auth/signin')}
          >
            Return to sign in
          </button>
        </div>
      )}

      {stage === 'ready' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm opacity-80">Choose a new password for your account.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            placeholder="New password (min 8 characters)"
            className="w-full rounded-xl bg-white/10 px-4 py-3 outline-none placeholder:opacity-70"
            required
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm new password"
            className="w-full rounded-xl bg-white/10 px-4 py-3 outline-none placeholder:opacity-70"
            required
          />
          {msg && (
            <p className="text-sm text-amber-200">{msg}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-yellow-400 px-4 py-3 font-semibold text-black disabled:opacity-60"
          >
            {loading ? 'Updating...' : 'Update password'}
          </button>
        </form>
      )}

      {stage === 'success' && (
        <div className="space-y-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
          <p className="text-sm text-emerald-100">Password updated successfully! We'll take you back shortly.</p>
          <button
            type="button"
            className="rounded-md bg-yellow-400 px-3 py-2 text-black font-semibold hover:bg-yellow-300"
            onClick={() => router.push(next)}
          >
            Continue now
          </button>
        </div>
      )}
    </main>
  )
}
