-- Add profile fields and saved listings support
alter table profiles
  add column if not exists display_name text,
  add column if not exists bio text,
  add column if not exists edu_verified boolean default false,
  alter column avatar_url set default null;

-- Add status and saved_count to listings
alter table listings
  add column if not exists status text check(status in ('active','pending','sold','hidden')) default 'active',
  add column if not exists saved_count int default 0,
  -- Keep existing image_url but add images array
  add column if not exists images text[] default array[]::text[];

-- Track saved listings
create table if not exists saved_listings (
  user_id uuid references profiles(id) on delete cascade,
  listing_id uuid references listings(id) on delete cascade,
  created_at timestamptz default now(),
  primary key(user_id, listing_id)
);

-- Enable RLS on saved_listings
alter table saved_listings enable row level security;

-- Update RLS policies

-- Users can see which listings they've saved
create policy "Users can view their saved listings"
  on saved_listings for select
  using (auth.uid() = user_id);

-- Users can save/unsave listings
create policy "Users can save listings"
  on saved_listings for insert
  with check (auth.uid() = user_id);

create policy "Users can unsave listings"
  on saved_listings for delete
  using (auth.uid() = user_id);

-- Function to update saved_count
create or replace function update_saved_count()
returns trigger
language plpgsql
security definer
as $$
begin
  if (TG_OP = 'INSERT') then
    update listings
    set saved_count = saved_count + 1
    where id = NEW.listing_id;
    return NEW;
  elsif (TG_OP = 'DELETE') then
    update listings
    set saved_count = saved_count - 1
    where id = OLD.listing_id;
    return OLD;
  end if;
  return null;
end;
$$;

-- Trigger to maintain saved_count
drop trigger if exists update_listing_saved_count on saved_listings;
create trigger update_listing_saved_count
  after insert or delete
  on saved_listings
  for each row
  execute function update_saved_count();

-- Index for faster saved listing lookups
create index if not exists saved_listings_user_idx on saved_listings(user_id);
create index if not exists saved_listings_listing_idx on saved_listings(listing_id);
