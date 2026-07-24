-- Track whether the WhatsApp order-confirmation has been sent.
alter table public.orders
  add column if not exists confirmation_sent boolean not null default false;
alter table public.orders
  add column if not exists confirmation_sent_at timestamptz;
