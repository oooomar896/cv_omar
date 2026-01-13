# دليل البدء السريع - ميزة الدومينات 🚀

## الخطوات الأساسية للتفعيل

### 1️⃣ تطبيق Schema قاعدة البيانات

افتح Supabase Dashboard وانتقل إلى SQL Editor، ثم قم بتشغيل الملف:

```bash
supabase_domains_schema.sql
```

هذا سينشئ:
- ✅ 6 جداول جديدة
- ✅ RLS Policies
- ✅ Triggers & Functions
- ✅ Views للإحصائيات
- ✅ بيانات تجريبية للأسعار

### 2️⃣ التحقق من التثبيت

بعد تشغيل الـ SQL، تحقق من إنشاء الجداول:

```sql
-- في SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('domains', 'dns_records', 'domain_transactions', 'domain_pricing', 'domain_notifications');
```

يجب أن ترى 5 جداول.

### 3️⃣ اختبار الميزة

#### أ) البحث عن دومين
1. شغل المشروع: `npm start`
2. انتقل إلى: `http://localhost:3000/domains/search`
3. جرب البحث عن دومين (مثال: `mybusiness`)
4. اختر امتدادات مختلفة
5. شاهد النتائج

#### ب) إدارة الدومينات
1. انتقل إلى: `http://localhost:3000/portal/domains`
2. سترى صفحة فارغة (لأنه لا توجد دومينات بعد)
3. اضغط "شراء دومين جديد" للانتقال للبحث

### 4️⃣ إضافة بيانات تجريبية (اختياري)

لاختبار صفحة الإدارة، أضف دومين تجريبي:

```sql
-- احصل على user_id الخاص بك
SELECT id FROM auth.users LIMIT 1;

-- أضف دومين تجريبي (استبدل USER_ID_HERE)
INSERT INTO domains (
  user_id, 
  domain_name, 
  extension, 
  full_domain, 
  expiry_date, 
  status
) VALUES (
  'USER_ID_HERE',
  'testdomain',
  '.com',
  'testdomain.com',
  NOW() + INTERVAL '1 year',
  'active'
);
```

الآن عند زيارة `/portal/domains` سترى الدومين التجريبي.

### 5️⃣ اختبار إدارة DNS

1. من صفحة إدارة الدومينات
2. اضغط "إدارة DNS" على أي دومين
3. جرب إضافة سجل جديد:
   - النوع: A
   - Host: @
   - القيمة: 192.0.2.1
   - TTL: 3600
4. احفظ وشاهد السجل في القائمة

### 6️⃣ اختبار القوالب الجاهزة

في نافذة DNS Manager:
1. اضغط على قالب "موقع ويب"
2. سيتم ملء الحقول تلقائياً
3. عدل القيم حسب الحاجة
4. احفظ

## الميزات المتاحة الآن ✨

### ✅ جاهزة للاستخدام
- [x] البحث عن الدومينات
- [x] عرض الأسعار
- [x] إدارة الدومينات
- [x] إدارة DNS
- [x] ربط الدومين بالموقع
- [x] التجديد التلقائي
- [x] الإحصائيات والفلاتر
- [x] الإشعارات

### ⏳ تحتاج تكامل خارجي
- [ ] التحقق الفعلي من توفر الدومين (Namecheap API)
- [ ] الشراء الفعلي (Payment Gateway)
- [ ] تسجيل الدومين الفعلي
- [ ] تحديث DNS الفعلي

## التكاملات المطلوبة للإنتاج 🔌

### Namecheap API

1. **التسجيل**:
   - اذهب إلى: https://www.namecheap.com/
   - أنشئ حساب
   - فعّل API Access من Dashboard

2. **الحصول على API Keys**:
   ```
   API User: your_username
   API Key: من Account > Profile > Tools > API Access
   Client IP: IP الخاص بالسيرفر
   ```

3. **إضافة للـ .env**:
   ```env
   REACT_APP_NAMECHEAP_API_USER=your_username
   REACT_APP_NAMECHEAP_API_KEY=your_api_key
   REACT_APP_NAMECHEAP_USERNAME=your_username
   REACT_APP_NAMECHEAP_CLIENT_IP=your_server_ip
   ```

### Moyasar Payment

1. **التسجيل**:
   - اذهب إلى: https://moyasar.com/
   - أنشئ حساب تاجر
   - احصل على API Keys من Dashboard

