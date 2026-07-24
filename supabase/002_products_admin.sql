-- ============================================================
-- PRECISE FUMES — migration 002
-- Products move from code into the database so the admin panel
-- can create and edit them, with multiple images per product.
-- ============================================================

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text,
  description text not null default '',
  -- 'Him' | 'Her'
  category text not null default 'Him',
  price integer not null default 3000,
  compare_at_price integer,
  -- [{ label, price, stock }]
  sizes jsonb not null default '[{"label":"50ml","price":3000,"stock":999}]'::jsonb,
  -- { top: [], heart: [], base: [] }
  notes jsonb not null default '{"top":[],"heart":[],"base":[]}'::jsonb,
  -- ordered list of image URLs (front, side, box, lifestyle, …)
  images jsonb not null default '[]'::jsonb,
  concentration text,
  longevity text,
  stock integer not null default 999,
  featured boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_slug_idx on public.products (slug);
create index if not exists products_active_idx on public.products (active, sort_order);

-- keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
  before update on public.products
  for each row execute function public.touch_updated_at();

-- Orders gain fulfilment fields the admin panel writes to
alter table public.orders add column if not exists tracking_note text;
alter table public.orders add column if not exists updated_at timestamptz not null default now();

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at
  before update on public.orders
  for each row execute function public.touch_updated_at();

-- Server-only, like everything else
alter table public.products enable row level security;

-- Public read for the storefront via the anon key (products are public
-- data; writes still require service_role).
drop policy if exists "products are publicly readable" on public.products;
create policy "products are publicly readable"
  on public.products for select
  to anon, authenticated
  using (active = true);
