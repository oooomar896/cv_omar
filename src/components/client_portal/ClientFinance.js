import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, DollarSign, CheckCircle, Clock, ChevronLeft, ShieldCheck, Download, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../../utils/supabaseClient';
import { dataService } from '../../utils/dataService';

const ClientFinance = () => {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [processingPayment, setProcessingPayment] = useState(false);

    const [stats, setStats] = useState({ total: 0, paid: 0, remaining: 0 });
    const [invoices, setInvoices] = useState([]);

    const loadFinanceData = async () => {
        try {
            const email = localStorage.getItem('portal_user');
            if (!email) return;

            // Fetch Real Invoices from DB
            const dbInvoices = await dataService.fetchInvoices(email);

            // Normalize for UI
            const formattedInvoices = dbInvoices.map(inv => ({
                id: inv.id,
                displayId: `INV-${inv.id.substring(0, 6)}`,
                title: inv.generated_projects?.project_name ? `فاتورة مشروع: ${inv.generated_projects.project_name}` : 'فاتورة خدمات عامة',
                amount: parseFloat(inv.amount),
                date: new Date(inv.created_at).toLocaleDateString('ar-SA'),
                status: inv.status,
                project: inv.generated_projects?.project_name || 'عام'
            }));

            setInvoices(formattedInvoices);

            // Calculate Stats
            const total = formattedInvoices.reduce((acc, curr) => acc + curr.amount, 0);
            const paid = formattedInvoices.filter(i => i.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);

            setStats({
                total,
                paid,
                remaining: total - paid
            });

        } catch (err) {
            console.error('Error fetching finances:', err);
            toast.error('حدث خطأ أثناء جلب البيانات المالية');
        }
    };

    useEffect(() => {
        loadFinanceData();
    }, []);

    const handlePayClick = (invoice) => {
        setSelectedInvoice(invoice);
        setIsPaymentModalOpen(true);
    };

    const processPayment = async () => {
        setProcessingPayment(true);
        try {
            // Update invoice in Supabase
            const { error } = await supabase
                .from('invoices')
                .update({
                    status: 'paid',
                    paid_at: new Date().toISOString()
                })
                .eq('id', selectedInvoice.id);

            if (error) throw error;

            // Notify Admin
            await dataService.sendNotification({
                user_email: 'oooomar896@gmail.com',
                title: 'تم استلام دفعة جديدة 💰',
                message: `قام العميل بسداد فاتورة بقيمة ${selectedInvoice.amount} SAR.`,
                type: 'success'
            });

            toast.success(`تم سداد الفاتورة بنجاح!`);
            await loadFinanceData();
            setIsPaymentModalOpen(false);
        } catch (error) {
            console.error(error);
            toast.error('فشل معالجة الدفع');
        } finally {
            setProcessingPayment(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 text-white font-cairo p-4 md:p-8" dir="rtl">
            <div className="max-w-6xl mx-auto">
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
                                <h1 className="text-4xl font-extrabold text-white tracking-tight">الشوؤن المالية</h1>
                            </div>
                            <p className="text-gray-400 flex items-center gap-2 pr-12">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                إدارة المدفوعات، الفواتير، والميزانية التقنية للمشاريع
                            </p>
                        </motion.div>

                        <div className="flex items-center gap-3 bg-dark-800/40 p-2 rounded-2xl border border-white/5 backdrop-blur-md">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-widest border border-emerald-500/10">
                                Secure Transact
                            </div>
                        </div>
                    </div>

                    {/* Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {[
                            { label: 'إجمالي قيمة المشاريع', value: stats.total, color: 'text-primary-400', bg: 'bg-primary-500/10', icon: DollarSign, suffix: 'ر.س' },
                            { label: 'قيمة الدفعات المسددة', value: stats.paid, color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle, suffix: 'ر.س' },
                            { label: 'إجمالي المبالغ المتبقية', value: stats.remaining, color: 'text-amber-400', bg: 'bg-amber-500/10', icon: Clock, suffix: 'ر.س' },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="glass-panel p-8 rounded-[2.5rem] border border-white/5 bg-dark-800/30 relative overflow-hidden group cursor-default"
                            >
                                <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -ml-16 -mt-16 group-hover:bg-white/10 transition-colors"></div>

                                <div className="relative">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className={`p-4 rounded-3xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                            <stat.icon size={28} />
                                        </div>
                                        <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Digital Ledger</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{stat.label}</div>
                                        <div className="flex items-baseline gap-2">
                                            <div className={`text-4xl font-black ${stat.color} font-mono tracking-tighter`}>{stat.value.toLocaleString()}</div>
                                            <span className="text-xs text-gray-500 font-bold">{stat.suffix}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Invoices List */}
                    <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
                        <div className="p-6 border-b border-white/5">
                            <h3 className="font-bold text-lg">سجل الفواتير</h3>
                        </div>
                        <div className="divide-y divide-white/5">
                            {invoices.map((invoice) => (
                                <div key={invoice.id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${invoice.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                            }`}>
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white mb-1">{invoice.title}</div>
                                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                                <span className="font-mono">{invoice.id}</span>
                                                <span>•</span>
                                                <span>{invoice.date}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                        <div className="font-mono font-bold text-lg">{invoice.amount.toLocaleString()} ر.س</div>

                                        {invoice.status === 'paid' ? (
                                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-sm transition-colors border border-white/5">
                                                <Download size={16} />
                                                <span>الفاتورة</span>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handlePayClick(invoice)}
                                                className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-105"
                                            >
                                                سداد الآن
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Payment Modal */}
                <AnimatePresence>
                    {isPaymentModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="w-full max-w-md bg-dark-900 border border-gray-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl"
                            >
                                {/* Decorative Background */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -mr-16 -mt-16 rounded-full" />

                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <ShieldCheck className="text-emerald-500" />
                                    بوابة الدفع الآمن
                                </h2>

                                <div className="bg-dark-800 p-4 rounded-xl mb-6 border border-white/5">
                                    <div className="text-sm text-gray-400 mb-1">المبلغ المستحق</div>
                                    <div className="text-3xl font-bold text-white font-mono">{selectedInvoice?.amount.toLocaleString()} ر.س</div>
                                    <div className="text-xs text-gray-500 mt-1">{selectedInvoice?.title}</div>
                                </div>

                                {/* Payment Form Mock */}
                                <div className="space-y-4 mb-8">
                                    <div>
                                        <label htmlFor="card-number" className="text-xs text-gray-400 mb-1 block">رقم البطاقة</label>
                                        <div className="relative">
                                            <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                            <input id="card-number" type="text" placeholder="0000 0000 0000 0000" className="w-full bg-dark-950 border border-gray-700 rounded-lg py-3 pr-10 pl-4 text-sm font-mono focus:border-emerald-500 outline-none transition-colors" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="expiry-date" className="text-xs text-gray-400 mb-1 block">تاريخ الانتهاء</label>
                                            <input id="expiry-date" type="text" placeholder="MM/YY" className="w-full bg-dark-950 border border-gray-700 rounded-lg py-3 px-4 text-sm font-mono focus:border-emerald-500 outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label htmlFor="cvc" className="text-xs text-gray-400 mb-1 block">CVC</label>
                                            <input id="cvc" type="text" placeholder="123" className="w-full bg-dark-950 border border-gray-700 rounded-lg py-3 px-4 text-sm font-mono focus:border-emerald-500 outline-none transition-colors" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsPaymentModalOpen(false)}
                                        className="flex-1 py-3 rounded-xl border border-gray-700 hover:bg-white/5 transition-colors font-bold text-sm"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        onClick={processPayment}
                                        disabled={processingPayment}
                                        className="flex-[2] py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        {processingPayment ? (
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <ShieldCheck size={18} />
                                                <span>تأكيد الدفع الآمن</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ClientFinance;
