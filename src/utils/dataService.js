/**
 * Data Service - محرك إدارة البيانات للمنصة
 * يقوم بحفظ واسترجاع المشاريع، المهارات، والأخبار باستخدام localStorage
 * لمحاكاة قاعدة بيانات حقيقية.
 */

const STORAGE_KEYS = {
    PROJECTS: 'omar_projects',
    SKILLS: 'omar_skills',
    NEWS: 'omar_news',
    USERS: 'omar_users',
    GENERATED_PROJECTS: 'omar_gen_projects',
    SETTINGS: 'omar_settings',
    ACTIVITIES: 'omar_activities',
    MESSAGES: 'omar_messages'
};

// البيانات الافتراضية الأولية
const DEFAULT_DATA = {
    PROJECTS: [
        // Mobile Apps
        { id: 'p1', name: 'تطبيق المقايضة - Swap App', category: 'mobile', desc: 'تطبيق مقايضة متقدم مع نظام إدارة ذكي', link: 'https://play.google.com/store/apps/details?id=com.molhimah.swap', image: '/images/projects/swap-app.svg', status: 'published' },
        { id: 'p2', name: 'مزادات لايف - Auction Live', category: 'mobile', desc: 'منصة مزادات مباشرة مع دعم الفيديو', link: 'https://play.google.com/store/apps/details?id=com.mulhmah_auctionlive', image: '/images/projects/auction-live.svg', status: 'published' },
        { id: 'p3', name: 'التطبيق الخيري - Charity App', category: 'mobile', desc: 'تطبيق للتبرعات والمشاريع الخيرية', link: 'https://www.play.google.com/store/apps/details?id=com.charity_show', image: '/images/projects/charity-app.svg', status: 'published' },

        // Web Projects
        { id: 'p4', name: 'منصة نشر الأبحاث العربية - Research Assistant', category: 'web', desc: 'منصة رقمية شاملة لتمكين الباحثين العرب من تقديم أبحاثهم ونشرها عالميًا مع متابعة ولوحة تحكم وإشعارات ذكية', link: 'https://res-assistant.com', image: '/logorest.png', imageClass: 'object-contain bg-white/10 p-6', status: 'published' },
        { id: 'p5', name: 'YourHelp - مساعدك', category: 'web', desc: 'منصة حجز الخدمات والمساعدة عبر الإنترنت', link: 'https://yourhelp.netlify.app/booking', image: '/images/projects/yourhelp.svg', status: 'published' },
        { id: 'p6', name: 'الأخبار الاستثمارية - شركة باكورة', category: 'web', desc: 'منصة استثمارية تبرز أحدث الأخبار والبيانات المالية لشركة باكورة بطريقة تفاعلية وواضحة', link: 'https://investor-bacura.netlify.app/', image: '/images/projects/logob.png', imageClass: 'object-contain bg-white/10 p-6', status: 'published' },
        { id: 'p14', name: 'العروض العقارية - Real Estate Offers', category: 'web', desc: 'منصة العروض العقارية الرائدة في المملكة العربية السعودية مع خريطة تفاعلية', link: 'https://real-estate-offers.netlify.app/', image: '/images/projects/real-estate-offers.svg', status: 'published' },
        { id: 'p15', name: 'كنشار - Kenshar', category: 'web', desc: 'منصة متكاملة لإنشاء وإدارة منصات استشارية مخصصة للشركات', link: 'https://korcher2.netlify.app/', image: '/images/projects/kenshar.svg', status: 'published' },
        { id: 'p16', name: 'الرؤية العقارية', category: 'web', desc: 'منصة للاستشارات العقارية', link: 'https://real-estateconsultations.netlify.app', image: '/images/projects/real-estate.svg', status: 'published' },
        { id: 'p17', name: 'مزادلي - Mzadly.com', category: 'web', desc: 'منصة مزادات إلكترونية متكاملة', link: 'https://mzadlly.netlify.app/', image: '/images/projects/mzadly.svg', status: 'published' },
        { id: 'p18', name: 'ملهمة العقارية - Molhimah.sa', category: 'web', desc: 'موقع عقاري احترافي', link: 'https://molhimah.sa', image: '/images/projects/molhimah.svg', status: 'published' },

        // AI Bots
        { id: 'p7', name: 'بوت المساعد الذكي - AI Assistant', category: 'ai-bots', desc: 'بوت Telegram متطور يعتمد على GPT-4o لتقديم استشارات تقنية وأتمتة المهام', link: 'https://github.com/oooomar896', image: '/images/projects/ai-bot.svg', status: 'published' },
        { id: 'p8', name: 'نظام تحليل البيانات الآلي', category: 'ai-bots', desc: 'AI Agent مخصص لتحويل البيانات الخام إلى تقارير تفاعلية باستخدام LangChain', link: 'https://github.com/oooomar896', image: '/images/projects/ai-agent.svg', status: 'published' },

        // Odoo Modules
        { id: 'p9', name: 'نظام إدارة الأملاك', category: 'odoo', desc: 'إدارة العقارات والعقود والمستأجرين', link: 'https://github.com/oooomar896/module-Real-state', image: '/images/projects/real-estate-module.svg', status: 'published' },
        { id: 'p10', name: 'نظام حجز القاعات', category: 'odoo', desc: 'تقويم وجدولة الاجتماعات', link: 'https://github.com/oooomar896/module-room-bookung', image: '/images/projects/room-booking.svg', status: 'published' },
        { id: 'p19', name: 'نظام الموارد البشرية', category: 'odoo', desc: 'إدارة الموظفين والحضور والإجازات', link: 'https://github.com/oooomar896/mangemen_HR', image: '/images/projects/hr-system.svg', status: 'published' },
        { id: 'p20', name: 'نظام المزادات', category: 'odoo', desc: 'ربط موقع المزادات مع Odoo', link: 'https://github.com/oooomar896/Website_Auction_odoo', image: '/images/projects/auction-system.svg', status: 'published' },

        // Open Source Projects
        { id: 'p11', name: 'تطبيق القهوة (UI/Animation)', category: 'open-source', desc: 'تطبيق قهوة مع واجهة متحركة متقدمة', link: 'https://github.com/oooomar896/coffee_app', image: '/images/projects/coffee-app.svg', status: 'published' },
        { id: 'p12', name: 'متجر الكهرباء', category: 'open-source', desc: 'تطبيق متجر إلكتروني للمعدات الكهربائية', link: 'https://github.com/oooomar896/electrical_store_app', image: '/images/projects/electrical-store.svg', status: 'published' },
        { id: 'p21', name: 'الآلة الحاسبة', category: 'open-source', desc: 'آلة حاسبة متقدمة مع واجهة جميلة', link: 'https://github.com/oooomar896/Calculter', image: '/images/projects/calculator.svg', status: 'published' },
        { id: 'p22', name: 'تطبيق اللاعبين', category: 'open-source', desc: 'تطبيق لإدارة فرق الألعاب', link: 'https://github.com/oooomar896/players', image: '/images/projects/players-app.svg', status: 'published' },
        { id: 'p23', name: 'تطبيق الملاحظات', category: 'open-source', desc: 'تطبيق ملاحظات متقدم مع مزامنة', link: 'https://github.com/oooomar896/note2', image: '/images/projects/notes-app.svg', status: 'published' }
    ],
    SKILLS: [
        { id: 's1', name: 'Flutter', category: 'mobile', level: 95 },
        { id: 's2', name: 'React Native', category: 'mobile', level: 90 },
        { id: 's3', name: 'React.js', category: 'web', level: 88 },
        { id: 's4', name: 'Next.js', category: 'web', level: 82 },
        { id: 's5', name: 'Python', category: 'backend', level: 85 },
        { id: 's6', name: 'OpenAI SDK', category: 'ai', level: 90 },
        { id: 's7', name: 'Odoo', category: 'erp', level: 90 },
        { id: 's8', name: 'UI/UX Design', category: 'design', level: 75 }
    ],
    NEWS: [
        {
            id: 'n1',
            title: 'انضمام إلى شركة باكورة التقنيات',
            content: 'بدأت رحلتي المهنية الجديدة مع شركة باكورة التقنيات (BACURA Tec)، حيث أعمل على تطوير منتجات وخدمات رقمية مبتكرة تدعم المؤسسات في التحول التقني وتعزز حضورها الرقمي. أتطلع لتوظيف خبرتي في بناء تطبيقات متكاملة وتجارب مستخدم عالية الجودة لخدمة عملاء الشركة وشركائها.',
            date: '2025-01-01',
            image: '/images/projects/logob.png',
            link: 'https://bacuratec.sa/'
        },
        {
            id: 'n2',
            title: 'عقارثون 2025 - الفوز ضمن الخمسة الأوائل',
            content: 'سعداء بالإعلان عن فوز فريق ملهمة ضمن الخمس المتأهلين الأكثر إبداعاً وريادة في التكنولوجيا العقارية في المملكة العربية السعودية. هذا الإنجاز يعكس التميز التقني والابتكار في مجال التطوير العقاري.',
            date: '2025-01-15',
            image: '/aqarthon_app.jpg',
            link: 'https://real-estateconsultations.netlify.app',
            certificate: '/Thun property certificate.pdf'
        },
        {
            id: 'n3',
            title: 'إطلاق منصة Research Assistant',
            content: 'تم إطلاق منصة نشر الأبحاث العربية بنجاح، وهي منصة رقمية شاملة تمكن الباحثين العرب من تقديم أبحاثهم ونشرها عالمياً مع نظام متابعة ذكي ولوحة تحكم متقدمة.',
            date: '2024-12-10',
            image: '/logorest.png',
            link: 'https://res-assistant.com'
        },
        {
            id: 'n4',
            title: 'تطوير 4 موديولات Odoo احترافية',
            content: 'نجحت في تطوير وتسليم 4 موديولات متكاملة لنظام Odoo تشمل: إدارة العقارات، حجز القاعات، الموارد البشرية، ونظام المزادات الإلكترونية. هذه الموديولات تخدم عملاء في قطاعات مختلفة وتساهم في تحسين كفاءة العمليات.',
            date: '2024-11-20',
            image: '/images/projects/real-estate-module.svg',
            link: 'https://github.com/oooomar896'
        },
        {
            id: 'n5',
            title: 'وصول تطبيق Swap إلى 10,000 تحميل',
            content: 'تطبيق المقايضة (Swap App) يتجاوز حاجز 10 آلاف تحميل على متجر Google Play مع تقييم 4.5 نجوم، ويستمر في النمو بفضل تجربة المستخدم المتميزة والميزات الفريدة التي يقدمها.',
            date: '2024-10-05',
            image: '/images/projects/swap-app.svg',
            link: 'https://play.google.com/store/apps/details?id=com.molhimah.swap'
        },
        {
            id: 'n6',
            title: 'مشاركة في مؤتمر التقنية السعودي 2024',
            content: 'شاركت كمتحدث في مؤتمر التقنية السعودي حول "مستقبل تطوير التطبيقات باستخدام Flutter والذكاء الاصطناعي"، بحضور أكثر من 500 مطور ومهتم بالتقنية من مختلف أنحاء المملكة.',
            date: '2024-09-15',
            image: '/images/news/conference.svg'
        }
    ],
    SETTINGS: {
        siteName: 'عمر التقني - Portfolio',
        adminEmail: 'oooomar123450@gmail.com',
        enableAIBuilder: true,
        maintenanceMode: false,
        notifications: true,
        saveLocalCopy: true
    }
};

