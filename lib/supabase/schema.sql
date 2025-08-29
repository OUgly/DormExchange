create table if not exists public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
-- Helpful index
create index if not exists idx_listing_images_listing_sort
  on public.listing_images(listing_id, sort_order);
