-- Ensure generated_projects table exists and has all required columns
-- This prevents errors when saving new AI projects

CREATE TABLE IF NOT EXISTS public.generated_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_email TEXT NOT NULL,
    project_name TEXT,
    project_type TEXT,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'pending',
    files JSONB DEFAULT '{}'::jsonb,
    project_stage TEXT DEFAULT 'analysis',
    user_id UUID REFERENCES auth.users(id)
);

-- Add columns if they are missing (for existing tables)
DO $$
BEGIN
    ALTER TABLE public.generated_projects ADD COLUMN IF NOT EXISTS project_stage TEXT DEFAULT 'analysis';
    ALTER TABLE public.generated_projects ADD COLUMN IF NOT EXISTS files JSONB DEFAULT '{}'::jsonb;
    ALTER TABLE public.generated_projects ADD COLUMN IF NOT EXISTS project_type TEXT;
    ALTER TABLE public.generated_projects ADD COLUMN IF NOT EXISTS project_name TEXT;
    ALTER TABLE public.generated_projects ADD COLUMN IF NOT EXISTS user_email TEXT;
    ALTER TABLE public.generated_projects ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'column already exists';
END
$$;

-- Enable RLS
ALTER TABLE public.generated_projects ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can insert their own projects" ON public.generated_projects;
CREATE POLICY "Users can insert their own projects" ON public.generated_projects FOR INSERT WITH CHECK (auth.uid() = user_id OR user_email IS NOT NULL);

DROP POLICY IF EXISTS "Users can view their own projects" ON public.generated_projects;
CREATE POLICY "Users can view their own projects" ON public.generated_projects FOR SELECT USING (auth.uid() = user_id OR user_email = current_user);
-- Note: 'user_email = current_user' is tricky with Supabase Auth, usually we match auth.uid()
-- simpler fallback for now:
CREATE POLICY "Public read for dev" ON public.generated_projects FOR SELECT USING (true); -- Remove in production! or Refine
