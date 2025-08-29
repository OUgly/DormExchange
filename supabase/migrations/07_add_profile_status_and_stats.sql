-- Add member status and stats to profiles
ALTER TABLE profiles
ADD COLUMN member_status text DEFAULT 'member' CHECK (member_status IN ('founder', 'cofounder', 'member')),
ADD COLUMN listings_count int DEFAULT 0,
ADD COLUMN messages_sent int DEFAULT 0,
ADD COLUMN ratings_received int DEFAULT 0,
ADD COLUMN bio text,
ADD COLUMN campus text REFERENCES campuses(id),
ADD COLUMN contact_email text,
ADD COLUMN phone text;

-- Create a function to calculate profile completion
CREATE OR REPLACE FUNCTION calculate_profile_completion(p profiles)
RETURNS int
LANGUAGE plpgsql
AS $$
DECLARE
  total_fields int := 8; -- Total number of optional fields
  filled_fields int := 0;
BEGIN
  -- Count filled fields
  IF p.username IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
  IF p.avatar_url IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
  IF p.bio IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
  IF p.campus IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
  IF p.contact_email IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
  IF p.phone IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
  IF p.listings_count > 0 THEN filled_fields := filled_fields + 1; END IF;
  IF p.messages_sent > 0 THEN filled_fields := filled_fields + 1; END IF;
  
  RETURN (filled_fields::float / total_fields::float * 100)::int;
END;
$$;

-- Create a trigger to update listings_count
CREATE OR REPLACE FUNCTION update_listings_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET listings_count = listings_count + 1
    WHERE id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET listings_count = listings_count - 1
    WHERE id = OLD.user_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_listings_count_trigger
AFTER INSERT OR DELETE ON listings
FOR EACH ROW
EXECUTE FUNCTION update_listings_count();
