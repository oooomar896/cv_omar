-- ENHANCED RLS AND SCHEMA FIX

-- 1. Ensure columns exist and have correct types
DO $$ 
BEGIN 
  -- Fix user_id if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='generated_projects' AND column_name='user_id') THEN
    ALTER TABLE public.generated_projects ADD COLUMN user_id UUID REFERENCES auth.users(id);
  END IF;
  
  -- Fix user_email if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='generated_projects' AND column_name='user_email') THEN
    ALTER TABLE public.generated_projects ADD COLUMN user_email TEXT;
  END IF;

  -- Fix project_name if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='generated_projects' AND column_name='project_name') THEN
    ALTER TABLE public.generated_projects ADD COLUMN project_name TEXT;
  END IF;

  -- Fix github_url if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='generated_projects' AND column_name='github_url') THEN
    ALTER TABLE public.generated_projects ADD COLUMN github_url TEXT;
  END IF;
END $$;

-- 2. Update RLS Policies for Generated Projects
-- This version allows access by UID OR Email (safe for Supabase Auth)
ALTER TABLE public.generated_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own projects" ON public.generated_projects;
CREATE POLICY "Users view own projects" ON public.generated_projects 
FOR SELECT USING (
  auth.uid() = user_id 
  OR 
  LOWER(user_email) = LOWER(auth.jwt() ->> 'email')
  OR
  LOWER(user_email) = LOWER(current_setting('request.jwt.claims', true)::json->>'email')
);

DROP POLICY IF EXISTS "Users create own projects" ON public.generated_projects;
CREATE POLICY "Users create own projects" ON public.generated_projects 
FOR INSERT WITH CHECK (true); -- Allow guest submission, we link by email later or UID

DROP POLICY IF EXISTS "Users update own projects" ON public.generated_projects;
CREATE POLICY "Users update own projects" ON public.generated_projects 
FOR UPDATE USING (
  auth.uid() = user_id 
  OR 
  LOWER(user_email) = LOWER(auth.jwt() ->> 'email')
);

-- 3. Leads Table (Lead Generation)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can send leads" ON public.leads;
CREATE POLICY "Anyone can send leads" ON public.leads FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public read leads" ON public.leads;
CREATE POLICY "Public read leads" ON public.leads FOR SELECT USING (true);


-- 4. Invoices and Notifications (Same Logic)
DROP POLICY IF EXISTS "Users view own invoices" ON public.invoices;
CREATE POLICY "Users view own invoices" ON public.invoices 
FOR SELECT USING (LOWER(user_email) = LOWER(auth.jwt() ->> 'email'));

DROP POLICY IF EXISTS "Allow users to see own notifications" ON public.notifications;
CREATE POLICY "Allow users to see own notifications" ON public.notifications 
FOR SELECT USING (LOWER(user_email) = LOWER(auth.jwt() ->> 'email'));
