'use client'

// Reusable input component with minimal styling.
import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/40 px-4 py-2 focus:border-yellow-400 focus:ring-yellow-400/20 outline-none ${className}`}
      {...props}
    />
  )
}
