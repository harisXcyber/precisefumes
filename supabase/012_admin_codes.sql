-- Admin-created promo codes live in the affiliates table so validation
-- and order attribution work unchanged; 'source' tells them apart and
-- 'commission' is the per-sale amount (0 = discount-only code).
alter table public.affiliates add column if not exists source text not null default 'signup';
alter table public.affiliates add column if not exists commission int not null default 300;
