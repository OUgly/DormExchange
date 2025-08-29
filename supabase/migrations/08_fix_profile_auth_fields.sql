-- Fix profile fields to match auth callback expectations

-- Add missing grade field
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS grade text CHECK (grade IN ('Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'Other'));

-- Rename campus column to campus_id for consistency with auth callback
-- First, drop the foreign key constraint
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_campus_fkey;

-- Rename the column
ALTER TABLE profiles 
RENAME COLUMN campus TO campus_id;

-- Re-add the foreign key constraint
ALTER TABLE profiles 
ADD CONSTRAINT profiles_campus_id_fkey 
FOREIGN KEY (campus_id) REFERENCES campuses(id);

-- Update RLS policies to ensure users can insert/update their own profiles
-- Drop existing policy and recreate with more permissive rules
DROP POLICY IF EXISTS "Users can manage their own profile" ON profiles;

-- Create separate policies for better clarity
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR true); -- Allow viewing all profiles but own profile always visible

-- Ensure profiles can be created during auth flow
-- This policy allows the auth system to create profiles
CREATE POLICY "Allow profile creation during auth"
  ON profiles FOR INSERT
  WITH CHECK (true); -- This is temporary and will be restricted by the application logic

-- Drop the overly broad policy and replace with more specific ones
DROP POLICY IF EXISTS "Allow profile creation during auth" ON profiles;

-- More secure: only allow authenticated users to create their own profiles
CREATE POLICY "Authenticated users can create their profile"
  ON profiles FOR INSERT
  WITH CHECK (
    auth.uid() = id AND 
    auth.uid() IS NOT NULL
  );
