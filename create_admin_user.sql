-- سكربت إنشاء وتعريف حساب الأدمن بشكل صحيح
-- Admin Creation Script

-- 1. التأكد من وجود الجدول بالأعمدة الصحيحة
CREATE TABLE IF NOT EXISTS admins (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  role text DEFAULT 'admin',
  created_at timestamp WITH time zone DEFAULT now()
);

-- 2. التأكد من وجود عمود كلمة المرور
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admins' AND column_name = 'password') THEN
    ALTER TABLE admins ADD COLUMN password text;
  END IF;
END $$;

-- 3. حذف المستخدم الحالي (لإعادة إنشائه بشكل نظيف)
DELETE FROM admins WHERE email = 'oooomar896@gmail.com';
DELETE FROM admins WHERE email = 'oooomar123450@gmail.com'; -- تنظيف القديم

-- 4. إدخال المستخدم الجديد بكلمة المرور الصحيحة
-- ملاحظة: كلمة المرور هنا نصية كما في الكود الحالي، يفضل تشفيرها لاحقاً
INSERT INTO admins (email, password, role)
VALUES ('oooomar896@gmail.com', 'Omar@2597798', 'super_admin');

-- 5. تفعيل صلاحيات القراءة للأدمن (Security Policy)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Read admins" ON admins;
-- 6. إنشاء جدول تتبع الزيارات (لإصلاح خطأ 404)
CREATE TABLE IF NOT EXISTS page_visits (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  path text NOT NULL,
  visitor_id text,
  user_id uuid REFERENCES auth.users(id),
  metadata jsonb,
  visited_at timestamp WITH time zone DEFAULT now()
);

ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous insert" ON page_visits;
CREATE POLICY "Allow anonymous insert" ON page_visits FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow admin select" ON page_visits;
CREATE POLICY "Allow admin select" ON page_visits FOR SELECT USING (true);

