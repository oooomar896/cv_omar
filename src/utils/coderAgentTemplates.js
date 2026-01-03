import { PROJECT_TYPES } from '../constants/platformConstants';

export const CODER_AGENT_PROMPTS = {
    SYSTEM_ENGINEER: `
    أنت مهندس برمجيات خبير (Senior Full Stack Engineer).
    مهمتك هي توليد هيكل مجلدات وملفات أساسية لمشروع تقني بناءً على متطلبات المستخدم.
    يجب أن يكون الكود:
    1. نظيفاً (Clean Code) ويتبع المعايير العالمية.
    2. منظماً في مجلدات منطقية (src, components, hooks, api, constants).
    3. يتضمن ملفات إعدادات كاملة (package.json, tailwind.config.js, .env.example).
    4. يحتوي على توثيق (README.md) يوضح طريقة التشغيل.
  `,

    GENERATE_STRUCTURE: (projectData) => `
    قم بإنشاء مشروع ${projectData.type} بالمواصفات التالية:
    - الوصف: ${projectData.description}
    - التقنيات المفضلة: ${projectData.specificAnswers.tech_stack || 'الأحدث والأكثر استقراراً'}
    - ميزات إضافية: ${JSON.stringify(projectData.specificAnswers)}

    المطلوب:
    1. قائمة بجميع الملفات والمجلدات.
    2. محتوى كل ملف أساسي (Main Files).
    3. ملف README احترافي.
  `
};

export const BOILERPLATE_TEMPLATES = {
    [PROJECT_TYPES.WEB]: {
        main: "src/App.js",
        config: "tailwind.config.js",
        dependencies: ["react", "framer-motion", "lucide-react", "tailwindcss"]
    },
    [PROJECT_TYPES.MOBILE]: {
        main: "App.js",
        config: "app.json",
        dependencies: ["expo", "react-native", "lucide-react-native"]
    },
    [PROJECT_TYPES.AI_BOT]: {
        main: "bot.py",
        config: "requirements.txt",
        dependencies: ["python-telegram-bot", "openai", "langchain"]
    }
};
