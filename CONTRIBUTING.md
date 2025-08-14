# 🤝 دليل المساهمة - Omar Tech Portfolio

## 🎯 كيف يمكنك المساهمة

نرحب بمساهماتك! هناك العديد من الطرق للمساهمة في هذا المشروع:

### 🐛 الإبلاغ عن الأخطاء
- استخدم [GitHub Issues](https://github.com/oooomar896/omar-tech-portfolio/issues)
- وصف المشكلة بوضوح
- أضف لقطات شاشة إذا أمكن
- حدد المتصفح ونظام التشغيل

### 💡 اقتراح ميزات جديدة
- اطرح أفكارك في [GitHub Discussions](https://github.com/oooomar896/omar-tech-portfolio/discussions)
- اشرح الفائدة من الميزة
- اقترح كيفية تنفيذها

### 🔧 إصلاح الأخطاء
- اختر issue من قائمة [Good First Issues](https://github.com/oooomar896/omar-tech-portfolio/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
- اتبع دليل التطوير أدناه
- أرسل Pull Request

### 📚 تحسين التوثيق
- أضف تعليقات للكود
- حسّن ملف README.md
- أضف أمثلة للاستخدام

## 🚀 بدء التطوير

### 1. إعداد البيئة المحلية
```bash
# Fork المستودع
# Clone المستودع المحلي
git clone https://github.com/YOUR_USERNAME/omar-tech-portfolio.git

# انتقل إلى المجلد
cd omar-tech-portfolio

# تثبيت التبعيات
npm install

# تشغيل التطبيق
npm start
```

### 2. إنشاء فرع جديد
```bash
# إنشاء فرع جديد
git checkout -b feature/your-feature-name

# أو إصلاح خطأ
git checkout -b fix/issue-description
```

### 3. تطوير الميزة
- اكتب كود نظيف ومفهوم
- اتبع معايير الكود أدناه
- أضف اختبارات إذا أمكن
- تأكد من أن التطبيق يعمل

### 4. اختبار التغييرات
```bash
# بناء المشروع
npm run build

# تشغيل الاختبارات
npm test

# فحص الكود
npm run lint
```

### 5. إرسال Pull Request
```bash
# إضافة التغييرات
git add .

# عمل commit
git commit -m "feat: add new feature description"

# رفع الفرع
git push origin feature/your-feature-name

# إنشاء Pull Request على GitHub
```

## 📝 معايير الكود

### 1. تنسيق الكود
- استخدم Prettier للتنسيق التلقائي
- استخدم ESLint لفحص الكود
- اتبع معايير React

### 2. أسماء المتغيرات والدوال
```javascript
// ✅ صحيح
const userName = 'عمر';
const getUserData = () => {};

// ❌ خاطئ
const u = 'عمر';
const get = () => {};
```

### 3. التعليقات
```javascript
// تعليق بسيط
const calculateTotal = (items) => {
  // حساب مجموع العناصر مع الضريبة
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.15; // ضريبة 15%
  return subtotal + tax;
};
```

### 4. هيكل الملفات
```
src/
├── components/          # مكونات React
│   ├── common/         # مكونات مشتركة
│   └── pages/          # مكونات الصفحات
├── hooks/              # Custom Hooks
├── utils/              # دوال مساعدة
├── constants/          # ثوابت
└── types/              # أنواع TypeScript
```

## 🧪 الاختبارات

### 1. اختبار المكونات
```javascript
import { render, screen } from '@testing-library/react';
import Hero from '../Hero';

test('يعرض اسم المطور', () => {
  render(<Hero />);
  expect(screen.getByText('عمر حميد العديني')).toBeInTheDocument();
});
```

### 2. اختبار الدوال
```javascript
import { calculateTotal } from '../utils/calculations';

test('يحسب المجموع مع الضريبة', () => {
  const items = [{ price: 100 }, { price: 200 }];
  expect(calculateTotal(items)).toBe(345); // 300 + 15% ضريبة
});
```

## 📋 قائمة التحقق قبل إرسال PR

- [ ] الكود يعمل محلياً
- [ ] جميع الاختبارات تمر
- [ ] لا توجد أخطاء في ESLint
- [ ] الكود يتبع المعايير
- [ ] أضفت تعليقات للكود الجديد
- [ ] حدثت التوثيق إذا لزم الأمر
- [ ] أضفت اختبارات للميزات الجديدة

## 🏷️ أنواع Commits

استخدم prefixes لتوضيح نوع التغيير:

- `feat:` - ميزة جديدة
- `fix:` - إصلاح خطأ
- `docs:` - تحديث التوثيق
- `style:` - تغييرات في التنسيق
- `refactor:` - إعادة هيكلة الكود
- `test:` - إضافة اختبارات
- `chore:` - مهام صيانة

## 🎨 إرشادات التصميم

### 1. الألوان
- استخدم نظام الألوان المحدد في `tailwind.config.js`
- حافظ على التناسق في جميع المكونات
- استخدم متغيرات CSS للألوان

### 2. الخطوط
- استخدم خط Cairo للنصوص العربية
- استخدم خط Fira Code للنصوص البرمجية
- حافظ على أحجام الخطوط المحددة

### 3. الحركات
- استخدم Framer Motion للانيميشن
- حافظ على مدة الحركة أقل من 500ms
- استخدم easing functions مناسبة

## 🌐 دعم اللغات

### 1. النصوص العربية
- استخدم اتجاه RTL
- تأكد من صحة النصوص
- استخدم خطوط مناسبة

### 2. النصوص الإنجليزية
- استخدم اتجاه LTR
- تأكد من صحة القواعد
- استخدم مصطلحات تقنية دقيقة

## 📞 التواصل

### 1. GitHub
- [Issues](https://github.com/oooomar896/omar-tech-portfolio/issues)
- [Discussions](https://github.com/oooomar896/omar-tech-portfolio/discussions)
- [Pull Requests](https://github.com/oooomar896/omar-tech-portfolio/pulls)

### 2. البريد الإلكتروني
- oooomar123450@gmail.com

### 3. LinkedIn
- [عمر حميد](https://linkedin.com/in/omar-hamid-288385235)

## 🙏 شكر وتقدير

نشكر كل من يساهم في تطوير هذا المشروع! مساهماتك تساعد في جعل Portfolio أفضل للجميع.

---

**معاً نصنع مستقبلاً تقنياً أفضل** 🚀
