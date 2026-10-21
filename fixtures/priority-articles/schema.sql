-- Run ONLY in an approved disposable Supabase project; never the blog database.
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  body text not null check (char_length(body) between 1 and 2000)
);
alter table public.notes enable row level security;
revoke all on public.notes from anon, authenticated;
grant select, insert on public.notes to authenticated;
create policy "read own notes" on public.notes for select to authenticated
using ((select auth.uid()) = user_id);
create policy "insert own notes" on public.notes for insert to authenticated
with check ((select auth.uid()) = user_id);
