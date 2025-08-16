'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { uploadListingImages } from '@/lib/supabase/storage';

export const ListingForm = () => {
  const router = useRouter();
  const CATEGORIES = [
    'Textbooks',
    'Electronics',
    'Furniture',
    'Clothing',
    'School Supplies',
    'Dorm Essentials',
    'Other'
  ];

  const CONDITIONS = [
    'New',
    'Like New',
    'Good',
    'Fair',
    'Poor'
  ];

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '' as string | number,
    imageFiles: [] as File[],
    category: '',
    condition: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Number(form.price);
    if (!form.title.trim()) return alert('Title is required.');
    if (Number.isNaN(priceNum) || priceNum < 0) return alert('Price must be ≥ 0.');

    try {
      setSubmitting(true);

      // Get the current campus from cookie
      const campusMatch = document.cookie.match(/(?:^|; )dx-campus=([^;]*)/);
      const campusSlug = campusMatch ? decodeURIComponent(campusMatch[1]) : null;
      if (!campusSlug) throw new Error('No campus selected');

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to create a listing');

      const { data: inserted, error: insErr } = await supabase
        .from('listings')
        .insert({
          title: form.title.trim(),
          description: form.description?.trim() || '',
          price: priceNum,
          category: form.category,
          condition: form.condition,
          campus_slug: campusSlug,
          status: 'active',
          user_id: user.id
        })
        .select('id')
        .single();
      if (insErr || !inserted) throw insErr;

      if (form.imageFiles.length) {
        const urls = await uploadListingImages(supabase, inserted.id, form.imageFiles);
        if (urls.length) {
          const rows = urls.map((url, i) => ({ listing_id: inserted.id, url, sort_order: i }));
          await supabase.from('listing_images').insert(rows);
          await supabase.from('listings').update({ image_url: urls[0] }).eq('id', inserted.id);
        }
      }

      router.push(`/listing/${inserted.id}`);
    } catch (error: any) {
      console.error(error);
      alert(error.message ?? 'Error creating listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <textarea
        className="h-28 w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
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
        className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        required
      >
        <option value="">Select Category</option>
        {CATEGORIES.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <select
        className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
        value={form.condition}
        onChange={(e) => setForm({ ...form, condition: e.target.value })}
        required
      >
        <option value="">Select Condition</option>
        {CONDITIONS.map(cond => (
          <option key={cond} value={cond}>{cond}</option>
        ))}
      </select>

      <Input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setForm({ ...form, imageFiles: Array.from(e.target.files ?? []) })}
      />
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Saving…' : 'Create Listing'}
      </Button>
    </form>
  );
};
