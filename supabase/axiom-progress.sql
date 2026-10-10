-- AXIOM: run this once in Supabase SQL Editor.
-- Users are authenticated by Supabase Auth; only their own progress is readable.
create table if not exists public.axiom_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  device_id uuid not null,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id,device_id),
  constraint axiom_payload_object check (jsonb_typeof(payload)='object'),
  constraint axiom_payload_size check (octet_length(payload::text)<=524288)
);
alter table public.axiom_progress enable row level security;
revoke all on public.axiom_progress from anon;
grant select,insert,update on public.axiom_progress to authenticated;
drop policy if exists "read own progress" on public.axiom_progress;
create policy "read own progress" on public.axiom_progress
for select to authenticated using ((select auth.uid())=user_id);
drop policy if exists "create own progress" on public.axiom_progress;
create policy "create own progress" on public.axiom_progress
for insert to authenticated with check ((select auth.uid())=user_id);
drop policy if exists "update own progress" on public.axiom_progress;
create policy "update own progress" on public.axiom_progress
for update to authenticated
using ((select auth.uid())=user_id)
with check ((select auth.uid())=user_id);
-- Important: never publish a service_role or secret Supabase key to browsers.
