-- ============================================================
-- PRECISE FUMES — migration 003: private finance ledger
-- Manual sales + expenses records for the owners. Server-only
-- (RLS on, no policies → only the service_role key can touch it).
-- ============================================================

create table if not exists public.finance_sales (
  id uuid primary key default gen_random_uuid(),
  sale_date date not null default current_date,
  item text not null,
  quantity integer not null default 1,
  unit_price integer not null default 0,
  amount integer not null default 0,      -- total received for this sale
  channel text,                            -- website / whatsapp / instagram / in-person / other
  notes text,
  created_by text,                         -- which owner logged it
  created_at timestamptz not null default now()
);
create index if not exists finance_sales_date_idx on public.finance_sales (sale_date desc);

create table if not exists public.finance_expenses (
  id uuid primary key default gen_random_uuid(),
  expense_date date not null default current_date,
  category text not null default 'other',  -- perfume_cost / transportation / delivery / packaging / additional / other
  description text not null,
  amount integer not null default 0,
  notes text,
  created_by text,
  created_at timestamptz not null default now()
);
create index if not exists finance_expenses_date_idx on public.finance_expenses (expense_date desc);

alter table public.finance_sales enable row level security;
alter table public.finance_expenses enable row level security;
