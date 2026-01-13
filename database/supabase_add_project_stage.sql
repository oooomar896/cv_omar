-- Add project_stage column to generated_projects
ALTER TABLE public.generated_projects 
ADD COLUMN IF NOT EXISTS project_stage TEXT DEFAULT 'analysis';

-- Update existing records to have a default stage
UPDATE public.generated_projects 
SET project_stage = 'analysis' 
WHERE project_stage IS NULL;
