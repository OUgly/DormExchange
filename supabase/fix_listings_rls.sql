-- Clean up existing listings policies and recreate them properly
-- First, drop all existing policies on listings table
DROP POLICY IF EXISTS "Allow everyone to read listings" ON public.listings;
DROP POLICY IF EXISTS "Allow authenticated users to insert listings" ON public.listings;
DROP POLICY IF EXISTS "Allow users to update own listings" ON public.listings;
DROP POLICY IF EXISTS "Allow users to delete own listings" ON public.listings;

-- Drop any other policies that might exist
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.listings;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.listings;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.listings;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.listings;

-- Now recreate clean policies
-- Allow everyone (including anonymous users) to read listings
CREATE POLICY "listings_select_policy" ON public.listings
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert listings (they must be the owner)
CREATE POLICY "listings_insert_policy" ON public.listings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own listings only
CREATE POLICY "listings_update_policy" ON public.listings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own listings only
CREATE POLICY "listings_delete_policy" ON public.listings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
