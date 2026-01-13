# 📊 دليل قاعدة البيانات الموحدة

## نظرة عامة

تم تجميع جميع جداول وسياسات قاعدة البيانات في ملف واحد شامل ومنظم:

**الملف**: `supabase_complete_database.sql`

---

## 📋 محتويات قاعدة البيانات

### القسم 1: الإعدادات الأساسية (Extensions & Setup)
- ✅ UUID Extension
- ✅ pg_cron Extension (للمهام المجدولة)

### القسم 2: الجداول الأساسية (Core Tables)

#### 2.1 المستخدمون والمصادقة
- `users` - معلومات المستخدمين (يمتد من auth.users)
- `admins` - المسؤولون (قديم، يُفضل استخدام users)
- `leads` - العملاء المحتملون

#### 2.2 إدارة المحتوى
- `projects` - مشاريع البورتفوليو
- `news` - الأخبار
- `skills` - المهارات

#### 2.3 التواصل
- `messages` - رسائل نموذج الاتصال
- `notifications` - الإشعارات

### القسم 3: باني المشاريع والطلبات

#### 3.1 المشاريع المولدة (AI Builder)
- `generated_projects` - المشاريع المنشأة بواسطة AI
- `project_messages` - محادثات المشاريع

#### 3.2 طلبات الخدمات
- `service_requests` - طلبات الخدمات
- `request_messages` - رسائل/تعليقات الطلبات

### القسم 4: نظام إدارة الدومينات

#### 4.1 المواقع
- `websites` - المواقع المنشأة

#### 4.2 الدومينات
- `domains` - معلومات الدومينات
- `dns_records` - سجلات DNS
- `domain_transactions` - المعاملات المالية
- `domain_pricing` - أسعار الامتدادات
- `domain_notifications` - إشعارات الدومينات

### القسم 5: التحليلات والتتبع
- `page_visits` - تتبع زيارات الصفحات

### القسم 6: سياسات الأمان (RLS)
- ✅ سياسات شاملة لجميع الجداول
- ✅ فصل صلاحيات المستخدمين والأدمن
- ✅ حماية البيانات الشخصية

### القسم 7: الدوال والمحفزات (Functions & Triggers)
- ✅ تحديث تلقائي لـ `updated_at`
- ✅ تعيين تلقائي لـ `full_domain`
- ✅ إشعارات انتهاء الدومينات

### القسم 8: Views للتحليلات
- `domain_statistics` - إحصائيات الدومينات
- `domain_revenue_statistics` - إحصائيات الإيرادات
- `page_visit_statistics` - إحصائيات الزيارات

### القسم 9: الاشتراكات الفورية (Realtime)
- ✅ تفعيل realtime للإشعارات والرسائل

### القسم 10: البيانات الأولية
- ✅ إدراج Super Admin الافتراضي

---

## 🚀 كيفية الاستخدام

### الطريقة 1: تطبيق كامل (موصى به للمشاريع الجديدة)

1. **افتح Supabase Dashboard**
2. **انتقل إلى SQL Editor**
3. **انسخ والصق محتوى الملف الكامل**:
   ```
   supabase_complete_database.sql
   ```
4. **اضغط Run**

⚠️ **تحذير**: هذا سينشئ جميع الجداول من الصفر. إذا كانت لديك بيانات موجودة، استخدم الطريقة 2.

### الطريقة 2: تطبيق تدريجي (للمشاريع الموجودة)

إذا كان لديك بيانات موجودة، طبق الأقسام بالترتيب:

```sql
-- 1. Extensions (آمن دائماً)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. الجداول الجديدة فقط
-- انسخ فقط CREATE TABLE للجداول غير الموجودة

-- 3. RLS Policies
-- طبق السياسات الجديدة أو المحدثة

-- 4. Functions & Triggers
-- طبق الدوال والمحفزات

-- 5. Views
-- أنشئ الـ Views
```

### الطريقة 3: تطبيق انتقائي (لميزات محددة)

#### لإضافة ميزة الدومينات فقط:

