import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Search, ArrowUpRight, ArrowDownLeft, Calendar, DollarSign, Filter } from 'lucide-react';
import { dataService } from '../../utils/dataService';

const ManageFinance = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({ total: 0, count: 0, pending: 0 });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await dataService.fetchAllTransactions();
            setTransactions(data);

            // Calculate stats
            const total = data.reduce((sum, t) => t.payment_status === 'completed' ? sum + (Number(t.amount) || 0) : sum, 0);
            const pending = data.filter(t => t.payment_status === 'pending').length;

            setStats({
                total,
                count: data.length,
                pending
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = transactions.filter(t => {
        const searchString = searchTerm.toLowerCase();
        return (
            (t.leads?.name || '').toLowerCase().includes(searchString) ||
            (t.leads?.email || '').toLowerCase().includes(searchString) ||
            (t.transaction_type || '').toLowerCase().includes(searchString) ||
            String(t.amount).includes(searchString)
        );
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return <span className="px-2 py-1 rounded text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">مكتملة</span>;
            case 'pending':
                return <span className="px-2 py-1 rounded text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">معلقة</span>;
            case 'failed':
                return <span className="px-2 py-1 rounded text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">فشلت</span>;
            default:
                return <span className="px-2 py-1 rounded text-xs font-bold bg-gray-500/10 text-gray-400 border border-gray-500/20">{status}</span>;
        }
    };

    return (
        <div className="space-y-6 font-cairo" dir="rtl">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-dark-900 to-dark-800 border border-gray-800 p-6 rounded-2xl"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-primary-500/10 rounded-xl">
                            <DollarSign className="text-primary-400" size={24} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.total.toLocaleString()} ر.س</div>
                    <div className="text-sm text-gray-400">إجمالي الإيرادات</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-dark-900 to-dark-800 border border-gray-800 p-6 rounded-2xl"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <Wallet className="text-blue-400" size={24} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.count}</div>
                    <div className="text-sm text-gray-400">عدد العمليات</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-dark-900 to-dark-800 border border-gray-800 p-6 rounded-2xl"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-yellow-500/10 rounded-xl">
                            <Clock className="text-yellow-400" size={24} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.pending}</div>
                    <div className="text-sm text-gray-400">عمليات معلقة</div>
                </motion.div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Filter className="text-primary-500" size={20} />
                    سجل العمليات المالية
                </h2>
                <div className="relative w-full md:w-auto">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="بحث برقم العملية، اسم العميل..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-80 bg-dark-900 border border-gray-700 rounded-xl py-2 pr-10 pl-4 text-white focus:outline-none focus:border-primary-500 transition-colors"
                    />
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-400">جاري تحميل السجلات...</p>
                </div>
            ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-12 bg-dark-800/30 rounded-2xl border border-dashed border-gray-800">
                    <p className="text-gray-500">لا توجد عمليات مالية مسجلة</p>
                </div>
            ) : (
                <div className="bg-dark-900 border border-gray-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-dark-800 text-gray-400 text-sm">
                                <tr>
                                    <th className="px-6 py-4 font-medium">العملية</th>
                                    <th className="px-6 py-4 font-medium">العميل</th>
                                    <th className="px-6 py-4 font-medium">المبلغ</th>
                                    <th className="px-6 py-4 font-medium">الحالة</th>
                                    <th className="px-6 py-4 font-medium">التاريخ</th>
                                    <th className="px-6 py-4 font-medium">تفاصيل</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {filteredTransactions.map((t) => (
                                    <motion.tr
                                        key={t.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-dark-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${t.transaction_type === 'purchase' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                                    {t.transaction_type === 'purchase' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                                                </div>
                                                <span className="font-medium text-white">
                                                    {t.transaction_type === 'purchase' ? 'شراء خدمات/دومين' : 'شحن رصيد'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                <div className="text-white font-medium">{t.leads?.name || 'زائر'}</div>
                                                <div className="text-gray-500 text-xs font-mono">{t.leads?.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-white font-bold font-mono text-lg">{t.amount} ر.س</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(t.payment_status)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm font-mono">
                                            {new Date(t.created_at).toLocaleDateString('en-US')}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm max-w-xs truncate">
                                            {t.notes || '-'}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageFinance;
