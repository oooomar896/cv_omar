-- Create storage bucket for project assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-assets', 'project-assets', true) 
ON CONFLICT (id) DO NOTHING;

-- Allow public access to read files from this bucket
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'project-assets');

-- Allow authenticated users to upload files to this bucket
CREATE POLICY "Authenticated Upload" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'project-assets' AND auth.role() = 'authenticated');
