import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, PenTool, AlertCircle, ChevronLeft, CreditCard } from 'lucide-react';
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
                            <h1 className="text-4xl font-extrabold text-white tracking-tight">الوثائق القانونية</h1>
                        </div>
                        <p className="text-gray-400 flex items-center gap-2 pr-12">
                            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                            توقيع ومراجعة العقود والاتفاقيات التقنية
                        </p>
                    </motion.div>

                    <div className="flex items-center gap-3 bg-dark-800/40 p-2 rounded-2xl border border-white/5 backdrop-blur-md">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-widest border border-purple-500/10">
                            Verified Legal
                        </div>
                    </div>
                </div>

                <div className="grid gap-8">
                    {loading ? (
                        [1, 2].map(i => (
                            <div key={i} className="h-40 rounded-[2.5rem] bg-white/5 animate-pulse border border-white/5"></div>
                        ))
                    ) : contracts.length === 0 ? (
                        <div className="glass-panel rounded-[3rem] p-20 text-center border border-white/5 bg-dark-800/20">
                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-700">
                                <FileText size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-400">لا توجد عقود حالياً</h3>
                            <p className="text-gray-500 mt-2">سيتم إصدار عقودك فور تفعيل طلبات المشاريع.</p>
                        </div>
                    ) : (
                        contracts.map((contract, idx) => (
                            <motion.div
                                key={contract.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`relative group`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r ${contract.status === 'pending' ? 'from-amber-600/10' : 'from-emerald-600/10'} to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />

                                <div className={`relative glass-panel p-8 rounded-[2.5rem] border ${contract.status === 'pending' ? 'border-amber-500/30' : 'border-white/5'} bg-dark-800/20 hover:bg-dark-800/40 transition-all flex flex-col lg:flex-row items-center gap-8`}>
                                    <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center shrink-0 shadow-2xl transition-transform group-hover:scale-105 ${contract.status === 'signed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                        }`}>
                                        <FileText size={40} strokeWidth={1.5} />
                                    </div>

                                    <div className="flex-1 text-center lg:text-right">
                                        <div className="flex flex-col lg:flex-row items-center gap-3 mb-3">
                                            <h3 className="text-2xl font-black text-white">{contract.title}</h3>
                                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${contract.status === 'signed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                                                }`}>
                                                {contract.status === 'signed' ? 'تم التوقيع' : 'بانتظار توقيعك'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-center lg:justify-start gap-4 text-sm font-medium text-gray-500">
                                            <span className="flex items-center gap-2 underline underline-offset-4 decoration-white/10 opacity-80 decoration-2">مشروع: {contract.project}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-800"></span>
                                            <span className="font-mono">{contract.date}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 shrink-0 border-t lg:border-t-0 lg:border-r border-white/5 pt-8 lg:pt-0 lg:pr-8 w-full lg:w-auto">
                                        {contract.status === 'pending' ? (
                                            <div className="grid grid-cols-2 lg:flex gap-4 w-full">
                                                <button className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black text-xs border border-white/10 transition-all flex items-center justify-center gap-2">
                                                    <Download size={18} />
                                                    <span>مراجعة</span>
                                                </button>
                                                <button
                                                    onClick={() => handleSign(contract.id)}
                                                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-dark-900 font-black text-xs shadow-xl shadow-amber-500/20 hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <PenTool size={18} />
                                                    <span>توقيع العقد</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-end">
                                                <div className="text-right">
                                                    <div className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">تاريخ الاعتماد التقني</div>
                                                    <div className="text-xs font-black text-emerald-400 font-mono tracking-tight">{contract.signed_at || 'Digital ID Verified'}</div>
                                                </div>
                                                <div className="flex gap-4">
                                                    <button className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5">
                                                        <Download size={20} />
                                                    </button>
                                                    <Link
                                                        to="/portal/finance"
                                                        className="px-6 py-4 rounded-2xl bg-primary-600 hover:bg-primary-500 text-dark-900 font-black text-xs shadow-xl shadow-primary-500/20 active:scale-95 transition-all flex items-center gap-2"
                                                    >
                                                        <CreditCard size={18} />
                                                        <span>تتبع المالية</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {contract.status === 'pending' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mt-6 flex items-center gap-3 text-amber-400 bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10 text-xs font-bold"
                                    >
                                        <AlertCircle size={16} />
                                        <span>توقيعك على هذا العقد يمثل موافقتك الرسمية للبدء في مراحل التطوير التقني فوراً.</span>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientContracts;
