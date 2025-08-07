-- SQL schema for DormExchange

-- Profiles table mirrors Supabase auth users
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  username text,
  avatar_url text,
  created_at timestamp default now()
);

-- Listings created by users
create table listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  title text not null,
  description text,
  price numeric not null,
  image_url text,
  created_at timestamp default now()
);

-- Comments for listings
create table comments (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  content text not null,
  created_at timestamp default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table listings enable row level security;
alter table comments enable row level security;

-- Policies
create policy "Profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can manage their own profile"
  on profiles for all
  using ( auth.uid() = id );

create policy "Listings are viewable by everyone"
  on listings for select
  using ( true );

create policy "Users can insert their listings"
  on listings for insert
  with check ( auth.uid() = user_id );

create policy "Users can update or delete their listings"
  on listings for update, delete
  using ( auth.uid() = user_id );

create policy "Comments are viewable by everyone"
  on comments for select
  using ( true );

create policy "Users can insert comments"
  on comments for insert
  with check ( auth.uid() = user_id );

create policy "Users can update or delete own comments"
  on comments for update, delete
  using ( auth.uid() = user_id );
