import {
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    ExternalLink,
    Globe,
    Smartphone,
    Database,
    Zap
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const ManageProjects = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock initial data
    const projects = [
        { id: 1, name: 'متجر عطور ذكي', category: 'web', date: '2026-01-01', status: 'published' },
        { id: 2, name: 'تطبيق توصيل طلبات', category: 'mobile', date: '2025-12-28', status: 'published' },
        { id: 3, name: 'بوت مساعد قانوني', category: 'ai-bots', date: '2026-01-02', status: 'draft' },
    ];

    const categories = {
        web: { icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        mobile: { icon: Smartphone, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        'ai-bots': { icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        odoo: { icon: Database, color: 'text-teal-500', bg: 'bg-teal-500/10' },
    };

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="بحث عن مشروع..."
                        className="w-full bg-dark-900 border border-gray-800 rounded-xl pr-12 pl-4 py-3 text-sm focus:border-primary-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex-grow md:flex-grow-0 flex items-center justify-center gap-2 bg-dark-800 border border-gray-700 px-4 py-3 rounded-xl hover:bg-dark-700 transition-all text-sm">
                        <Filter size={18} />
                        <span>تصفية</span>
                    </button>
                    <button className="flex-grow md:flex-grow-0 flex items-center justify-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-xl hover:bg-primary-600 transition-all font-bold text-sm shadow-lg shadow-primary-500/20">
                        <Plus size={18} />
                        <span>مشروع جديد</span>
                    </button>
                </div>
            </div>

            {/* Projects Grid/Table */}
            <div className="bg-dark-900/50 border border-gray-800 rounded-3xl overflow-hidden">
                <table className="w-full text-right">
                    <thead className="bg-dark-800/50 text-gray-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4 font-bold">المشروع</th>
                            <th className="p-4 font-bold">التصنيف</th>
                            <th className="p-4 font-bold">تاريخ الإضافة</th>
                            <th className="p-4 font-bold">الحالة</th>
                            <th className="p-4 font-bold">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-sm">
                        {projects.map((project) => {
                            const CatInfo = categories[project.category] || categories.web;
                            const Icon = CatInfo.icon;

                            return (
                                <motion.tr
                                    key={project.id}
                                    layout
                                    className="hover:bg-white/5 transition-colors group"
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${CatInfo.bg} ${CatInfo.color}`}>
                                                <Icon size={20} />
                                            </div>
                                            <span className="font-bold text-gray-200">{project.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold ${CatInfo.bg} ${CatInfo.color}`}>
                                            {project.category.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-400 font-mono text-xs">{project.date}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${project.status === 'published' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-600'}`} />
                                            <span className={project.status === 'published' ? 'text-emerald-500' : 'text-gray-500'}>
                                                {project.status === 'published' ? 'منشور' : 'مسودة'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 hover:bg-primary-500/10 hover:text-primary-500 rounded-lg transition-all text-gray-500">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-blue-500/10 hover:text-blue-500 rounded-lg transition-all text-gray-500">
                                                <ExternalLink size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all text-gray-500">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination Placeholder */}
            <div className="flex justify-between items-center text-sm text-gray-500">
                <p>عرض {projects.length} مشاريع</p>
                <div className="flex gap-2">
                    <button className="p-2 border border-gray-800 rounded-lg hover:bg-dark-800 disabled:opacity-50 text-xs">السابق</button>
                    <button className="p-2 border border-gray-800 rounded-lg bg-primary-500 text-white shadow-lg text-xs">1</button>
                    <button className="p-2 border border-gray-800 rounded-lg hover:bg-dark-800 text-xs text-gray-400">التالي</button>
                </div>
            </div>
        </div>
    );
};

export default ManageProjects;
