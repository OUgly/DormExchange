'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export const ListingForm = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '' as string | number,
    imageFile: null as File | null,
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
        const fileName = crypto.randomUUID();
        const { data: up, error: upErr } = await supabase
          .storage
          .from('listing-images')
          .upload(fileName, form.imageFile, { cacheControl: '3600', upsert: false });
        if (upErr) throw upErr;

        const { data: pub } = supabase.storage.from('listing-images').getPublicUrl(up!.path);
        imageUrl = pub.publicUrl;
      }

      const { error: insErr } = await supabase.from('listings').insert({
        title: form.title.trim(),
        description: form.description?.trim() || '',
        price: priceNum,
        image_url: imageUrl,
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
