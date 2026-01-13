-- Enable Realtime for page_visits table
-- This allows the dashboard to receive live updates when a new visit occurs
begin;
  -- Remove if already exists to avoid error (optional safety)
  -- alter publication supabase_realtime drop table public.page_visits; 
  
  -- Add table to publication
  alter publication supabase_realtime add table public.page_visits;
commit;
