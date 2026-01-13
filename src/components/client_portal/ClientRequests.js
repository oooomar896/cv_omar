import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Link to="/portal/dashboard" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                            <ChevronLeft size={24} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <LayoutList className="text-blue-400" />
                                طلباتي
                            </h1>
                            <p className="text-gray-400 text-sm">تتبع وإدارة جميع طلبات المشاريع والخدمات</p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/builder')}
                        className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary-500/20 transition-all"
                    >
                        <Plus size={18} />
                        طلب مشروع جديد
                    </button>
                </div>

                {/* Filters */}
                <div className="glass-panel p-4 rounded-2xl mb-6 flex items-center gap-4">
                    <Search className="text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="البحث في الطلبات..."
                        className="bg-transparent border-none focus:outline-none text-white w-full"
                    />
                </div>

                {/* List */}
                <div className="space-y-4">
                    {requests.map((req, idx) => (
                        <motion.div
                            key={req.id || idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-panel p-6 rounded-2xl group hover:border-primary-500/30 transition-all border border-white/5 relative overflow-hidden"
                        >
                            {/* Decorative ID Background */}
                            <span className="absolute -left-4 -bottom-4 text-[100px] font-black text-white/5 pointer-events-none select-none">
                                {String(idx + 1).padStart(2, '0')}
                            </span>

                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="w-12 h-12 rounded-xl bg-dark-800 flex items-center justify-center border border-white/5 group-hover:border-primary-500/50 transition-colors">
                                        <FileText size={20} className="text-gray-400 group-hover:text-primary-400 transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{req.project_name || req.title}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <span>{req.project_type || req.type}</span>
                                            <span>•</span>
                                            <span className="font-mono">{new Date(req.created_at || Date.now()).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between w-full md:w-auto gap-8">
                                    <div className="text-center">
                                        <div className="text-xs text-gray-500 mb-1">الميزانية</div>
                                        <div className="font-mono font-bold text-white">{req.budget || '-'}</div>
                                    </div>
                                    <div>
                                        {getStatusBadge(req.status)}
                                    </div>
                                    <button
                                        onClick={() => setSelectedRequest(req)}
                                        className="px-4 py-2 bg-white/5 rounded-lg text-sm text-white hover:bg-white/10 transition-colors"
                                    >
                                        التفاصيل
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {requests.length === 0 && !loading && (
                        <div className="text-center py-20 text-gray-600">
                            لا توجد طلبات حتى الآن. ابدأ بطلب مشروع جديد!
                        </div>
                    )}
                </div>
            </div>

            {/* Request Details Modal */}
            <AnimatePresence>
                {selectedRequest && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 isolate">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedRequest(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-dark-900 border border-gray-800 rounded-3xl w-full max-w-2xl p-0 relative z-10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                        >
                            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-dark-900 sticky top-0 z-20">
                                <h2 className="text-xl font-bold text-white">تفاصيل الطلب</h2>
                                <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-white/10 rounded-full text-gray-400">✕</button>
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 mb-2">اسم المشروع</h3>
                                    <p className="text-lg font-bold text-white">{selectedRequest.project_name || selectedRequest.title}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-dark-800 p-4 rounded-xl">
                                        <span className="text-xs text-gray-500 block mb-1">نوع المشروع</span>
                                        <span className="text-white font-medium">{selectedRequest.project_type || selectedRequest.type}</span>
                                    </div>
                                    <div className="bg-dark-800 p-4 rounded-xl">
                                        <span className="text-xs text-gray-500 block mb-1">تاريخ الطلب</span>
                                        <span className="text-white font-medium font-mono">{new Date(selectedRequest.created_at || Date.now()).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 mb-3">وصف المشروع</h3>
                                    <div className="bg-dark-950 p-4 rounded-xl text-gray-300 text-sm leading-relaxed whitespace-pre-wrap border border-gray-800">
                                        {selectedRequest.description || 'لا يوجد وصف متاح.'}
                                    </div>
                                </div>

                                {selectedRequest.specificAnswers && Object.keys(selectedRequest.specificAnswers).length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-400 mb-3">تفاصيل إضافية</h3>
                                        <div className="grid grid-cols-1 gap-2">
                                            {Object.entries(selectedRequest.specificAnswers).map(([key, value]) => (
                                                <div key={key} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                                                    <span className="text-xs text-gray-400">{key}</span>
                                                    <span className="text-sm font-bold text-white">{String(value)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ClientRequests;
