-- DRAFT, NOT EXECUTED. Disposable Supabase project only; not a production migration.
-- Create using a reviewed trusted database owner. Review function owner/grants.
begin;
create table public.cwl_inventory_products (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id),
  name text not null check (char_length(name) between 1 and 200),
  initial_stock integer not null check (initial_stock between 0 and 100000),
  stock integer not null check (stock between 0 and 100000)
);
create table public.cwl_inventory_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.cwl_inventory_products(id),
  owner_id uuid not null references auth.users(id),
  request_id uuid not null,
  delta integer not null check (delta between -10000 and -1),
  balance_after integer not null check (balance_after >= 0),
  created_at timestamptz not null default now(),
  unique (owner_id, request_id)
);
create index cwl_inventory_products_owner_idx on public.cwl_inventory_products(owner_id);
create index cwl_inventory_movements_product_idx on public.cwl_inventory_movements(product_id);
alter table public.cwl_inventory_products enable row level security;
alter table public.cwl_inventory_movements enable row level security;
create policy cwl_products_read on public.cwl_inventory_products for select to authenticated
  using ((select auth.uid()) = owner_id);
create policy cwl_movements_read on public.cwl_inventory_movements for select to authenticated
  using ((select auth.uid()) = owner_id);
revoke all on public.cwl_inventory_products, public.cwl_inventory_movements from public, anon, authenticated;
grant select on public.cwl_inventory_products, public.cwl_inventory_movements to authenticated;

create function public.cwl_record_sale(p_product_id uuid, p_qty integer, p_request_id uuid)
returns table (remaining_after_sale integer, movement_id uuid, replayed boolean)
language plpgsql security definer set search_path = '' as $$
declare
  v_actor uuid := auth.uid();
  v_product public.cwl_inventory_products%rowtype;
  v_previous public.cwl_inventory_movements%rowtype;
  v_remaining integer;
  v_movement uuid;
begin
  if v_actor is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  if p_product_id is null or p_request_id is null or p_qty is null or p_qty < 1 or p_qty > 10000 then
    raise exception 'Invalid sale input' using errcode = '22023';
  end if;
  select p.* into v_product from public.cwl_inventory_products as p
    where p.id = p_product_id and p.owner_id = v_actor for update;
  if not found then raise exception 'Product unavailable' using errcode = '42501'; end if;

  select m.* into v_previous from public.cwl_inventory_movements as m
    where m.owner_id = v_actor and m.request_id = p_request_id;
  if found then
    if v_previous.product_id <> p_product_id or v_previous.delta <> -p_qty then
      raise exception 'Request key reused with different input' using errcode = '22023';
    end if;
    return query select v_previous.balance_after, v_previous.id, true;
    return;
  end if;

  update public.cwl_inventory_products as p set stock = p.stock - p_qty
    where p.id = p_product_id and p.owner_id = v_actor and p.stock >= p_qty
    returning p.stock into v_remaining;
  if not found then raise exception 'Insufficient stock' using errcode = 'P0001'; end if;
  insert into public.cwl_inventory_movements (product_id, owner_id, request_id, delta, balance_after)
    values (p_product_id, v_actor, p_request_id, -p_qty, v_remaining)
    returning id into v_movement;
  return query select v_remaining, v_movement, false;
end;
$$;
revoke all on function public.cwl_record_sale(uuid, integer, uuid) from public, anon, authenticated;
grant execute on function public.cwl_record_sale(uuid, integer, uuid) to authenticated;
commit;
