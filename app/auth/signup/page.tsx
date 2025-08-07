'use client'

// Simple sign up page using Supabase auth.
import { useState, FormEvent } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({ email, password })
    if (!error) {
      router.push('/')
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Create Account</Button>
      </form>
    </div>
  )
}
