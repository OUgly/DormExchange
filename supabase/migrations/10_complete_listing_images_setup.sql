-- Complete database setup for listing images and fixes

-- Create listing_images table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.listing_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  url text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_listing_images_listing_sort
  ON public.listing_images(listing_id, sort_order);

-- Enable Row Level Security
ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Listing images are viewable by everyone" ON public.listing_images;
DROP POLICY IF EXISTS "Users can insert images for their listings" ON public.listing_images;
DROP POLICY IF EXISTS "Users can update/delete images for their listings" ON public.listing_images;

-- Policies for listing_images
CREATE POLICY "Listing images are viewable by everyone"
  ON public.listing_images FOR SELECT
  USING (true);

CREATE POLICY "Users can insert images for their listings"
  ON public.listing_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.listings 
      WHERE id = listing_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update/delete images for their listings"
  ON public.listing_images FOR UPDATE, DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.listings 
      WHERE id = listing_id AND user_id = auth.uid()
    )
  );

-- Fix the condition constraint to allow the correct values
ALTER TABLE public.listings DROP CONSTRAINT IF EXISTS listings_condition_check;
ALTER TABLE public.listings ADD CONSTRAINT listings_condition_check 
CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'poor'));
