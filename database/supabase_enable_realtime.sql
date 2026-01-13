-- Enable Realtime for relevant tables
-- This allows the frontend to listen for INSERT/UPDATE/DELETE events

-- Add tables to the supabase_realtime publication
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.leads;
alter publication supabase_realtime add table public.generated_projects;

-- Optional: Verify replication identity (usually default is fine)
alter table public.messages replica identity full;
alter table public.leads replica identity full;