2. **إضافة للـ .env**:
   ```env
   REACT_APP_MOYASAR_API_KEY=your_api_key
   REACT_APP_MOYASAR_PUBLISHABLE_KEY=your_publishable_key
   ```

## Backend API (مطلوب للإنتاج) 🖥️

حالياً الميزة تعمل مع Supabase مباشرة. للإنتاج، يُنصح بإنشاء Backend API:

### مثال على Express.js Backend

```javascript
// server.js
const express = require('express');
const app = express();

// Check domain availability
app.post('/api/domains/check', async (req, res) => {
  const { domain, extension } = req.body;
  
  // Call Namecheap API
  const available = await namecheap.domains.check(domain + extension);
  
  res.json({ available, price: getPricing(extension) });
});

// Purchase domain
app.post('/api/domains/purchase', async (req, res) => {
  const { domain, userId, paymentId } = req.body;
  
  // 1. Verify payment with Moyasar
  // 2. Register domain with Namecheap
  // 3. Save to Supabase
  
  res.json({ success: true, domainId });
});

app.listen(5000);
```

## الإشعارات التلقائية ⏰

لتفعيل إشعارات انتهاء الدومينات، أضف Cron Job:

### في Supabase (pg_cron)

```sql
-- تفعيل pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- إضافة job يومي
SELECT cron.schedule(
  'domain-expiry-notifications',
  '0 9 * * *', -- كل يوم الساعة 9 صباحاً
  $$SELECT create_domain_expiry_notification()$$
);
```

### أو استخدم External Cron

```bash
# crontab -e
0 9 * * * curl -X POST https://your-api.com/cron/domain-notifications
```

## الأمان 🔒

### تحقق من RLS Policies

```sql
-- تحقق من تفعيل RLS
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'domain%';

-- يجب أن تكون rowsecurity = true لجميع الجداول
```

### اختبار الصلاحيات

```sql
-- كمستخدم عادي، يجب أن ترى دوميناتك فقط
SELECT * FROM domains;

-- كأدمن، يجب أن ترى جميع الدومينات
```

## الأداء والتحسينات ⚡

### Indexes المهمة (موجودة بالفعل)

```sql
-- تحقق من الـ indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename IN ('domains', 'dns_records', 'domain_transactions');
```

### Caching (للمستقبل)

```javascript
// استخدم React Query أو SWR
import { useQuery } from 'react-query';

const { data: domains } = useQuery('domains', fetchDomains, {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000 // 10 minutes
});
```

## استكشاف الأخطاء 🔍

### المشكلة: لا تظهر الدومينات

**الحل**:
1. تحقق من تسجيل الدخول
2. تحقق من RLS policies
3. افتح Console وشاهد الأخطاء

```javascript
// في Console
supabase.auth.getUser().then(console.log);
```

### المشكلة: خطأ عند إضافة DNS Record

**الحل**:
1. تحقق من domain_id
2. تحقق من RLS policy لـ dns_records
3. تحقق من القيم المدخلة

```sql
-- تحقق من السياسات
SELECT * FROM pg_policies WHERE tablename = 'dns_records';
```

### المشكلة: البحث لا يعمل

**الحل**:
حالياً البحث محاكاة (mock). للإنتاج:
1. كامل Namecheap API
2. أو استخدم Backend API

## الخطوات التالية 📋

### للتطوير
- [ ] إضافة المزيد من الامتدادات
- [ ] تحسين UI/UX
- [ ] إضافة اختبارات آلية
- [ ] تحسين الأداء

### للإنتاج
- [ ] تكامل Namecheap API
- [ ] تكامل Moyasar Payment
- [ ] إنشاء Backend API
- [ ] إعداد Cron Jobs
- [ ] اختبار شامل
- [ ] Deploy

## الدعم والمساعدة 💬

إذا واجهت أي مشاكل:
1. راجع [DOMAIN_FEATURE_README.md](./DOMAIN_FEATURE_README.md)
2. راجع [domain-feature-implementation.md](./domain-feature-implementation.md)
3. تواصل عبر: oooomar123450@gmail.com

---

**ملاحظة**: هذه الميزة في مرحلة MVP وجاهزة للاختبار المحلي. للإنتاج، يجب تفعيل التكاملات الخارجية.

**آخر تحديث**: 2026-01-13
**الحالة**: ✅ MVP Ready
