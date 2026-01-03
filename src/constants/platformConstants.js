export const PROJECT_TYPES = {
    WEB: 'web',
    MOBILE: 'mobile',
    AI_BOT: 'ai-bot',
};

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
