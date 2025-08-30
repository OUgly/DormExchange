-- Minimal SQL Migration - Run this if the other file has issues
-- Execute each section one at a time in Supabase SQL Editor

-- 1. Create the table
CREATE TABLE IF NOT EXISTS public.listing_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  url text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Create the index
CREATE INDEX IF NOT EXISTS idx_listing_images_listing_sort
  ON public.listing_images(listing_id, sort_order);

-- 3. Enable RLS
ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;

-- 4. Create basic policies (run these one by one)
CREATE POLICY "listing_images_select_policy" ON public.listing_images FOR SELECT USING (true);

CREATE POLICY "listing_images_insert_policy" ON public.listing_images FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "listing_images_update_policy" ON public.listing_images FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "listing_images_delete_policy" ON public.listing_images FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- 5. Fix listings constraint
ALTER TABLE public.listings DROP CONSTRAINT IF EXISTS listings_condition_check;
ALTER TABLE public.listings ADD CONSTRAINT listings_condition_check 
CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'poor'));
