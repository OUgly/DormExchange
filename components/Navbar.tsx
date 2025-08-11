import Link from 'next/link'
import { cookies } from 'next/headers'
import { signOutAction } from '@/app/(auth)/logout/actions'

export default async function Navbar() {
  const jar = await cookies()
  const campus = jar.get('dx-campus')?.value

  return (
    <nav className="sticky top-0 z-50 bg-bg/80 backdrop-blur border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">DormExchange</Link>
        <div className="flex items-center gap-2">
          {campus && (
            <span className="text-xs px-2 py-1 rounded-full bg-white/10">
              {campus}
            </span>
          )}
          <Link href="/market" className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10">Market</Link>
          <Link href="/profile" className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10">Profile</Link>
          <Link href="/campus" className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10">Change campus</Link>
          <form action={signOutAction}>
            <button type="submit" className="px-3 py-1 rounded-xl bg-yellow-400 text-black hover:brightness-95">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </nav>
  )
}
