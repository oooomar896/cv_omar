export const PROJECT_TYPES = {
    WEB: 'web',
    MOBILE: 'mobile',
    AI_BOT: 'ai-bot',
};

export const AI_AGENTS = [
    { id: 'expert', name: 'الخبير التقني', role: 'يركز على بنية الكود والأداء', icon: 'Terminal' },
    { id: 'creative', name: 'المصمم الإبداعي', role: 'يركز على جمالية الواجهات وتجربة المستخدم', icon: 'Palette' },
    { id: 'business', name: 'محلل الأعمال', role: 'يركز على القيمة السوقية واحتياجات العميل', icon: 'Briefcase' }
];

export const FORM_STEPS = [
    { id: 'type', title: 'نوع المشروع' },
    { id: 'details', title: 'تفاصيل المشروع' },
    { id: 'features', title: 'المميزات المطلوبة' },
    { id: 'tech', title: 'التفضيلات التقنية' },
];

export const DYNAMIC_QUESTIONS = {
    [PROJECT_TYPES.WEB]: [
        {
            id: 'web_type',
            question: 'ما نوع الموقع؟',
            options: ['متجر إلكتروني', 'مدونة', 'موقع تعريفي للشركة', 'منصة SaaS'],
        },
        {
            id: 'has_backend',
            question: 'هل يحتاج الموقع إلى لوحة تحكم وإدارة بيانات؟',
            type: 'boolean',
        },
    ],
    [PROJECT_TYPES.MOBILE]: [
        {
            id: 'platform',
            question: 'ما هي المنصة المستهدفة؟',
            options: ['Android', 'iOS', 'كلاهما (Cross-platform)'],
        },
        {
            id: 'has_auth',
            question: 'هل يحتاج التطبيق لنظام تسجيل دخول؟',
            type: 'boolean',
        },
    ],
    [PROJECT_TYPES.AI_BOT]: [
        {
            id: 'bot_platform',
            question: 'أين سيعمل البوت؟',
            options: ['Telegram', 'WhatsApp', 'Web Chat', 'Discord'],
        },
        {
            id: 'ai_model',
            question: 'الموديل المفضل (إذا وجد)',
            options: ['GPT-4o', 'Claude 3.5 Sonnet', 'Gemini Pro'],
        },
    ],
};

export const STARTER_KITS = {
    [PROJECT_TYPES.WEB]: [
        { name: 'React + Vite Starter', desc: 'هيكل أساسي لمشروع React سريع جداً مع Tailwind CSS.', link: 'https://github.com/vitejs/vite-plugin-react' },
        { name: 'Next.js Premium Template', desc: 'قالب Next.js جاهز مع نظام SEO ونظام ملفات متطور.', link: 'https://nextjs.org/docs/getting-started' }
    ],
    [PROJECT_TYPES.MOBILE]: [
        { name: 'Flutter Clean Arch', desc: 'هيكل مشروع Flutter يتبع معايير Clean Architecture.', link: 'https://flutter.dev' },
        { name: 'React Native Base', desc: 'قالب React Native مع Expo و Navigation جاهز.', link: 'https://reactnative.dev' }
    ],
    [PROJECT_TYPES.AI_BOT]: [
        { name: 'Node.js Bot Core', desc: 'نظام أساسي لبناء بوتات Telegram و Discord باستخدام Node.js.', link: 'https://github.com/telegraf/telegraf' },
        { name: 'Python AI Agent Kit', desc: 'هيكل لبناء وكلاء ذكاء اصطناعي باستخدام LangChain و OpenAI.', link: 'https://python.langchain.com' }
    ]
};

export const UI_UX_RESOURCES = [
    { name: 'Framer Motion', desc: 'أفضل مكتبة للأنيميشن والتحركات التفاعلية في React.', link: 'https://www.framer.com/motion/' },
    { name: 'Lucide Icons', desc: 'مجموعة أيقونات مرنة وجميلة مفتوحة المصدر.', link: 'https://lucide.dev/' },
    { name: 'Tailwind CSS', desc: 'إطار عمل CSS يركز على الإنتاجية والتصميم السريع.', link: 'https://tailwindcss.com/' },
    { name: 'Google Fonts (Cairo)', desc: 'الخط العربي الرسمي والأكثر احترافية للواجهات.', link: 'https://fonts.google.com/specimen/Cairo' },
    { name: 'Radix UI', desc: 'مكونات واجهة مستخدم غير معقدة (Headless) للوصول العالي.', link: 'https://www.radix-ui.com/' }
];
