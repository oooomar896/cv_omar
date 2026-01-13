import { useState, useEffect } from 'react';
import {
    Search,
    Eye,
    MessageSquare,
    Smartphone,
    Mail,
    Layout,
    CheckCircle2,
    FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dataService } from '../../utils/dataService';
import { downloadProjectBlueprint } from '../../utils/fileUtils';

import toast from 'react-hot-toast';
import Skeleton from '../../components/common/Skeleton';
import FileViewer from '../platform/FileViewer';
import ProjectChat from '../platform/ProjectChat';
import LiveCodeEditor from '../platform/LiveCodeEditor';

const ROADMAP_STAGES = [
    { id: 'analysis', label: 'تحليل المتطلبات' },
    { id: 'design', label: 'التصميم والواجهات' },
    { id: 'dev', label: 'مرحلة البرمجة' },
    { id: 'qa', label: 'فحص الجودة' },
    { id: 'launch', label: 'الإطلاق النهائي' }
];

const ManageRequests = () => {
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [filter, setFilter] = useState('all'); // all, pending, completed
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRequests();
    }, []);

    useEffect(() => {
        const filterRequests = () => {
            let temp = [...requests];

            if (filter !== 'all') {
                if (filter === 'pending') temp = temp.filter(r => r.status !== 'completed');
                if (filter === 'completed') temp = temp.filter(r => r.status === 'completed');
            }

            if (searchTerm) {
                temp = temp.filter(r =>
                    r.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    r.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            setFilteredRequests(temp);
        };

        filterRequests();
    }, [requests, filter, searchTerm]);

    const loadRequests = async () => {
        setLoading(true);
        const data = await dataService.fetchGeneratedProjects();
        setRequests(data);
        setLoading(false);
    };

    const extractPhone = (desc) => {
        if (!desc) return null;
        const match = desc.match(/PHONE:\s*([+\d\s-]+)/);
        return match ? match[1].trim() : null;
    };

    const updateStage = async (newStage) => {
        if (!selectedRequest) return;
        try {
            await dataService.updateGeneratedProject(selectedRequest.id, { project_stage: newStage });
            toast.success('تم تحديث مرحلة المشروع بنجاح');

            // Update local state
            setSelectedRequest(prev => ({ ...prev, project_stage: newStage }));
            setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, project_stage: newStage } : r));
        } catch (error) {
            toast.error('فشل تحديث المرحلة');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-green-500 bg-green-500/10';
            case 'cancelled': return 'text-red-500 bg-red-500/10';
            default: return 'text-amber-500 bg-amber-500/10';
        }
    };

    return (
        <div className="space-y-6 font-cairo" dir="rtl">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="بحث في الطلبات..."
                        className="w-full bg-dark-900 border border-gray-800 rounded-xl pr-12 pl-4 py-3 text-sm focus:border-primary-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex bg-dark-900 p-1 rounded-xl border border-gray-800">
                    {['all', 'pending', 'completed'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f ? 'bg-primary-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {f === 'all' ? 'الكل' : f === 'pending' ? 'قيد الانتظار' : 'مكتمل'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="bg-dark-900 border border-gray-800 rounded-2xl p-6">
                            <div className="flex justify-between items-start mb-4">
                                <Skeleton className="w-20 h-6 rounded-lg" />
                                <Skeleton className="w-24 h-4 rounded-md" />
                            </div>
                            <Skeleton className="w-3/4 h-6 rounded-md mb-2" />
                            <Skeleton className="w-1/2 h-4 rounded-md mb-4" />
                            <Skeleton className="w-full h-20 rounded-xl mb-6" />
                            <div className="flex gap-2">
                                <Skeleton className="flex-1 h-10 rounded-xl" />
                                <Skeleton className="w-12 h-10 rounded-xl" />
                            </div>
                        </div>
                    ))
                ) : (
                    filteredRequests.map((req) => {
                        const phone = extractPhone(req.description);
                        return (
                            <motion.div
                                layout
                                key={req.id}
                                className="bg-dark-900 border border-gray-800 rounded-2xl p-6 hover:border-primary-500/50 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(req.status)}`}>
                                        {req.status === 'completed' ? 'مكتمل' : 'قيد المراجعة'}
                                    </div>
                                    <span className="text-xs text-gray-500 font-mono">
                                        {new Date(req.created_at || req.timestamp).toLocaleDateString()}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{req.project_name}</h3>
                                <div className="flex items-center gap-2 text-primary-400 text-xs font-mono mb-4 bg-primary-500/5 p-2 rounded-lg w-fit">
                                    <Mail size={12} />
                                    {req.user_email}
                                </div>

                                <div className="text-gray-400 text-sm mb-6 line-clamp-3 h-[4.5em] bg-dark-950/50 p-3 rounded-xl">
                                    {req.description}
                                </div>

                                <div className="flex gap-2 relative z-10">
                                    {phone && (
                                        <a
                                            href={`https://wa.me/${phone.replace(/\+/g, '').replace(/\s/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white py-2 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm font-bold"
                                        >
                                            <MessageSquare size={16} />
                                            <span>واتساب</span>
                                        </a>
                                    )}
                                    <button
                                        onClick={() => setSelectedRequest(req)}
                                        className="px-4 py-2 bg-dark-800 hover:bg-dark-700 text-gray-300 rounded-xl transition-colors"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedRequest && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedRequest(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-dark-900 border border-gray-800 rounded-3xl w-full max-w-2xl p-8 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-4">
                                {selectedRequest.project_name}
                            </h2>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-dark-800 p-4 rounded-xl">
                                        <span className="text-xs text-gray-500 block mb-1">العميل</span>
                                        <span className="text-white font-medium">{selectedRequest.user_email}</span>
                                    </div>
                                    <div className="bg-dark-800 p-4 rounded-xl">
                                        <span className="text-xs text-gray-500 block mb-1">النوع</span>
                                        <span className="text-white font-medium">{selectedRequest.project_type}</span>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-sm text-gray-400 block mb-2">الوصف الكامل</span>
                                    <div className="bg-dark-950 p-6 rounded-2xl text-gray-300 leading-relaxed whitespace-pre-wrap font-mono text-sm border border-gray-800">
                                        {selectedRequest.description}
                                    </div>
                                </div>

                                {extractPhone(selectedRequest.description) && (
                                    <div className="flex gap-4 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl items-center">
                                        <Smartphone className="text-emerald-500" />
                                        <div>
                                            <span className="text-sm text-gray-400 block">رقم الهاتف المستخرج</span>
                                            <span className="text-emerald-400 font-bold font-mono text-lg" dir="ltr">
                                                {extractPhone(selectedRequest.description)}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Status Management */}
                                <div className="bg-dark-950 border border-gray-800 rounded-2xl p-6 mb-6">
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <CheckCircle2 size={20} className="text-emerald-500" />
                                        <span>حالة المشروع العامة</span>
                                    </h3>
                                    <div className="flex gap-2">
                                        {['pending_review', 'in_progress', 'completed', 'cancelled'].map((st) => (
                                            <button
                                                key={st}
                                                onClick={async () => {
                                                    try {
                                                        await dataService.updateGeneratedProject(selectedRequest.id, { status: st });
                                                        toast.success('تم تحديث حالة المشروع');
                                                        setSelectedRequest(prev => ({ ...prev, status: st }));
                                                        setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, status: st } : r));
                                                    } catch (e) {
                                                        toast.error('فشل التحديث');
                                                    }
                                                }}
                                                className={`flex-1 py-3 rounded-xl border text-xs font-bold transition-all ${selectedRequest.status === st
                                                    ? 'bg-primary-500 text-white border-primary-500'
                                                    : 'bg-dark-900 text-gray-400 border-gray-800 hover:border-gray-600'
                                                    }`}
                                            >
                                                {st === 'pending_review' ? 'قيد المراجعة' :
                                                    st === 'in_progress' ? 'قيد التنفيذ' :
                                                        st === 'completed' ? 'مكتمل' : 'ملغي'}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Admin Actions */}
                                    <div className="bg-dark-950 border border-gray-800 rounded-2xl p-6 mb-6">
                                        <h3 className="text-lg font-bold text-white mb-4">إجراءات إدارية</h3>
                                        <button
                                            onClick={async () => {
                                                if (!window.confirm('هل أنت متأكد من إصدار عقد لهذا المشروع؟')) return;
                                                try {
                                                    await dataService.createContract({
                                                        user_email: selectedRequest.user_email,
                                                        project_id: selectedRequest.id,
                                                        title: `عقد تنفيذ مشروع: ${selectedRequest.project_name}`,
                                                        project: selectedRequest.project_name, // Optional, for local context
                                                        amount: '50,000 SAR', // Default for demo
                                                        date: new Date().toISOString().split('T')[0]
                                                    });
                                                    toast.success('تم إصدار العقد وربطه بحساب العميل');
                                                } catch (e) {
                                                    console.error(e);
                                                    toast.error('حدث خطأ أثناء إصدار العقد');
                                                }
                                            }}
                                            className="w-full py-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center gap-2 transition-all font-bold"
                                        >
                                            <FileText size={18} />
                                            <span>إصدار عقد إلكتروني للمشروع</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Stage Management */}
                                <div className="bg-dark-950 border border-gray-800 rounded-2xl p-6">
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <Layout size={20} className="text-primary-500" />
                                        <span>تقدم المشروع (Timeline)</span>
                                    </h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {ROADMAP_STAGES.map((stage) => {
                                            const isCurrent = (selectedRequest.project_stage || 'analysis') === stage.id;
                                            return (
                                                <button
                                                    key={stage.id}
                                                    onClick={() => updateStage(stage.id)}
                                                    className={`w-full text-right px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${isCurrent
                                                        ? 'bg-primary-500/10 border-primary-500 text-primary-400'
                                                        : 'bg-dark-900 border-gray-800 text-gray-400 hover:border-gray-600'
                                                        }`}
                                                >
                                                    <span className="font-bold text-sm">{stage.label}</span>
                                                    {isCurrent && <CheckCircle2 size={18} />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {selectedRequest.files && (
                                <div className="mt-6 border-t border-gray-800 pt-6">
                                    <h3 className="text-lg font-bold text-white mb-4">المخطط التقني (Blueprint)</h3>
                                    <div className="bg-dark-950 rounded-2xl border border-gray-800 overflow-hidden max-h-[400px] overflow-y-auto">
                                        <FileViewer
                                            files={selectedRequest.files}
                                            onDownload={() => downloadProjectBlueprint(selectedRequest)}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 border-t border-gray-800 pt-6">
                                <h3 className="text-lg font-bold text-white mb-4">بيئة التطوير (IDE)</h3>
                                <LiveCodeEditor project={selectedRequest} userRole="admin" />
                            </div>

                            <div className="mt-6 border-t border-gray-800 pt-6">
                                <ProjectChat project={selectedRequest} userRole="admin" />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageRequests;
