import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Filter, CheckCircle, Clock } from 'lucide-react';
import { dataService } from '../../utils/dataService';
import toast from 'react-hot-toast';

const ManageContracts = () => {
    const [contracts, setContracts] = useState([]);
    const [filteredContracts, setFilteredContracts] = useState([]);
    const [filter, setFilter] = useState('all'); // all, signed, pending
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadContracts();
    }, []);

    useEffect(() => {
        let result = [...contracts];

        // Status Filter
        if (filter !== 'all') {
            result = result.filter(c => c.status === filter);
        }

        // Search Filter
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(c =>
                c.title.toLowerCase().includes(lowerTerm) ||
                (c.user_email && c.user_email.toLowerCase().includes(lowerTerm)) ||
                (c.project && c.project.toLowerCase().includes(lowerTerm))
            );
        }

        setFilteredContracts(result);
    }, [contracts, filter, searchTerm]);

    const loadContracts = async () => {
        setLoading(true);
        try {
            // Passing null/undefined fetches all contracts (Admin Mode)
            const data = await dataService.getContracts();
            if (data) setContracts(data);
        } catch (error) {
            console.error(error);
            toast.error('فشل تحميل العقود');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        if (status === 'signed') {
            return (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                    <CheckCircle size={14} />
                    موقع
                </span>
            );
        }
        return (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
                <Clock size={14} />
                معلق
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-dark-900/50">
                    <h3 className="text-gray-400 text-sm mb-2">إجمالي العقود</h3>
                    <div className="text-3xl font-bold text-white">{contracts.length}</div>
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                    <h3 className="text-emerald-400 text-sm mb-2">العقود الموقعة</h3>
                    <div className="text-3xl font-bold text-white">
                        {contracts.filter(c => c.status === 'signed').length}
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                    <h3 className="text-amber-400 text-sm mb-2">في انتظار التوقيع</h3>
                    <div className="text-3xl font-bold text-white">
                        {contracts.filter(c => c.status === 'pending').length}
                    </div>
                </div>
            </div>

            {/* Filters Area */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-dark-900/50 p-4 rounded-2xl border border-white/5">
                <div className="relative w-full md:w-96">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="بحث برقم العقد، العميل، أو المشروع..."
                        className="w-full bg-dark-950 border border-gray-800 rounded-xl pr-12 pl-4 py-3 text-sm focus:border-primary-500 outline-none transition-all text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {['all', 'signed', 'pending'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${filter === f
                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                                    : 'bg-dark-950 text-gray-400 hover:text-white border border-gray-800'
                                }`}
                        >
                            {f === 'all' ? 'الكل' : f === 'signed' ? 'موقعة' : 'معلقة'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Contracts List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-12 text-gray-500">جاري تحميل العقود...</div>
                ) : filteredContracts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 border border-dashed border-gray-800 rounded-2xl">
                        لا توجد عقود مطابقة للبحث
                    </div>
                ) : (
                    filteredContracts.map((contract) => (
                        <motion.div
                            layout
                            key={contract.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-dark-900 border border-gray-800 rounded-2xl p-6 hover:border-primary-500/30 transition-all group relative overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg ${contract.status === 'signed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                        }`}>
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                            {contract.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mt-1">
                                            <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded text-xs">
                                                {contract.user_email || 'بدون إيميل'}
                                            </span>
                                            <span>•</span>
                                            <span>{contract.project}</span>
                                            <span>•</span>
                                            <span className="font-mono">{contract.date}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                    <div className="text-left">
                                        <div className="text-xs text-gray-500 mb-1">قيمة العقد</div>
                                        <div className="font-mono font-bold text-white text-lg">{contract.amount || '-'}</div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        {getStatusBadge(contract.status)}
                                        {contract.signed_at && (
                                            <span className="text-[10px] text-emerald-500/70 font-mono">
                                                {contract.signed_at.split('T')[0]}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageContracts;
