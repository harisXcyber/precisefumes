alter table public.orders add column if not exists is_test boolean not null default false;
create index if not exists orders_is_test_idx on public.orders (is_test);
