'use client'

// Simple navigation bar displayed on every page.
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Navbar() {
  const [session, setSession] = useState<any>(null)

  // Check auth state on mount and subscribe to changes.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session)
    })
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-panel">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-xl font-bold">
          DormExchange
        </Link>
        <div className="flex flex-1 justify-center px-4">
          <div className="relative w-full max-w-[320px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-xl border border-line bg-muted pl-10 py-2 text-sm focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/50"
            />
          </div>
        </div>
        <div>
          {session ? (
            <Link
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-muted"
            >
              <span className="sr-only">Account</span>
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
