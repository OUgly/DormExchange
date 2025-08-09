'use client'
import { useTransition, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function FavButton({ listingId, initial }: { listingId: string; initial: boolean }) {
  const [isFav, setIsFav] = useState(initial)
  const [pending, start] = useTransition()

  async function toggle() {
    start(async () => {
      if (isFav) {
        await supabase.from('favorites').delete().eq('listing_id', listingId)
        setIsFav(false)
      } else {
        await supabase.from('favorites').insert({ listing_id: listingId })
        setIsFav(true)
      }
    })
  }

  return (
    <button onClick={toggle} disabled={pending} aria-pressed={isFav} title={isFav ? 'Unsave' : 'Save'}
      className={`rounded-full p-2 border ${isFav ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-white/10 border-white/20'}`}>
      {isFav ? '♥' : '♡'}
    </button>
  )
}