```sql
-- 1. الجداول
CREATE TABLE public.websites (...);
CREATE TABLE public.domains (...);
CREATE TABLE public.dns_records (...);
CREATE TABLE public.domain_transactions (...);
CREATE TABLE public.domain_pricing (...);
CREATE TABLE public.domain_notifications (...);

-- 2. الـ Indexes
CREATE INDEX idx_domains_user_id ON public.domains(user_id);
-- ... الخ

-- 3. RLS Policies
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own domains" ON public.domains ...;
-- ... الخ

-- 4. Functions
CREATE OR REPLACE FUNCTION set_full_domain() ...;
CREATE OR REPLACE FUNCTION create_domain_expiry_notification() ...;

-- 5. Triggers
CREATE TRIGGER set_full_domain_trigger ...;

-- 6. Views
CREATE OR REPLACE VIEW domain_statistics AS ...;

-- 7. البيانات الأولية
INSERT INTO public.domain_pricing (...) VALUES (...);
```

---

## 📊 هيكل قاعدة البيانات

### العلاقات الرئيسية

```
auth.users (Supabase Auth)
    ↓
users (معلومات إضافية)
    ↓
    ├── generated_projects → project_messages
    ├── service_requests → request_messages
    ├── domains → dns_records
    ├── domains → domain_transactions
    ├── domains → domain_notifications
    ├── websites
    └── notifications
```

### الجداول المستقلة

```
- projects (بورتفوليو)
- news (أخبار)
- skills (مهارات)
- messages (رسائل الاتصال)
- domain_pricing (أسعار عامة)
- page_visits (تحليلات)
```

---

## 🔒 الأمان (RLS Policies)

### القواعد العامة

1. **المستخدمون العاديون**:
   - يرون بياناتهم الخاصة فقط
   - يمكنهم إنشاء وتعديل بياناتهم
   - لا يمكنهم رؤية بيانات الآخرين

2. **الأدمن**:
   - يرون جميع البيانات
   - يمكنهم إدارة جميع الجداول
   - صلاحيات كاملة

3. **المحتوى العام**:
   - Projects, News, Skills: قراءة عامة
   - الكتابة للأدمن فقط

4. **الأسعار**:
   - قراءة عامة للجميع
   - الكتابة للأدمن فقط

### التحقق من RLS

```sql
-- تحقق من تفعيل RLS
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- يجب أن تكون rowsecurity = true لجميع الجداول
```

---

## 🔧 الصيانة والتحديث

### تحديث Schema موجود

إذا كنت تريد تحديث schema موجود:

```sql
-- 1. النسخ الاحتياطي أولاً!
-- في Supabase Dashboard > Database > Backups

-- 2. إضافة أعمدة جديدة
ALTER TABLE public.domains 
ADD COLUMN IF NOT EXISTS new_column TEXT;

-- 3. تحديث RLS Policies
DROP POLICY IF EXISTS "old_policy_name" ON public.domains;
CREATE POLICY "new_policy_name" ON public.domains ...;

-- 4. إضافة Indexes جديدة
CREATE INDEX IF NOT EXISTS idx_new_index ON public.domains(column_name);
```

### حذف وإعادة إنشاء (خطر!)

⚠️ **تحذير**: هذا سيحذف جميع البيانات!

```sql
-- حذف جميع الجداول
DROP TABLE IF EXISTS public.domain_notifications CASCADE;
DROP TABLE IF EXISTS public.domain_transactions CASCADE;
DROP TABLE IF EXISTS public.dns_records CASCADE;
DROP TABLE IF EXISTS public.domains CASCADE;
-- ... الخ

-- ثم شغل supabase_complete_database.sql
```

---

## 📈 المراقبة والأداء

### فحص الـ Indexes

```sql
-- عرض جميع الـ indexes
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

### فحص حجم الجداول

```sql
-- حجم كل جدول
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### فحص عدد السجلات

```sql
-- عدد السجلات في كل جدول
SELECT 
    schemaname,
    tablename,
    n_live_tup AS row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY n_live_tup DESC;
```

