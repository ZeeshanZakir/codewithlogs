-- DRAFT, NOT EXECUTED. Empty disposable Supabase project only.
begin;
create table public.cwl_rls_notes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id),
  body text not null check (char_length(body) between 1 and 1000)
);
create index cwl_rls_notes_owner_idx on public.cwl_rls_notes(owner_id);
alter table public.cwl_rls_notes enable row level security;
revoke all on public.cwl_rls_notes from public, anon, authenticated;
grant select, delete on public.cwl_rls_notes to authenticated;
grant insert (body), update (body) on public.cwl_rls_notes to authenticated;
create policy cwl_notes_read on public.cwl_rls_notes for select to authenticated
  using ((select auth.uid()) = owner_id);
create policy cwl_notes_insert on public.cwl_rls_notes for insert to authenticated
  with check ((select auth.uid()) = owner_id);
create policy cwl_notes_update on public.cwl_rls_notes for update to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);
create policy cwl_notes_delete on public.cwl_rls_notes for delete to authenticated
  using ((select auth.uid()) = owner_id);
commit;
