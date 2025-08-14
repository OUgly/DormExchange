-- Storage policies for listing images
CREATE POLICY "Authenticated users can upload listing images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'listing-images');

CREATE POLICY "Listing images are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'listing-images');

CREATE POLICY "Users can update their own listing images"
ON storage.objects FOR UPDATE, DELETE
TO authenticated
USING (bucket_id = 'listing-images' AND auth.uid() = owner);
