import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../utils/supabaseClient';
import { dataService } from '../../utils/dataService';
import {
    Bell,
    CreditCard,
    LogOut,
    Briefcase,
    LayoutDashboard,
    FileText,
    MessageSquare
} from 'lucide-react';

import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

const ClientDashboard = () => {
    const navigate = useNavigate();
    const [activeProjects, setActiveProjects] = useState([]);
    const [userName, setUserName] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('portal_user');
        localStorage.removeItem('portal_token');
        navigate('/portal/login');
    };

    const getNextMilestone = (status, stage) => {
        if (status === 'completed') return 'المشروع مكتمل';
        switch (stage) {
            case 'analysis': return 'إصدار العقد';
            case 'design': return 'بدء البرمجة';
            case 'dev': return 'المراجعة الأولية';
            case 'qa': return 'الإطلاق';
            case 'launch': return 'مكتمل';
            default: return '---';
        }
    };

    const loadDashboardData = useCallback(async () => {
        try {
            const email = localStorage.getItem('portal_user');
            if (!email) {
                navigate('/portal/login');
                return;
            }
            setUserName(email.split('@')[0]);

            // Fetch Projects
            const projects = await dataService.fetchUserProjects(email);

            // Transform data for UI
            const formattedProjects = projects.map(p => {
                return {
                    id: p.id,
                    name: p.project_name || 'مشروع بدون عنوان',
                    progress: p.status === 'completed' ? 100 :
                        (p.project_stage === 'analysis' ? 10 :
                            p.project_stage === 'design' ? 30 :
                                p.project_stage === 'dev' ? 60 :
                                    p.project_stage === 'qa' ? 85 : 95),
                    status: p.status,
                    type: p.project_type || 'Web App',
                    nextMilestone: getNextMilestone(p.status, p.project_stage),
                    dueDate: 'قيد التحديد'
                };
            });

            setActiveProjects(formattedProjects);

            // Fetch Notifications
            const notifs = await dataService.fetchNotifications(email);
            setNotifications(notifs);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    }, [navigate]);

    useEffect(() => {
        loadDashboardData();

        // Listen for new notifications
        const handleNewNotif = () => loadDashboardData();
        window.addEventListener('new_notification', handleNewNotif);
        return () => window.removeEventListener('new_notification', handleNewNotif);
    }, [loadDashboardData]);

    const markAllAsRead = async () => {
        const unread = notifications.filter(n => !n.read);
        for (const n of unread) {
            await dataService.markNotificationRead(n.id);
        }
        loadDashboardData();
    };

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
                            <span className="text-lg font-bold text-gray-200 hidden md:block tracking-tight">بوابة العملاء المميزين</span>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Notification Bell */}
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setShowNotifications(!showNotifications);
                                        if (!showNotifications) markAllAsRead();
                                    }}
                                    className="p-2 rounded-full hover:bg-white/5 transition-colors relative group"
                                >
                                    <Bell size={20} className="text-gray-400 group-hover:text-primary-400 transition-colors" />
                                    {notifications.some(n => !n.read) && (
                                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-dark-900 animate-pulse"></span>
                                    )}
                                </button>

                                {/* Notifications Dropdown */}
                                <AnimatePresence>
                                    {showNotifications && (
                                        <>
                                            <button
                                                className="fixed inset-0 z-[60] w-full h-full cursor-default bg-transparent"
                                                onClick={() => setShowNotifications(false)}
                                                aria-label="Close notifications"
                                            />
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute left-0 mt-4 w-80 bg-dark-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[70] backdrop-blur-xl"
                                            >
                                                <div className="p-4 border-b border-white/5 flex justify-between items-center">
                                                    <span className="text-sm font-bold">التنبيهات</span>
                                                    <span className="text-[10px] text-gray-500">{notifications.length} تنبيه</span>
                                                </div>
                                                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                                                    {notifications.length === 0 ? (
                                                        <div className="p-8 text-center text-gray-500 text-sm">لا توجد تنبيهات جديدة</div>
                                                    ) : (
                                                        notifications.map((notif) => (
                                                            <button
                                                                key={notif.id}
                                                                className={`w-full text-right p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer block ${!notif.read ? 'bg-primary-500/5' : ''}`}
                                                                onClick={() => {
                                                                    if (notif.link) navigate(notif.link);
                                                                    setShowNotifications(false);
                                                                }}
                                                            >
                                                                <div className="flex justify-between items-start mb-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={`w-1.5 h-1.5 rounded-full ${notif.type === 'success' ? 'bg-emerald-500' : notif.type === 'warning' ? 'bg-amber-500' : 'bg-primary-500'}`} />
                                                                        <span className="text-xs font-bold text-white">{notif.title}</span>
                                                                    </div>
                                                                    <span className="text-[10px] text-gray-500">{new Date(notif.created_at).toLocaleDateString()}</span>
                                                                </div>
                                                                <p className="text-xs text-gray-400 leading-relaxed">{notif.message}</p>
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="flex items-center gap-3 pr-4 border-r border-white/10 pl-4">
                                <span className="text-sm text-gray-300 hidden md:block font-medium">حسابي المهني</span>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-indigo-500 border border-white/10 ring-2 ring-primary-500/20"></div>
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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
                            مرحباً، <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">{userName}</span> 💎
                        </h1>
                        <p className="text-gray-400 flex items-center gap-2 text-lg">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse"></span>
                            {activeProjects.length === 0 ? 'ابدأ رحلة مشروعك القادم معنا اليوم' : `تتم إدارة ${activeProjects.length} مشاريع نشطة بأحدث التقنيات`}
                        </p>
                    </motion.div>

                    <div className="flex items-center gap-3">
                        <Link
                            to="/portal/requests"
                            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-primary-500/20 transition-all hover:-translate-y-1 active:scale-95"
                        >
                            <Briefcase size={20} />
                            <span>مشروع جديد</span>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Projects Grid */}
                    <div className="lg:col-span-3">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">المشاريع الحالية</h2>
                            <Link to="/portal/requests" className="text-sm text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1 font-bold">
                                طلب مشروع جديد +
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {activeProjects.map((project, idx) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />

                                    <div className="relative glass-panel rounded-[2.5rem] border border-white/5 bg-dark-800/40 p-8 overflow-hidden hover:border-primary-500/30 transition-all">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-4 bg-primary-500/10 text-primary-400 rounded-3xl">
                                                <div className="w-8 h-8 flex items-center justify-center">
                                                    {project.type.includes('Web') ? <LayoutDashboard size={24} /> : <FileText size={24} />}
                                                </div>
                                            </div>
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${project.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                    'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                                                }`}>
                                                {project.status}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                                            {project.name}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-6 line-clamp-1">{project.type}</p>

                                        <div className="space-y-4 mb-8">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-500">نسبة الإنجاز</span>
                                                <span className="text-white font-mono">{project.progress}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-dark-900 rounded-full overflow-hidden border border-white/5">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${project.progress}%` }}
                                                    className="h-full bg-gradient-to-r from-primary-600 to-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                                            <div>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">المرحلة القادمة</div>
                                                <div className="text-xs font-bold text-gray-300 truncate">{project.nextMilestone}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">تاريخ التسليم</div>
                                                <div className="text-xs font-bold text-gray-300 font-mono">{project.dueDate}</div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigate(`/portal/project/${project.id}`)}
                                            className="w-full mt-8 py-4 rounded-2xl bg-white/5 hover:bg-primary-500 hover:text-dark-900 transition-all font-bold text-sm border border-white/5 hover:border-primary-500"
                                        >
                                            عرض تفاصيل المشروع
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions Sidebar */}
                    <div className="space-y-6">
                        <div className="glass-panel p-6 rounded-3xl">
                            <h3 className="text-lg font-bold text-white mb-4">وصول سريع</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <button
                                    onClick={() => navigate('/portal/requests')}
                                    className="p-4 rounded-2xl bg-dark-800 border border-white/5 hover:bg-primary-500/10 hover:border-primary-400 transition-all flex items-center gap-4 group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                                        <Briefcase className="text-primary-400" size={20} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-300">طلبات المشاريع</span>
                                </button>
                                <button
                                    onClick={() => navigate('/portal/finance')}
                                    className="p-4 rounded-2xl bg-dark-800 border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-400 transition-all flex items-center gap-4 group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                        <CreditCard className="text-emerald-400" size={20} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-300">الفواتير والمالية</span>
                                </button>
                                <button className="p-4 rounded-2xl bg-dark-800 border border-white/5 hover:bg-amber-500/10 hover:border-amber-400 transition-all flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                        <MessageSquare className="text-amber-400" size={20} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-300">الدعم المباشر</span>
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
