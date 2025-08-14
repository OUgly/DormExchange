'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function Navbar() {
  const [campus, setCampus] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Get campus from cookie
    const match = document.cookie.match(/(?:^|; )dx-campus=([^;]*)/)
    setCampus(match ? decodeURIComponent(match[1]) : null)

    // Get initial auth state
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <nav className="sticky top-0 z-50 bg-bg/80 backdrop-blur border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">DormExchange</Link>
        <div className="flex items-center gap-2">
          {campus && (
            <span className="text-xs px-2 py-1 rounded-full bg-white/10">
              {campus}
            </span>
          )}
          <Link href="/market" className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10">Market</Link>
          {user && (
            <Link href="/profile" className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10">Profile</Link>
          )}
          <Link href="/campus" className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10">Change campus</Link>
          {user ? (
            <button
              onClick={async () => {
                await supabase.auth.signOut()
                window.location.href = '/'
              }}
              className="px-3 py-1 rounded-xl bg-yellow-400 text-black hover:brightness-95"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/auth/signin"
              className="px-3 py-1 rounded-xl bg-yellow-400 text-black hover:brightness-95"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
