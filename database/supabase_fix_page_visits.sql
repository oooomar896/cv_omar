-- Fix page_visits table and policies safely

-- 1. Create Table if not exists
CREATE TABLE IF NOT EXISTS public.page_visits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    path TEXT NOT NULL,
    visitor_id TEXT,
    user_id UUID REFERENCES auth.users(id),
    visited_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. Enable RLS
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to avoid "policy already exists" errors
DROP POLICY IF EXISTS "Allow public insert to page_visits" ON public.page_visits;
DROP POLICY IF EXISTS "Allow public read page_visits" ON public.page_visits;

-- 4. Re-create policies
-- Allow anyone (anon) to insert stats
CREATE POLICY "Allow public insert to page_visits" ON public.page_visits FOR INSERT WITH CHECK (true);
-- Allow anyone to read stats (needed for dashboard if not authenticated as strict admin)
CREATE POLICY "Allow public read page_visits" ON public.page_visits FOR SELECT USING (true);

-- 5. Enable Realtime (Idempotent check)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'page_visits') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.page_visits;
  END IF;
END
$$;
