'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

type ConfirmState = 'idle' | 'loading' | 'success' | 'error'

export default function CheckoutBanner() {
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const canceled = searchParams.get('canceled')
  const sessionId = searchParams.get('session_id')

  const [state, setState] = useState<ConfirmState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isSuccess = !!success

  useEffect(() => {
    if (!isSuccess || !sessionId || state !== 'idle') return
    let active = true

    async function confirm() {
      try {
        setState('loading')
        const res = await fetch('/api/checkout/confirm', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => null)
          throw new Error(data?.error || 'Unable to finalize checkout.')
        }
        if (!active) return
        setState('success')
      } catch (err) {
        console.error('Failed to confirm checkout session', err)
        if (!active) return
        setErrorMessage(err instanceof Error ? err.message : 'Unable to finalize checkout.')
        setState('error')
      }
    }

    confirm()

    return () => {
      active = false
    }
  }, [isSuccess, sessionId, state])

  if (!success && !canceled) return null

  const baseClass = 'mb-4 rounded-md p-3 text-sm '
  let message: string
  let className: string

  if (isSuccess) {
    className = baseClass + 'bg-green-100 text-green-900'
    if (sessionId) {
      if (state === 'loading') {
        message = 'Payment successful - finishing up your order...'
      } else if (state === 'success') {
        message = 'Payment successful - this item is now marked as sold.'
      } else if (state === 'error') {
        const extra = errorMessage ? ' (' + errorMessage + ')' : ''
        message = 'Payment succeeded, but we could not update the listing automatically. Please refresh in a moment or contact support.' + extra
      } else {
        message = 'Payment successful - finalizing your order shortly.'
      }
    } else {
      message = 'Payment successful - if the listing is still visible, refresh the page in a moment.'
    }
  } else {
    className = baseClass + 'bg-yellow-100 text-yellow-900'
    message = 'Checkout canceled.'
  }

  return <div className={className}>{message}</div>
}

