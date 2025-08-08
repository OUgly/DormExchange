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
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-line bg-panel px-4 py-2">
      <Link href="/" className="text-lg font-semibold">
        DormExchange
      </Link>
      <div className="flex flex-1 justify-center px-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full max-w-xs rounded-md border border-line bg-muted px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
      <div>
        {session ? (
          <Link
            href="#"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted"
          >
            <span className="sr-only">Account</span>
          </Link>
        ) : (
          <Link href="/auth/login" className="text-sm font-medium">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  )
}
