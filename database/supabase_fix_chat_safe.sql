-- SAFE Chat Fix Script
-- This script safely sets up the chat table, policies, and realtime, skipping steps that are already done.

-- 1. Create table if not exists
CREATE TABLE IF NOT EXISTS public.project_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.generated_projects(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Index
CREATE INDEX IF NOT EXISTS idx_project_messages_project_id ON public.project_messages(project_id);

-- 3. Enable RLS
ALTER TABLE public.project_messages ENABLE ROW LEVEL SECURITY;

-- 4. Re-create Policies (Drop first to avoid conflicts)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.project_messages;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.project_messages;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.project_messages;

CREATE POLICY "Enable read access for all users" ON public.project_messages FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.project_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.project_messages FOR UPDATE USING (true);

-- 5. Enable Realtime Safely (Check before adding)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_publication_rel pr
        JOIN pg_class c ON pr.prrelid = c.oid
        JOIN pg_publication p ON pr.prpubid = p.oid
        WHERE p.pubname = 'supabase_realtime' AND c.relname = 'project_messages'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.project_messages;
    END IF;
END
$$;
