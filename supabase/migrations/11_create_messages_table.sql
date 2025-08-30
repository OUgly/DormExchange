-- Messages between users about listings
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  from_user_id uuid not null references public.profiles(id) on delete cascade,
  to_user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  listing_title text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

-- Allow participants to select their messages
create policy "participants can select messages" on public.messages for select
  using (auth.uid() = from_user_id or auth.uid() = to_user_id);

-- Only sender can insert
create policy "sender can insert messages" on public.messages for insert
  with check (auth.uid() = from_user_id);

-- Allow recipient to update read_at
create policy "recipient can update read_at" on public.messages for update
  using (auth.uid() = to_user_id)
  with check (auth.uid() = to_user_id);

create index if not exists idx_messages_to_user on public.messages(to_user_id, created_at desc);
create index if not exists idx_messages_listing on public.messages(listing_id, created_at desc);

