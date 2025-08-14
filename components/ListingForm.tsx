'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

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
    imageFile: null as File | null,
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
      let imageUrl: string | null = null;

      if (form.imageFile) {
        const fileName = `${crypto.randomUUID()}-${form.imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const { data: up, error: upErr } = await supabase
          .storage
          .from('listing-images')
          .upload(fileName, form.imageFile, { 
            cacheControl: '3600',
            upsert: false
          });
          
        if (upErr) {
          console.error('Image upload error:', upErr);
          throw new Error('Failed to upload image. Please try again.');
        }

        if (!up?.path) {
          throw new Error('Failed to get upload path');
        }

        const { data: pub } = supabase.storage.from('listing-images').getPublicUrl(up.path);
        if (!pub?.publicUrl) {
          throw new Error('Failed to get public URL');
        }
        
        imageUrl = pub.publicUrl;
      }

      // Get the current campus from cookie
      const campusMatch = document.cookie.match(/(?:^|; )dx-campus=([^;]*)/);
      const campusSlug = campusMatch ? decodeURIComponent(campusMatch[1]) : null;
      
      if (!campusSlug) {
        throw new Error('No campus selected');
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to create a listing');
      }

      const { error: insErr } = await supabase.from('listings').insert({
        title: form.title.trim(),
        description: form.description?.trim() || '',
        price: priceNum,
        image_url: imageUrl,
        category: form.category,
        condition: form.condition,
        campus_slug: campusSlug,
        status: 'active',
        user_id: user.id
      });
      if (insErr) throw insErr;

      alert('Listing created!');
      router.push('/');
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
        accept="image/*"
        onChange={(e) => setForm({ ...form, imageFile: e.target.files?.[0] || null })}
      />
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Saving…' : 'Create Listing'}
      </Button>
    </form>
  );
};
