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
    { id: 'assets', title: 'الهوية والملفات' },
    { id: 'review', title: 'المراجعة والبدء' },
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

export const COUNTRY_CODES = [
    { code: '+966', country: 'SA', label: 'السعودية (+966)', flag: '🇸🇦' },
    { code: '+20', country: 'EG', label: 'مصر (+20)', flag: '🇪🇬' },
    { code: '+971', country: 'AE', label: 'الإمارات (+971)', flag: '🇦🇪' },
    { code: '+965', country: 'KW', label: 'الكويت (+965)', flag: '🇰🇼' },
    { code: '+974', country: 'QA', label: 'قطر (+974)', flag: '🇶🇦' },
    { code: '+973', country: 'BH', label: 'البحرين (+973)', flag: '🇧🇭' },
    { code: '+968', country: 'OM', label: 'عمان (+968)', flag: '🇴🇲' },
    { code: '+962', country: 'JO', label: 'الأردن (+962)', flag: '🇯🇴' },
    { code: '+961', country: 'LB', label: 'لبنان (+961)', flag: '🇱🇧' },
    { code: '+964', country: 'IQ', label: 'العراق (+964)', flag: '🇮🇶' },
    { code: '+967', country: 'YE', label: 'اليمن (+967)', flag: '🇾🇪' },
    { code: '+970', country: 'PS', label: 'فلسطين (+970)', flag: '🇵🇸' },
    { code: '+212', country: 'MA', label: 'المغرب (+212)', flag: '🇲🇦' },
    { code: '+213', country: 'DZ', label: 'الجزائر (+213)', flag: '🇩🇿' },
    { code: '+216', country: 'TN', label: 'تونس (+216)', flag: '🇹🇳' },
    { code: '+218', country: 'LY', label: 'ليبيا (+218)', flag: '🇱🇾' },
    { code: '+249', country: 'SD', label: 'السودان (+249)', flag: '🇸🇩' },
];
