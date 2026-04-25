-- ============================================================
-- GP Companion — Supabase Database Schema
-- Run this in the Supabase SQL Editor (once only)
-- ============================================================

-- Profiles: extended user info linked to auth.users
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  first_name text not null,
  last_name text not null,
  clinic_name text not null,
  clinic_address text not null,
  position text not null,
  phone_number text not null unique,
  email text not null unique,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Subscriptions: tracks trial + paid plan per user
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan text check (plan in ('trial', 'weekly', 'monthly', 'yearly')) not null default 'trial',
  status text check (status in ('trialing', 'active', 'past_due', 'canceled', 'expired')) not null default 'trialing',
  trial_start timestamptz not null default now(),
  trial_end timestamptz not null default (now() + interval '2 months'),
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-update updated_at timestamps
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function update_updated_at();

create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function update_updated_at();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;

-- Users can only read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Users can only view their own subscription
create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Service role (used by API routes and webhooks) bypasses RLS
-- Admins can view all profiles
create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Admins can view all subscriptions"
  on public.subscriptions for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );
