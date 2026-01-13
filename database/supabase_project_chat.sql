-- Create project_messages table for live chat
CREATE TABLE IF NOT EXISTS public.project_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id BIGINT REFERENCES public.generated_projects(id) ON DELETE CASCADE,
    sender_type TEXT CHECK (sender_type IN ('admin', 'user')) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_read BOOLEAN DEFAULT false
);

-- Index
CREATE INDEX IF NOT EXISTS idx_project_messages_project_id ON public.project_messages(project_id);

-- RLS
ALTER TABLE public.project_messages ENABLE ROW LEVEL SECURITY;

-- Policies
-- Allow public access for now (simulating auth for demo purposes as before)
-- In production, strict user/admin checks apply
CREATE POLICY "Allow public all on project_messages" ON public.project_messages FOR ALL USING (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_messages;
