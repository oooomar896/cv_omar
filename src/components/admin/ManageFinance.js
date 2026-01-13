import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Search, ArrowUpRight, ArrowDownLeft, DollarSign, Filter, Clock } from 'lucide-react';
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
        const styles = {
            completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10',
            pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/10',
            failed: 'bg-red-500/10 text-red-400 border-red-500/20 shadow-red-500/10'
        };
        const labels = {
            completed: 'مكتملة',
            pending: 'معلقة',
            failed: 'فشلت'
        };
        const currentStyle = styles[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-lg backdrop-blur-md ${currentStyle}`}>
                {labels[status] || status}
            </span>
        );
    };

    // Calculate monthly data for chart (Simple Mock Logic for Demo)
    const chartData = [30, 45, 25, 60, 75, 50, 90].map(h => h + Math.random() * 20);

    return (
        <div className="space-y-8 font-cairo text-right" dir="rtl">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-6 rounded-3xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 left-0 w-24 h-24 bg-primary-500/20 rounded-full blur-3xl -ml-12 -mt-12 group-hover:bg-primary-500/30 transition-all"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                            <DollarSign className="text-primary-400" size={28} />
                        </div>
                        <span className="text-xs font-mono text-green-400 bg-green-500/10 px-2 py-1 rounded-lg">+12.5%</span>
                    </div>
                    <div className="text-4xl font-black text-white mb-1 tracking-tight">{stats.total.toLocaleString()} <span className="text-lg font-medium text-gray-400">ر.س</span></div>
                    <div className="text-sm text-gray-400 font-medium">إجمالي الإيرادات</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 rounded-3xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 left-0 w-24 h-24 bg-blue-500/20 rounded-full blur-3xl -ml-12 -mt-12 group-hover:bg-blue-500/30 transition-all"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                            <Wallet className="text-blue-400" size={28} />
                        </div>
                    </div>
                    <div className="text-4xl font-black text-white mb-1 tracking-tight">{stats.count}</div>
                    <div className="text-sm text-gray-400 font-medium">عدد العمليات الناجحة</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 rounded-3xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 left-0 w-24 h-24 bg-orange-500/20 rounded-full blur-3xl -ml-12 -mt-12 group-hover:bg-orange-500/30 transition-all"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                            <Clock className="text-orange-400" size={28} />
                        </div>
                    </div>
                    <div className="text-4xl font-black text-white mb-1 tracking-tight">{stats.pending}</div>
                    <div className="text-sm text-gray-400 font-medium">عمليات قيد المراجعة</div>
                </motion.div>
            </div>

            {/* Revenue Chart Section */}
            <div className="glass-panel p-8 rounded-3xl border border-white/5">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <ArrowUpRight className="text-green-400" />
                    النمو المالي (آخر 7 أشهر)
                </h3>
                <div className="h-64 flex items-end justify-between gap-2 md:gap-4 px-2">
                    {chartData.map((val, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="w-full bg-dark-800 rounded-t-2xl relative h-full flex items-end overflow-hidden">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${val}%` }}
                                    transition={{ duration: 1, delay: idx * 0.1 }}
                                    className="w-full bg-gradient-to-t from-primary-900/50 to-primary-500 rounded-t-xl relative group-hover:to-primary-400 transition-colors"
                                >
                                    <div className="absolute top-0 inset-x-0 h-[2px] bg-primary-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                </motion.div>
                            </div>
                            <span className="text-xs text-gray-500 font-mono">شهر {idx + 1}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Filter className="text-primary-500" size={20} />
                        سجل العمليات الأخيرة
                    </h2>
                    <div className="relative w-full md:w-auto group">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="بحث..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-80 bg-black/20 border border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-white focus:outline-none focus:border-primary-500/50 transition-all focus:bg-black/40 text-sm"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-400 animate-pulse">جاري جلب البيانات المالية...</p>
                    </div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <DollarSign className="text-gray-600" size={32} />
                        </div>
                        <p className="text-gray-500">لا توجد عمليات مطابقة</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-black/20 text-gray-400 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">نوع العملية</th>
                                    <th className="px-6 py-4 font-semibold">العميل</th>
                                    <th className="px-6 py-4 font-semibold">المبلغ</th>
                                    <th className="px-6 py-4 font-semibold">الحالة</th>
                                    <th className="px-6 py-4 font-semibold">التاريخ</th>
                                    <th className="px-6 py-4 font-semibold">ملاحظات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredTransactions.map((t) => (
                                    <motion.tr
                                        key={t.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-white/5 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${t.transaction_type === 'purchase' ? 'bg-primary-500/10 text-primary-400' : 'bg-secondary-500/10 text-secondary-400'}`}>
                                                    {t.transaction_type === 'purchase' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                                                </div>
                                                <span className="font-bold text-gray-200 text-sm">
                                                    {t.transaction_type === 'purchase' ? 'دفع إلكتروني' : 'استرداد'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-white font-medium text-sm">{t.leads?.name || 'زائر مجهول'}</span>
                                                <span className="text-gray-500 text-xs font-mono">{t.leads?.email || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-white font-black font-mono text-lg tracking-wide">{t.amount} <span className="text-xs text-gray-500">SAR</span></span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(t.payment_status)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm font-mono whitespace-nowrap">
                                            {new Date(t.created_at).toLocaleDateString('en-GB')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-500 text-xs truncate max-w-[150px] inline-block" title={t.notes}>{t.notes || '-'}</span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageFinance;
