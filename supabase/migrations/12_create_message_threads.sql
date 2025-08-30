-- Messaging schema: threads, participants, messages, RLS, helper function

-- 1) Tables
create table if not exists public.message_threads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  listing_id uuid null references public.listings(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.message_thread_participants (
  thread_id uuid not null references public.message_threads(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text check(role in ('buyer','seller','other')) default 'other',
  last_read_at timestamptz,
  primary key (thread_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.message_threads(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  edited_at timestamptz
);

-- 2) Indexes
create index if not exists idx_message_threads_updated on public.message_threads(updated_at desc);
create index if not exists idx_participants_user on public.message_thread_participants(user_id);
create index if not exists idx_messages_thread_created on public.messages(thread_id, created_at desc);

-- 3) RLS
alter table public.message_threads enable row level security;
alter table public.message_thread_participants enable row level security;
alter table public.messages enable row level security;

-- Users can select threads they participate in
create policy if not exists "select_threads_participant"
on public.message_threads for select using (
  exists (
    select 1 from public.message_thread_participants p
    where p.thread_id = message_threads.id and p.user_id = auth.uid()
  )
);

-- Insert threads allowed; participants are added via helper function below
create policy if not exists "insert_threads_any"
on public.message_threads for insert with check (true);

-- Participants policies
create policy if not exists "select_participants_in_thread"
on public.message_thread_participants for select using (
  exists (
    select 1 from public.message_thread_participants p
    where p.thread_id = message_thread_participants.thread_id and p.user_id = auth.uid()
  )
);

-- Allow inserting participants if caller is adding themselves OR function runs as service (security definer function below uses this)
create policy if not exists "insert_participants_self_or_service"
on public.message_thread_participants for insert with check (
  user_id = auth.uid() or auth.role() = 'service_role'
);

-- Messages policies
create policy if not exists "select_messages_participant"
on public.messages for select using (
  exists (
    select 1 from public.message_thread_participants p
    where p.thread_id = messages.thread_id and p.user_id = auth.uid()
  )
);

create policy if not exists "insert_messages_participant"
on public.messages for insert with check (
  exists (
    select 1 from public.message_thread_participants p
    where p.thread_id = messages.thread_id and p.user_id = auth.uid() and auth.uid() = sender_id
  )
);

-- 4) Trigger to bump thread.updated_at when new message arrives
create or replace function public.bump_thread_updated_at()
returns trigger as $$
begin
  update public.message_threads set updated_at = now() where id = new.thread_id;
  return new;
end; $$ language plpgsql;

drop trigger if exists trg_bump_thread_updated_on_message on public.messages;
create trigger trg_bump_thread_updated_on_message
after insert or update on public.messages
for each row execute function public.bump_thread_updated_at();

-- 5) Helper function to get or create a thread between buyer/seller for a listing
-- Ensures only the buyer (caller) can create a thread on their behalf.
create or replace function public.create_or_get_thread(buyer_id uuid, seller_id uuid, in_listing_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_id uuid;
  new_thread_id uuid;
begin
  if auth.uid() is null or auth.uid() <> buyer_id then
    raise exception 'not_authorized';
  end if;

  -- Try find existing thread with both participants and same listing_id (or null)
  select t.id into existing_id
  from public.message_threads t
  join public.message_thread_participants pb on pb.thread_id = t.id and pb.user_id = buyer_id
  join public.message_thread_participants ps on ps.thread_id = t.id and ps.user_id = seller_id
  where ((t.listing_id is null and in_listing_id is null) or t.listing_id = in_listing_id)
  limit 1;

  if existing_id is not null then
    return existing_id;
  end if;

  -- Create thread and both participants
  insert into public.message_threads(listing_id) values (in_listing_id) returning id into new_thread_id;

  insert into public.message_thread_participants(thread_id, user_id, role)
  values (new_thread_id, buyer_id, 'buyer')
  on conflict do nothing;

  insert into public.message_thread_participants(thread_id, user_id, role)
  values (new_thread_id, seller_id, 'seller')
  on conflict do nothing;

  return new_thread_id;
end;
$$;

