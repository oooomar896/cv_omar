-- Create domain_pricing table
CREATE TABLE IF NOT EXISTS public.domain_pricing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tld VARCHAR(10) NOT NULL UNIQUE,
    price_per_year DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'SAR',
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.domain_pricing ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access for domain_pricing" 
ON public.domain_pricing FOR SELECT 
TO public 
USING (true);

-- Seed initial data
INSERT INTO public.domain_pricing (tld, price_per_year, currency, is_available)
VALUES 
('.com', 59.00, 'SAR', true),
('.net', 65.00, 'SAR', true),
('.org', 70.00, 'SAR', true),
('.sa', 150.00, 'SAR', true),
('.com.sa', 120.00, 'SAR', true),
('.me', 85.00, 'SAR', true),
('.ai', 299.00, 'SAR', true),
('.io', 250.00, 'SAR', true)
ON CONFLICT (tld) DO NOTHING;
