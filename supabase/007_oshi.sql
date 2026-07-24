alter table public.orders add column if not exists oshi_tracking text;
alter table public.orders add column if not exists oshi_courier text;
alter table public.orders add column if not exists oshi_status text;
alter table public.orders add column if not exists oshi_booked_at timestamptz;
