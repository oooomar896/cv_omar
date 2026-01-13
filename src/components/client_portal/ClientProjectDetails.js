import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    CheckCircle,
    Clock,
    CreditCard,
    ArrowRight,
    Calendar,
    Code,
    Smartphone
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

const ClientProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Mock Data based on ID (Later fetched)
    const projectData = {
        name: "منصة التجارة الإلكترونية AI",
        phase: "development",
        progress: 65,
        dueDate: "2024-02-15",
        status: 'active',
        timeline: [
            { id: 1, title: 'تحليل المتطلبات', status: 'completed', date: '10 يناير' },
            { id: 2, title: 'تصميم الواجهات UI/UX', status: 'completed', date: '20 يناير' },
            { id: 3, title: 'تطوير النظام (Backend)', status: 'active', date: 'جاري العمل' },
            { id: 4, title: 'ربط الواجهات (Frontend)', status: 'pending', date: '1 فبراير' },
            { id: 5, title: 'الاختبار والتسليم', status: 'pending', date: '15 فبراير' },
        ],
        recentUpdates: [
            { id: 1, type: 'dev', message: 'تم الانتهاء من تطوير قاعدة البيانات وتجهيز API المنتجات.', time: 'منذ ساعتين' },
            { id: 2, type: 'design', message: 'تم اعتماد تصميم الصفحة الرئيسية من قبل فريق التصميم.', time: 'أمس' },
            { id: 3, type: 'system', message: 'تم استلام الدفعة الثانية من المستحقات المالية.', time: 'منذ يومين' },
        ]
    };

    useEffect(() => {
        // Simulate fetch
        setTimeout(() => setLoading(false), 500);
    }, [id]);

    if (loading) return <div className="text-white text-center p-20">جاري تحميل التفاصيل...</div>;

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
                    {/* Main Content Area (Timeline & Status) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Project Pulse Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-8 rounded-3xl relative overflow-hidden border border-white/5 bg-dark-800/50"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50"></div>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-2xl font-bold text-white">حالة المشروع</h2>
                                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold animate-pulse">
                                            نشط الآن
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm">المرحلة الحالية: <span className="text-white font-medium">تطوير النظام (Backend Development)</span></p>
                                </div>
                                <div className="text-left md:text-right">
                                    <div className="text-3xl font-black text-white mb-1">{projectData.progress}%</div>
                                    <div className="text-xs text-gray-500 font-mono">نسبة الإنجاز الكلية</div>
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
                                                <div className="text-[10px] text-gray-600 font-mono">{item.date}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Recent Updates Feed */}
                        <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-dark-800/50">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <LayoutDashboard className="text-blue-400" size={20} />
                                آخر التحديثات
                            </h3>
                            <div className="space-y-6">
                                {projectData.recentUpdates.map((update, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex gap-4 group"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="w-2 h-2 rounded-full bg-gray-700 group-hover:bg-primary-500 transition-colors mt-2"></div>
                                            <div className="w-0.5 h-full bg-gray-800 my-1 group-last:hidden"></div>
                                        </div>
                                        <div className="pb-6 w-full">
                                            <div className="bg-dark-800/50 p-4 rounded-2xl border border-white/5 group-hover:border-primary-500/20 transition-all hover:bg-dark-800">
                                                <p className="text-gray-300 text-sm mb-2 leading-relaxed">{update.message}</p>
                                                <div className="flex justify-between items-center text-xs text-gray-500">
                                                    <span className="flex items-center gap-1"><Clock size={10} /> {update.time}</span>
                                                    <span className={`px-2 py-0.5 rounded-full bg-gray-700/50 ${update.type === 'dev' ? 'text-blue-400' : update.type === 'design' ? 'text-pink-400' : 'text-green-400'}`}>
                                                        {update.type === 'dev' ? 'تطوير' : update.type === 'design' ? 'تصميم' : 'نظام'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Area (Contract & Finance) */}
                    <div className="space-y-6">

                        {/* Project Details */}
                        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden border border-white/5 bg-dark-800/50">
                            <h3 className="text-lg font-bold text-white mb-4">تفاصيل العقد</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-sm text-gray-500">تاريخ التسليم المتوقع</span>
                                    <span className="text-sm font-mono text-white bg-dark-800 px-2 py-1 rounded-lg border border-white/5">{projectData.dueDate}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-sm text-gray-500">التكلفة الإجمالية</span>
                                    <span className="text-sm font-bold text-white">45,000 ر.س</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-sm text-gray-500">المدفوع</span>
                                    <span className="text-sm font-bold text-green-400">15,000 ر.س</span>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-sm text-gray-500">المتبقي</span>
                                    <span className="text-sm font-bold text-gray-300">30,000 ر.س</span>
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
