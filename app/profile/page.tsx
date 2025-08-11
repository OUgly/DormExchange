import { redirect } from 'next/navigation'
import { requireAuthAndCampus } from '@/lib/guards'
import { createServerSupabase } from '@/lib/supabase/server'

export default async function ProfilePage() {
  const { user, campus } = await requireAuthAndCampus()
  if (!user) redirect('/auth?next=/profile')
  if (!campus) redirect('/campus')

  const supabase = await createServerSupabase()
  const [{ data: profile }, { data: favs }, { data: myListings }] = await Promise.all([
    supabase.from('profiles').select('username').eq('id', user.id).maybeSingle(),
    supabase
      .from('favorites')
      .select('listing_id, listings(title, price_cents, image_url)')
      .eq('user_id', user.id)
      .returns<any[]>(),
    supabase
      .from('listings')
      .select('id, title, price_cents')
      .eq('user_id', user.id)
      .returns<any[]>(),
  ])

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <a
          href="/messages"
          className="rounded-xl bg-white/10 px-4 py-2 font-medium"
        >
          Messages
        </a>
      </div>
      <div className="space-y-6">
        <section className="rounded-2xl bg-white/5 p-4 space-y-2">
          <div>
            <div className="font-semibold">Email</div>
            <div className="opacity-80">{user.email}</div>
          </div>
          <div>
            <div className="font-semibold">Username</div>
            <div className="opacity-80">{profile?.username}</div>
          </div>
        </section>
        <section className="rounded-2xl bg-white/5 p-4">
          <div className="mb-2 font-semibold">Your Listings</div>
          <ul className="space-y-2">
            {(myListings ?? []).map((l) => (
              <li key={l.id} className="flex items-center justify-between">
                <span>{l.title}</span>
                <span className="opacity-70">${(l.price_cents ?? 0) / 100}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl bg-white/5 p-4">
          <div className="mb-2 font-semibold">Saved Items</div>
          <ul className="space-y-2">
            {(favs ?? []).map((f) => (
              <li key={f.listing_id} className="flex items-center justify-between">
                <span>{f.listings?.title}</span>
                <span className="opacity-70">${(f.listings?.price_cents ?? 0) / 100}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
