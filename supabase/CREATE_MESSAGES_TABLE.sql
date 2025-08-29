-- Create Messages Table Migration
-- Apply this in Supabase Dashboard -> SQL Editor

-- Messages between users about listings
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  from_user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  to_user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body text NOT NULL,
  listing_title text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "participants can select messages" ON public.messages;
DROP POLICY IF EXISTS "sender can insert messages" ON public.messages;
DROP POLICY IF EXISTS "recipient can update read_at" ON public.messages;

-- Allow participants to select their messages
CREATE POLICY "participants can select messages" ON public.messages FOR SELECT
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- Only sender can insert
CREATE POLICY "sender can insert messages" ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = from_user_id);

-- Allow recipient to update read_at
CREATE POLICY "recipient can update read_at" ON public.messages FOR UPDATE
  USING (auth.uid() = to_user_id)
  WITH CHECK (auth.uid() = to_user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_messages_to_user ON public.messages(to_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_listing ON public.messages(listing_id, created_at DESC);

SELECT 'Messages table created successfully!' as status;
