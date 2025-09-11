'use client'
import { useState } from 'react'

export default function BuyNowButton({ listingId }: { listingId: string }) {
  const [loading, setLoading] = useState(false)
  async function handleBuy() {
    try {
      setLoading(true)
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ listingId }),
      })
      if (res.status === 401) {
        // Not signed in: send to auth, then back to listing
        const next = encodeURIComponent(`/listing/${listingId}`)
        window.location.href = `/auth?next=${next}`
        return
      }
      const data = await res.json()
      if (!res.ok || !data?.url) throw new Error(data?.error || 'Checkout failed')
      window.location.href = data.url
    } catch (e) {
      console.error(e)
      alert('Unable to start checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="w-full rounded-xl bg-yellow-400 text-black font-semibold px-4 py-3 hover:bg-yellow-300 disabled:opacity-60"
    >
      {loading ? 'Starting checkout…' : 'Buy Now'}
    </button>
  )
}

