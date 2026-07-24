-- ============================================================
-- Migration 006: email OTP codes (verify email before order).
-- ============================================================
create table if not exists public.otp_codes (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  code text not null,                 -- 6-digit
  purpose text not null default 'checkout',
  expires_at timestamptz not null,
  consumed boolean not null default false,
  attempts integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists otp_email_idx on public.otp_codes (email, purpose, created_at desc);
alter table public.otp_codes enable row level security;  -- server-only
