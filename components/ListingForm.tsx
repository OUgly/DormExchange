'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ListingForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    price: '',
    category: 'Books',
    condition: 'New',
    campus: '',
    description: '',
    imageUrls: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        price: Number(form.price),
        category: form.category,
        condition: form.condition,
        campus: form.campus,
        description: form.description,
        imageUrls: form.imageUrls.split(',').map((s) => s.trim()).filter(Boolean),
      }),
    })
    setLoading(false)
    if (res.ok) {
      router.push('/')
    }
  }

  const inputClass =
    'w-full rounded-xl border border-line bg-muted px-3 py-2 text-sm text-neutral-300 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/50'

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
        className={inputClass}
      />
      <input
        name="price"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        required
        className={inputClass}
      />
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className={inputClass}
      >
        <option>Books</option>
        <option>Furniture</option>
        <option>Electronics</option>
        <option>Clothing</option>
      </select>
      <select
        name="condition"
        value={form.condition}
        onChange={handleChange}
        className={inputClass}
      >
        <option>New</option>
        <option>Like New</option>
        <option>Good</option>
        <option>Used</option>
      </select>
      <input
        name="campus"
        placeholder="Campus"
        value={form.campus}
        onChange={handleChange}
        className={inputClass}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className={`md:col-span-2 ${inputClass}`}
        rows={4}
      />
      <input
        name="imageUrls"
        placeholder="Image URLs (comma separated)"
        value={form.imageUrls}
        onChange={handleChange}
        className={`md:col-span-2 ${inputClass}`}
      />
      <div className="md:col-span-2 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-accent px-4 py-2 text-white hover:bg-accent/90 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}
