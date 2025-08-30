'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Logo from './Logo'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [unread, setUnread] = useState<number>(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Add a small delay to prevent race conditions with middleware
    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getUser()
        setUser(data.user)
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
          setUser(session?.user ?? null)
        })
        
        return () => subscription.unsubscribe()
      } catch (error) {
        console.error('Auth error in navbar:', error)
      }
    }

    const cleanup = initAuth()
    return () => {
      cleanup.then(unsubscribe => unsubscribe?.())
    }
  }, [])

  useEffect(() => {
    if (!mounted || !user) return
    let cancelled = false

    const fetchUnread = async () => {
      try {
        const lastSeen = localStorage.getItem('messagesLastSeenAt') || '1970-01-01T00:00:00.000Z'
        const { count } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('to_user_id', user.id)
          .gt('created_at', lastSeen)
        if (!cancelled) setUnread(count || 0)
      } catch (e) {
        if (!cancelled) setUnread(0)
      }
    }

    fetchUnread()

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'messagesLastSeenAt') fetchUnread()
    }
    window.addEventListener('storage', onStorage)

    const interval = window.setInterval(fetchUnread, 30000)

    return () => {
      cancelled = true
      window.removeEventListener('storage', onStorage)
      window.clearInterval(interval)
    }
  }, [mounted, user?.id])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  // Don't render auth-dependent content until mounted
  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <Logo />
                <span className="font-semibold">DormExchange</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
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
            <Link href="/messages" className="relative hover:opacity-80">
              Messages
              {user && unread > 0 && (
                <span className="absolute -right-2 -top-1 inline-flex items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] leading-4 text-white">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </Link>
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
