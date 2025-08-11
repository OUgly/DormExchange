import { redirect } from 'next/navigation'
import { requireAuthAndCampus } from '@/lib/guards'
import { createServerSupabase } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function ProfilePage() {
  const { user, campus } = await requireAuthAndCampus()
  if (!user) redirect('/auth?next=/profile')
  if (!campus) redirect('/campus')

  const supabase = await createServerSupabase()
  const [{ data: profile }, { data: favs }, { data: myListings }] = await Promise.all([
    supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('favorites')
      .select('listing_id, listings(title, price_cents, image_url)')
      .eq('user_id', user.id)
      .returns<any[]>(),
    supabase
      .from('listings')
      .select('id, title, price_cents')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
      <div className="space-y-6">
        <section className="bg-white/5 rounded-2xl p-4">
          <div className="font-semibold">Email</div>
          <div className="opacity-80">{user.email}</div>
        </section>
        <section className="bg-white/5 rounded-2xl p-4">
          <div className="font-semibold">Username</div>
          <div className="opacity-80">{profile?.username}</div>
        </section>
        <section className="bg-white/5 rounded-2xl p-4">
          <div className="font-semibold mb-2">Your Listings</div>
          <ul className="space-y-2">
            {(myListings ?? []).map((l) => (
              <li key={l.id} className="flex items-center justify-between">
                <span>{l.title}</span>
                <span className="opacity-70">${l.price_cents / 100}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="bg-white/5 rounded-2xl p-4">
          <div className="font-semibold mb-2">Saved Items</div>
          <ul className="space-y-2">
            {(favs ?? []).map((f) => (
              <li key={f.listing_id} className="flex items-center justify-between">
                <span>{f.listings?.title}</span>
                <span className="opacity-70">${(f.listings?.price_cents ?? 0) / 100}</span>
              </li>
            ))}
          </ul>
        </section>
        <Link
          href="/messages"
          className="block text-center rounded-xl px-4 py-3 bg-yellow-400 text-black font-semibold"
        >
          Messages
        </Link>
      </div>
    </main>
  )
}
