'use client'

// Simple navigation bar displayed on every page.
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Button from './ui/Button'

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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <nav className="mb-6 flex items-center justify-between border-b p-4">
      <Link href="/" className="text-xl font-bold">
        DormExchange
      </Link>
      <div className="space-x-4">
        <Link href="/listings/new" className="text-sm font-medium">
          New Listing
        </Link>
        {session ? (
          <Button onClick={handleSignOut}>Sign Out</Button>
          ) : (
          <Link href="/auth/login" className="text-sm font-medium">
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}
