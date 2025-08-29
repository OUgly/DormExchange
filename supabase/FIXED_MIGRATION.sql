-- Fixed SQL Migration for DormExchange Listing Images
-- Run this in your Supabase Dashboard -> SQL Editor

-- Step 1: Create listing_images table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.listing_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  url text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Step 2: Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_listing_images_listing_sort
  ON public.listing_images(listing_id, sort_order);

-- Step 3: Enable Row Level Security
ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Listing images are viewable by everyone" ON public.listing_images;
DROP POLICY IF EXISTS "Users can insert images for their listings" ON public.listing_images;
DROP POLICY IF EXISTS "Users can update images for their listings" ON public.listing_images;
DROP POLICY IF EXISTS "Users can delete images for their listings" ON public.listing_images;

-- Step 5: Create policies for listing_images (separate policies for UPDATE and DELETE)
CREATE POLICY "Listing images are viewable by everyone"
  ON public.listing_images FOR SELECT
  USING (true);

CREATE POLICY "Users can insert images for their listings"
  ON public.listing_images FOR INSERT
  WITH CHECK (
    listing_id IN (
      SELECT id FROM public.listings 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update images for their listings"
  ON public.listing_images FOR UPDATE
  USING (
    listing_id IN (
      SELECT id FROM public.listings 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete images for their listings"
  ON public.listing_images FOR DELETE
  USING (
    listing_id IN (
      SELECT id FROM public.listings 
      WHERE user_id = auth.uid()
    )
  );

-- Step 6: Fix the condition constraint to allow the correct values
ALTER TABLE public.listings DROP CONSTRAINT IF EXISTS listings_condition_check;

ALTER TABLE public.listings ADD CONSTRAINT listings_condition_check 
  CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'poor'));

-- Step 7: Verify the table was created successfully
SELECT 'listing_images table and policies created successfully!' as status;
