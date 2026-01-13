import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // 1. CORS Handle
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // 2. Auth Check
        const supabaseClient = createClient(
            // @ts-ignore
            Deno.env.get('SUPABASE_URL') ?? '',
            // @ts-ignore
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
        if (authError || !user) throw new Error('Unauthorized AI Access');

        // 3. Parse Request
        const { type, description, specificAnswers, agent } = await req.json()

        // 4. AI Logic (Mocking LLM capabilities based on inputs)
        // In a real scenario, this would call OpenAI API:
        // const completion = await openai.createCompletion({ ... })

        const projectPlan = generateSmartPlan(type, description, specificAnswers);

        // Simulate AI Thinking Latency (2-3 seconds)
        await new Promise(r => setTimeout(r, 2500));

        return new Response(
            JSON.stringify(projectPlan),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200
            }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 400
            }
        )
    }
})

// Helper function to simulate AI logic
function generateSmartPlan(type: string, description: string, answers: any) {
    const isECommerce = description.includes('متجر') || description.includes('بيع') || answers['products_count'];
    const isSaaS = description.includes('منصة') || description.includes('اشتراك');

    let features = [];
    let techStack = [];
    let basePrice = 5000;

    // --- Logic for WEB ---
    if (type === 'web') {
        techStack = ['React.js', 'Next.js', 'TailwindCSS', 'Supabase'];
        if (isECommerce) {
            features = [
                'نظام إدارة المنتجات والمخزون',
                'سلة تسوق متقدمة ودفع إلكتروني',
                'لوحة تحكم للمبيعات والتقارير',
                'نظام تسجيل دخول العملاء'
            ];
            basePrice = 12000;
        } else {
            features = [
                'صفحة هبوط تعريفية احترافية',
                'نموذج تواصل وجمع بيانات',
                'لوحة تحكم للمحتوى (CMS)',
                'تصميم متجاوب مع جميع الشاشات'
            ];
            basePrice = 5000;
        }
    }
    // --- Logic for MOBILE ---
    else if (type === 'mobile') {
        techStack = ['Flutter', 'Firebase', 'Google Maps API'];
        features = [
            'تطبيق iOS و Android (Cross-platform)',
            'نظام إشعارات فورية (Push Notifications)',
            'واجهة مستخدم حديثة (Modern UI)',
            'تكامل مع خدمات الموقع الجغرافي'
        ];
        basePrice = 15000;
    }
    // --- Logic for AI BOT ---
    else {
        techStack = ['Python', 'OpenAI API', 'LangChain', 'FastAPI'];
        features = [
            'بوت دردشة ذكي مدعوم بـ GPT-4',
            'واجهة محادثة تشبه ChatGPT',
            'إمكانية تدريب البوت على بيانات خاصة',
            'تكامل مع الواتساب (اختياري)'
        ];
        basePrice = 10000;
    }

    // Add extra features from answers
    if (answers['users_system']) features.push('نظام صلاحيات مستخدمين متعدد الأدوار');
    if (answers['payment_integration']) {
        features.push('رابط بوابة دفع (Moyasar/Stripe)');
        basePrice += 2000;
    }

    return {
        projectName: extractProjectName(description) || 'مشروع جديد',
        summary: `بناءً على تحليلي لطلبك، سنقوم ببناء ${type === 'web' ? 'منصة ويب' : 'تطبيق'} متكامل يركز على ${isECommerce ? 'تجربة البيع السلسة' : 'تجربة المستخدم'}.`,
        features: features,
        techStack: techStack,
        phases: [
            { name: 'تصميم الواجهات (UI/UX)', duration: '2 أسابيع' },
            { name: 'تطوير النظام (Development)', duration: '4 أسابيع' },
            { name: 'الاختبار والإطلاق (QA & Launch)', duration: '1 أسبوع' }
        ],
        estimatedCost: {
            min: basePrice,
            max: basePrice * 1.3,
            currency: 'SAR'
        },
        files: generateMockFileStructure(type) // Returning generated file structure for the viewer
    };
}

function extractProjectName(desc: string) {
    // Simple heuristic to find a name if mentioned
    const words = desc.split(' ');
    if (words.length > 0 && words.length < 5) return desc;
    return null;
}

function generateMockFileStructure(type: string) {
    if (type === 'web') {
        return [
            {
                name: 'src', type: 'folder', children: [
                    {
                        name: 'components', type: 'folder', children: [
                            { name: 'Header.jsx', type: 'file', content: '// Header Component' },
                            { name: 'Hero.jsx', type: 'file', content: '// Hero Section' }
                        ]
                    },
                    {
                        name: 'pages', type: 'folder', children: [
                            { name: 'index.js', type: 'file', content: '// Home Page' },
                            { name: 'about.js', type: 'file', content: '// About Page' }
                        ]
                    },
                    {
                        name: 'utils', type: 'folder', children: [
                            { name: 'api.js', type: 'file', content: '// API Handler' }
                        ]
                    }
                ]
            },
            { name: 'package.json', type: 'file', content: '{ "name": "project" }' },
            { name: 'README.md', type: 'file', content: '# Project Documentation' }
        ];
    }
    return [
        {
            name: 'lib', type: 'folder', children: [
                { name: 'main.dart', type: 'file', content: '// Main Entry' },
                { name: 'screens', type: 'folder', children: [] }
            ]
        },
        { name: 'pubspec.yaml', type: 'file', content: 'name: flutter_app' }
    ];
}
