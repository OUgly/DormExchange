-- Add category and condition columns to listings table
ALTER TABLE listings
ADD COLUMN category text,
ADD COLUMN condition text,
ADD COLUMN status text DEFAULT 'active',
ADD COLUMN campus_slug text;
