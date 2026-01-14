import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle,
    Clock,
    CreditCard,
    ArrowRight,
    Activity,
    FileText,
    Download,
    Bell,
    LogOut,
    Menu,
    ChevronUp
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import { dataService } from '../../utils/dataService';
import LiveCodeEditor from '../platform/LiveCodeEditor';
import ProjectChat from '../platform/ProjectChat';
import ProjectDomainReg from '../platform/ProjectDomainReg';
import { AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const ClientProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [projectData, setProjectData] = useState(null);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [userName, setUserName] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const email = localStorage.getItem('portal_user');
                if (!email) {
                    navigate('/portal/login');
                    return;
                }
                setUserName(email.split('@')[0]);

                // Fetch Notifications for the bell
                const notifs = await dataService.fetchNotifications(email);
                setNotifications(notifs);

                // Fetch Project by ID (Hybrid Local + Remote)
                const project = await dataService.getProjectById(id);

                if (project) {
                    const contract = project.contracts?.[0];
                    const rawBudget = contract?.budget || project.budget || "0";
                    const totalCost = typeof rawBudget === 'string'
                        ? parseFloat(rawBudget.replace(/[^0-9.]/g, ''))
                        : (typeof rawBudget === 'number' ? rawBudget : 0);
                    const paidAmount = 0;

                    const mappedData = {
                        ...project,
                        name: project.projectName || project.project_name || 'مشروع بدون عنوان',
                        status: project.status || 'pending',
                        progress: getProgress(project.status, project.projectStage || project.project_stage),
                        dueDate: contract?.delivery_date || 'غير محدد',
                        finance: {
                            total: totalCost,
                            paid: paidAmount,
                            remaining: totalCost - paidAmount
                        },
                        timeline: [
                            { id: 1, id_code: 'analysis', title: 'تحليل المتطلبات', status: 'completed', date: new Date(project.created_at || project.timestamp).toLocaleDateString('ar-SA') },
                            { id: 2, id_code: 'design', title: 'التصميم والواجهات', status: (project.projectStage === 'design' || project.project_stage === 'design' || project.status === 'approved') ? 'completed' : 'active', date: '-' },
                            { id: 3, id_code: 'contract', title: 'توقيع العقد', status: contract?.status === 'signed' ? 'completed' : (project.projectStage === 'contract' || project.project_stage === 'contract' ? 'active' : 'pending'), date: '-' },
                            { id: 4, id_code: 'dev', title: 'التطوير والتنفيذ', status: (project.projectStage === 'dev' || project.project_stage === 'dev') ? 'active' : (project.status === 'completed' ? 'completed' : 'pending'), date: '-' },
                            { id: 5, id_code: 'qa', title: 'فحص الجودة', status: (project.projectStage === 'qa' || project.project_stage === 'qa') ? 'active' : 'pending', date: '-' },
                            { id: 6, id_code: 'launch', title: 'التسليم النهائي', status: project.status === 'completed' ? 'completed' : 'pending', date: contract?.delivery_date || '-' },
                        ]
                    };
                    setProjectData(mappedData);
                } else {
                    toast.error('لم يتم العثور على المشروع');
                    navigate('/portal/requests');
                }
            } catch (err) {
                console.error('Error fetching project details:', err);
                toast.error('فشل في تحميل تفاصيل المشروع');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id, navigate]);

    const getProgress = (status, stage) => {
        if (status === 'completed') return 100;
        switch (stage) {
            case 'analysis': return 10;
            case 'design': return 30;
            case 'contract': return 45;
            case 'dev': return 75;
            case 'qa': return 90;
            case 'launch': return 98;
            default: return 5;
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('portal_user');
        localStorage.removeItem('portal_token');
        navigate('/portal/login');
    };

    const markAllAsRead = async () => {
        const unread = notifications.filter(n => !n.read);
        for (const n of unread) {
            await dataService.markNotificationRead(n.id);
        }
        // Refresh notifications
        const email = localStorage.getItem('portal_user');
        if (email) {
            const notifs = await dataService.fetchNotifications(email);
            setNotifications(notifs);
        }
    };

    if (loading) return <div className="min-h-screen bg-dark-900 flex items-center justify-center text-white">جاري تحميل البيانات...</div>;
    if (!projectData) return <div className="min-h-screen bg-dark-900 flex items-center justify-center text-white">لم يتم العثور على المشروع</div>;

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
                                    <button
                                        onClick={() => navigate('/portal/dashboard')}
                                        className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5 group"
                                    >
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        <span className="font-bold text-xs">العودة للوحة التحكم</span>
                                    </button>

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

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
                {/* Secondary Bar for Project Context */}
                <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-sm text-gray-400 font-bold uppercase tracking-widest">متابعة حية للمشروع</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Main Content: Info & Progress */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-panel p-8 rounded-[2.5rem] border border-white/5 bg-dark-800/40 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-3xl rounded-full -mr-32 -mt-32"></div>

                            <div className="relative">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                                    <div>
                                        <h1 className="text-3xl font-black text-white mb-2">{projectData.name}</h1>
                                        <p className="text-gray-400 flex items-center gap-2">
                                            <Clock size={16} />
                                            <span>تاريخ البدء: {new Date(projectData.created_at).toLocaleDateString('ar-SA')}</span>
                                        </p>
                                    </div>
                                    <div className="px-6 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-sm uppercase tracking-wider">
                                        {projectData.status === 'approved' ? 'جاري التنفيذ' : projectData.status}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-gray-400 text-sm font-medium">اكتمال مراحل المشروع</span>
                                        <span className="text-2xl font-black text-white font-mono">{projectData.progress}%</span>
                                    </div>
                                    <div className="h-4 w-full bg-dark-900 rounded-2xl p-1 border border-white/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${projectData.progress}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className="h-full bg-gradient-to-r from-primary-600 via-primary-500 to-emerald-400 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Timeline */}
                        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 bg-dark-800/30">
                            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                                <Activity size={24} className="text-primary-500" />
                                الجدول الزمني للإنجاز
                            </h3>
                            <div className="relative space-y-8">
                                <div className="absolute top-0 bottom-0 right-[15px] w-[2px] bg-white/5"></div>
                                {projectData.timeline.map((item, idx) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-start gap-6 relative"
                                    >
                                        <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors shadow-lg ${item.status === 'completed' ? 'bg-emerald-500 text-dark-900' :
                                            item.status === 'active' ? 'bg-primary-500 text-dark-900 animate-pulse' : 'bg-dark-900 border border-white/10 text-gray-600'
                                            }`}>
                                            {item.status === 'completed' ? <CheckCircle size={18} /> : (idx + 1)}
                                        </div>
                                        <div className={`flex-1 p-5 rounded-2xl transition-all border ${item.status === 'active' ? 'bg-primary-500/5 border-primary-500/20 shadow-[0_0_20px_rgba(var(--primary-rgb),0.05)]' : 'bg-white/5 border-white/5'
                                            }`}>
                                            <div className="flex justify-between items-center mb-1">
                                                <h4 className={`font-bold ${item.status === 'pending' ? 'text-gray-500' : 'text-white'}`}>{item.title}</h4>
                                                <span className="text-[10px] font-mono text-gray-500 uppercase">{item.date}</span>
                                            </div>
                                            <div className="mt-2 space-y-2">
                                                <p className="text-xs text-gray-500">
                                                    {item.status === 'completed' ? 'تمت المهمة بنجاح' :
                                                        item.status === 'active' ? 'نحن نعمل على هذا حالياً' : 'مرحلة مستقبلية'}
                                                </p>
                                                {projectData.files?.filter(f => f.stage === projectData.timeline[idx].id_code).map((file, fIdx) => (
                                                    <a
                                                        key={fIdx}
                                                        href={file.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] hover:bg-emerald-500 hover:text-dark-900 transition-all w-fit"
                                                    >
                                                        <Download size={10} />
                                                        <span>{file.name}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Finance & Files */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden border border-white/5 bg-gradient-to-br from-dark-800/80 to-dark-950/80"
                        >
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-500/10 blur-[80px] rounded-full"></div>

                            <h3 className="text-lg font-bold text-white mb-6">الملخص المالي</h3>
                            <div className="space-y-5">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-right">
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">إجمالي الميزانية</div>
                                    <div className="text-2xl font-black text-white font-mono">{projectData.finance.total.toLocaleString()} ر.س</div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-1 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-right">
                                        <div className="text-[10px] text-emerald-500/70 uppercase tracking-widest mb-1 font-bold">المدفوع</div>
                                        <div className="text-lg font-bold text-emerald-400 font-mono">{projectData.finance.paid.toLocaleString()}</div>
                                    </div>
                                    <div className="flex-1 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-right">
                                        <div className="text-[10px] text-amber-500/70 uppercase tracking-widest mb-1 font-bold">المتبقي</div>
                                        <div className="text-lg font-bold text-amber-400 font-mono">{projectData.finance.remaining.toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10">
                                <Link
                                    to="/portal/finance"
                                    className="w-full py-4 rounded-[1.5rem] bg-gradient-to-r from-primary-600 to-primary-500 hover:scale-[1.02] active:scale-[0.98] text-dark-900 font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <CreditCard size={18} />
                                    <span>البدء في السداد</span>
                                </Link>
                                <p className="text-[10px] text-center text-gray-500 mt-4 font-medium">سداد آمن عبر بوابة الدفع المعتمدة</p>
                            </div>
                        </motion.div>

                        <ProjectDomainReg project={projectData} />

                        <div className="glass-panel p-6 rounded-[2rem] border border-white/5 bg-dark-800/20">
                            <h4 className="text-sm font-bold text-white mb-4">كافة الملفات</h4>
                            <div className="space-y-2">
                                {projectData.files?.map((file, i) => (
                                    <a
                                        key={i}
                                        href={file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary-500/10 text-primary-500 flex items-center justify-center"><FileText size={16} /></div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-300 truncate max-w-[120px]">{file.name}</span>
                                                <span className="text-[8px] text-gray-500 uppercase">{file.stage}</span>
                                            </div>
                                        </div>
                                        <Download size={14} className="text-gray-500 group-hover:text-white" />
                                    </a>
                                ))}
                                {(!projectData.files || projectData.files.length === 0) && (
                                    <p className="text-[10px] text-center text-gray-500 py-4">لا توجد ملفات مرفوعة حالياً</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Communication & Development Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Chat Section - Always Visible */}
                    <div className="lg:col-span-1 h-[600px]">
                        <ProjectChat project={projectData} userRole="client" />
                    </div>

                    {/* Code Editor Section - Conditional based on progress */}
                    <div className="lg:col-span-2">
                        {(projectData.status === 'approved' || projectData.status === 'development' || projectData.status === 'contract_signed' || projectData.status === 'completed') ? (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-panel rounded-[3rem] border border-white/5 bg-dark-800/40 overflow-hidden shadow-2xl relative h-full min-h-[500px]"
                            >
                                <div className="p-6 border-b border-white/5 bg-dark-900/50 flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                        </div>
                                        <div className="h-4 w-[1px] bg-white/10"></div>
                                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Live Development Environment</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-[10px] font-bold text-primary-400 font-mono uppercase">
                                        Real-time View
                                    </div>
                                </div>
                                <div className="h-[calc(100%-80px)] relative group">
                                    <LiveCodeEditor project={projectData} readOnly={true} />
                                </div>
                            </motion.div>
                        ) : (
                            <div className="glass-panel rounded-[3rem] border border-white/10 bg-dark-800/20 overflow-hidden shadow-2xl relative h-full flex flex-col items-center justify-center p-12 text-center min-h-[500px]">
                                <div className="p-6 bg-primary-500/5 rounded-full mb-6">
                                    <Activity className="text-primary-500/50" size={48} />
                                </div>
                                <h4 className="text-xl font-bold text-white/80 mb-2">بيئة التطوير المباشرة غير مفعلة</h4>
                                <p className="text-gray-600 text-sm max-w-sm">ستتمكن من رؤية كود المشروع ومعاينته مباشرة هنا بمجرد اعتماد الطلب والبدء في مرحلة التنفيذ.</p>
                                <div className="mt-8 px-6 py-2 rounded-xl bg-primary-500/10 text-primary-400 text-xs font-bold border border-primary-500/20">
                                    بانتظار الموافقة على المشروع
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientProjectDetails;
