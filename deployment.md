# 🚀 دليل النشر - Omar Tech Portfolio

## 📋 المتطلبات الأساسية

- Node.js 18+ 
- npm أو yarn
- حساب Netlify (مجاني)

## 🔧 خطوات النشر

### 1. بناء المشروع
```bash
# تثبيت التبعيات
npm install

# بناء المشروع للإنتاج
npm run build
```

### 2. النشر على Netlify

#### الطريقة الأولى: السحب والإفلات
1. اذهب إلى [netlify.com](https://netlify.com)
2. سجل دخول أو أنشئ حساب جديد
3. اسحب مجلد `build` إلى منطقة النشر
4. انتظر حتى يكتمل النشر

#### الطريقة الثانية: ربط GitHub
1. ارفع المشروع إلى GitHub
2. في Netlify، اختر "New site from Git"
3. اختر GitHub واختر المستودع
4. اضبط إعدادات البناء:
   - Build command: `npm run build`
   - Publish directory: `build`
5. اضغط "Deploy site"

### 3. إعدادات النشر

#### ملف netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "build"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"
```

#### إعادة التوجيه
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 4. النشر على Vercel

```bash
# تثبيت Vercel CLI
npm i -g vercel

# نشر المشروع
vercel

# أو ربط GitHub للنشر التلقائي
```

### 5. النشر على GitHub Pages

```bash
# إضافة homepage في package.json
"homepage": "https://username.github.io/repo-name"

# تثبيت gh-pages
npm install --save-dev gh-pages

# إضافة script في package.json
"deploy": "gh-pages -d build"

# نشر المشروع
npm run deploy
```

## 🌐 إعدادات النطاق

### 1. نطاق مخصص
- في Netlify: Settings > Domain management > Add custom domain
- أضف نطاقك: `yourdomain.com`
- اتبع تعليمات DNS

### 2. HTTPS
- Netlify يوفر HTTPS تلقائياً
- Vercel يدعم HTTPS تلقائياً
- GitHub Pages يدعم HTTPS

## 📱 اختبار النشر

### 1. اختبار الوظائف
- [ ] التنقل بين الصفحات
- [ ] النماذج تعمل
- [ ] الصور تظهر
- [ ] الروابط تعمل

### 2. اختبار الأداء
- [ ] PageSpeed Insights
- [ ] GTmetrix
- [ ] WebPageTest

### 3. اختبار التجاوب
- [ ] الهاتف المحمول
- [ ] التابلت
- [ ] سطح المكتب

## 🔍 استكشاف الأخطاء

### مشاكل شائعة

#### 1. خطأ في البناء
```bash
# تنظيف cache
npm run build -- --reset-cache

# حذف node_modules وإعادة التثبيت
rm -rf node_modules package-lock.json
npm install
```

#### 2. مشاكل في النشر
- تحقق من إعدادات البناء
- تحقق من مجلد النشر
- تحقق من الأخطاء في console

#### 3. مشاكل في الروابط
- تأكد من إعدادات React Router
- تحقق من إعادة التوجيه في Netlify

## 📊 مراقبة الأداء

### 1. Google Analytics
```html
<!-- في public/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

### 2. Netlify Analytics
- متاح في الخطة المدفوعة
- يوفر إحصائيات مفصلة

### 3. Vercel Analytics
- متاح في الخطة المجانية
- يوفر رؤى حول الأداء

## 🔄 التحديثات المستمرة

### 1. النشر التلقائي
- ربط GitHub مع Netlify/Vercel
- كل push يحدث نشر تلقائي

### 2. النشر اليدوي
```bash
# بناء وتشغيل محلي
npm run build
npm run start

# نشر بعد الاختبار
git add .
git commit -m "Update portfolio"
git push
```

## 📞 الدعم

- **Netlify**: [docs.netlify.com](https://docs.netlify.com)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **GitHub Pages**: [pages.github.com](https://pages.github.com)

---

**تم إنشاؤه بواسطة عمر حميد العديني** 🚀
