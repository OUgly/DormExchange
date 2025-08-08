import { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'accent'
}

export default function Badge({
  children,
  variant = 'default',
  className = '',
  ...props
}: BadgeProps) {
  const base = 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium'
  const variants = {
    default: 'bg-muted border border-line text-white',
    outline: 'border border-line text-white',
    accent: 'bg-accent text-white',
  }[variant]

  return (
    <span className={`${base} ${variants} ${className}`} {...props}>
      {children}
    </span>
  )
}
