-- Final Platform Integration Tables

-- 1. Project Messages (Chat)
create table if not exists project_messages (
  id uuid default uuid_generate_v4() primary key,
  project_id bigint references generated_projects(id),
  sender_email text not null,
  sender_role text not null, -- admin, client
  text text not null,
  created_at timestamp with time zone default now()
);

alter table project_messages enable row level security;
create policy "Allow everyone to read messages" on project_messages for select using (true);
create policy "Allow everyone to insert messages" on project_messages for insert with check (true);

-- 2. Notifications Table (Moved from localStorage)
create table if not exists notifications (
  id uuid default uuid_generate_v4() primary key,
  user_email text not null,
  title text not null,
  message text not null,
  type text default 'info', -- info, success, warning, error
  read boolean default false,
  link text,
  created_at timestamp with time zone default now()
);

alter table notifications enable row level security;
create policy "Allow users to see own notifications" on notifications for select using (true);
create policy "Allow inserts for notifications" on notifications for insert with check (true);

-- 3. Invoices Table
create table if not exists invoices (
  id uuid default uuid_generate_v4() primary key,
  project_id bigint references generated_projects(id),
  user_email text not null,
  amount numeric not null,
  currency text default 'SAR',
  status text default 'unpaid', -- unpaid, paid, cancelled
  due_date timestamp with time zone,
  paid_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

alter table invoices enable row level security;
create policy "Users view own invoices" on invoices for select using (true);
create policy "Admin manage invoices" on invoices for all using (true);

-- 4. Projects table (Main Portfolio - ensuring consistency)
-- This table already exists in database_schema.sql but we might need triggers
-- to update it when a generated_project reaches 'launch' stage.

-- Trigger function to update project status
create or replace function update_generated_project_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_gen_proj_time
before update on generated_projects
for each row execute function update_generated_project_timestamp();
