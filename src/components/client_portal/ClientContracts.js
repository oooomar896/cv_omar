import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, Download, PenTool, AlertCircle, ChevronLeft, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dataService } from '../../utils/dataService';
import toast from 'react-hot-toast';

const ClientContracts = () => {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadContracts();
    }, []);

    const loadContracts = async () => {
        setLoading(true);
        const userEmail = localStorage.getItem('portal_user');

        try {
            const data = await dataService.getContracts(userEmail);

            // Initial Seed if empty (Demo Purpose)
            if (data.length === 0) {
                const seed = [
                    {
                        id: 101,
                        title: 'اتفاقية عدم الإفصاح (NDA)',
                        project: 'منصة التجارة الإلكترونية AI',
                        date: '2024-01-05',
                        status: 'signed',
                        signed_at: '2024-01-05 10:30 AM',
                        amount: '-'
                    }
                ];
                setContracts(seed);
            } else {
                setContracts(data);
            }
        } catch (error) {
            console.error('Failed to load contracts', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSign = async (id) => {
        try {
            await dataService.signContract(id);
            toast.success('تم توقيع العقد بنجاح');

            // Refresh local state
            setContracts(prev => prev.map(c =>
                c.id === id ? { ...c, status: 'signed', signed_at: new Date().toLocaleString('en-US') } : c
            ));
        } catch (error) {
            toast.error('حدث خطأ أثناء التوقيع');
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 text-white font-cairo p-4 md:p-8" dir="rtl">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/portal/dashboard" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                        <ChevronLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <FileText className="text-purple-400" />
                            العقود والاتفاقيات
                        </h1>
                        <p className="text-gray-400 text-sm">مراجعة وتوقيع العقود الخاصة بمشاريعك</p>
                    </div>
                </div>

                <div className="grid gap-6">
                    {contracts.length === 0 && !loading && (
                        <div className="text-center py-12 text-gray-500">لا توجد عقود حالياً</div>
                    )}

                    {contracts.map((contract) => (
                        <motion.div
                            key={contract.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`glass-panel p-6 rounded-2xl border ${contract.status === 'pending' ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/5'}`}
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-start gap-4">
                                    <div className={`p-4 rounded-xl ${contract.status === 'signed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                        <FileText size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1">{contract.title}</h3>
                                        <p className="text-sm text-gray-400 mb-2">مشروع: {contract.project}</p>
                                        <div className="flex items-center gap-3 text-xs">
                                            <span className="bg-white/5 px-2 py-1 rounded-md text-gray-400 font-mono">{contract.date}</span>
                                            {contract.amount && <span className="bg-white/5 px-2 py-1 rounded-md text-gray-300 font-bold">{contract.amount}</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    {contract.status === 'pending' ? (
                                        <div className="flex gap-3 w-full md:w-auto">
                                            <button className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm">
                                                <Download size={16} />
                                                <span>مسودة PDF</span>
                                            </button>
                                            <button
                                                onClick={() => handleSign(contract.id)}
                                                className="flex-1 px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2 text-sm"
                                            >
                                                <PenTool size={16} />
                                                <span>توقيع الآن</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden md:block">
                                                <div className="text-xs text-gray-400 mb-1">تم التوقيع في</div>
                                                <div className="text-xs font-mono text-emerald-400">{contract.signed_at || 'Maldia Platform'}</div>
                                            </div>
                                            <button className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 cursor-default">
                                                <CheckCircle size={18} />
                                                <span className="text-sm font-bold hidden md:inline">معتمد</span>
                                            </button>
                                            <Link
                                                to="/portal/finance"
                                                className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/20 flex items-center gap-2 transition-all"
                                            >
                                                <CreditCard size={18} />
                                                <span className="text-sm font-bold">سداد الدفعات</span>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {contract.status === 'pending' && (
                                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-amber-400 text-xs">
                                    <AlertCircle size={14} />
                                    <span>يرجى مراجعة العقد وتوقيعه للبدء في المرحلة التالية من المشروع.</span>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClientContracts;
