-- Create page_visits table
CREATE TABLE IF NOT EXISTS public.page_visits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    path TEXT NOT NULL,
    visitor_id TEXT, -- formatted likely as localStorage UUID
    user_id UUID REFERENCES auth.users(id), -- optional, if logged in
    visited_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_page_visits_path ON public.page_visits(path);
CREATE INDEX IF NOT EXISTS idx_page_visits_visited_at ON public.page_visits(visited_at);

-- RLS
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

-- Allow public to insert (anonymous tracking)
CREATE POLICY "Allow public insert to page_visits" ON public.page_visits FOR INSERT WITH CHECK (true);

-- Allow public read for now (as per project pattern), or restrict to admin
-- For this setup, we'll allow all to read to ensure the dashboard works without complex auth setup in this dev environment
CREATE POLICY "Allow public read page_visits" ON public.page_visits FOR SELECT USING (true);
