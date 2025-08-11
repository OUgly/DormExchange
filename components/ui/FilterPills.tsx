'use client'

import { useCallback } from 'react'

const categories = ['All', 'Books', 'Furniture', 'Electronics', 'Clothing']

interface FilterPillsProps {
  value: string
  onChange: (value: string) => void
}

export default function FilterPills({ value, onChange }: FilterPillsProps) {
  const handleClick = useCallback(
    (cat: string) => () => onChange(cat),
    [onChange]
  )

  return (
    <div className="-mx-2 flex gap-2 overflow-x-auto px-2">
      {categories.map((cat) => {
        const active = value === cat
        return (
          <button
            key={cat}
            onClick={handleClick(cat)}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${
              active
                ? 'bg-accent/20 border-accent text-white'
                : 'bg-muted border-line text-neutral-300'
            }`}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}