---

## 🔄 المهام المجدولة (Cron Jobs)

### إعداد إشعارات انتهاء الدومينات

```sql
-- تفعيل pg_cron (إذا لم يكن مفعلاً)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- إضافة job يومي للتحقق من الدومينات
SELECT cron.schedule(
    'domain-expiry-check',
    '0 9 * * *', -- كل يوم الساعة 9 صباحاً
    $$SELECT create_domain_expiry_notification()$$
);

-- عرض جميع الـ cron jobs
SELECT * FROM cron.job;

-- حذف job
SELECT cron.unschedule('domain-expiry-check');
```

---

## 🧪 الاختبار

### اختبار RLS Policies

```sql
-- 1. أنشئ مستخدم تجريبي
-- في Supabase Dashboard > Authentication > Users

-- 2. اختبر الصلاحيات
-- سجل دخول كمستخدم عادي
SELECT * FROM public.domains; -- يجب أن ترى دوميناتك فقط

-- سجل دخول كأدمن
SELECT * FROM public.domains; -- يجب أن ترى جميع الدومينات
```

### اختبار Functions

```sql
-- اختبر إشعارات انتهاء الدومينات
SELECT create_domain_expiry_notification();

-- تحقق من الإشعارات المنشأة
SELECT * FROM public.domain_notifications 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## 📝 ملاحظات مهمة

### 1. البيانات الأولية
- تم إدراج Super Admin الافتراضي
- تم إدراج أسعار الدومينات الافتراضية
- يمكنك تعديلها حسب الحاجة

### 2. كلمات المرور
⚠️ **مهم**: كلمة مرور الأدمن في الملف هي للتطوير فقط!
```sql
-- غيّر كلمة المرور في الإنتاج
UPDATE public.admins 
SET password = 'new_hashed_password' 
WHERE email = 'oooomar123450@gmail.com';
```

### 3. Realtime
تم تفعيل Realtime للجداول التالية:
- `notifications`
- `project_messages`
- `request_messages`
- `page_visits`

### 4. الأداء
- جميع الـ Indexes الضرورية موجودة
- Views محسّنة للاستعلامات الشائعة
- Triggers خفيفة ولا تؤثر على الأداء

---

## 🆘 استكشاف الأخطاء

### خطأ: "relation already exists"

```sql
-- استخدم IF NOT EXISTS
CREATE TABLE IF NOT EXISTS public.domains (...);
```

### خطأ: "policy already exists"

```sql
-- احذف السياسة القديمة أولاً
DROP POLICY IF EXISTS "policy_name" ON public.table_name;
CREATE POLICY "policy_name" ON public.table_name ...;
```

### خطأ: "permission denied"

```sql
-- تحقق من RLS Policies
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- تأكد من تسجيل الدخول
SELECT auth.uid();
```

---

## 📚 الملفات ذات الصلة

- `supabase_complete_database.sql` - **الملف الرئيسي الشامل**
- `supabase_domains_schema.sql` - ميزة الدومينات فقط
- `supabase_schema.sql` - Schema الأساسي القديم
- `supabase_admin_setup.sql` - إعداد الأدمن
- `supabase_secure_rls.sql` - سياسات الأمان

---

## 🎯 التوصيات

### للمشاريع الجديدة
✅ استخدم `supabase_complete_database.sql` مباشرة

### للمشاريع الموجودة
✅ راجع الملف وطبق الأقسام المطلوبة فقط
✅ اعمل نسخة احتياطية قبل التطبيق
✅ اختبر في بيئة التطوير أولاً

### للإنتاج
✅ غيّر كلمات المرور
✅ راجع RLS Policies
✅ فعّل Backups التلقائية
✅ راقب الأداء

---

## 📞 الدعم

للمساعدة:
- 📧 **البريد**: oooomar123450@gmail.com
- 📱 **الهاتف**: +966-55-853-9717

---

**آخر تحديث**: 2026-01-13  
**الإصدار**: 2.0.0  
**الحالة**: ✅ جاهز للاستخدام
