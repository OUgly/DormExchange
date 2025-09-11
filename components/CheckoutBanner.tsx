"use client"
import { useSearchParams } from 'next/navigation'

export default function CheckoutBanner() {
  const sp = useSearchParams()
  const success = sp.get('success')
  const canceled = sp.get('canceled')
  if (!success && !canceled) return null
  const isSuccess = !!success
  return (
    <div
      className={`mb-4 rounded-md p-3 text-sm ${
        isSuccess ? 'bg-green-100 text-green-900' : 'bg-yellow-100 text-yellow-900'
      }`}
    >
      {isSuccess
        ? 'Payment successful — this item is now sold.'
        : 'Checkout canceled.'}
    </div>
  )
}

