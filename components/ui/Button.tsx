'use client'

// A small wrapper around the native button element so we can reuse
// consistent styles across the app without repeating long class names.
import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export default function Button({
  children,
  className = '',
  variant = 'primary',
  ...props
}: ButtonProps) {
  const base = 'rounded-md px-4 py-2 text-sm font-medium transition-colors'
  const variants =
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'

  return (
    <button className={`${base} ${variants} ${className}`} {...props}>
      {children}
    </button>
  )
}
