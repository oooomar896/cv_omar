import { useState, useEffect } from 'react';
import {
    Search,
    Eye,
    MessageSquare,
    Smartphone,
    Mail,
    Layout,
    CheckCircle2,
    FileText,
    Plus,
    Github,
    Link as LinkIcon
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
    { id: 'contract', label: 'توقيع العقد' },
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


    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-green-500 bg-green-500/10';
            case 'cancelled': return 'text-red-500 bg-red-500/10';
            default: return 'text-amber-500 bg-amber-500/10';
        }
    };

    const handleFileUpload = async (e, stageId) => {
        const file = e.target.files[0];
        if (!file || !selectedRequest) return;

        try {
            toast.loading('جاري رفع الملف...', { id: 'upload' });

            const reader = new FileReader();
            reader.onloadend = async () => {
                const fileData = {
                    name: file.name,
                    size: (file.size / 1024).toFixed(2) + ' KB',
                    type: file.type,
                    stage: stageId,
                    url: reader.result
                };

                const updated = await dataService.addProjectFile(selectedRequest.id, fileData);
                setSelectedRequest(updated);
                setRequests(prev => prev.map(r => r.id === updated.id ? updated : r));

                await dataService.sendNotification({
                    user_email: selectedRequest.user_email,
                    title: 'ملف جديد متاح 📁',
                    message: `قام المطور برفع ملف جديد لمرحلة (${ROADMAP_STAGES.find(s => s.id === stageId)?.label}): ${file.name}`,
                    type: 'info',
                    link: `/portal/project/${selectedRequest.id}`
                });

                toast.success('تم رفع الملف بنجاح!', { id: 'upload' });
            };
            reader.readAsDataURL(file);
        } catch (error) {
            toast.error('فشل في رفع الملف', { id: 'upload' });
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

                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-bold text-white line-clamp-1">{req.project_name}</h3>
                                    {req.github_url && (
                                        <div className="flex items-center gap-1 text-primary-400" title="GitHub Linked">
                                            <Github size={14} />
                                        </div>
                                    )}
                                </div>
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

            {/* Modal - Improved Layout & Data Display */}
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
                            className="bg-dark-900 border border-gray-800 rounded-3xl w-full max-w-4xl p-0 relative z-10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-dark-900 sticky top-0 z-20">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">
                                        {selectedRequest.project_name}
                                    </h2>
                                    <div className="flex items-center gap-2 text-sm text-gray-400 font-mono">
                                        {selectedRequest.id}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedRequest(null)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors font-bold text-gray-400 hover:text-white"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Modal Content - Scrollable */}
                            <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">

                                {/* Client & Type Info */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-dark-800 p-4 rounded-xl border border-gray-700/50">
                                        <span className="text-xs text-gray-500 block mb-1">العميل</span>
                                        <div className="flex items-center gap-2 text-white font-medium truncate" dir="ltr">
                                            <Mail size={14} className="text-primary-500" />
                                            {selectedRequest.user_email}
                                        </div>
                                    </div>
                                    <div className="bg-dark-800 p-4 rounded-xl border border-gray-700/50">
                                        <span className="text-xs text-gray-500 block mb-1">نوع المشروع</span>
                                        <div className="flex items-center gap-2 text-white font-medium">
                                            {selectedRequest.project_type === 'web' && <Layout size={14} className="text-blue-500" />}
                                            {selectedRequest.project_type === 'mobile' && <Smartphone size={14} className="text-purple-500" />}
                                            {selectedRequest.project_type}
                                        </div>
                                    </div>
                                    <div className="bg-dark-800 p-4 rounded-xl border border-gray-700/50">
                                        <span className="text-xs text-gray-500 block mb-1">تاريخ الطلب</span>
                                        <div className="text-white font-medium font-mono">
                                            {new Date(selectedRequest.created_at || selectedRequest.timestamp).toLocaleDateString('en-GB')}
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
                                        <FileText size={16} /> وصف المشروع
                                    </h3>
                                    <div className="bg-dark-950 p-6 rounded-2xl text-gray-300 leading-relaxed whitespace-pre-wrap font-sans text-sm border border-gray-800">
                                        {selectedRequest.description}
                                    </div>
                                </div>

                                {/* Specific Answers (Custom Details) */}
                                {selectedRequest.specificAnswers && Object.keys(selectedRequest.specificAnswers).length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
                                            <CheckCircle2 size={16} /> تفاصيل إضافية
                                        </h3>
                                        <div className="bg-dark-950 p-6 rounded-2xl border border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries(selectedRequest.specificAnswers).map(([key, value]) => (
                                                <div key={key} className="flex flex-col gap-1 p-3 bg-white/5 rounded-xl border border-white/5">
                                                    <span className="text-xs text-primary-400 font-mono opacity-70">{key}</span>
                                                    <span className="text-sm font-bold text-white uppercase">
                                                        {typeof value === 'boolean' ? (value ? 'نعم' : 'لا') : String(value)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* GitHub Integration */}
                                <div className="bg-dark-800 border border-gray-700 rounded-2xl p-6">
                                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                        <Github size={18} className="text-gray-400" />
                                        <span>مستودع GitHub (Repository)</span>
                                    </h3>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="https://github.com/username/repo"
                                            className="flex-1 bg-dark-900 border border-gray-700 rounded-xl px-4 py-2 text-sm text-white focus:border-primary-500 outline-none font-mono"
                                            defaultValue={selectedRequest.github_url}
                                            onBlur={async (e) => {
                                                const url = e.target.value;
                                                if (url !== selectedRequest.github_url) {
                                                    try {
                                                        await dataService.updateGeneratedProject(selectedRequest.id, { github_url: url });
                                                        toast.success('تم تحديث رابط GitHub');
                                                        setSelectedRequest(prev => ({ ...prev, github_url: url }));
                                                    } catch (err) {
                                                        toast.error('فشل تحديث الرابط');
                                                    }
                                                }
                                            }}
                                        />
                                        {selectedRequest.github_url && (
                                            <a
                                                href={selectedRequest.github_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2 bg-dark-700 hover:bg-dark-600 rounded-xl text-primary-400 transition-all"
                                            >
                                                <LinkIcon size={20} />
                                            </a>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-2">سيتمكن العميل من رؤية الكود وتقدم العمل مباشرة من GitHub.</p>
                                </div>

                                {/* Admin Actions Section */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Status & Contract */}
                                    <div className="space-y-4">
                                        <div className="bg-dark-800 border border-gray-700 rounded-2xl p-5">
                                            <h3 className="text-sm font-bold text-white mb-4">حالة الطلب</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {['pending_review', 'in_progress', 'completed', 'cancelled'].map((st) => (
                                                    <button
                                                        key={st}
                                                        onClick={async () => {
                                                            try {
                                                                await dataService.updateGeneratedProject(selectedRequest.id, { status: st });

                                                                // Send Notification to Client
                                                                await dataService.sendNotification({
                                                                    user_email: selectedRequest.user_email,
                                                                    title: 'تحديث حالة المشروع 📢',
                                                                    message: `تم تحديث حالة مشروعك (${selectedRequest.project_name}) إلى: ${st === 'pending_review' ? 'قيد المراجعة' :
                                                                        st === 'in_progress' ? 'قيد التنفيذ' :
                                                                            st === 'completed' ? 'مكتمل' : 'ملغي'
                                                                        }`,
                                                                    type: st === 'completed' ? 'success' : 'info'
                                                                });

                                                                toast.success('تم تحديث حالة المتشروع وإشعار العميل');
                                                                setSelectedRequest(prev => ({ ...prev, status: st }));
                                                                setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, status: st } : r));
                                                            } catch (e) {
                                                                toast.error('فشل التحديث');
                                                            }
                                                        }}
                                                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${selectedRequest.status === st
                                                            ? 'bg-primary-500 text-white border-primary-500'
                                                            : 'bg-dark-900 text-gray-400 border-gray-700 hover:border-gray-500'
                                                            }`}
                                                    >
                                                        {st === 'pending_review' ? 'مراجعة' :
                                                            st === 'in_progress' ? 'تنفيذ' :
                                                                st === 'completed' ? 'مكتمل' : 'إلغاء'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-dark-800 border border-gray-700 rounded-2xl p-5">
                                            <h3 className="text-sm font-bold text-white mb-4">العقود والمالية</h3>
                                            <div className="space-y-3">
                                                <button
                                                    onClick={async () => {
                                                        const amount = window.prompt('أدخل قيمة العقد (مثلاً: 5,000 SAR):', '5,000 SAR');
                                                        if (!amount) return;
                                                        try {
                                                            await dataService.createContract({
                                                                user_email: selectedRequest.user_email,
                                                                project_id: selectedRequest.id,
                                                                title: `عقد تنفيذ مشروع: ${selectedRequest.project_name}`,
                                                                project: selectedRequest.project_name,
                                                                amount: amount,
                                                                body: `هذا العقد ملزم لتنفيذ مشروع ${selectedRequest.project_name} المتفق عليه...`
                                                            });

                                                            // Notify User
                                                            await dataService.sendNotification({
                                                                user_email: selectedRequest.user_email,
                                                                title: 'عقد جديد في انتظارك 📄',
                                                                message: `تم إصدار عقد لمشروعك بقيمة ${amount}. يرجى المراجعة والتوقيع.`,
                                                                type: 'warning',
                                                                link: '/portal/contracts'
                                                            });

                                                            toast.success('تم إصدار العقد وإشعار العميل');
                                                        } catch (e) {
                                                            console.error(e);
                                                            toast.error('حدث خطأ أثناء إصدار العقد');
                                                        }
                                                    }}
                                                    className="w-full py-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center gap-2 transition-all font-bold text-xs"
                                                >
                                                    <FileText size={16} />
                                                    <span>إصدار عقد جديد</span>
                                                </button>

                                                <button
                                                    onClick={async () => {
                                                        const amount = window.prompt('أدخل قيمة الفاتورة (أرقام فقط):', '1000');
                                                        if (!amount) return;
                                                        try {
                                                            await dataService.createInvoice({
                                                                project_id: selectedRequest.id,
                                                                user_email: selectedRequest.user_email,
                                                                amount: parseFloat(amount),
                                                                due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                                                            });
                                                            toast.success('تم إصدار الفاتورة وإشعار العميل بنجاح');
                                                        } catch (e) {
                                                            toast.error('فشل إصدار الفاتورة');
                                                        }
                                                    }}
                                                    className="w-full py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center gap-2 transition-all font-bold text-xs"
                                                >
                                                    <Smartphone size={16} />
                                                    <span>إصدار فاتورة دفع</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timeline Stages */}
                                    <div className="bg-dark-800 border border-gray-700 rounded-2xl p-5">
                                        <h3 className="text-sm font-bold text-white mb-4">المرحلة الحالية</h3>
                                        <div className="space-y-2">
                                            {ROADMAP_STAGES.map((stage) => {
                                                const isCurrent = (selectedRequest.project_stage || 'analysis') === stage.id;
                                                return (
                                                    <div key={stage.id} className="space-y-2">
                                                        <button
                                                            type="button"
                                                            className={`w-full text-right px-4 py-3 rounded-xl border transition-all flex items-center justify-between group cursor-pointer ${isCurrent
                                                                ? 'bg-primary-500/10 border-primary-500 text-primary-400'
                                                                : 'bg-dark-900 border-gray-800 text-gray-500 hover:border-gray-600'
                                                                }`}
                                                            onClick={async () => {
                                                                try {
                                                                    await dataService.updateGeneratedProject(selectedRequest.id, { project_stage: stage.id });

                                                                    // Notify Client
                                                                    await dataService.sendNotification({
                                                                        user_email: selectedRequest.user_email,
                                                                        title: ' تقدم في المشروع! 🚀',
                                                                        message: `انتقل مشروعك (${selectedRequest.project_name}) إلى مرحلة: ${stage.label}`,
                                                                        type: 'success',
                                                                        link: `/portal/project/${selectedRequest.id}`
                                                                    });

                                                                    toast.success(`تم التحديث لمرحلة ${stage.label}`);
                                                                    setSelectedRequest(prev => ({ ...prev, project_stage: stage.id }));
                                                                    setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, project_stage: stage.id } : r));
                                                                } catch (e) {
                                                                    toast.error('فشل تحديث المرحلة');
                                                                }
                                                            }}
                                                        >
                                                            <span className="font-bold text-xs">{stage.label}</span>
                                                            <div className="flex items-center gap-2">
                                                                {isCurrent && <CheckCircle2 size={16} className="text-primary-500" />}
                                                                <button
                                                                    type="button"
                                                                    title="رفع ملف لهذه المرحلة"
                                                                    className="p-1.5 hover:bg-white/10 rounded-lg cursor-pointer text-gray-400 hover:text-white transition-colors"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        const input = document.getElementById(`file-stage-${stage.id}`);
                                                                        if (input) input.click();
                                                                    }}
                                                                >
                                                                    <Plus size={16} />
                                                                </button>
                                                                <input
                                                                    id={`file-stage-${stage.id}`}
                                                                    type="file"
                                                                    hidden
                                                                    onChange={(e) => handleFileUpload(e, stage.id)}
                                                                />
                                                            </div>
                                                        </button>
                                                        {selectedRequest.files?.some(f => f.stage === stage.id) && (
                                                            <div className="pr-4 py-1 space-y-1">
                                                                {selectedRequest.files.filter(f => f.stage === stage.id).map((f, i) => (
                                                                    <div key={i} className="text-[10px] text-gray-500 flex items-center gap-1">
                                                                        <FileText size={10} />
                                                                        <span className="truncate max-w-[150px]">{f.name}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {selectedRequest.files && selectedRequest.files.length > 0 && (
                                    <div className="pt-6 border-t border-gray-800">
                                        <h3 className="text-sm font-bold text-white mb-4">الملفات والموارد</h3>
                                        <div className="bg-dark-950 rounded-2xl border border-gray-800 overflow-hidden h-[300px]">
                                            <FileViewer
                                                files={selectedRequest.files}
                                                onDownload={() => downloadProjectBlueprint(selectedRequest)}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="pt-6 border-t border-gray-800">
                                    <h3 className="text-sm font-bold text-white mb-4">بيئة التطوير (IDE)</h3>
                                    <LiveCodeEditor project={selectedRequest} userRole="admin" />
                                </div>

                                <div className="pt-6 border-t border-gray-800">
                                    <ProjectChat project={selectedRequest} userRole="admin" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageRequests;
