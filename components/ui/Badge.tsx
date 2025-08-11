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
  const base = 'inline-flex items-center rounded-full border px-2.5 py-1 text-xs'
  const variants = {
    default: 'bg-muted border-line text-neutral-300',
    outline: 'bg-transparent border-line text-neutral-300',
    accent: 'bg-accent text-white border-transparent',
  }[variant]

  return (
    <span className={`${base} ${variants} ${className}`} {...props}>
      {children}
    </span>
  )
}
