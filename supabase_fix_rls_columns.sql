-- FIX: Add missing user_id column and secure tables

-- 1. Ensure user_id column exists in generated_projects
-- This links the project to the Supabase Auth User
ALTER TABLE public.generated_projects 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. Backfill user_id for existing rows? 
-- If you have existing projects created by a user email, you might want to link them manually later.
-- For now, we ensure the column exists so the policies don't fail.

-- 3. Apply Strict RLS Policies

-- Enable RLS
ALTER TABLE public.generated_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_messages ENABLE ROW LEVEL SECURITY;

-- Drop loose policies
DROP POLICY IF EXISTS "Public read for dev" ON public.generated_projects;
DROP POLICY IF EXISTS "Users can insert their own projects" ON public.generated_projects;
DROP POLICY IF EXISTS "Users can view their own projects" ON public.generated_projects;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.project_messages;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.project_messages;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.project_messages;

-- Create Strict Policies

-- Projects: View Own
CREATE POLICY "Users view own projects" ON public.generated_projects
FOR SELECT
USING (
  (auth.uid() = user_id) OR 
  (auth.jwt() ->> 'email' = 'admin@example.com') -- Hardcoded Admin bypass for now (replace with your admin email)
);

-- Projects: Create Own (Must enforce user_id matches auth.uid())
CREATE POLICY "Users create own projects" ON public.generated_projects
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
);

-- Projects: Update Own
CREATE POLICY "Users update own projects" ON public.generated_projects
FOR UPDATE
USING (auth.uid() = user_id);


-- Messages: View (If you own the project OR are admin)
CREATE POLICY "View messages" ON public.project_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.generated_projects gp
    WHERE gp.id = project_messages.project_id
    AND (gp.user_id = auth.uid()) 
  )
  OR 
  (auth.jwt() ->> 'email' = 'admin@example.com') -- Admin bypass
);

-- Messages: Send (If you own the project OR are admin)
CREATE POLICY "Send messages" ON public.project_messages
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.generated_projects gp
    WHERE gp.id = project_messages.project_id
    AND (gp.user_id = auth.uid())
  )
  OR 
  (auth.jwt() ->> 'email' = 'admin@example.com') -- Admin bypass
);
