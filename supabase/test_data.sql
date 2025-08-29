-- Insert sample data for testing (run this after setting up a user account)

-- Note: Replace 'your-user-id-here' with an actual user ID from your auth.users table
-- You can get this from the Supabase dashboard or after creating a user

-- Sample listings
INSERT INTO public.listings (id, user_id, title, description, price, category, condition, campus_slug, status) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'your-user-id-here', 'Calculus Textbook', 'Used calculus textbook in excellent condition. All pages intact, minimal highlighting.', 45.00, 'textbooks', 'good', 'test-campus', 'active'),
  ('550e8400-e29b-41d4-a716-446655440002', 'your-user-id-here', 'Mini Fridge', 'Compact refrigerator perfect for dorm room. Barely used, moving out sale.', 120.00, 'appliances', 'like_new', 'test-campus', 'active'),
  ('550e8400-e29b-41d4-a716-446655440003', 'your-user-id-here', 'Study Lamp', 'Adjustable desk lamp with LED bulb. Great for late night studying.', 25.00, 'furniture', 'good', 'test-campus', 'active');

-- Sample images (you can add these after creating actual image URLs)
-- INSERT INTO public.listing_images (listing_id, url, sort_order) VALUES
--   ('550e8400-e29b-41d4-a716-446655440001', 'https://your-supabase-url.storage.supabase.co/listing-images/textbook1.jpg', 0),
--   ('550e8400-e29b-41d4-a716-446655440002', 'https://your-supabase-url.storage.supabase.co/listing-images/fridge1.jpg', 0),
--   ('550e8400-e29b-41d4-a716-446655440002', 'https://your-supabase-url.storage.supabase.co/listing-images/fridge2.jpg', 1);
