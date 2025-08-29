-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all profiles (needed for listing authors, etc.)
CREATE POLICY "Allow authenticated users to read profiles" ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to insert their own profile during sign-up
CREATE POLICY "Allow users to insert own profile" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Allow users to update own profile" ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to delete their own profile (optional)
CREATE POLICY "Allow users to delete own profile" ON profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- For listings table (if RLS is enabled)
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read listings
CREATE POLICY "Allow everyone to read listings" ON listings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow authenticated users to insert listings
CREATE POLICY "Allow authenticated users to insert listings" ON listings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own listings
CREATE POLICY "Allow users to update own listings" ON listings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own listings
CREATE POLICY "Allow users to delete own listings" ON listings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Messages table policies will be added when the messages feature is implemented
-- (Currently the messages table doesn't exist in the database)
