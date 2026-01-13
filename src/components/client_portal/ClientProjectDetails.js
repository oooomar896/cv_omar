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
    Download
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import LiveCodeEditor from '../platform/LiveCodeEditor';

const ClientProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [projectData, setProjectData] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const email = localStorage.getItem('portal_user');
                if (!email) {
                    navigate('/portal/login');
                    return;
                }

                const { data: project, error } = await supabase
                    .from('generated_projects')
                    .select(`
                        *,
                        contracts (*)
                    `)
                    .eq('id', id)
                    .eq('user_email', email)
                    .single();

                if (error) throw error;

                if (project) {
                    const contract = project.contracts?.[0];
                    const totalCost = contract?.budget ? parseFloat(contract.budget.replace(/[^0-9.]/g, '')) : 0;
                    const paidAmount = 0;

                    const mappedData = {
                        ...project,
                        name: project.name || 'مشروع بدون عنوان',
                        status: project.status,
                        progress: getProgress(project.status),
                        dueDate: contract?.delivery_date || 'غير محدد',
                        finance: {
                            total: totalCost,
                            paid: paidAmount,
                            remaining: totalCost - paidAmount
                        },
                        timeline: [
                            { id: 1, title: 'إنشاء الطلب', status: 'completed', date: new Date(project.created_at).toLocaleDateString('ar-SA') },
                            { id: 2, title: 'مراجعة الإدارة', status: project.status === 'approved' || project.status === 'completed' || contract ? 'completed' : 'active', date: '-' },
                            { id: 3, title: 'توقيع العقد', status: contract?.status === 'signed' ? 'completed' : (project.status === 'approved' ? 'active' : 'pending'), date: '-' },
                            { id: 4, title: 'التطوير والتنفيذ', status: project.status === 'development' ? 'active' : (project.status === 'completed' ? 'completed' : 'pending'), date: '-' },
                            { id: 5, title: 'التسليم النهائي', status: project.status === 'completed' ? 'completed' : 'pending', date: contract?.delivery_date || '-' },
                        ]
                    };
                    setProjectData(mappedData);
                }
            } catch (err) {
                console.error('Error fetching project details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id, navigate]);

    const getProgress = (status) => {
        if (status === 'completed') return 100;
        if (status === 'development') return 60;
        if (status === 'contract_signed') return 30;
        if (status === 'approved') return 20;
        return 10;
    };

    if (loading) return <div className="min-h-screen bg-dark-900 flex items-center justify-center text-white">جاري تحميل البيانات...</div>;
    if (!projectData) return <div className="min-h-screen bg-dark-900 flex items-center justify-center text-white">لم يتم العثور على المشروع</div>;

    return (
        <div className="min-h-screen bg-dark-900 text-white font-cairo p-4 md:p-8" dir="rtl">
            <div className="max-w-7xl mx-auto">

                {/* Top Bar */}
                <div className="flex items-center justify-between mb-10">
                    <button
                        onClick={() => navigate('/portal/dashboard')}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5 group"
                    >
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        <span className="font-bold text-sm">العودة للوحة التحكم</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-sm text-gray-400 font-medium">تحديث حي للمشروع</span>
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
                                            <p className="text-xs text-gray-500">
                                                {item.status === 'completed' ? 'تمت المهمة بنجاح' :
                                                    item.status === 'active' ? 'نحن نعمل على هذا حالياً' : 'مرحلة مستقبلية'}
                                            </p>
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

                        <div className="glass-panel p-6 rounded-[2rem] border border-white/5 bg-dark-800/20">
                            <h4 className="text-sm font-bold text-white mb-4">وثائق المشروع</h4>
                            <div className="space-y-2">
                                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center"><FileText size={16} /></div>
                                        <span className="text-xs text-gray-300">عقد التنفيذ التقني.pdf</span>
                                    </div>
                                    <Download size={14} className="text-gray-500 group-hover:text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Editor Section */}
                {(projectData.status === 'approved' || projectData.status === 'development' || projectData.status === 'contract_signed' || projectData.status === 'completed') && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-panel rounded-[3rem] border border-white/5 bg-dark-800/40 overflow-hidden shadow-2xl relative mb-12"
                    >
                        <div className="p-6 border-b border-white/5 bg-dark-900/50 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                </div>
                                <div className="h-4 w-[1px] bg-white/10"></div>
                                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Live Development Environment v2.0</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-[10px] font-bold text-primary-400 font-mono uppercase">
                                Read-Only
                            </div>
                        </div>
                        <div className="h-[600px] relative group">
                            <LiveCodeEditor project={projectData} readOnly={true} />
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ClientProjectDetails;
