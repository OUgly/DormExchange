'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { uploadListingImages } from '@/lib/supabase/storage'

export const ListingForm = () => {
  const router = useRouter()
  const CATEGORIES = [
    'Textbooks',
    'Electronics',
    'Furniture',
    'Clothing',
    'School Supplies',
    'Dorm Essentials',
    'Other',
  ]

  const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor']

  const CONDITION_MAP: Record<string, string> = {
    New: 'new',
    'Like New': 'like_new',
    Good: 'good',
    Fair: 'fair',
    Poor: 'poor',
  }

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '' as string | number,
    imageFiles: [] as File[],
    category: '',
    condition: '',
  })
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const previewsRef = useRef<string[]>([])
  const [imageErrors, setImageErrors] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState<{ completed: number; total: number } | null>(
    null,
  )
  const [submitting, setSubmitting] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    // Validate file sizes (max 6MB each)
    const MAX_BYTES = 6 * 1024 * 1024
    const errors: string[] = []
    const validFiles: File[] = []
    files.forEach((f) => {
      if (f.size > MAX_BYTES) {
        errors.push(`${f.name} is too large (${Math.round(f.size / 1024)} KB). Max 6MB.`)
      } else {
        validFiles.push(f)
      }
    })
    if (errors.length) setImageErrors((prev) => [...prev, ...errors])

    // Append new valid files to existing selection, up to 5 total
    const combined = [...form.imageFiles, ...validFiles].slice(0, 5)
    setForm({ ...form, imageFiles: combined })

    // Append new previews (don't revoke existing here)
    const newUrls = files.map((file) => URL.createObjectURL(file))
    setImagePreviews((prev) => {
      const merged = [...prev, ...newUrls].slice(0, 5)
      return merged
    })

    // reset input so same file can be selected again if needed
    try {
      ;(e.target as HTMLInputElement).value = ''
    } catch {}
  }

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index])
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
    setForm((prev) => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((_, i) => i !== index),
    }))
  }

  // keep a ref of previews for cleanup on unmount
  useEffect(() => {
    previewsRef.current = imagePreviews
  }, [imagePreviews])

  useEffect(() => {
    return () => {
      previewsRef.current.forEach((u) => URL.revokeObjectURL(u))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const priceNum = Number(form.price)
    if (!form.title.trim()) return alert('Title is required.')
    if (Number.isNaN(priceNum) || priceNum < 0) return alert('Price must be ≥ 0.')
    if (form.imageFiles.length > 5) return alert('Maximum 5 images allowed.')

    try {
      setSubmitting(true)

      // Get the current campus from client-readable mirror cookie
      const campusMatch = document.cookie.match(/(?:^|; )dx-campus-public=([^;]*)/)
      const campusSlug = campusMatch ? decodeURIComponent(campusMatch[1]) : null
      if (!campusSlug) throw new Error('No campus selected')

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('You must be logged in to create a listing')

      const conditionValue = CONDITION_MAP[form.condition] ?? null

      const { data: inserted, error: insErr } = await supabase
        .from('listings')
        .insert({
          title: form.title.trim(),
          description: form.description?.trim() || '',
          price: priceNum,
          condition: conditionValue,
          category: form.category,
          campus_slug: campusSlug,
          status: 'active',
          user_id: user.id,
        })
        .select('id')
        .single()
      if (insErr || !inserted) throw insErr

      if (form.imageFiles.length) {
        setUploadProgress({ completed: 0, total: form.imageFiles.length })
        const urls = await uploadListingImages(
          supabase,
          inserted.id,
          form.imageFiles,
          (completed, total) => {
            setUploadProgress({ completed, total })
          },
        )
        setUploadProgress(null)
        if (urls.length) {
          const rows = urls.map((url, i) => ({ listing_id: inserted.id, url, sort_order: i }))
          await supabase.from('listing_images').insert(rows)
          await supabase.from('listings').update({ image_url: urls[0] }).eq('id', inserted.id)
        }
      }

      router.push(`/listing/${inserted.id}`)
    } catch (error: any) {
      console.error(error)
      alert(error.message ?? 'Error creating listing')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <textarea
        className="h-28 w-full rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/40 px-4 py-2 focus:border-yellow-400 focus:ring-yellow-400/20 outline-none resize-none"
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <Input
        type="number"
        step="0.01"
        placeholder="Price (USD)"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
        required
      />
      <select
        className="w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-2 focus:border-yellow-400 focus:ring-yellow-400/20 outline-none [&>option]:text-black"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        required
      >
        <option value="">Select Category</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <select
        className="w-full rounded-md bg-white/5 border border-white/10 text-white px-4 py-2 focus:border-yellow-400 focus:ring-yellow-400/20 outline-none [&>option]:text-black"
        value={form.condition}
        onChange={(e) => setForm({ ...form, condition: e.target.value })}
        required
      >
        <option value="">Select Condition</option>
        {CONDITIONS.map((cond) => (
          <option key={cond} value={cond}>
            {cond}
          </option>
        ))}
      </select>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={() => document.getElementById('image-input')?.click()}
            className="bg-white/10 hover:bg-white/20"
          >
            Add Images
          </Button>
          <input
            id="image-input"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <span className="text-sm text-white/60">Up to 5 images</span>
        </div>

        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
            {imagePreviews.map((preview, index) => (
              <div key={preview} className="relative group h-28 overflow-hidden rounded-lg">
                <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white/70 hover:text-white hidden group-hover:block"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        {imageErrors.length > 0 && (
          <div className="space-y-1">
            {imageErrors.map((err, i) => (
              <div key={i} className="text-sm text-red-400">
                {err}
              </div>
            ))}
          </div>
        )}
      </div>

      {uploadProgress ? (
        <div>
          <div className="text-sm mb-2">
            Uploading images: {uploadProgress.completed}/{uploadProgress.total}
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-yellow-400 h-2 rounded-full"
              style={{ width: `${(uploadProgress.completed / uploadProgress.total) * 100}%` }}
            />
          </div>
        </div>
      ) : null}

      <Button type="submit" disabled={submitting}>
        {submitting
          ? uploadProgress
            ? `Uploading ${uploadProgress.completed}/${uploadProgress.total}…`
            : 'Saving…'
          : 'Create Listing'}
      </Button>
    </form>
  )
}

