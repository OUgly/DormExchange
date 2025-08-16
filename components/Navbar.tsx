'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Logo from './Logo'

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
      <div className="mx-auto max-w-7xl h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group pl-3">
          <Logo />
          <span className="font-semibold text-xl group-hover:text-yellow-400 transition-colors">
            DormXchange
          </span>
        </Link>
        <div className="flex items-center gap-3 pr-3">
          {campus && (
            <span className="text-base px-4 py-2 rounded-full bg-white/10">
              {campus}
            </span>
          )}
          <Link href="/market" className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-base font-medium">Market</Link>
          {user && (
            <Link href="/profile" className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-base font-medium">Profile</Link>
          )}
          <Link href="/campus" className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-base font-medium">Change campus</Link>
          {user ? (
            <form action="/auth/signout">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-yellow-400 text-black hover:brightness-95 text-base font-medium"
              >
                Sign out
              </button>
            </form>
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
