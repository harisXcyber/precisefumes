-- ============================================================
-- Migration 005: time-limited offers, admin-managed.
-- ============================================================
create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  -- 'bundle2' or 'pack4' drive cart pricing; null = display-only promo
  offer_key text unique,
  title text not null,
  description text,
  badge text,                       -- short chip label
  active boolean not null default true,
  ends_at timestamptz,              -- null = no expiry
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists offers_active_idx on public.offers (active, sort_order);

drop trigger if exists offers_touch_updated_at on public.offers;
create trigger offers_touch_updated_at
  before update on public.offers
  for each row execute function public.touch_updated_at();

alter table public.offers enable row level security;

-- Storefront reads active, non-expired offers via the anon key.
drop policy if exists "offers are publicly readable" on public.offers;
create policy "offers are publicly readable"
  on public.offers for select
  to anon, authenticated
  using (active = true and (ends_at is null or ends_at > now()));

-- Seed the two live pricing offers with a 7-day window.
insert into public.offers (offer_key, title, description, badge, ends_at, sort_order)
values
  ('bundle2', 'Any 2 for PKR 5,000',
   'Mix any two perfumes and pay just PKR 5,000 — save PKR 1,000.',
   '2 for PKR 5,000', now() + interval '7 days', 1),
  ('pack4', 'Buy 3 Get 1 Free',
   'Four premium perfumes for PKR 9,000 instead of PKR 12,000 — the 4th is free.',
   'Buy 3 Get 1 Free', now() + interval '7 days', 2)
on conflict (offer_key) do nothing;
