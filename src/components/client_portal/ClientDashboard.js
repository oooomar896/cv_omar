
import { motion } from 'framer-motion';
import { supabase } from '../../utils/supabaseClient';
import {
    MessageSquare,
    Bell,
    CreditCard,
    LogOut,
    Briefcase,
    LayoutDashboard,
    Activity,
    FileText
} from 'lucide-react';

import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ClientDashboard = () => {
    const navigate = useNavigate();
    const [activeProjects, setActiveProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('portal_user');
        localStorage.removeItem('portal_token');
        navigate('/portal/login');
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Get user from local storage
                const email = localStorage.getItem('portal_user');
                if (!email) {
                    navigate('/portal/login');
                    return;
                }
                setUserName(email.split('@')[0]); // Simple fallback name

                // Fetch Projects that are NOT just drafts (assuming 'approved' or has contract)
                // We'll fetch all non-draft projects to let user see progress
                const { data: projects, error } = await supabase
                    .from('generated_projects')
                    .select(`
                        *,
                        contracts (*)
                    `)
                    .eq('user_email', email)
                    .neq('status', 'draft') // Show everything except initial drafts? Or only approved?
                    .order('created_at', { ascending: false });

                if (error) throw error;

                // Transform data for UI
                const formattedProjects = projects.map(p => {
                    const contract = p.contracts?.[0]; // Assuming one contract per project for now
                    return {
                        id: p.id,
                        name: p.name || 'مشروع بدون عنوان',
                        progress: p.status === 'completed' ? 100 : (p.status === 'approved' ? 20 : 5), // Rough estimate
                        status: p.status,
                        type: p.projectType || 'Web App',
                        nextMilestone: getNextMilestone(p.status),
                        dueDate: contract?.delivery_date || 'غير محدد'
                    };
                });

                setActiveProjects(formattedProjects);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const getNextMilestone = (status) => {
        switch (status) {
            case 'pending': return 'مراجعة الإدارة';
            case 'approved': return 'توقيع العقد';
            case 'contract_signed': return 'بدء التطوير';
            case 'development': return 'التسليم الأولي';
            case 'completed': return 'المشروع مكتمل';
            default: return '---';
        }
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
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
                            أهلاً بك، <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-emerald-400">{userName}</span> 👋
                        </h1>
                        <p className="text-gray-400 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            لديك {activeProjects.length} مشاريع نشطة حالياً تحت التنفيذ
                        </p>
                    </motion.div>

                    <div className="flex items-center gap-4 bg-dark-800/40 p-2 rounded-2xl border border-white/5 backdrop-blur-md">
                        <button className="p-3 rounded-xl hover:bg-white/5 text-gray-400 transition-all relative">
                            <Bell size={20} />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-dark-800"></span>
                        </button>
                        <div className="h-8 w-[1px] bg-white/10 mx-1"></div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all font-bold text-sm group"
                        >
                            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span>تسجيل الخروج</span>
                        </button>
                    </div>
                </div>

                {/* Quick Stats / Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'المشاريع النشطة', value: activeProjects.length, icon: LayoutDashboard, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                        { label: 'بإنتظار التوقيع', value: '1', icon: FileText, color: 'text-amber-400', bg: 'bg-amber-400/10' },
                        { label: 'دفعات مستحقة', value: '0', icon: CreditCard, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                        { label: 'تنبيهات جارية', value: '3', icon: Bell, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-panel p-6 rounded-3xl border border-white/5 bg-dark-800/30 hover:bg-dark-800/50 transition-all group cursor-default"
                        >
                            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <stat.icon size={24} />
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-500">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Projects Grid */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">المشاريع الحالية</h2>
                        <Link to="/portal/requests" className="text-sm text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1 font-bold">
                            طلب مشروع جديد +
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                                        onClick={() => navigate(`/portal/projects/${project.id}`)}
                                        className="w-full mt-8 py-4 rounded-2xl bg-white/5 hover:bg-primary-500 hover:text-dark-900 transition-all font-bold text-sm border border-white/5 hover:border-primary-500"
                                    >
                                        عرض تفاصيل المشروع
                                    </button>
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
