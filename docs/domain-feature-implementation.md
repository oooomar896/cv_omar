# خطة تنفيذ ميزة بيع وإدارة الدومينات

## 📋 نظرة عامة
هذا المستند يحدد خطة التنفيذ الكاملة لإضافة ميزة بيع وإدارة الدومينات في منصة باكورة أعمال.

## 🎯 الأهداف الرئيسية
1. تمكين المستخدمين من البحث عن الدومينات المتاحة
2. شراء الدومينات مباشرة من المنصة
3. ربط الدومينات تلقائياً بالمواقع المنشأة
4. إدارة الدومينات من لوحة التحكم
5. تجديد الدومينات وإدارة DNS

## 🏗️ البنية التقنية

### Frontend (React)
- **صفحة البحث عن الدومين**: `/domains/search`
- **صفحة إدارة الدومينات**: `/portal/domains`
- **صفحة تفاصيل الدومين**: `/portal/domains/:id`
- **مكونات جديدة**:
  - `DomainSearch.js` - البحث عن الدومينات
  - `DomainCheckout.js` - صفحة الدفع
  - `DomainManagement.js` - إدارة الدومينات
  - `DNSManager.js` - إدارة DNS
  - `DomainRenewal.js` - تجديد الدومين

### Backend (Node.js + Express)
- **API Endpoints**:
  - `POST /api/domains/check` - التحقق من توفر الدومين
  - `POST /api/domains/purchase` - شراء دومين
  - `GET /api/domains/user/:userId` - قائمة دومينات المستخدم
  - `POST /api/domains/renew/:domainId` - تجديد دومين
  - `PUT /api/domains/dns/:domainId` - تحديث DNS
  - `POST /api/domains/link/:domainId/:websiteId` - ربط الدومين بالموقع

### Database (Supabase/PostgreSQL)
```sql
-- جدول الدومينات
CREATE TABLE domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  domain_name VARCHAR(255) UNIQUE NOT NULL,
  extension VARCHAR(10) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  purchase_date TIMESTAMP DEFAULT NOW(),
  expiry_date TIMESTAMP NOT NULL,
  auto_renew BOOLEAN DEFAULT false,
  provider VARCHAR(50) DEFAULT 'namecheap',
  provider_domain_id VARCHAR(255),
  linked_website_id UUID REFERENCES websites(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- جدول DNS Records
CREATE TABLE dns_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain_id UUID REFERENCES domains(id) ON DELETE CASCADE,
  record_type VARCHAR(10) NOT NULL, -- A, CNAME, MX, TXT
  host VARCHAR(255) NOT NULL,
  value TEXT NOT NULL,
  ttl INTEGER DEFAULT 3600,
  priority INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- جدول المعاملات المالية للدومينات
CREATE TABLE domain_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  domain_id UUID REFERENCES domains(id),
  transaction_type VARCHAR(50) NOT NULL, -- purchase, renewal
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'SAR',
  payment_method VARCHAR(50),
  payment_provider VARCHAR(50),
  payment_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- جدول المواقع (إذا لم يكن موجوداً)
CREATE TABLE IF NOT EXISTS websites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50),
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔌 التكاملات الخارجية

### 1. Namecheap API
```javascript
// مثال على التكامل
const namecheapConfig = {
  apiUser: process.env.NAMECHEAP_API_USER,
  apiKey: process.env.NAMECHEAP_API_KEY,
  userName: process.env.NAMECHEAP_USERNAME,
  clientIp: process.env.NAMECHEAP_CLIENT_IP,
  sandbox: process.env.NODE_ENV !== 'production'
};

// الوظائف المطلوبة:
// - namecheap.domains.check
// - namecheap.domains.create
// - namecheap.domains.renew
// - namecheap.domains.dns.setHosts
```

### 2. Payment Gateway (Moyasar)
```javascript
const moyasarConfig = {
  apiKey: process.env.MOYASAR_API_KEY,
  publishableKey: process.env.MOYASAR_PUBLISHABLE_KEY
};
```

## 📱 User Flow

### 1. البحث عن الدومين
```
المستخدم → صفحة البحث → إدخال اسم الدومين → 
اختيار الامتداد (.com, .net, .sa) → 
عرض النتائج (متاح/غير متاح + السعر)
```

### 2. الشراء
```
اختيار الدومين → إضافة للسلة → 
اختيار مدة الاشتراك (1-10 سنوات) → 
صفحة الدفع → إدخال بيانات الدفع → 
تأكيد الدفع → تسجيل الدومين
```

### 3. الربط بالموقع
```
بعد الشراء → اختيار الموقع للربط (اختياري) → 
إنشاء DNS Records تلقائياً → 
تفعيل الدومين على الموقع
```

### 4. الإدارة
```
لوحة التحكم → قسم الدومينات → 
عرض قائمة الدومينات → 
(تجديد / إدارة DNS / ربط بموقع / نقل)
```

## 🎨 UI/UX Components

### 1. DomainSearch Component
- حقل بحث مع اقتراحات تلقائية
- اختيار الامتدادات المتعددة
- عرض النتائج في بطاقات جذابة
- مؤشر التحميل أثناء البحث

### 2. DomainCard Component
- اسم الدومين
- السعر
- حالة التوفر
- زر الشراء
- اقتراحات بديلة

### 3. DomainManagement Dashboard
- جدول الدومينات
- فلاتر (الكل / نشط / منتهي / قريب الانتهاء)
- بحث وترتيب
- إجراءات سريعة

### 4. DNSManager Component
- قائمة DNS Records
- إضافة/تعديل/حذف Records
- قوالب جاهزة (Email, Website, etc.)
- معاينة التغييرات

## 🔒 الأمان والصلاحيات

### Row Level Security (RLS)
```sql
-- سياسة القراءة: المستخدم يرى دوميناته فقط
CREATE POLICY "Users can view own domains"
ON domains FOR SELECT
USING (auth.uid() = user_id);

