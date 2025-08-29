# Database Setup Reminder

To complete the messaging functionality, you need to run these SQL scripts in your Supabase SQL Editor:

## 1. First, create the messages table:
```sql
-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
    from_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    to_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    listing_title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_messages_listing_id ON public.messages(listing_id);
CREATE INDEX IF NOT EXISTS idx_messages_from_user_id ON public.messages(from_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_to_user_id ON public.messages(to_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can view messages they sent or received" ON public.messages
    FOR SELECT USING (
        auth.uid() = from_user_id OR 
        auth.uid() = to_user_id
    );

CREATE POLICY "Users can insert their own messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = from_user_id);
```

## 2. Then create the listing_images table (if not already done):
```sql
-- Create listing_images table
CREATE TABLE IF NOT EXISTS public.listing_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_listing_images_listing_id ON public.listing_images(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_images_display_order ON public.listing_images(listing_id, display_order);

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
```

## How to Apply:
1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the first SQL block, then click "Run"
4. Copy and paste the second SQL block, then click "Run"
5. Your messaging and image functionality should now work!

## What This Fixes:
- ✅ "Message Seller" button will work properly
- ✅ Messages will be stored in the database
- ✅ Users can view their conversations in `/messages`
- ✅ Listing images will display properly on detail pages
- ✅ Image carousels will work on market and detail pages
- ✅ "My Listings" will show user's listings with images
