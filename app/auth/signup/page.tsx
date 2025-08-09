'use client';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const REQUIRE_EDU = process.env.NEXT_PUBLIC_REQUIRE_EDU === 'true';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (REQUIRE_EDU && !email.trim().toLowerCase().endsWith('.edu')) {
      setErr('Please use your .edu email to sign up.');
      return;
    }
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      router.push('/');
    } catch (e: any) {
      setErr(e.message ?? 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm rounded-xl bg-white p-6 shadow-sm">
      <h1 className="mb-1 text-2xl font-semibold">Create account</h1>
      <p className="mb-4 text-sm text-gray-600">Join your campus marketplace.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <Input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <Button type="submit" disabled={loading}>{loading ? 'Creating…' : 'Sign up'}</Button>
      </form>
    </div>
  );
}
