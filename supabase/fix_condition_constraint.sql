-- Fix the listings condition constraint
-- Drop the problematic constraint
ALTER TABLE public.listings DROP CONSTRAINT IF EXISTS listings_condition_check;

-- Recreate with the correct values that match your ListingForm
ALTER TABLE public.listings ADD CONSTRAINT listings_condition_check 
CHECK (condition IS NULL OR condition IN ('new', 'like_new', 'good', 'fair', 'poor'));

-- Test that it works by trying to insert a valid condition
-- (This should succeed after the constraint fix)
-- You can uncomment this to test:
-- INSERT INTO public.listings (campus_slug, user_id, title, price, condition, status) 
-- VALUES ('test', 'some-uuid', 'Test Listing', 10.00, 'good', 'active');
