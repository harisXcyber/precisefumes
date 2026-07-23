-- ============================================================
-- PRECISE FUMES — database schema
-- Run this once in Supabase: SQL Editor → New query → paste → Run
-- All tables are locked down by RLS with no policies: only the
-- server (service_role key) can read/write them.
-- ============================================================

-- Customer orders (items snapshotted as JSON at purchase time)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  ref text unique not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  address text not null,
  city text not null,
  shipping_zone text not null default 'nationwide',
  shipping_fee integer not null default 0,
  payment_method text not null default 'cod',
  payment_status text not null default 'pending',
  items jsonb not null,
  subtotal integer not null,
  discount integer not null default 0,
  promo_type text,
  affiliate_code text,
  affiliate_commission integer not null default 0,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_affiliate_code_idx on public.orders (affiliate_code);

-- Affiliate accounts
create table if not exists public.affiliates (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  password_hash text not null,
  bank_method text not null,
  bank_phone text not null,
  bank_account_name text not null,
  referral_code text unique not null,
  verification_token text unique,
  status text not null default 'pending_verification',
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists affiliates_referral_code_idx on public.affiliates (referral_code);

-- One row per order placed with an affiliate code
create table if not exists public.affiliate_orders (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates(id) on delete cascade,
  order_id uuid not null references public.orders(id) on delete cascade,
  order_ref text not null,
  commission integer not null default 300,
  status text not null default 'pending', -- pending → paid
  created_at timestamptz not null default now()
);

create index if not exists affiliate_orders_affiliate_idx on public.affiliate_orders (affiliate_id);

-- Contact form messages
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- Newsletter list
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

-- Lock everything down: server-only access via service_role
alter table public.orders enable row level security;
alter table public.affiliates enable row level security;
alter table public.affiliate_orders enable row level security;
alter table public.contact_messages enable row level security;
alter table public.newsletter_subscribers enable row level security;
