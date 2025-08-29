-- Check what constraints exist on the listings table
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.listings'::regclass
AND contype = 'c'; -- Check constraints only

-- Also show the table structure to see what columns exist
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'listings' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Fix the condition constraint to allow the correct values
-- First drop the existing constraint
ALTER TABLE public.listings DROP CONSTRAINT IF EXISTS listings_condition_check;

-- Recreate with correct values that match your form
ALTER TABLE public.listings ADD CONSTRAINT listings_condition_check 
CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'poor'));
