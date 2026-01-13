import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle,
    Clock,
    CreditCard,
    ArrowRight
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

                // Fetch Project + Contract + Security Check
                const { data: project, error } = await supabase
                    .from('generated_projects')
                    .select(`
                        *,
                        contracts (*)
                    `)
                    .eq('id', id)
                    .eq('user_email', email) // Security: Ensure ownership
                    .single();

                if (error) throw error;

                if (project) {
                    const contract = project.contracts?.[0];
                    const totalCost = contract?.budget || 0;
                    const paidAmount = 0; // TODO: Fetch from verified transactions

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
                        // Generate a basic timeline
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
    }, [id]);

    const getProgress = (status) => {
        if (status === 'completed') return 100;
        if (status === 'development') return 60;
        if (status === 'contract_signed') return 30;
        if (status === 'approved') return 20;
        return 10;
    };

    if (loading) return <div className="text-white text-center p-20">جاري تحميل البيانات...</div>;
    if (!projectData) return <div className="text-white text-center p-20">لم يتم العثور على المشروع</div>;

    return (
        <div className="min-h-screen bg-dark-900 text-white font-cairo p-4 md:p-8" dir="rtl">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header with Back Button */}
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={() => navigate('/portal/dashboard')}
                        className="p-2 bg-dark-800 rounded-full hover:bg-dark-700 transition"
                    >
                        <ArrowRight size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">{projectData.name}</h1>
                        <p className="text-sm text-gray-400">تفاصيل المشروع والتقدم</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area (Timeline & IDE) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Project Pulse Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-8 rounded-3xl relative overflow-hidden border border-white/5 bg-dark-800/50"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-2xl font-bold text-white">حالة المشروع</h2>
                                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                                            {projectData.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm">مرحلة: <span className="text-white font-medium">{projectData.timeline.find(t => t.status === 'active')?.title || 'مكتمل'}</span></p>
                                </div>
                                <div className="text-left md:text-right">
                                    <div className="text-3xl font-black text-white mb-1">{projectData.progress}%</div>
                                    <div className="text-xs text-gray-500 font-mono">الإنجاز</div>
                                </div>
                            </div>

                            {/* Timeline Visualization */}
                            <div className="relative">
                                {/* Connector Line */}
                                <div className="absolute top-4 right-0 left-0 h-0.5 bg-gray-800 -z-10 rounded-full"></div>
                                <div className="absolute top-4 right-0 left-0 h-0.5 bg-primary-500 -z-10 rounded-full" style={{ width: `${projectData.progress}%` }}></div>

                                <div className="flex justify-between items-start w-full overflow-x-auto pb-4 gap-4 no-scrollbar">
                                    {projectData.timeline.map((item, index) => (
                                        <div key={item.id} className="flex flex-col items-center min-w-[100px] group cursor-default">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${item.status === 'completed' ? 'bg-primary-500 border-primary-900 text-white' :
                                                item.status === 'active' ? 'bg-dark-900 border-primary-500 text-primary-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' :
                                                    'bg-dark-800 border-gray-700 text-gray-600'
                                                }`}>
                                                {item.status === 'completed' ? <CheckCircle size={16} /> :
                                                    item.status === 'active' ? <Clock size={16} className="animate-spin-slow" /> :
                                                        <span className="text-xs font-mono">{index + 1}</span>}
                                            </div>
                                            <div className="text-center mt-3">
                                                <div className={`text-xs font-bold mb-1 ${item.status === 'active' ? 'text-white' : 'text-gray-500'}`}>{item.title}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Development Environment (IDE) - Only if Approved/In Progress */}
                        {(projectData.status === 'approved' || projectData.status === 'development' || projectData.status === 'contract_signed' || projectData.status === 'completed') && (
                            <div className="glass-panel p-1 rounded-3xl border border-white/5 bg-dark-800/50 overflow-hidden">
                                <div className="p-4 border-b border-white/5 bg-dark-900/50 flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="mr-4 text-xs font-mono text-gray-400">بيئة التطوير المباشرة</span>
                                </div>
                                <div className="h-[500px]">
                                    <LiveCodeEditor project={projectData} readOnly={true} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Area (Contract & Finance) */}
                    <div className="space-y-6">

                        {/* Financial Details */}
                        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden border border-white/5 bg-dark-800/50">
                            <h3 className="text-lg font-bold text-white mb-4">تفاصيل العقد والمالية</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-sm text-gray-500">تاريخ التسليم</span>
                                    <span className="text-sm font-mono text-white bg-dark-800 px-2 py-1 rounded-lg border border-white/5">{projectData.dueDate}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-sm text-gray-500">التكلفة الإجمالية</span>
                                    <span className="text-sm font-bold text-white">{projectData.finance.total.toLocaleString()} ر.س</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-sm text-gray-500">المدفوع</span>
                                    <span className="text-sm font-bold text-green-400">{projectData.finance.paid.toLocaleString()} ر.س</span>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-sm text-gray-500">المتبقي</span>
                                    <span className="text-sm font-bold text-gray-300">{projectData.finance.remaining.toLocaleString()} ر.س</span>
                                </div>
                            </div>
                            <div className="mt-6">
                                <Link
                                    to="/portal/finance"
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-dark-900 font-bold text-sm shadow-lg shadow-primary-500/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                                >
                                    <CreditCard size={18} />
                                    <span>سعداد دفعة مستحقة</span>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientProjectDetails;
