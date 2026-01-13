import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutList, Plus, Search, ChevronLeft, Clock, CheckCircle, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { dataService } from '../../utils/dataService';

const ClientRequests = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null); // Added state for modal

    // Mock for demo if no real data found
    const MOCK_DATA = [
        {
            id: 'REQ-2024-001',
            type: 'Mobile App Project',
            title: 'تطبيق توصيل طلبات',
            project_name: 'تطبيق توصيل طلبات',
            created_at: '2023-12-01',
            status: 'completed',
            budget: '35,000 SAR',
            project_type: 'Mobile App',
            description: 'تطبيق متكامل لتوصيل الطلبات يشمل تطبيق العميل، تطبيق السائق، ولوحة تحكم للمطاعم.'
        },
        {
            id: 'REQ-2024-008',
            type: 'Web Platform',
            title: 'منصة التجارة الإلكترونية AI',
            project_name: 'منصة التجارة الإلكترونية AI',
            created_at: '2024-01-02',
            status: 'in_progress',
            budget: '45,000 SAR',
            project_type: 'Web',
            description: 'منصة تجارة إلكترونية ذكية تستخدم الذكاء الاصطناعي لترشيح المنتجات وتحليل سلوك المستخدمين.'
        }
    ];

    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            const userEmail = localStorage.getItem('portal_user');

            if (userEmail) {
                try {
                    const realData = await dataService.fetchUserProjects(userEmail);
                    if (realData && realData.length > 0) {
                        setRequests(realData);
                    } else {
                        setRequests(MOCK_DATA);
                    }
                } catch (err) {
                    console.error("Failed to load requests", err);
                    setRequests(MOCK_DATA);
                }
            } else {
                setRequests(MOCK_DATA);
            }
            setLoading(false);
        };

        fetchRequests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed': return <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg text-xs border border-emerald-500/20"><CheckCircle size={12} /> مكتمل</span>;
            case 'in_progress': return <span className="flex items-center gap-1 text-blue-400 bg-blue-500/10 px-2 py-1 rounded-lg text-xs border border-blue-500/20"><Clock size={12} className="animate-spin-slow" /> قيد التنفيذ</span>;
            case 'pending':
            case 'pending_review': return <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg text-xs border border-amber-500/20"><Clock size={12} /> قيد المراجعة</span>;
            default: return <span className="text-gray-400 text-xs">غير معروف</span>;
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 text-white font-cairo p-4 md:p-8" dir="rtl">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-4 mb-2">
                            <Link to="/portal/dashboard" className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5">
                                <ChevronLeft size={20} />
                            </Link>
                            <h1 className="text-4xl font-extrabold text-white tracking-tight">قائمة الطلبات</h1>
                        </div>
                        <p className="text-gray-400 flex items-center gap-2 pr-12">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            تتبع حالة طلباتك والمشاريع قيد المراجعة
                        </p>
                    </motion.div>

                    <button
                        onClick={() => navigate('/builder')}
                        className="group relative px-8 py-4 bg-primary-600 hover:bg-primary-500 text-dark-900 rounded-2xl font-black text-sm transition-all shadow-xl shadow-primary-500/20 active:scale-95 flex items-center gap-2"
                    >
                        <Plus size={20} />
                        <span>إرسال طلب جديد</span>
                    </button>
                </div>

                {/* Filters & Search */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="md:col-span-2 glass-panel p-2 rounded-3xl border border-white/5 bg-dark-800/40 flex items-center gap-4 group focus-within:border-primary-500/30 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="ابحث عن مشروع بالاسم أو النوع..."
                            className="bg-transparent border-none focus:outline-none text-white w-full font-medium placeholder:text-gray-600"
                        />
                    </div>
                    <div className="glass-panel p-2 rounded-3xl border border-white/5 bg-dark-800/40 flex items-center gap-2">
                        <div className="flex-1 py-3 px-4 rounded-2xl bg-white/5 text-gray-400 text-xs font-bold text-center border border-white/5 cursor-pointer hover:bg-white/10 transition-all">الكل</div>
                        <div className="flex-1 py-3 px-4 rounded-2xl text-gray-600 text-xs font-bold text-center cursor-pointer hover:text-gray-400 transition-all">قيد المراجعة</div>
                        <div className="flex-1 py-3 px-4 rounded-2xl text-gray-600 text-xs font-bold text-center cursor-pointer hover:text-gray-400 transition-all">نشط</div>
                    </div>
                </div>

                {/* List of Requests */}
                <div className="grid grid-cols-1 gap-6">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-32 rounded-3xl bg-white/5 animate-pulse border border-white/5"></div>
                        ))
                    ) : requests.length > 0 ? (
                        requests.map((req, idx) => (
                            <motion.div
                                key={req.id || idx}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="relative glass-panel p-8 rounded-[2.5rem] border border-white/5 bg-dark-800/20 hover:bg-dark-800/40 transition-all flex flex-col md:flex-row items-center gap-8 group-hover:border-white/10">
                                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-dark-700 to-dark-900 border border-white/5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                                            <FileText size={28} />
                                        </div>
                                    </div>

                                    <div className="flex-1 text-center md:text-right">
                                        <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors uppercase tracking-tight">
                                                {req.project_name || req.title}
                                            </h3>
                                            {getStatusBadge(req.status)}
                                        </div>
                                        <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5"><LayoutList size={14} /> {req.project_type || req.type}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-800"></span>
                                            <span className="flex items-center gap-1.5 font-mono"><Clock size={14} /> {new Date(req.created_at || Date.now()).toLocaleDateString('ar-SA')}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-10 shrink-0 border-t md:border-t-0 md:border-r border-white/5 pt-6 md:pt-0 md:pr-10 w-full md:w-auto">
                                        <div className="text-center md:text-right">
                                            <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-1 font-bold">الميزانية المقديرة</div>
                                            <div className="text-xl font-black text-white font-mono tracking-tighter">{req.budget || 'غير محدد'}</div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedRequest(req)}
                                            className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black text-sm border border-white/5 transition-all active:scale-95 group/btn"
                                        >
                                            <span className="flex items-center gap-2">
                                                عرض التفاصيل
                                                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="glass-panel rounded-[3rem] p-20 text-center border border-white/5 bg-dark-800/20">
                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-700">
                                <LayoutList size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-400 mb-2">لا توجد طلبات حتى الآن</h3>
                            <p className="text-gray-500 mb-10 max-w-sm mx-auto">ابدأ ببناء مشروعك الأول من خلال المحرك الذكي الخاص بنا في دقائق معدودة.</p>
                            <button
                                onClick={() => navigate('/builder')}
                                className="px-10 py-4 bg-primary-600 shadow-xl shadow-primary-500/20 text-dark-900 rounded-2xl font-black transition-all hover:scale-105 active:scale-95"
                            >
                                إطلاق مشروع جديد
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Request Details Modal */}
            <AnimatePresence>
                {selectedRequest && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 isolate">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedRequest(null)}
                            className="absolute inset-0 bg-dark-950/90 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 40 }}
                            className="bg-dark-900 border border-white/10 rounded-[3rem] w-full max-w-3xl p-0 relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-full"
                        >
                            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-dark-800/50 backdrop-blur-md sticky top-0 z-20">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400 border border-primary-500/20">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-white">تفاصيل الطلب</h2>
                                        <p className="text-xs text-gray-400 font-mono tracking-widest uppercase">Request Configuration</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedRequest(null)}
                                    className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-all border border-transparent hover:border-white/10"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto custom-scrollbar space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-black">اسم المشروع</div>
                                        <div className="text-lg font-bold text-white leading-tight">{selectedRequest.project_name || selectedRequest.title}</div>
                                    </div>
                                    <div className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-black">نوع العمل</div>
                                        <div className="text-lg font-bold text-primary-400 leading-tight">{selectedRequest.project_type || selectedRequest.type}</div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-1.5 h-6 bg-primary-500 rounded-full"></div>
                                        <h3 className="text-sm font-black text-white uppercase tracking-wider">وصف المتطلبات</h3>
                                    </div>
                                    <div className="bg-dark-950/50 p-6 rounded-3xl text-gray-400 text-sm leading-relaxed whitespace-pre-wrap border border-white/5 italic">
                                        {selectedRequest.description || 'لا يوجد وصف مفصل متاح لهذا الطلب.'}
                                    </div>
                                </div>

                                {selectedRequest.specificAnswers && Object.keys(selectedRequest.specificAnswers).length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                                            <h3 className="text-sm font-black text-white uppercase tracking-wider">المواصفات المختارة</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {Object.entries(selectedRequest.specificAnswers).map(([key, value]) => (
                                                <div key={key} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/[0.07] transition-all">
                                                    <span className="text-[10px] text-gray-500 font-bold uppercase">{key}</span>
                                                    <span className="text-xs font-black text-gray-200">{String(value)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4 pt-10 border-t border-white/5">
                                    <div className="text-right">
                                        <div className="text-[10px] text-gray-600 uppercase font-black mb-1">تاريخ الإرسال</div>
                                        <div className="text-sm font-bold text-gray-400 font-mono">{new Date(selectedRequest.created_at || Date.now()).toLocaleDateString('ar-SA')}</div>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-[10px] text-gray-600 uppercase font-black mb-1">الميزانية المتوقعة</div>
                                        <div className="text-sm font-bold text-emerald-400 font-mono">{selectedRequest.budget || '---'}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-dark-950/50 border-t border-white/5 flex gap-4">
                                <button className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-sm transition-all">تحميل كملف PDF</button>
                                <button className="flex-1 py-4 bg-primary-600 hover:bg-primary-500 text-dark-900 rounded-2xl font-black text-sm transition-all shadow-lg shadow-primary-500/10">تعديل الطلب</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ClientRequests;
