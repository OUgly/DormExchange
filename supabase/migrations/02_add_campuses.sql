-- Add campus support
create table campuses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  hero_image_url text,
  allowed_domains text[] not null default array[]::text[],
  created_at timestamp default now()
);

-- Add campus_id to profiles
alter table profiles 
  add column campus_id uuid references campuses(id) on delete set null,
  add column grade text;

-- Campus policies
create policy "Campuses are viewable by everyone"
  on campuses for select
  using ( true );

-- Index for domain lookup
create index campuses_allowed_domains_idx on campuses using gin (allowed_domains);
