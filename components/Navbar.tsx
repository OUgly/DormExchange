'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Logo from './Logo'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Left: brand */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Logo />
              <span className="font-semibold">DormExchange</span>
            </Link>
          </div>
          {/* Right: actions */}
          <div className="flex items-center gap-3">
            <Link href="/market" className="hover:opacity-80">Market</Link>
            <Link href="/profile" className="hover:opacity-80">Profile</Link>
            <Link href="/campus" className="hover:opacity-80">Change Campus</Link>
            {user ? (
              <button
                onClick={handleSignOut}
                className="rounded-lg border px-3 py-1 hover:bg-white/10"
              >
                Sign Out
              </button>
            ) : (
              <Link href="/auth/signin" className="rounded-lg border px-3 py-1 hover:bg-white/10">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
