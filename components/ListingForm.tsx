'use client'

// Form used for creating a new listing.
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Input from './ui/Input'
import Button from './ui/Button'

export default function ListingForm() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Upload the image to Supabase Storage if provided.
    let imageUrl: string | null = null
    if (imageFile) {
      const { data, error } = await supabase.storage
        .from('listing-images')
        .upload(`public/${Date.now()}-${imageFile.name}`, imageFile)
      if (!error && data) {
        const { data: url } = supabase.storage
          .from('listing-images')
          .getPublicUrl(data.path)
        imageUrl = url.publicUrl
      }
    }

    const user = (await supabase.auth.getUser()).data.user

    // Insert the listing into the database.
    const { error } = await supabase.from('listings').insert({
      title,
      description,
      price: Number(price),
      image_url: imageUrl,
      user_id: user?.id,
    })

    setLoading(false)
    if (!error) {
      router.push('/')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </form>
  )
}
