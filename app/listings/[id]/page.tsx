// app/listings/[id]/page.tsx
// Dynamic route for a single listing. The folder name is literally [id].
import { supabase } from '@/lib/supabaseClient'
import CommentSection from '@/components/CommentSection'
import { notFound } from 'next/navigation'

interface Props {
  params: { id: string }
}

export default async function ListingPage({ params }: Props) {
  const { data } = await supabase
    .from('listings')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!data) {
    return notFound()
  }

  return (
    <div>
      {data.image_url && (
        <img
          src={data.image_url}
          alt={data.title}
          className="mb-4 h-60 w-full rounded object-cover"
        />
      )}
      <h1 className="mb-2 text-2xl font-bold">{data.title}</h1>
      <p className="mb-2 text-gray-700">${data.price}</p>
      <p>{data.description}</p>
      <CommentSection listingId={params.id} />
    </div>
  )
}
