/**
 * Data Service - محرك إدارة البيانات للمنصة
 * يقوم بحفظ واسترجاع المشاريع، المهارات، والأخبار باستخدام localStorage
 * لمحاكاة قاعدة بيانات حقيقية.
 */

import { supabase } from './supabaseClient';

const STORAGE_KEYS = {
    PROJECTS: 'omar_projects',
    SKILLS: 'omar_skills',
    NEWS: 'omar_news',
    USERS: 'omar_users',
    GENERATED_PROJECTS: 'omar_gen_projects',
    SETTINGS: 'omar_settings',
    ACTIVITIES: 'omar_activities',
    MESSAGES: 'omar_messages',
    NOTIFICATIONS: 'omar_notifications'
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
            title: 'شركة باكورة التقنية (bacura.sa)',
            content: 'مدير تنفيذي بالبرمجيات - قيادة الفرق التقنية وتطوير الحلول البرمجية المبتكرة للمؤسسات والشركات، مع التركيز على الكفاءة والابتكار الرقمي.',
            date: '2025-01-01',
            image: '/images/projects/logob.png',
            link: 'https://bacuratec.sa/'
        },
        {
            id: 'n8',
            title: 'شركة TPS (tps-ksa.com)',
            content: 'مدير تنفيذي بالبرمجيات - الإشراف على المشاريع البرمجية الكبرى وتطوير الاستراتيجيات التقنية لضمان تقديم أفضل الحلول للعملاء.',
            date: '2025-01-01',
            image: '/images/projects/tps.png',
            link: 'https://tps-ksa.com/'
        },
        {
            id: 'n9',
            title: 'شركة ملهمة العقارية (mulhimah.sa)',
            content: 'مطور برمجيات تطبيقات ومنصات وأنظمة مؤسسة - بناء وتطوير المنصات العقارية المتقدمة والأنظمة المؤسسية التي تخدم قطاع العقارات في المملكة.',
            date: '2023-01-01',
            image: '/images/projects/molhimah.svg',
            link: 'https://mulhimah.sa'
        },
        {
            id: 'n10',
            title: 'شركة تركية للاستثمار',
            content: 'مطور تطبيقات استثمارية - تطوير حلول برمجية متخصصة في قطاع الاستثمار والتجارة، مع التركيز على دقة البيانات وتجربة المستخدم.',
            date: '2020-01-01',
            image: '/images/projects/investment.svg',
            link: '#'
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
            id: 'n7',
            title: 'شهادة البرمجة والتطوير - Maldia Global',
            content: 'الحصول على شهادة R&D Certificate من شركة Maldia Global International Technology كمطور Flutter بعد إتمام المهام البرمجية والوحدات المطلوبة بنجاح وتسليمها.',
            date: '2022-06-15',
            image: '/images/cert/maldia_cert.jpeg',
            fallbackIcon: 'Award',
            link: '#'
        }
    ],
    SETTINGS: {
        siteName: 'عمر التقني - Portfolio',
        adminEmail: '',
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
    // Projects (Supabase Integrated)
    getProjects() { return this._get(STORAGE_KEYS.PROJECTS, DEFAULT_DATA.PROJECTS); }

    async fetchProjects() {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Normalize
            const projects = data.map(p => ({
                ...p,
                id: p.id,
                date: p.created_at,
                // Ensure image field consistency if needed
                image: p.image_url || p.image || '/placeholder.png'
            }));

            // Only update if we got data, otherwise keep defaults/local
            if (projects.length > 0) {
                this._set(STORAGE_KEYS.PROJECTS, projects);
            }
            return projects;
        } catch (error) {
            console.error('Error fetching projects:', error);
            return this.getProjects();
        }
    }

    async addProject(project) {
        try {
            const { data, error } = await supabase
                .from('projects')
                .insert([{
                    name: project.name,
                    category: project.category,
                    description: project.desc || project.description,
                    link: project.link,
                    image_url: project.image,
                    status: 'published'
                }])
                .select()
                .single();

            if (error) throw error;

            const newProject = {
                ...data,
                id: data.id,
                date: data.created_at,
                image: data.image_url,
                desc: data.description
            };

            const projects = this.getProjects();
            this._set(STORAGE_KEYS.PROJECTS, [newProject, ...projects]);
            this.logActivity('create', `تم إضافة مشروع جديد: ${project.name}`);
            return newProject;
        } catch (error) {
            console.error('Error adding project:', error);
            // Fallback
            const newProject = { ...project, id: Date.now(), date: new Date().toISOString().split('T')[0] };
            const projects = this.getProjects();
            this._set(STORAGE_KEYS.PROJECTS, [...projects, newProject]);
            return newProject;
        }
    }

    async deleteProject(id) {
        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id);

            if (error) throw error;

            const projects = this.getProjects();
            const project = projects.find(p => p.id === id);
            const filteredProjects = projects.filter(p => p.id !== id);
            this._set(STORAGE_KEYS.PROJECTS, filteredProjects);
            if (project) this.logActivity('delete', `تم حذف مشروع: ${project.name}`);
        } catch (error) {
            console.error('Error deleting project:', error);
            // Fallback
            const projects = this.getProjects();
            const filteredProjects = projects.filter(p => p.id !== id);
            this._set(STORAGE_KEYS.PROJECTS, filteredProjects);
        }
    }

    async updateProject(id, updatedData) {
        try {
            const { error } = await supabase
                .from('projects')
                .update({
                    name: updatedData.name,
                    category: updatedData.category,
                    description: updatedData.desc || updatedData.description,
                    link: updatedData.link,
                    image_url: updatedData.image
                })
                .eq('id', id);

            if (error) throw error;

            const projects = this.getProjects().map(p =>
                p.id === id ? { ...p, ...updatedData } : p
            );
            this._set(STORAGE_KEYS.PROJECTS, projects);
            this.logActivity('update', `تم تحديث بيانات مشروع: ${updatedData.name}`);
        } catch (error) {
            console.error('Error updating project:', error);
            // Fallback
            const projects = this.getProjects().map(p =>
                p.id === id ? { ...p, ...updatedData } : p
            );
            this._set(STORAGE_KEYS.PROJECTS, projects);
        }
    }

    // Skills
    // Skills (Supabase Integrated)
    getSkills() { return this._get(STORAGE_KEYS.SKILLS, DEFAULT_DATA.SKILLS); }

    async fetchSkills() {
        try {
            const { data, error } = await supabase.from('skills').select('*').order('level', { ascending: false });
            if (error) throw error;
            if (data.length > 0) this._set(STORAGE_KEYS.SKILLS, data);
            return data;
        } catch (err) {
            console.error(err);
            return this.getSkills();
        }
    }

    async addSkill(skill) {
        try {
            const { data, error } = await supabase.from('skills').insert([skill]).select().single();
            if (error) throw error;
            const skills = this.getSkills();
            this._set(STORAGE_KEYS.SKILLS, [...skills, data]);
            this.logActivity('create', `تم إضافة مهارة جديدة: ${skill.name}`);
            return data;
        } catch (err) {
            console.error(err);
            // Fallback
            const newSkill = { ...skill, id: Date.now() };
            const skills = this.getSkills();
            this._set(STORAGE_KEYS.SKILLS, [...skills, newSkill]);
            return newSkill;
        }
    }

    async deleteSkill(id) {
        try {
            await supabase.from('skills').delete().eq('id', id);
            const skills = this.getSkills().filter(s => s.id !== id);
            this._set(STORAGE_KEYS.SKILLS, skills);
        } catch (err) {
            console.error(err);
            const skills = this.getSkills().filter(s => s.id !== id);
            this._set(STORAGE_KEYS.SKILLS, skills);
        }
    }

    async updateSkill(id, updatedData) {
        try {
            await supabase.from('skills').update(updatedData).eq('id', id);
            const skills = this.getSkills().map(s => s.id === id ? { ...s, ...updatedData } : s);
            this._set(STORAGE_KEYS.SKILLS, skills);
        } catch (err) {
            console.error(err);
            const skills = this.getSkills().map(s => s.id === id ? { ...s, ...updatedData } : s);
            this._set(STORAGE_KEYS.SKILLS, skills);
        }
    }

    // News
    // News (Supabase Integrated)
    getNews() { return this._get(STORAGE_KEYS.NEWS, DEFAULT_DATA.NEWS); }

    async fetchNews() {
        try {
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;

            // Normalize
            const news = data.map(n => ({
                ...n,
                id: n.id,
                // Ensure image field consistency
                image: n.image_url || n.image || '/placeholder.png'
            }));

            if (news.length > 0) {
                this._set(STORAGE_KEYS.NEWS, news);
            }
            return news;
        } catch (error) {
            console.error('Error fetching news:', error);
            return this.getNews();
        }
    }

    async addNews(item) {
        try {
            const { data, error } = await supabase
                .from('news')
                .insert([{
                    title: item.title,
                    content: item.content,
                    image_url: item.image,
                    link: item.link,
                    date: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;

            const newItem = {
                ...data,
                id: data.id,
                image: data.image_url
            };

            const news = this.getNews();
            this._set(STORAGE_KEYS.NEWS, [newItem, ...news]);
            this.logActivity('create', `تم نشر خبر جديد: ${item.title}`);
            return newItem;
        } catch (error) {
            console.error('Error adding news:', error);
            // Fallback
            const newItem = { ...item, id: Date.now(), date: new Date().toISOString().split('T')[0] };
            const news = this.getNews();
            this._set(STORAGE_KEYS.NEWS, [...news, newItem]);
            return newItem;
        }
    }

    async deleteNews(id) {
        try {
            const { error } = await supabase
                .from('news')
                .delete()
                .eq('id', id);

            if (error) throw error;

            const news = this.getNews();
            const item = news.find(n => n.id === id);
            const filteredNews = news.filter(n => n.id !== id);
            this._set(STORAGE_KEYS.NEWS, filteredNews);
            if (item) this.logActivity('delete', `تم حذف خبر: ${item.title}`);
        } catch (error) {
            console.error('Error deleting news:', error);
            // Fallback
            const news = this.getNews();
            const filteredNews = news.filter(n => n.id !== id);
            this._set(STORAGE_KEYS.NEWS, filteredNews);
        }
    }

    async updateNews(id, updatedData) {
        try {
            const { error } = await supabase
                .from('news')
                .update({
                    title: updatedData.title,
                    content: updatedData.content,
                    image_url: updatedData.image,
                    link: updatedData.link,
                    date: updatedData.date
                })
                .eq('id', id);

            if (error) throw error;

            const news = this.getNews().map(n =>
                n.id === id ? { ...n, ...updatedData } : n
            );
            this._set(STORAGE_KEYS.NEWS, news);
            this.logActivity('update', `تم تحديث خبر: ${updatedData.title}`);
        } catch (error) {
            console.error('Error updating news:', error);
            // Fallback
            const news = this.getNews().map(n =>
                n.id === id ? { ...n, ...updatedData } : n
            );
            this._set(STORAGE_KEYS.NEWS, news);
        }
    }

    // Users & Leads
    // Users & Leads (Supabase Integrated)
    getUsers() { return this._get(STORAGE_KEYS.USERS, []); }

    async fetchUsers() {
        try {
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Normalize
            const users = data.map(u => ({
                ...u,
                id: u.id,
                date: u.created_at,
                // Ensure array for generated_projects
                // Note: generated_project in DB vs local might differ structure slightly, normalize if needed
            }));

            if (users.length > 0) {
                this._set(STORAGE_KEYS.USERS, users);
            }
            return users;
        } catch (error) {
            console.error('Error fetching users:', error);
            return this.getUsers();
        }
    }

    async addUser(user) {
        try {
            // Check if user exists (by email) - optional but good logic
            // For now, simple insert
            const { data, error } = await supabase
                .from('leads')
                .upsert([{
                    name: user.name,
                    email: user.email,
                    role: user.role || 'user',
                    generated_projects: []
                }], { onConflict: 'email' })
                .select()
                .single();

            if (error) throw error;

            const newUser = {
                ...data,
                id: data.id,
                date: data.created_at
            };

            const users = this.getUsers();
            this._set(STORAGE_KEYS.USERS, [...users, newUser]);
            this.logActivity('create', `تسجيل مستخدم جديد: ${user.name}`);
            return newUser;
        } catch (error) {
            console.error('Error adding user:', error);
            // Fallback
            const newUser = {
                ...user,
                id: Date.now(),
                date: new Date().toISOString().split('T')[0]
            };
            const users = this.getUsers();
            this._set(STORAGE_KEYS.USERS, [...users, newUser]);
            return newUser;
        }
    }

    async deleteUser(id) {
        try {
            const { error } = await supabase
                .from('leads')
                .delete()
                .eq('id', id);

            if (error) throw error;

            const users = this.getUsers();
            const user = users.find(u => u.id === id);
            const filteredUsers = users.filter(u => u.id !== id);
            this._set(STORAGE_KEYS.USERS, filteredUsers);
            if (user) this.logActivity('delete', `تم حذف المستخدم: ${user.name}`);
        } catch (error) {
            console.error('Error deleting user:', error);
            // Fallback
            const users = this.getUsers();
            const filteredUsers = users.filter(u => u.id !== id);
            this._set(STORAGE_KEYS.USERS, filteredUsers);
        }
    }

    // Auth
    async loginAdmin(email, password) {
        // FAIL-SAFE: Hardcoded check to ensure access if DB connection fails
        // This allows the admin to log in even if Supabase/Network has issues
        if (email.trim() === 'oooomar896@gmail.com' && password.trim() === 'Omar@2597798') {
            console.log('Using fail-safe admin login');
            return {
                id: 'master_admin',
                email: email,
                role: 'super_admin'
            };
        }

        // Secure login via Supabase
        try {
            // First check if user exists with this email
            const { data: user, error } = await supabase
                .from('admins')
                .select('*')
                .eq('email', email)
                .maybeSingle();

            if (error) {
                console.error('Database error checking admin:', error);
                throw error;
            }

            if (!user) {
                console.warn('Admin login failed: Email not found in DB');
                return null;
            }

            // Compare password (Trim both to avoid whitespace issues)
            if (user.password && user.password.trim() === password.trim()) {
                return user;
            } else {
                console.warn('Admin login failed: Password mismatch for', email);
                return null;
            }
        } catch (error) {
            console.error('Login error details:', error);
            throw error;
        }
    }

    // Generated Projects (AI Projects)
    // Generated Projects (Supabase Integrated)
    getGeneratedProjects() { return this._get(STORAGE_KEYS.GENERATED_PROJECTS, []); }

    async fetchGeneratedProjects() {
        try {
            const { data, error } = await supabase.from('generated_projects').select('*').order('created_at', { ascending: false });
            if (error) throw error;

            // Merge with local to preserve projects that failed to sync
            const local = this.getGeneratedProjects();
            const mergedMap = new Map();
            local.forEach(p => mergedMap.set(p.id, p));
            data.forEach(p => mergedMap.set(p.id, this._normalizeProjectData(p)));

            const merged = Array.from(mergedMap.values());
            this._set(STORAGE_KEYS.GENERATED_PROJECTS, merged);
            return merged;
        } catch (err) {
            console.error('Fetch error:', err);
            return this.getGeneratedProjects();
        }
    }

    _normalizeProjectData(p) {
        return {
            ...p,
            userEmail: p.user_email,
            projectName: p.project_name,
            projectType: p.project_type,
            projectStage: p.project_stage,
            specificAnswers: p.specific_answers || p.specificAnswers || {},
            analysis: p.analysis || {},
            userName: p.user_name || p.userName || '',
            userPhone: p.user_phone || p.userPhone || '',
            files: p.files || {},
            timestamp: p.created_at || p.timestamp
        };
    }

    async fetchUserProjects(email) {
        if (!email) return [];
        const cleanEmail = email.toLowerCase().trim();

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const userId = session?.user?.id;

            const query = supabase.from('generated_projects').select('*');
            if (userId) {
                query.or(`user_email.ilike.${cleanEmail},user_id.eq.${userId}`);
            } else {
                query.ilike('user_email', cleanEmail);
            }

            const { data: dbData, error } = await query.order('created_at', { ascending: false });
            if (error) console.warn('Supabase fetch failed, falling back to local:', error);

            // Fetch from LocalStorage
            const localProjects = this.getGeneratedProjects().filter(p =>
                p.user_email?.toLowerCase() === cleanEmail ||
                p.userEmail?.toLowerCase() === cleanEmail ||
                p.email?.toLowerCase() === cleanEmail
            );

            // Merge and Normalize
            const mergedMap = new Map();

            // Add local ones first
            localProjects.forEach(p => mergedMap.set(p.id || p.projectName, this._normalizeProjectData(p)));

            // Add DB ones (overwrite local if same ID)
            (dbData || []).forEach(p => mergedMap.set(p.id, this._normalizeProjectData(p)));

            const final = Array.from(mergedMap.values()).sort((a, b) =>
                new Date(b.timestamp || b.created_at) - new Date(a.timestamp || a.created_at)
            );

            // Sync local storage state for this user's view
            this._set(STORAGE_KEYS.GENERATED_PROJECTS, final);

            return final;
        } catch (err) {
            console.error('Error fetching user projects:', err);
            return this.getGeneratedProjects().filter(p =>
                p.userEmail?.toLowerCase() === cleanEmail || p.email?.toLowerCase() === cleanEmail
            );
        }
    }

    async getProjectById(id) {
        try {
            // Priority 1: Supabase
            const { data } = await supabase
                .from('generated_projects')
                .select('*, contracts (*)')
                .eq('id', id)
                .maybeSingle();

            if (data) return this._normalizeProjectData(data);

            // Priority 2: LocalStorage
            const local = this.getGeneratedProjects().find(p => p.id === id);
            if (local) return this._normalizeProjectData(local);

            return null;
        } catch (err) {
            const local = this.getGeneratedProjects().find(p => p.id === id);
            return local ? this._normalizeProjectData(local) : null;
        }
    }

    async saveGeneratedProject(projectId, data) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const userId = session?.user?.id;
            const cleanEmail = (data.user_email || data.userEmail || data.email)?.toLowerCase()?.trim();

            const projectData = {
                user_email: cleanEmail,
                user_name: data.userName || data.user_name || null,
                user_phone: data.userPhone || data.user_phone || data.phone || null,
                project_name: data.project_name || data.projectName || data.title || 'مشروع جديد',
                project_type: data.project_type || data.projectType || 'web',
                features: data.features || [],
                description: data.description || '',
                specific_answers: data.specificAnswers || data.specific_answers || {},
                analysis: data.analysis || {},
                status: data.status || 'pending',
                files: data.files || {},
                project_stage: data.project_stage || data.projectStage || 'analysis',
                github_url: data.github_url || null
            };

            if (userId) projectData.user_id = userId;

            const { data: savedData, error } = await supabase.from('generated_projects').insert([projectData]).select().single();
            if (error) throw error;

            return this._normalizeProject(savedData, data);
        } catch (err) {
            console.error('Error saving generated project:', err);

            // Deduplicated fallback to localStorage
            const projects = this.getGeneratedProjects().filter(p => p.id !== projectId);
            const newProject = this._normalizeProjectData({
                ...data,
                id: projectId,
                created_at: new Date().toISOString()
            });

            this._set(STORAGE_KEYS.GENERATED_PROJECTS, [...projects, newProject]);
            return newProject;
        }
    }

    // Draft System
    saveProjectDraft(draftId, draftData) {
        const drafts = this._get('project_drafts', {});
        drafts[draftId] = {
            ...draftData,
            updatedAt: new Date().toISOString()
        };
        this._set('project_drafts', drafts);
        return true;
    }

    getProjectDraft(draftId) {
        const drafts = this._get('project_drafts', {});
        return drafts[draftId] || null;
    }

    clearProjectDraft(draftId) {
        const drafts = this._get('project_drafts', {});
        delete drafts[draftId];
        this._set('project_drafts', drafts);
    }

    _normalizeProject(savedData) {
        const normalized = this._normalizeProjectData(savedData);

        // Update local storage to reflect the DB record immediately
        const projects = this.getGeneratedProjects().filter(p => p.id !== savedData.id);
        this._set(STORAGE_KEYS.GENERATED_PROJECTS, [...projects, normalized]);

        return normalized;
    }

    // Chat System
    async fetchProjectMessages(projectId) {
        try {
            const { data, error } = await supabase
                .from('project_messages')
                .select('*')
                .eq('project_id', projectId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching chat:', error);
            return [];
        }
    }

    async sendProjectMessage(messageData) {
        try {
            const payload = {
                project_id: messageData.project_id,
                sender_email: messageData.sender_email,
                sender_role: messageData.sender_role,
                text: messageData.text
            };

            const { data, error } = await supabase
                .from('project_messages')
                .insert([payload])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    async updateGeneratedProject(id, updates) {
        try {
            const { data, error } = await supabase
                .from('generated_projects')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            const projects = this.getGeneratedProjects().map(p =>
                p.id === id ? { ...p, ...data } : p
            );
            this._set(STORAGE_KEYS.GENERATED_PROJECTS, projects);

            if (updates.project_stage) {
                this.logActivity('update', `تم تحديث مرحلة المشروع #${id} إلى ${updates.project_stage}`);
            }

            return data;
        } catch (error) {
            console.error('Error updating generated project:', error);
            throw error;
        }
    }

    async addProjectFile(projectId, fileData) {
        try {
            const { data: project, error: fetchError } = await supabase
                .from('generated_projects')
                .select('files')
                .eq('id', projectId)
                .single();

            if (fetchError) throw fetchError;

            const existingFiles = project.files || [];
            const newFiles = [...existingFiles, {
                ...fileData,
                id: Math.random().toString(36).substr(2, 9),
                uploaded_at: new Date().toISOString()
            }];

            const { data, error } = await supabase
                .from('generated_projects')
                .update({ files: newFiles })
                .eq('id', projectId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error adding project file:', error);
            throw error;
        }
    }

    // Settings (Supabase Integrated)
    getSettings() { return this._get(STORAGE_KEYS.SETTINGS, DEFAULT_DATA.SETTINGS); }

    async fetchSettings() {
        try {
            const { data, error } = await supabase.from('settings').select('*').single();
            if (error) throw error;
            if (data) {
                const normalized = {
                    siteName: data.site_name,
                    adminEmail: data.admin_email,
                    enableAIBuilder: data.enable_ai_builder,
                    maintenanceMode: data.maintenance_mode,
                    notifications: data.notifications_enabled,
                    saveLocalCopy: true,
                    id: data.id
                };
                this._set(STORAGE_KEYS.SETTINGS, normalized);
                return normalized;
            }
        } catch (err) {
            console.error(err);
        }
        return this.getSettings();
    }

    async saveSettings(settings) {
        try {
            // Upsert handled by logic or explicit ID
            const dbSettings = {
                site_name: settings.siteName,
                admin_email: settings.adminEmail,
                enable_ai_builder: settings.enableAIBuilder,
                maintenance_mode: settings.maintenanceMode,
                notifications_enabled: settings.notifications
                // id: settings.id // if updating
            };

            // Check if exists first to decide update vs insert (or assume single row id=1)
            const { data: existing } = await supabase.from('settings').select('id').limit(1).single();

            if (existing) {
                await supabase.from('settings').update(dbSettings).eq('id', existing.id);
            } else {
                await supabase.from('settings').insert([dbSettings]);
            }

            this._set(STORAGE_KEYS.SETTINGS, settings);
            this.logActivity('update', 'تم تحديث إعدادات النظام');
        } catch (err) {
            console.error('Error saving settings:', err);
            // Fallback
            this._set(STORAGE_KEYS.SETTINGS, settings);
        }
    }

    // Activity Log System (Supabase Integrated)
    getActivities() {
        return this._get(STORAGE_KEYS.ACTIVITIES, []);
    }

    async fetchActivities() {
        try {
            const { data, error } = await supabase.from('activities').select('*').order('created_at', { ascending: false }).limit(50);
            if (error) throw error;

            // Normalize if needed, or mostly same structure
            const activities = data.map(a => ({
                id: a.id,
                type: a.type,
                message: a.message,
                timestamp: a.created_at
            }));

            if (activities.length > 0) this._set(STORAGE_KEYS.ACTIVITIES, activities);
            return activities;
        } catch (err) {
            console.error(err);
            return this.getActivities();
        }
    }

    async logActivity(type, message) {
        try {
            // Try to get admin email from local storage if available
            let adminEmail = 'system';
            try {
                const adminUser = JSON.parse(localStorage.getItem('admin_user'));
                if (adminUser && adminUser.email) adminEmail = adminUser.email;
            } catch (e) {
                // Ignore parsing error
            }

            const newActivity = {
                type,
                message,
                admin_email: adminEmail
            };

            await supabase.from('activities').insert([newActivity]);
            // Also notify UI
            window.dispatchEvent(new Event('storage_update'));
        } catch (error) {
            console.error('Error logging activity:', error);
        }
    }

    // --- Admin Domain & Finance Functions ---

    async fetchAllDomains() {
        try {
            const { data, error } = await supabase
                .from('domains')
                .select(`
                    *,
                    leads:user_id (name, email)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching all domains:', error);
            return [];
        }
    }

    async updateDomainStatus(id, status) {
        try {
            const { error } = await supabase
                .from('domains')
                .update({ status })
                .eq('id', id);

            if (error) throw error;
            this.logActivity('update', `تم تحديث حالة الدومين #${id} إلى ${status}`);
            return true;
        } catch (error) {
            console.error('Error updating domain status:', error);
            return false;
        }
    }

    async fetchAllTransactions() {
        try {
            const { data, error } = await supabase
                .from('domain_transactions')
                .select(`
                    *,
                    leads:user_id (name, email)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching transactions:', error);
            return [];
        }
    }

    // Notifications System
    getNotifications() {
        return this._get(STORAGE_KEYS.NOTIFICATIONS, [
            { id: 1, title: 'أهلاً بك 👋', msg: 'مرحباً بك في منصة باني المشاريع الذكي', time: 'الآن', read: false }
        ]);
    }

    addNotification(notif) {
        const notifications = this.getNotifications();
        const newNotif = {
            id: Date.now(),
            title: notif.title,
            msg: notif.msg,
            time: 'منذ قليل',
            read: false,
            type: notif.type
        };
        this._set(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...notifications].slice(0, 20));
        // نطلق حدث تنبيه المكونات
        window.dispatchEvent(new CustomEvent('new_notification', { detail: newNotif }));
    }

    markAllNotificationsRead() {
        const notifications = this.getNotifications().map(n => ({ ...n, read: true }));
        this._set(STORAGE_KEYS.NOTIFICATIONS, notifications);
    }

    // Messages (Supabase Integrated)
    getMessages() { return this._get(STORAGE_KEYS.MESSAGES, []); }

    async fetchMessages() {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Normalize data
            const messages = data.map(msg => ({
                ...msg,
                id: msg.id,
                date: msg.created_at,
                replies: msg.replies || []
            }));

            this._set(STORAGE_KEYS.MESSAGES, messages);
            return messages;
        } catch (error) {
            console.error('Error fetching messages from Supabase:', error);
            // Fallback
            return this.getMessages();
        }
    }

    async addMessage(msg) {
        try {
            const { data, error } = await supabase
                .from('messages')
                .insert([{
                    name: msg.name,
                    email: msg.email,
                    subject: msg.subject,
                    message: msg.message,
                    read: false,
                    replies: []
                }])
                .select()
                .single();

            if (error) throw error;

            const newMessage = {
                ...data,
                date: data.created_at,
                replies: []
            };

            const messages = this.getMessages();
            this._set(STORAGE_KEYS.MESSAGES, [newMessage, ...messages]);
            this.logActivity('create', `رسالة جديدة من: ${msg.email}`);

            return newMessage;
        } catch (error) {
            console.error('Error adding message:', error);
            // Fallback
            const localMsg = {
                ...msg,
                id: Date.now(),
                date: new Date().toISOString(),
                read: false,
                replies: [],
                _local: true
            };
            const messages = this.getMessages();
            this._set(STORAGE_KEYS.MESSAGES, [localMsg, ...messages]);
            return localMsg;
        }
    }

    async deleteMessage(id) {
        try {
            const { error } = await supabase
                .from('messages')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Update Local
            const messages = this.getMessages();
            const filtered = messages.filter(m => m.id !== id);
            this._set(STORAGE_KEYS.MESSAGES, filtered);
            this.logActivity('delete', 'تم حذف رسالة');
        } catch (error) {
            console.error('Error deleting message:', error);
            // Fallback: Delete locally
            const messages = this.getMessages();
            const filtered = messages.filter(m => m.id !== id);
            this._set(STORAGE_KEYS.MESSAGES, filtered);
        }
    }

    async markMessageRead(id) {
        try {
            const { error } = await supabase
                .from('messages')
                .update({ read: true })
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error marking message as read:', error);
        } finally {
            // Update Local Always
            const messages = this.getMessages().map(m =>
                m.id === id ? { ...m, read: true } : m
            );
            this._set(STORAGE_KEYS.MESSAGES, messages);
        }
    }

    async sendReply(messageId, replyContent) {
        try {
            const messages = this.getMessages();
            const message = messages.find(m => m.id === messageId);
            if (!message) throw new Error('Message not found');

            const newReply = {
                id: Date.now(),
                content: replyContent,
                date: new Date().toISOString(),
                type: 'admin'
            };

            const updatedReplies = [...(message.replies || []), newReply];

            // Update Supabase
            const { error } = await supabase
                .from('messages')
                .update({
                    replies: updatedReplies,
                    read: true
                })
                .eq('id', messageId);

            if (error) throw error;

            // Update Local
            const updatedMessages = messages.map(m => {
                if (m.id === messageId) {
                    return { ...m, replies: updatedReplies, read: true };
                }
                return m;
            });

            this._set(STORAGE_KEYS.MESSAGES, updatedMessages);
            this.logActivity('update', `تم الرد على الرسالة #${messageId}`);
            return newReply;
        } catch (error) {
            console.error('Error sending reply:', error);
            throw error;
        }
    }



    // --- Contract Management (Supabase) ---
    async getContracts(userEmail) {
        try {
            let query = supabase.from('contracts').select('*, generated_projects(project_name)').order('created_at', { ascending: false });

            if (userEmail) {
                query = query.eq('user_email', userEmail);
            }

            const { data, error } = await query;
            if (error) throw error;

            return data.map(c => ({
                id: c.id,
                title: c.title,
                project: c.generated_projects?.project_name || 'مشروع عام',
                date: new Date(c.created_at).toISOString().split('T')[0],
                status: c.status,
                signed_at: c.signed_at ? new Date(c.signed_at).toLocaleString('en-US') : null,
                amount: c.amount,
                user_email: c.user_email
            }));
        } catch (err) {
            console.error('Error fetching contracts:', err);
            return this._get('omar_contracts', []);
        }
    }

    async createContract(contractData) {
        try {
            const dbContract = {
                user_email: contractData.user_email,
                project_id: contractData.project_id || null, // Ensure UUID or null
                title: contractData.title,
                amount: contractData.amount,
                status: 'pending',
                body: contractData.body || ''
            };

            const { data, error } = await supabase
                .from('contracts')
                .insert([dbContract])
                .select()
                .single();

            if (error) throw error;

            this.logActivity('create', `تم إنشاء عقد جديد: ${contractData.title}`);
            return data;
        } catch (err) {
            console.error('Error creating contract:', err);
            // Fallback Mock
            const contracts = this._get('omar_contracts', []);
            const newContract = {
                id: Date.now(),
                status: 'pending',
                created_at: new Date().toISOString(),
                ...contractData
            };
            this._set('omar_contracts', [...contracts, newContract]);
            return newContract;
        }
    }

    async signContract(id) {
        try {
            const { data: contract, error: fetchError } = await supabase
                .from('contracts')
                .select('project_id, user_email, title')
                .eq('id', id)
                .single();

            if (fetchError) throw fetchError;

            const { error } = await supabase
                .from('contracts')
                .update({
                    status: 'signed',
                    signed_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;

            // If contract is linked to a project, update project stage
            if (contract.project_id) {
                await this.updateGeneratedProject(contract.project_id, {
                    project_stage: 'dev',
                    status: 'in_progress'
                });
            }

            // Real-time Notification for Admin
            await this.sendNotification({
                user_email: 'oooomar896@gmail.com',
                title: 'توقيع عقد جديد ✍️',
                message: `قام العميل بتوقيع العقد: ${contract.title}`,
                type: 'success'
            });

            this.logActivity('update', `تم توقيع العقد #${id}`);
            return true;
        } catch (err) {
            console.error('Error signing contract:', err);
            return false;
        }
    }

    // --- Invoices & Finance (Real Database) ---
    async fetchInvoices(email) {
        try {
            let query = supabase
                .from('invoices')
                .select('*, generated_projects(project_name)')
                .order('created_at', { ascending: false });

            if (email) {
                query = query.eq('user_email', email);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching invoices:', error);
            return [];
        }
    }

    async createInvoice(invoiceData) {
        try {
            const { data, error } = await supabase
                .from('invoices')
                .insert([{
                    project_id: invoiceData.project_id,
                    user_email: invoiceData.user_email,
                    amount: invoiceData.amount,
                    currency: invoiceData.currency || 'SAR',
                    status: 'unpaid',
                    due_date: invoiceData.due_date
                }])
                .select()
                .single();

            if (error) throw error;

            // Notify Client
            await this.sendNotification({
                user_email: invoiceData.user_email,
                title: 'فاتورة جديدة 🧾',
                message: `تم إصدار فاتورة جديدة بقيمة ${invoiceData.amount} SAR لمشروعك.`,
                type: 'warning',
                link: '/portal/finance'
            });

            return data;
        } catch (error) {
            console.error('Error creating invoice:', error);
            throw error;
        }
    }

    // --- Real-time Notifications (Supabase) ---
    async fetchNotifications(email) {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_email', email)
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return [];
        }
    }

    async sendNotification(notif) {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .insert([{
                    user_email: notif.user_email,
                    title: notif.title,
                    message: notif.message,
                    type: notif.type || 'info',
                    link: notif.link,
                    read: false
                }])
                .select()
                .single();

            if (error) throw error;

            // Still dispatch local event for immediate UI update if user is current
            window.dispatchEvent(new CustomEvent('new_notification', { detail: data }));
            return data;
        } catch (error) {
            console.error('Error sending notification:', error);
            // Fallback to local
            this.addNotification(notif);
        }
    }

    async markNotificationRead(id) {
        try {
            await supabase
                .from('notifications')
                .update({ read: true })
                .eq('id', id);
        } catch (error) {
            console.error('Error marking notification read:', error);
        }
    }

    // Analytics
    async fetchPageVisits() {
        try {
            // Fetch last 30 days of visits
            const { data, error } = await supabase
                .from('page_visits')
                .select('path, visitor_id, visited_at')
                .gte('visited_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

            if (error) {
                console.warn("Analytics fetch error:", error.message);
                return [];
            }
            return data || [];
        } catch (error) {
            console.error('Error fetching page visits:', error);
            return [];
        }
    }

    async fetchDomainPricing() {
        try {
            const { data, error } = await supabase
                .from('domain_pricing')
                .select('*')
                .eq('is_available', true);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching pricing:', error);
            return [];
        }
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