-- سياسة الإدارة: المستخدم يدير دوميناته فقط
CREATE POLICY "Users can manage own domains"
ON domains FOR ALL
USING (auth.uid() = user_id);

-- الأدمن يرى كل شيء
CREATE POLICY "Admins can view all domains"
ON domains FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);
```

## 📊 MVP Features (المرحلة الأولى)

### ✅ يجب تنفيذها
1. البحث عن الدومينات (.com, .net, .org)
2. عرض الأسعار والتوفر
3. شراء دومين جديد
4. الدفع عبر Moyasar
5. ربط تلقائي بالموقع
6. لوحة تحكم بسيطة
7. عرض تاريخ الانتهاء
8. تجديد الدومين

### ⏳ المرحلة الثانية
1. إدارة DNS متقدمة
2. نقل دومين من مزود آخر
3. دومينات Premium
4. سوق إعادة بيع الدومينات
5. WHOIS Privacy
6. Email Forwarding

## 🚀 خطوات التنفيذ

### المرحلة 1: إعداد البنية التحتية (يوم 1-2)
- [ ] إنشاء جداول قاعدة البيانات
- [ ] إعداد RLS Policies
- [ ] إعداد Backend API
- [ ] تكامل Namecheap API
- [ ] تكامل Moyasar Payment

### المرحلة 2: Frontend Components (يوم 3-4)
- [ ] DomainSearch Component
- [ ] DomainCheckout Component
- [ ] DomainManagement Component
- [ ] DNSManager Component

### المرحلة 3: التكامل والربط (يوم 5)
- [ ] ربط Frontend مع Backend
- [ ] اختبار عملية الشراء الكاملة
- [ ] اختبار الربط مع المواقع

### المرحلة 4: الاختبار والتحسين (يوم 6-7)
- [ ] اختبار شامل لجميع الميزات
- [ ] معالجة الأخطاء
- [ ] تحسين الأداء
- [ ] تحسين UX

## 💰 نموذج التسعير

### أسعار الدومينات (سنوياً)
- `.com` - 50 SAR
- `.net` - 55 SAR
- `.org` - 60 SAR
- `.sa` - 150 SAR
- `.com.sa` - 100 SAR

### هامش الربح
- إضافة 20-30% على سعر المزود
- رسوم إدارة DNS: مجاناً
- رسوم التجديد: نفس سعر الشراء

## 📈 مؤشرات الأداء (KPIs)

1. عدد عمليات البحث اليومية
2. معدل التحويل (بحث → شراء)
3. متوسط قيمة الطلب
4. معدل التجديد
5. رضا العملاء

## 🔧 متغيرات البيئة المطلوبة

```env
# Namecheap API
NAMECHEAP_API_USER=your_api_user
NAMECHEAP_API_KEY=your_api_key
NAMECHEAP_USERNAME=your_username
NAMECHEAP_CLIENT_IP=your_whitelisted_ip

# Moyasar Payment
MOYASAR_API_KEY=your_api_key
MOYASAR_PUBLISHABLE_KEY=your_publishable_key

# Backend URL
REACT_APP_BACKEND_URL=http://localhost:5000
```

## 📝 ملاحظات إضافية

1. **الدعم الفني**: يجب توفير دعم فني للمستخدمين في حالة مشاكل الدومين
2. **الإشعارات**: إرسال تنبيهات قبل انتهاء الدومين (30، 15، 7 أيام)
3. **التوثيق**: توفير دليل استخدام شامل
4. **النسخ الاحتياطي**: حفظ سجلات DNS بشكل دوري
5. **المراقبة**: مراقبة حالة الدومينات وتنبيه في حالة المشاكل

## 🎓 الموارد والمراجع

- [Namecheap API Documentation](https://www.namecheap.com/support/api/intro/)
- [Moyasar Documentation](https://moyasar.com/docs/api/)
- [DNS Best Practices](https://www.cloudflare.com/learning/dns/dns-records/)
