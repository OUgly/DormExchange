// Simple redirect page to handle auth callback redirects
'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AuthSuccess() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/market'

  useEffect(() => {
    // Small delay to ensure auth state is set, then redirect
    const timer = setTimeout(() => {
      router.push(next)
    }, 100)

    return () => clearTimeout(timer)
  }, [next, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Sign-in Successful!</h1>
        <p className="text-gray-600">Redirecting...</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
        </div>
      </div>
    </div>
  )
}
