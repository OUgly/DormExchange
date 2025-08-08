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
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const active = value === cat
        return (
          <button
            key={cat}
            onClick={handleClick(cat)}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              active
                ? 'bg-accent/20 border-accent'
                : 'border-line bg-muted'
            }`}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}
