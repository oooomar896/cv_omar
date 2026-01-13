# 🚀 دليل تشغيل دوال Supabase (Edge Functions)

لقد قمنا بإنشاء البنية التحتية للدوال السحابية اللازمة للدفع وحجز الدومينات. لتفعيلها، يجب عليك نشرها على مشروع Supabase الخاص بك.

## 📂 الدوال المتاحة
1.  **`create-payment`**: لمعالجة المدفوعات (جاهزة لربط Moyasar).
2.  **`check-domain`**: للتحقق من توفر الدومينات (جاهزة لربط Namecheap).

---

## 🛠️ خطوات النشر (Deployment Steps)

يجب تنفيذ هذه الأوامر من التيرمينال (Terminal) في جهازك:

### 1. تثبيت Supabase CLI (إذا لم يكن مثبتاً)
```bash
# MacOS / Linux
brew install supabase/tap/supabase

# Windows (Scope)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### 2. تسجيل الدخول
```bash
supabase login
```
سيفتح لك المتصفح لتسجيل الدخول بحساب Supabase الخاص بك.

### 3. ربط المشروع
احصل على الـ Reference ID الخاص بمشروعك من لوحة تحكم Supabase (موجود في إعدادات المشروع > General).
```bash
supabase link --project-ref your-project-id
```

### 4. نشر الدوال 🚀
```bash
supabase functions deploy create-payment
supabase functions deploy check-domain
```

### 5. إعداد المتغيرات البيئية (Secrets) 🔐
عندما تكون جاهزاً للربط الحقيقي، ستحتاج لإضافة مفاتيح API الخاصة بـ Moyasar أو Namecheap:

```bash
# مثال لإعداد مفتاح Moyasar
supabase secrets set MOYASAR_API_KEY=sk_test_...

# مثال لإعداد مفتاح Namecheap (استبدل YOUR_API_KEY بالمفتاح الحقيقي)
supabase secrets set NAMECHEAP_USER="omar256" NAMECHEAP_API_KEY="YOUR_API_KEY" CLIENT_IP="YOUR_PUBLIC_IP"
```

---

## 🔗 كيفية استخدامها في React
بعد النشر، يمكنك استدعاء الدوال باستخدام مكتبة `supabase-js`:

```javascript
const { data, error } = await supabase.functions.invoke('check-domain', {
  body: { domain: 'example.com' }
})
```

هذا يجعل تطبيقك أكثر أماناً واحترافية! 🛡️
