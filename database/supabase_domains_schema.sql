-- ============================================
-- Domain Management System Schema
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. Websites Table (إذا لم يكن موجوداً)
-- ============================================
CREATE TABLE IF NOT EXISTS websites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50), -- 'landing', 'booking', 'ecommerce', etc.
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'active', 'inactive'
  subdomain VARCHAR(255) UNIQUE,
  custom_domain VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. Domains Table
-- ============================================
CREATE TABLE domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  domain_name VARCHAR(255) NOT NULL,
  extension VARCHAR(10) NOT NULL, -- '.com', '.net', '.org', '.sa', etc.
  full_domain VARCHAR(255) UNIQUE NOT NULL, -- domain_name + extension
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'expired', 'pending', 'suspended'
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  auto_renew BOOLEAN DEFAULT false,
  
  -- Provider Information
  provider VARCHAR(50) DEFAULT 'namecheap', -- 'namecheap', 'godaddy', etc.
  provider_domain_id VARCHAR(255),
  
  -- Website Linking
  linked_website_id UUID REFERENCES websites(id) ON DELETE SET NULL,
  
  -- Privacy & Security
  whois_privacy BOOLEAN DEFAULT false,
  domain_lock BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_domains_user_id ON domains(user_id);
CREATE INDEX idx_domains_status ON domains(status);
CREATE INDEX idx_domains_expiry_date ON domains(expiry_date);
CREATE INDEX idx_domains_full_domain ON domains(full_domain);

-- ============================================
-- 3. DNS Records Table
-- ============================================
CREATE TABLE dns_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain_id UUID REFERENCES domains(id) ON DELETE CASCADE NOT NULL,
  
  -- DNS Record Details
  record_type VARCHAR(10) NOT NULL, -- 'A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS'
  host VARCHAR(255) NOT NULL, -- '@', 'www', 'mail', etc.
  value TEXT NOT NULL, -- IP address, domain, or text value
  ttl INTEGER DEFAULT 3600, -- Time to live in seconds
  priority INTEGER, -- For MX records
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_dns_records_domain_id ON dns_records(domain_id);
CREATE INDEX idx_dns_records_type ON dns_records(record_type);

-- ============================================
-- 4. Domain Transactions Table
-- ============================================
CREATE TABLE domain_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  domain_id UUID REFERENCES domains(id) ON DELETE SET NULL,
  
  -- Transaction Details
  transaction_type VARCHAR(50) NOT NULL, -- 'purchase', 'renewal', 'transfer'
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'SAR',
  
  -- Payment Information
  payment_method VARCHAR(50), -- 'credit_card', 'mada', 'apple_pay'
  payment_provider VARCHAR(50), -- 'moyasar', 'stripe'
  payment_id VARCHAR(255),
  payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
  
  -- Additional Info
  years_purchased INTEGER DEFAULT 1,
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_domain_transactions_user_id ON domain_transactions(user_id);
CREATE INDEX idx_domain_transactions_domain_id ON domain_transactions(domain_id);
CREATE INDEX idx_domain_transactions_status ON domain_transactions(payment_status);

-- ============================================
-- 5. Domain Pricing Table
-- ============================================
CREATE TABLE domain_pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  extension VARCHAR(10) UNIQUE NOT NULL, -- '.com', '.net', etc.
  
  -- Pricing
  purchase_price DECIMAL(10,2) NOT NULL,
  renewal_price DECIMAL(10,2) NOT NULL,
  transfer_price DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'SAR',
  
  -- Availability
  is_available BOOLEAN DEFAULT true,
  is_premium BOOLEAN DEFAULT false,
  
  -- Provider Info
  provider VARCHAR(50) DEFAULT 'namecheap',
  provider_price DECIMAL(10,2), -- Cost from provider
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default pricing
INSERT INTO domain_pricing (extension, purchase_price, renewal_price, currency, is_available) VALUES
('.com', 50.00, 50.00, 'SAR', true),
('.net', 55.00, 55.00, 'SAR', true),
('.org', 60.00, 60.00, 'SAR', true),
('.sa', 150.00, 150.00, 'SAR', true),
('.com.sa', 100.00, 100.00, 'SAR', true),
('.info', 45.00, 45.00, 'SAR', true),
('.biz', 50.00, 50.00, 'SAR', true)
ON CONFLICT (extension) DO NOTHING;

-- ============================================
-- 6. Domain Notifications Table
-- ============================================
CREATE TABLE domain_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain_id UUID REFERENCES domains(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Notification Details
  notification_type VARCHAR(50) NOT NULL, -- 'expiry_warning', 'renewal_success', 'dns_change'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_domain_notifications_user_id ON domain_notifications(user_id);
CREATE INDEX idx_domain_notifications_domain_id ON domain_notifications(domain_id);

-- ============================================
-- 7. Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE dns_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_notifications ENABLE ROW LEVEL SECURITY;

-- Domains Policies
CREATE POLICY "Users can view own domains"
ON domains FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own domains"
ON domains FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own domains"
ON domains FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all domains"
ON domains FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can manage all domains"
ON domains FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- DNS Records Policies
CREATE POLICY "Users can view DNS for own domains"
ON dns_records FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM domains
    WHERE domains.id = dns_records.domain_id
    AND domains.user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage DNS for own domains"
ON dns_records FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM domains
    WHERE domains.id = dns_records.domain_id
    AND domains.user_id = auth.uid()
  )
);

