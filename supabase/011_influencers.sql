create table if not exists public.influencer_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  instagram text not null,
  followers text not null,
  avg_views text not null,
  avg_likes text,
  tier text not null, -- collab | signature | brand
  pitch text,
  status text not null default 'new', -- new | contacted | approved | rejected
  created_at timestamptz not null default now()
);
alter table public.influencer_applications enable row level security;
create index if not exists influencer_apps_status_idx on public.influencer_applications (status);
