
import { motion } from 'framer-motion';
import { supabase } from '../../utils/supabaseClient';
import {
    MessageSquare,
    Bell,
    CreditCard,
    LogOut,
    Briefcase,
    ArrowRight,
    Activity
} from 'lucide-react';

import { useNavigate, Link } from 'react-router-dom';

const ClientDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('portal_user');
        localStorage.removeItem('portal_token');
        navigate('/portal/login');
    };

    // Mock Active Projects (List View)
    const activeProjects = [
        {
            id: 101,
            name: "منصة التجارة الإلكترونية AI",
            progress: 65,
            status: 'نشط',
            type: 'Web Application',
            nextMilestone: "إطلاق النسخة التجريبية",
            dueDate: "2024-02-15"
        },
        {
            id: 102,
            name: "تطبيق توصيل طلبات - لوحة التحكم",
            progress: 15,
            status: 'تحليل',
            type: 'Dashboard',
            nextMilestone: "اعتماد وثيقة المتطلبات",
            dueDate: "2024-03-01"
        }
    ];

    return (
        <div className="min-h-screen bg-dark-900 text-white font-cairo" dir="rtl">
            {/* Top Navigation Bar */}
            <nav className="glass-panel border-b border-white/5 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20">
                                <span className="text-xl font-bold text-white">B</span>
                            </div>
                            <span className="text-lg font-bold text-gray-200 hidden md:block">لوحة العميل</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-2 rounded-full hover:bg-white/5 transition-colors relative">
                                <Bell size={20} className="text-gray-400" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-dark-900"></span>
                            </button>
                            <div className="flex items-center gap-3 pr-4 border-r border-white/10 pl-4">
                                <span className="text-sm text-gray-300 hidden md:block">حسابي</span>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 border border-white/10"></div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 transition-colors"
                                title="تسجيل الخروج"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-10 relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
                    <h1 className="text-3xl font-bold mb-2">مرحباً، أحمد 👋</h1>
                    <p className="text-gray-400">تابع تقدم مشاريعك الحالية والسابقة من هنا.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Projects List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Activity className="text-primary-500" /> المشاريع النشطة
                            </h2>
                        </div>

                        {activeProjects.map((project) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-primary-500/30 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
                                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">
                                                {project.name}
                                            </h3>
                                            <span className="px-2 py-0.5 bg-white/5 rounded text-xs text-gray-400 border border-white/10">{project.type}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <span>الهدف القادم: <span className="text-gray-300">{project.nextMilestone}</span></span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 w-full md:w-auto">
                                        <div className="text-center">
                                            <div className="text-xs text-gray-500 mb-1">الإنجاز</div>
                                            <div className="font-bold text-lg text-white font-mono">{project.progress}%</div>
                                        </div>
                                        <Link
                                            to={`/portal/projects/${project.id}`}
                                            className="px-6 py-3 bg-white/5 hover:bg-primary-500 hover:text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                                        >
                                            <span>عرض التفاصيل</span>
                                            <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                                {/* Progress Bar Background */}
                                <div className="absolute bottom-0 left-0 h-1 bg-white/5 w-full">
                                    <div className="h-full bg-primary-500" style={{ width: `${project.progress}%` }}></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick Actions Sidebar */}
                    <div className="space-y-6">
                        <div className="glass-panel p-6 rounded-3xl">
                            <h3 className="text-lg font-bold text-white mb-4">وصول سريع</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => navigate('/portal/requests')}
                                    className="p-4 rounded-2xl bg-dark-800 border border-white/5 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all flex flex-col items-center gap-2 text-center group"
                                >
                                    <Briefcase className="text-gray-400 group-hover:text-blue-400 transition-colors" size={24} />
                                    <span className="text-xs font-medium text-gray-300">طلبات جديدة</span>
                                </button>
                                <button className="p-4 rounded-2xl bg-dark-800 border border-white/5 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all flex flex-col items-center gap-2 text-center group">
                                    <MessageSquare className="text-gray-400 group-hover:text-purple-400 transition-colors" size={24} />
                                    <span className="text-xs font-medium text-gray-300">الدعم الفني</span>
                                </button>
                                <button
                                    onClick={() => navigate('/portal/finance')}
                                    className="p-4 rounded-2xl bg-dark-800 border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all flex flex-col items-center gap-2 text-center group"
                                >
                                    <CreditCard className="text-gray-400 group-hover:text-emerald-400 transition-colors" size={24} />
                                    <span className="text-xs font-medium text-gray-300">المالية</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ClientDashboard;
