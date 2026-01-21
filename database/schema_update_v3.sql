ALTER TABLE generated_projects ADD COLUMN IF NOT EXISTS specific_answers JSONB DEFAULT '{}'::JSONB;ALTER TABLE generated_projects ADD COLUMN IF NOT EXISTS analysis JSONB DEFAULT '{}'::JSONB;
ALTER TABLE generated_projects ADD COLUMN IF NOT EXISTS user_phone TEXT;
ALTER TABLE generated_projects ADD COLUMN IF NOT EXISTS user_name TEXT;
