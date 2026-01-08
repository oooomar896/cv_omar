import { useState, useEffect } from 'react';
import {
    Search,
    Eye,
    MessageSquare,
    Smartphone,
    Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dataService } from '../../utils/dataService';
import Toast from '../../components/common/Toast';
import FileViewer from '../platform/FileViewer';

const ManageRequests = () => {
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [filter, setFilter] = useState('all'); // all, pending, completed
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

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
        const data = await dataService.fetchGeneratedProjects();
        setRequests(data);
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

    return (
        <div className="space-y-6 font-cairo" dir="rtl">
            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}

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
                {filteredRequests.map((req) => {
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
                })}
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
                            </div>

                            {selectedRequest.files && (
                                <div className="mt-6 border-t border-gray-800 pt-6">
                                    <h3 className="text-lg font-bold text-white mb-4">المخطط التقني (Blueprint)</h3>
                                    <div className="bg-dark-950 rounded-2xl border border-gray-800 overflow-hidden max-h-[400px] overflow-y-auto">
                                        <FileViewer
                                            files={selectedRequest.files}
                                            onDownload={() => {
                                                const blob = new Blob([JSON.stringify(selectedRequest.files, null, 2)], { type: 'application/json' });
                                                const url = URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = `blueprint_${selectedRequest.id}.json`;
                                                document.body.appendChild(a);
                                                a.click();
                                                document.body.removeChild(a);
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageRequests;
