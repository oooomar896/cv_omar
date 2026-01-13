-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Page Visits Table
create table if not exists page_visits (
  id uuid default uuid_generate_v4() primary key,
  path text not null,
  visitor_id text,
  user_id uuid references auth.users(id),
  metadata jsonb,
  visited_at timestamp with time zone default now()
);

-- RLS for page_visits (Allow insert for everyone, select for admins only usually)
alter table page_visits enable row level security;
drop policy if exists "Allow anonymous insert" on page_visits;
create policy "Allow anonymous insert" on page_visits for insert with check (true);
drop policy if exists "Allow admin select" on page_visits;
create policy "Allow admin select" on page_visits for select using (true);

-- 2. Domains Table
create table if not exists domains (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  domain_name text not null,
  extension text not null,
  status text default 'pending', -- pending, active, expired
  expiry_date timestamp with time zone,
  auto_renew boolean default false,
  created_at timestamp with time zone default now()
);

alter table domains enable row level security;
drop policy if exists "Users can view own domains" on domains;
create policy "Users can view own domains" on domains for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own domains" on domains;
create policy "Users can insert own domains" on domains for insert with check (auth.uid() = user_id);
drop policy if exists "Admins can view all domains" on domains;
create policy "Admins can view all domains" on domains for select using (true);
drop policy if exists "Admins can update domains" on domains;
create policy "Admins can update domains" on domains for update using (true);

-- 3. Domain Transactions (Wallet)
create table if not exists domain_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  transaction_type text not null, -- purchase, refund, deposit
  amount numeric not null,
  currency text default 'SAR',
  payment_status text default 'pending', -- pending, completed, failed
  years_purchased integer,
  notes text,
  created_at timestamp with time zone default now()
);

alter table domain_transactions enable row level security;
drop policy if exists "Users can view own transactions" on domain_transactions;
create policy "Users can view own transactions" on domain_transactions for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own transactions" on domain_transactions;
create policy "Users can insert own transactions" on domain_transactions for insert with check (auth.uid() = user_id);
drop policy if exists "Admins can view all transactions" on domain_transactions;
create policy "Admins can view all transactions" on domain_transactions for select using (true);

-- 4. Admins Table (Optional if using Metadata, but good for management)
create table if not exists admins (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  role text default 'admin',
  created_at timestamp with time zone default now()
);

-- Insert initial admin (Safe insert)
insert into admins (email, role)
values ('oooomar896@gmail.com', 'super_admin')
on conflict (email) do nothing;

alter table admins enable row level security;
drop policy if exists "Read admins" on admins;
create policy "Read admins" on admins for select using (true);
