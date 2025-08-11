'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setEmail(s?.user?.email ?? null)
    )
    return () => sub.subscription.unsubscribe()
  }, [])

  return (
    <nav className="w-full py-3 backdrop-blur bg-black/20">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          DormExchange
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/market" className="px-3 py-1.5 rounded-xl bg-white/10">
            Market
          </Link>
          <Link href="/profile" className="px-3 py-1.5 rounded-xl bg-white/10">
            Profile
          </Link>
          <Link href="/campus" className="px-3 py-1.5 rounded-xl bg-white/10">
            Change campus
          </Link>
          {email ? (
            <button
              onClick={async () => {
                await supabase.auth.signOut()
                window.location.href = '/'
              }}
              className="px-3 py-1.5 rounded-xl bg-yellow-400 text-black"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/auth"
              className="px-3 py-1.5 rounded-xl bg-yellow-400 text-black"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
