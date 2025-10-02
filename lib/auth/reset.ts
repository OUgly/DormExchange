'use client'

import { supabase } from '@/lib/supabase/client'

export async function requestPasswordResetEmail(email: string, redirectTo?: string) {
  const trimmed = email.trim()
  if (!trimmed) {
    throw new Error('Email is required')
  }

  const fallbackOrigin = typeof window !== 'undefined' ? window.location.origin : ''
  const target = redirectTo ?? (fallbackOrigin ? `${fallbackOrigin}/auth/reset` : undefined)

  const { error } = await supabase.auth.resetPasswordForEmail(
    trimmed,
    target ? { redirectTo: target } : undefined
  )

  if (error) {
    throw error
  }

  return { success: true }
}
