/**
 * Data Service - محرك إدارة البيانات للمنصة
 * يقوم بحفظ واسترجاع المشاريع، المهارات، والأخبار باستخدام localStorage
 * لمحاكاة قاعدة بيانات حقيقية.
 */

const STORAGE_KEYS = {
    PROJECTS: 'omar_projects',
    SKILLS: 'omar_skills',
    NEWS: 'omar_news',
    USERS: 'omar_users'
};

// البيانات الافتراضية الأولية
const DEFAULT_DATA = {
    PROJECTS: [
        { id: 1, name: 'متجر عطور ذكي', category: 'web', date: '2026-01-01', status: 'published', image: '/project1.jpg', desc: 'تطبيق ويب متكامل لبيع العطور مع توصيات AI.' },
        { id: 2, name: 'تطبيق توصيل طلبات', category: 'mobile', date: '2025-12-28', status: 'published', image: '/project2.jpg', desc: 'تطبيق موبايل لنظام توصيل وجبات سريع.' },
    ],
    SKILLS: [
        { id: 1, name: 'React.js', category: 'Frontend', level: 'Expert' },
        { id: 2, name: 'Flutter', category: 'Mobile', level: 'Expert' },
        { id: 3, name: 'AI Integration', category: 'AI', level: 'Expert' },
    ],
    NEWS: [
        { id: 1, title: 'إطلاق منصة باني المشاريع AI', content: 'تم اليوم إطلاق النسخة التجريبية من المنصة...', date: '2026-01-03' },
    ]
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
        return newProject;
    }
    deleteProject(id) {
        const projects = this.getProjects().filter(p => p.id !== id);
        this._set(STORAGE_KEYS.PROJECTS, projects);
    }

    // Skills
    getSkills() { return this._get(STORAGE_KEYS.SKILLS, DEFAULT_DATA.SKILLS); }
    addSkill(skill) {
        const skills = this.getSkills();
        const newSkill = { ...skill, id: Date.now() };
        this._set(STORAGE_KEYS.SKILLS, [...skills, newSkill]);
        return newSkill;
    }
    deleteSkill(id) {
        const skills = this.getSkills().filter(s => s.id !== id);
        this._set(STORAGE_KEYS.SKILLS, skills);
    }

    // News
    getNews() { return this._get(STORAGE_KEYS.NEWS, DEFAULT_DATA.NEWS); }
    addNews(item) {
        const news = this.getNews();
        const newItem = { ...item, id: Date.now(), date: new Date().toISOString().split('T')[0] };
        this._set(STORAGE_KEYS.NEWS, [...news, newItem]);
        return newItem;
    }
    deleteNews(id) {
        const news = this.getNews().filter(n => n.id !== id);
        this._set(STORAGE_KEYS.NEWS, news);
    }
}

export const dataService = new DataService();
