-- Create listing_images table (simplified version)
CREATE TABLE IF NOT EXISTS public.listing_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Create index (without display_order since it doesn't exist)
CREATE INDEX IF NOT EXISTS idx_listing_images_listing_id ON public.listing_images(listing_id);

-- Enable RLS
ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;

-- Create policy for RLS
CREATE POLICY "Anyone can view listing images" ON public.listing_images
    FOR SELECT USING (true);

CREATE POLICY "Users can insert images for their own listings" ON public.listing_images
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.listings 
            WHERE id = listing_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update images for their own listings" ON public.listing_images
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.listings 
            WHERE id = listing_id AND user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.listings 
            WHERE id = listing_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete images for their own listings" ON public.listing_images
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.listings 
            WHERE id = listing_id AND user_id = auth.uid()
        )
    );
