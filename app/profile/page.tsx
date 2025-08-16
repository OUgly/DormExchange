import Link from 'next/link'
import { redirect } from 'next/navigation'
import { requireAuthAndCampus } from '@/lib/guards'
import { getSupabaseServer } from '@/lib/supabase/server'
import { deleteListingImages } from '@/lib/supabase/storage'

async function deleteListing(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const supabase = await getSupabaseServer()
  await deleteListingImages(supabase, id)
  await supabase.from('listings').delete().eq('id', id)
  redirect('/profile')
}

export default async function ProfilePage() {
  const { user, campus, supabase } = await requireAuthAndCampus()
  if (!user) redirect('/auth/signin')
  if (!campus) redirect('/campus')

  const { data: myListings } = await supabase
    .from('listings')
    .select('id,title,price,image_url,status,created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">My Listings</h1>
        {!myListings?.length ? (
          <div className="rounded-2xl bg-white/5 p-6 text-center">
            <p className="mb-2">You have no listings.</p>
            <Link href="/listing/new" className="rounded-xl bg-accent px-4 py-2 text-white">
              Create a listing
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {myListings.map((l) => (
              <li key={l.id} className="flex items-center gap-4 rounded-2xl bg-white/5 p-3">
                <Link href={`/listing/${l.id}`} className="flex-shrink-0">
                  <img
                    src={l.image_url ?? '/placeholder.jpg'}
                    alt={l.title}
                    className="h-20 w-20 rounded object-cover"
                  />
                </Link>
                <div className="flex-1">
                  <Link href={`/listing/${l.id}`} className="font-medium hover:underline">
                    {l.title}
                  </Link>
                  <div className="text-sm opacity-80">
                    ${Number(l.price).toFixed(0)} · {l.status ?? '—'} · {new Date(l.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/listing/${l.id}/edit`} className="text-sm hover:underline">
                    Edit
                  </Link>
                  <form action={deleteListing}>
                    <input type="hidden" name="id" value={l.id} />
                    <button type="submit" className="text-sm text-red-400 hover:underline">
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
