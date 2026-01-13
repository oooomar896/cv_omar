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
    MessageSquare,
    ChevronUp,
    Menu,
    ArrowRight,
    Plus
} from 'lucide-react';

import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

const ClientDashboard = () => {
    const navigate = useNavigate();
    const [activeProjects, setActiveProjects] = useState([]);
    const [userName, setUserName] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);

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
            {/* Toggle Header Button - Floating when hidden */}
            <AnimatePresence>
                {!isHeaderVisible && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => setIsHeaderVisible(true)}
                        className="fixed left-6 top-6 z-[60] p-3 rounded-2xl bg-primary-500 text-dark-900 shadow-2xl shadow-primary-500/40 hover:scale-110 active:scale-95 transition-transform"
                        title="إظهار القائمة"
                    >
                        <Menu size={24} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Top Navigation Bar */}
            <AnimatePresence>
                {isHeaderVisible && (
                    <motion.nav
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className="glass-panel border-b border-white/5 sticky top-0 z-50 bg-dark-900/80 backdrop-blur-xl"
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between items-center h-20">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                                        <span className="text-2xl font-black text-white">B</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-lg font-black text-white hidden md:block tracking-tight leading-none">بوابة باكورة</span>
                                        <button
                                            onClick={() => setIsHeaderVisible(false)}
                                            className="text-[10px] text-gray-500 hover:text-primary-400 transition-colors flex items-center gap-1 hidden md:flex mt-1"
                                        >
                                            <ChevronUp size={12} />
                                            <span>إخفاء القائمة</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {/* Notification Bell */}
                                    <div className="relative">
                                        <button
                                            onClick={() => {
                                                setShowNotifications(!showNotifications);
                                                if (!showNotifications) markAllAsRead();
                                            }}
                                            className="p-3 rounded-2xl hover:bg-white/5 transition-all relative group border border-transparent hover:border-white/5"
                                        >
                                            <Bell size={22} className="text-gray-400 group-hover:text-primary-400 transition-colors" />
                                            {notifications.some(n => !n.read) && (
                                                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-dark-900 animate-pulse"></span>
                                            )}
                                        </button>

                                        {/* Notifications Dropdown */}
                                        <AnimatePresence>
                                            {showNotifications && (
                                                <>
                                                    <button
                                                        className="fixed inset-0 z-[60] w-full h-full cursor-default bg-transparent"
                                                        onClick={() => setShowNotifications(false)}
                                                    />
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                                        className="absolute left-0 mt-4 w-80 bg-dark-800 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden z-[70] backdrop-blur-xl"
                                                    >
                                                        <div className="p-5 border-b border-white/5 bg-white/2 flex justify-between items-center">
                                                            <span className="font-bold">التنبيهات</span>
                                                            <span className="text-[10px] px-2 py-1 bg-primary-500/10 text-primary-400 rounded-lg">{notifications.length} جديد</span>
                                                        </div>
                                                        <div className="max-h-96 overflow-y-auto custom-scrollbar">
                                                            {notifications.length === 0 ? (
                                                                <div className="p-12 text-center text-gray-500 text-sm">أنت على اطلاع بكل شيء!</div>
                                                            ) : (
                                                                notifications.map((notif) => (
                                                                    <button
                                                                        key={notif.id}
                                                                        onClick={() => {
                                                                            if (notif.link) navigate(notif.link);
                                                                            setShowNotifications(false);
                                                                        }}
                                                                        className={`w-full text-right p-5 border-b border-white/5 hover:bg-white/5 transition-colors block ${!notif.read ? 'bg-primary-500/5' : ''}`}
                                                                    >
                                                                        <div className="flex justify-between items-start mb-1">
                                                                            <span className="text-sm font-bold text-white">{notif.title}</span>
                                                                            <span className="text-[10px] text-gray-600">{new Date(notif.created_at).toLocaleDateString('ar-SA')}</span>
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

                                    {/* User Actions */}
                                    <div className="flex items-center gap-3 border-r border-white/10 pr-4 mr-2">
                                        <div className="hidden sm:flex flex-col items-end">
                                            <span className="text-sm font-bold text-white">{userName}</span>
                                            <span className="text-[10px] text-primary-500 font-bold uppercase tracking-wider">عميل ذهبي</span>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="p-3 rounded-2xl bg-red-500/5 hover:bg-red-500/10 text-red-500 transition-all border border-red-500/10"
                                            title="تسجيل الخروج"
                                        >
                                            <LogOut size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-5xl font-black text-white mb-3 tracking-tight">
                            مرحباً، <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">{userName}</span> 💎
                        </h1>
                        <p className="text-gray-400 flex items-center gap-3 text-lg">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse"></span>
                            {activeProjects.length === 0 ? 'ابدأ رحلة مشروعك القادم معنا اليوم' : `تتم إدارة ${activeProjects.length} مشاريع نشطة بأحدث التقنيات`}
                        </p>
                    </motion.div>

                    <button
                        onClick={() => navigate('/portal/requests')}
                        className="group bg-primary-500 hover:bg-primary-600 text-dark-900 px-8 py-4 rounded-[2rem] flex items-center gap-3 font-black shadow-2xl shadow-primary-500/30 transition-all hover:-translate-y-1 active:scale-95"
                    >
                        <Briefcase size={22} className="group-hover:rotate-12 transition-transform" />
                        <span>إطلاق مشروع جديد</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                    {/* Projects Grid */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-black text-white">المشاريع الحالية</h2>
                            <Link to="/portal/requests" className="text-sm text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-2 font-bold group">
                                <span>طلب مشروع جديد</span>
                                <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {activeProjects.map((project, idx) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-indigo-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem]" />

                                    <div className="relative glass-panel rounded-[3rem] border border-white/5 bg-dark-800/40 p-10 overflow-hidden hover:border-primary-500/30 transition-all h-full flex flex-col">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="p-5 bg-white/5 text-primary-400 rounded-[1.5rem] border border-white/5">
                                                {project.type.includes('Web') ? <LayoutDashboard size={28} /> : <FileText size={28} />}
                                            </div>
                                            <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${project.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                                                }`}>
                                                {project.status === 'approved' ? 'جاري التنفيذ' : project.status}
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-black text-white mb-2 group-hover:text-primary-400 transition-colors">
                                            {project.name}
                                        </h3>
                                        <p className="text-gray-500 text-sm mb-8 font-medium">{project.type}</p>

                                        <div className="space-y-4 mb-10 mt-auto">
                                            <div className="flex justify-between text-xs font-bold mb-2">
                                                <span className="text-gray-400">الإنجاز الكلي</span>
                                                <span className="text-white font-mono">{project.progress}%</span>
                                            </div>
                                            <div className="h-3 w-full bg-dark-950 rounded-full overflow-hidden border border-white/5 p-0.5">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${project.progress}%` }}
                                                    className="h-full bg-gradient-to-r from-primary-600 via-primary-400 to-emerald-400 rounded-full"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/5 mb-8">
                                            <div>
                                                <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">المرحلة القادمة</div>
                                                <div className="text-xs font-bold text-gray-200">{project.nextMilestone}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">التسليم المتوقع</div>
                                                <div className="text-xs font-bold text-gray-200 font-mono">{project.dueDate}</div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigate(`/portal/project/${project.id}`)}
                                            className="w-full py-5 rounded-[2rem] bg-white/5 hover:bg-primary-500 hover:text-dark-900 transition-all font-black text-sm border border-white/5 hover:border-transparent flex items-center justify-center gap-2 group/btn"
                                        >
                                            <span>تفاصيل المشروع الكاملة</span>
                                            <ArrowRight size={18} className="group-hover/btn:-translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}

                            {activeProjects.length === 0 && (
                                <div className="col-span-full py-20 text-center glass-panel rounded-[3rem] border border-dashed border-white/10">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Briefcase className="text-gray-600" size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-400 mb-2">لا توجد مشاريع نشطة حالياً</h3>
                                    <p className="text-gray-600 text-sm max-w-xs mx-auto">ابدأ مشروعك الأول اليوم واستمتع بتجربة تطوير برمجية فريدة</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Access Sidebar */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-panel p-8 rounded-[2.5rem] border border-white/5 bg-dark-800/40"
                        >
                            <h3 className="text-xl font-black text-white mb-6">الوصول السريع</h3>
                            <div className="space-y-4">
                                {[
                                    { icon: Briefcase, label: 'قائمة الطلبات', path: '/portal/requests', color: 'primary' },
                                    { icon: CreditCard, label: 'الإدارة المالية', path: '/portal/finance', color: 'emerald' },
                                    { icon: FileText, label: 'العقود والوثائق', path: '/portal/contracts', color: 'indigo' },
                                    { icon: MessageSquare, label: 'الدعم الفني', path: '#', color: 'amber' }
                                ].map((btn, i) => (
                                    <button
                                        key={i}
                                        onClick={() => btn.path !== '#' && navigate(btn.path)}
                                        className="w-full p-5 rounded-2xl bg-dark-900/50 border border-white/5 hover:border-primary-500/50 transition-all flex items-center gap-4 group"
                                    >
                                        <div className={`w-12 h-12 rounded-xl bg-${btn.color}-500/10 flex items-center justify-center text-${btn.color}-400 group-hover:scale-110 transition-transform`}>
                                            <btn.icon size={22} />
                                        </div>
                                        <span className="font-bold text-gray-300 group-hover:text-white transition-colors">{btn.label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        <div className="glass-panel p-8 rounded-[2.5rem] bg-gradient-to-br from-primary-600/20 to-indigo-600/20 border border-primary-500/20 relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-lg font-bold text-white mb-2">هل تحتاج مساعدة؟</h3>
                                <p className="text-xs text-gray-400 mb-6 leading-relaxed">المستشار التقني الخاص بك متاح دائماً للإجابة على استفساراتك حول المشاريع القائمة.</p>
                                <button className="w-full py-4 bg-white text-dark-900 rounded-2xl font-black text-xs hover:bg-primary-400 transition-colors">
                                    تحدث مع المطور
                                </button>
                            </div>
                            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary-500/20 blur-3xl rounded-full group-hover:scale-150 transition-transform" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ClientDashboard;
