'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

const CATEGORIES = ['Textbooks','Electronics','Clothing','Furniture','Other']
const CONDITIONS = [
  { label: 'New', value: 'new' },
  { label: 'Like New', value: 'like_new' },
  { label: 'Good', value: 'good' },
  { label: 'Fair', value: 'fair' },
  { label: 'Poor', value: 'poor' },
  { label: 'Used', value: 'used' }
]

export default function MarketFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const [q, setQ] = useState(params.get('q') ?? '')
  const [category, setCategory] = useState(params.get('category') ?? '')
  const [condition, setCondition] = useState(params.get('condition') ?? '')
  const [min, setMin] = useState(params.get('min') ?? '')
  const [max, setMax] = useState(params.get('max') ?? '')

  const dq = useDebounced(q, 300)

  const makeUrl = useMemo(() => {
    return (next: Partial<Record<string,string>>) => {
      const p = new URLSearchParams(params.toString())
      Object.entries(next).forEach(([k, v]) => {
        if (!v) p.delete(k)
        else p.set(k, v)
      })
      // reset page param if you add pagination later
      return `${pathname}?${p.toString()}`
    }
  }, [params, pathname])

  useEffect(() => {
    router.replace(makeUrl({ q: dq }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dq])

  function apply() {
    router.replace(makeUrl({ category, condition, min, max }))
  }

  function clearAll() {
    setQ(''); setCategory(''); setCondition(''); setMin(''); setMax('')
    router.replace(pathname)
  }

  return (
    <section className="rounded-2xl bg-white/5 p-4 flex flex-col lg:flex-row gap-3 items-stretch">
      <input
        type="search"
        placeholder="Search listings..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="flex-1 rounded-xl bg-black/20 px-3 py-2 outline-none"
      />

      <select value={category} onChange={(e)=>setCategory(e.target.value)} className="rounded-xl bg-black/20 px-3 py-2">
        <option value="">All categories</option>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <select value={condition} onChange={(e)=>setCondition(e.target.value)} className="rounded-xl bg-black/20 px-3 py-2">
        <option value="">Any condition</option>
        {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
      </select>

      <input inputMode="numeric" placeholder="Min $" value={min} onChange={(e)=>setMin(e.target.value)} className="w-28 rounded-xl bg-black/20 px-3 py-2" />
      <input inputMode="numeric" placeholder="Max $" value={max} onChange={(e)=>setMax(e.target.value)} className="w-28 rounded-xl bg-black/20 px-3 py-2" />

      <div className="flex gap-2">
        <button onClick={apply} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20">Apply</button>
        <button onClick={clearAll} className="px-4 py-2 rounded-xl bg-white/0 hover:bg-white/10">Clear</button>
      </div>
    </section>
  )
}

