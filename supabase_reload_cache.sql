-- Force Supabase to reload the schema cache
-- Run this if you see "Could not find the table" errors after creating a table.

NOTIFY pgrst, 'reload schema';

-- Optional: Verify table exists by just selecting from it (will return error or empty result in SQL editor if missing)
SELECT count(*) FROM public.project_messages;