class DataService {
    _get(key, defaultValue) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    }

    _set(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
        // إرسال حدث لتنبيه المكونات الأخرى بالتغيير
        window.dispatchEvent(new Event('storage_update'));
    }

    // Projects
    getProjects() { return this._get(STORAGE_KEYS.PROJECTS, DEFAULT_DATA.PROJECTS); }
    addProject(project) {
        const projects = this.getProjects();
        const newProject = { ...project, id: Date.now(), date: new Date().toISOString().split('T')[0] };
        this._set(STORAGE_KEYS.PROJECTS, [...projects, newProject]);
        this.logActivity('create', `تم إضافة مشروع جديد: ${project.name}`);
        return newProject;
    }
    deleteProject(id) {
        const projects = this.getProjects();
        const project = projects.find(p => p.id === id);
        const filteredProjects = projects.filter(p => p.id !== id);
        this._set(STORAGE_KEYS.PROJECTS, filteredProjects);
        if (project) this.logActivity('delete', `تم حذف مشروع: ${project.name}`);
    }
    updateProject(id, updatedData) {
        const projects = this.getProjects().map(p =>
            p.id === id ? { ...p, ...updatedData } : p
        );
        this._set(STORAGE_KEYS.PROJECTS, projects);
        this.logActivity('update', `تم تحديث بيانات مشروع: ${updatedData.name}`);
    }

    // Skills
    getSkills() {
        const skills = this._get(STORAGE_KEYS.SKILLS, DEFAULT_DATA.SKILLS);
        // تصحيح البيانات القديمة إذا كانت المستويات نصية
        const levelMap = { 'Expert': 95, 'Professional': 85, 'Advanced': 75, 'Intermediate': 60 };
        return skills.map(s => ({
            ...s,
            level: typeof s.level === 'string' ? (levelMap[s.level] || 75) : s.level
        }));
    }
    addSkill(skill) {
        const skills = this.getSkills();
        const newSkill = { ...skill, id: Date.now() };
        this._set(STORAGE_KEYS.SKILLS, [...skills, newSkill]);
        this.logActivity('create', `تم إضافة مهارة جديدة: ${skill.name}`);
        return newSkill;
    }
    deleteSkill(id) {
        const skills = this.getSkills();
        const skill = skills.find(s => s.id === id);
        const filteredSkills = skills.filter(s => s.id !== id);
        this._set(STORAGE_KEYS.SKILLS, filteredSkills);
        if (skill) this.logActivity('delete', `تم حذف مهارة: ${skill.name}`);
    }
    updateSkill(id, updatedData) {
        const skills = this.getSkills().map(s =>
            s.id === id ? { ...s, ...updatedData } : s
        );
        this._set(STORAGE_KEYS.SKILLS, skills);
        this.logActivity('update', `تم تحديث مهارة: ${updatedData.name}`);
    }

    // News
    getNews() { return this._get(STORAGE_KEYS.NEWS, DEFAULT_DATA.NEWS); }
    addNews(item) {
        const news = this.getNews();
        const newItem = { ...item, id: Date.now(), date: new Date().toISOString().split('T')[0] };
        this._set(STORAGE_KEYS.NEWS, [...news, newItem]);
        this.logActivity('create', `تم نشر خبر جديد: ${item.title}`);
        return newItem;
    }
    deleteNews(id) {
        const news = this.getNews();
        const item = news.find(n => n.id === id);
        const filteredNews = news.filter(n => n.id !== id);
        this._set(STORAGE_KEYS.NEWS, filteredNews);
        if (item) this.logActivity('delete', `تم حذف خبر: ${item.title}`);
    }
    updateNews(id, updatedData) {
        const news = this.getNews().map(n =>
            n.id === id ? { ...n, ...updatedData } : n
        );
        this._set(STORAGE_KEYS.NEWS, news);
        this.logActivity('update', `تم تحديث خبر: ${updatedData.title}`);
    }

    // Users & Leads
    getUsers() { return this._get(STORAGE_KEYS.USERS, []); }
    addUser(user) {
        const users = this.getUsers();
        const newUser = {
            ...user,
            id: Date.now(),
            date: new Date().toISOString().split('T')[0]
        };
        this._set(STORAGE_KEYS.USERS, [...users, newUser]);
        this.logActivity('create', `تسجيل مستخدم جديد: ${user.name}`);
        return newUser;
    }
    deleteUser(id) {
        const users = this.getUsers();
        const user = users.find(u => u.id === id);
        const filteredUsers = users.filter(u => u.id !== id);
        this._set(STORAGE_KEYS.USERS, filteredUsers);
        if (user) this.logActivity('delete', `تم حذف المستخدم: ${user.name}`);
    }

    // Generated Projects (AI Projects)
    getGeneratedProjects() { return this._get(STORAGE_KEYS.GENERATED_PROJECTS, []); }
    saveGeneratedProject(projectId, data) {
        const projects = this.getGeneratedProjects();
        const newProject = {
            ...data,
            id: projectId,
            timestamp: new Date().toISOString()
        };
        this._set(STORAGE_KEYS.GENERATED_PROJECTS, [...projects, newProject]);
        return newProject;
    }

    // Settings
    getSettings() { return this._get(STORAGE_KEYS.SETTINGS, DEFAULT_DATA.SETTINGS); }
    saveSettings(settings) {
        this._set(STORAGE_KEYS.SETTINGS, settings);
        this.logActivity('update', 'تم تحديث إعدادات النظام');
    }

    // Activity Log System
    getActivities() {
        return this._get(STORAGE_KEYS.ACTIVITIES, []);
    }

    logActivity(type, message) {
        const activities = this.getActivities();
        const newActivity = {
            id: Date.now(),
            type, // 'create', 'update', 'delete', 'system'
            message,
            timestamp: new Date().toISOString()
        };
        // Keep only last 50 activities
        const updatedActivities = [newActivity, ...activities].slice(0, 50);
        this._set(STORAGE_KEYS.ACTIVITIES, updatedActivities);
    }

    // Messages (Contact Form)
    getMessages() { return this._get(STORAGE_KEYS.MESSAGES, []); }
    addMessage(msg) {
        const messages = this.getMessages();
        const newMessage = {
            ...msg,
            id: Date.now(),
            date: new Date().toISOString(),
            read: false
        };
        this._set(STORAGE_KEYS.MESSAGES, [...messages, newMessage]);
        this.logActivity('create', `رسالة جديدة من: ${msg.email}`);
        return newMessage;
    }
    deleteMessage(id) {
        const messages = this.getMessages();
        const filtered = messages.filter(m => m.id !== id);
        this._set(STORAGE_KEYS.MESSAGES, filtered);
        this.logActivity('delete', 'تم حذف رسالة');
    }
    markMessageRead(id) {
        const messages = this.getMessages().map(m =>
            m.id === id ? { ...m, read: true } : m
        );
        this._set(STORAGE_KEYS.MESSAGES, messages);
    }

    // Utility
    resetToDefaults() {
        Object.keys(STORAGE_KEYS).forEach(k => {
            if (DEFAULT_DATA[k]) {
                this._set(STORAGE_KEYS[k], DEFAULT_DATA[k]);
            }
        });
        window.location.reload();
    }
}

export const dataService = new DataService();
