import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, DollarSign, CheckCircle, Clock, ChevronLeft, ShieldCheck, Download, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ClientFinance = () => {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [processingPayment, setProcessingPayment] = useState(false);

    // Mock Data for Finance
    const [invoices, setInvoices] = useState([
        { id: 'INV-2024-001', title: 'الدفعة المقدمة - مشروع التجارة الإلكترونية', amount: 15000, date: '2024-01-05', status: 'paid', project: 'منصة التجارة الإلكترونية AI' },
        { id: 'INV-2024-002', title: 'الدفعة الثانية - مرحلة التطوير', amount: 15000, date: '2024-02-01', status: 'pending', project: 'منصة التجارة الإلكترونية AI' },
        { id: 'INV-2024-003', title: 'الدفعة النهائية - التسليم', amount: 15000, date: '2024-02-15', status: 'pending', project: 'منصة التجارة الإلكترونية AI' },
    ]);

    const stats = {
        total: 45000,
        paid: 15000,
        remaining: 30000
    };

    const handlePayClick = (invoice) => {
        setSelectedInvoice(invoice);
        setIsPaymentModalOpen(true);
    };

    const processPayment = () => {
        setProcessingPayment(true);
        setTimeout(() => {
            setInvoices(current => current.map(inv =>
                inv.id === selectedInvoice.id ? { ...inv, status: 'paid' } : inv
            ));
            setProcessingPayment(false);
            setIsPaymentModalOpen(false);
            toast.success(`تم سداد الفاتورة ${selectedInvoice.id} بنجاح!`);
        }, 2000);
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
                            <CreditCard className="text-emerald-400" />
                            المالية والفواتير
                        </h1>
                        <p className="text-gray-400 text-sm">متابعة الدفعات والفواتير المستحقة</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-dark-800/50">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-400 text-sm">إجمالي المشروع</h3>
                            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><DollarSign size={20} /></div>
                        </div>
                        <div className="text-3xl font-bold">{stats.total.toLocaleString()} ر.س</div>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-emerald-400 text-sm">المدفوع</h3>
                            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg"><CheckCircle size={20} /></div>
                        </div>
                        <div className="text-3xl font-bold text-emerald-500">{stats.paid.toLocaleString()} ر.س</div>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-amber-400 text-sm">المتبقي</h3>
                            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg"><Clock size={20} /></div>
                        </div>
                        <div className="text-3xl font-bold text-amber-500">{stats.remaining.toLocaleString()} ر.س</div>
                    </div>
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
    );
};

export default ClientFinance;
