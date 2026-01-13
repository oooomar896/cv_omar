-- 1. Create project_messages table if not exists
CREATE TABLE IF NOT EXISTS public.project_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.generated_projects(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL, -- 'user' or 'admin'
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Index for performance
CREATE INDEX IF NOT EXISTS idx_project_messages_project_id ON public.project_messages(project_id);

-- 3. Enable RLS
ALTER TABLE public.project_messages ENABLE ROW LEVEL SECURITY;

-- 4. Policies
-- Drop existing to avoid conflicts
DROP POLICY IF EXISTS "Enable read access for all users" ON public.project_messages;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.project_messages;

-- Broad policy for development/beta: Allow anyone with the project_id to read/write messages
-- This ensures that both the Client and the Admin can chat without complex JOIN policies on the user ID for now.
CREATE POLICY "Enable read access for all users" ON public.project_messages FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.project_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.project_messages FOR UPDATE USING (true);

-- 5. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_messages;