-- Domain Transactions Policies
CREATE POLICY "Users can view own transactions"
ON domain_transactions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
ON domain_transactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions"
ON domain_transactions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Domain Pricing Policies (Public read, admin write)
CREATE POLICY "Anyone can view pricing"
ON domain_pricing FOR SELECT
USING (true);

CREATE POLICY "Admins can manage pricing"
ON domain_pricing FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Domain Notifications Policies
CREATE POLICY "Users can view own notifications"
ON domain_notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
ON domain_notifications FOR UPDATE
USING (auth.uid() = user_id);

-- ============================================
-- 8. Functions and Triggers
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_domains_updated_at
    BEFORE UPDATE ON domains
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dns_records_updated_at
    BEFORE UPDATE ON dns_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_domain_transactions_updated_at
    BEFORE UPDATE ON domain_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_domain_pricing_updated_at
    BEFORE UPDATE ON domain_pricing
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create expiry notification
CREATE OR REPLACE FUNCTION create_domain_expiry_notification()
RETURNS void AS $$
DECLARE
    domain_record RECORD;
BEGIN
    -- Find domains expiring in 30 days
    FOR domain_record IN
        SELECT d.id, d.user_id, d.full_domain, d.expiry_date
        FROM domains d
        WHERE d.status = 'active'
        AND d.expiry_date BETWEEN NOW() AND NOW() + INTERVAL '30 days'
        AND NOT EXISTS (
            SELECT 1 FROM domain_notifications dn
            WHERE dn.domain_id = d.id
            AND dn.notification_type = 'expiry_warning'
            AND dn.sent_at > NOW() - INTERVAL '7 days'
        )
    LOOP
        INSERT INTO domain_notifications (domain_id, user_id, notification_type, title, message)
        VALUES (
            domain_record.id,
            domain_record.user_id,
            'expiry_warning',
            'تنبيه: الدومين قارب على الانتهاء',
            'الدومين ' || domain_record.full_domain || ' سينتهي في ' || 
            EXTRACT(DAY FROM (domain_record.expiry_date - NOW())) || ' يوم. يرجى التجديد لتجنب فقدان الدومين.'
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to set full_domain before insert
CREATE OR REPLACE FUNCTION set_full_domain()
RETURNS TRIGGER AS $$
BEGIN
    NEW.full_domain = NEW.domain_name || NEW.extension;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_full_domain_trigger
    BEFORE INSERT OR UPDATE ON domains
    FOR EACH ROW
    EXECUTE FUNCTION set_full_domain();

-- ============================================
-- 9. Views for Analytics
-- ============================================

-- View for domain statistics
CREATE OR REPLACE VIEW domain_statistics AS
SELECT
    COUNT(*) as total_domains,
    COUNT(*) FILTER (WHERE status = 'active') as active_domains,
    COUNT(*) FILTER (WHERE status = 'expired') as expired_domains,
    COUNT(*) FILTER (WHERE expiry_date < NOW() + INTERVAL '30 days') as expiring_soon,
    COUNT(*) FILTER (WHERE auto_renew = true) as auto_renew_enabled,
    SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END)::FLOAT / NULLIF(COUNT(*), 0) * 100 as active_percentage
FROM domains;

-- View for revenue statistics
CREATE OR REPLACE VIEW domain_revenue_statistics AS
SELECT
    COUNT(*) as total_transactions,
    SUM(amount) FILTER (WHERE payment_status = 'completed') as total_revenue,
    SUM(amount) FILTER (WHERE payment_status = 'completed' AND transaction_type = 'purchase') as purchase_revenue,
    SUM(amount) FILTER (WHERE payment_status = 'completed' AND transaction_type = 'renewal') as renewal_revenue,
    AVG(amount) FILTER (WHERE payment_status = 'completed') as average_transaction_value
FROM domain_transactions;

-- ============================================
-- 10. Sample Data (for testing)
-- ============================================

-- Uncomment to insert sample data
/*
INSERT INTO domains (user_id, domain_name, extension, full_domain, expiry_date, status)
VALUES
    ((SELECT id FROM auth.users LIMIT 1), 'example', '.com', 'example.com', NOW() + INTERVAL '1 year', 'active'),
    ((SELECT id FROM auth.users LIMIT 1), 'test', '.net', 'test.net', NOW() + INTERVAL '6 months', 'active');
*/

-- ============================================
-- Completion Message
-- ============================================
DO $$
BEGIN
    RAISE NOTICE 'Domain Management System Schema created successfully!';
    RAISE NOTICE 'Tables created: domains, dns_records, domain_transactions, domain_pricing, domain_notifications';
    RAISE NOTICE 'RLS Policies enabled and configured';
    RAISE NOTICE 'Triggers and functions created';
    RAISE NOTICE 'Views created for analytics';
END $$;
