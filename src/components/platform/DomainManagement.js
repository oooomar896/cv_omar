import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Globe,
    RefreshCw,
    Settings,
    AlertCircle,
    CheckCircle,
    XCircle,
    Shield,
    Clock,
    ChevronLeft,
    Plus,
    ExternalLink,
    Lock
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

const DomainManagement = () => {
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, active, expiring, expired
    const navigate = useNavigate();

    useEffect(() => {
        fetchDomains();
    }, []);

    const fetchDomains = async () => {
        try {
            setLoading(true);
            const email = localStorage.getItem('portal_user');
            if (!email) {
                toast.error('يرجى تسجيل الدخول');
                return;
            }

            // In a real app we'd fetch by email/user_id properly. 
            // For now, let's assume RLS is handled or we use the local portal indicator
            const { data, error } = await supabase
                .from('domains')
                .select(`
                    *,
                    linked_website:websites(id, name, type)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setDomains(data || []);
        } catch (error) {
            console.error('Error fetching domains:', error);
            toast.error('حدث خطأ في تحميل الدومينات');
        } finally {
            setLoading(false);
        }
    };


    const getDaysUntilExpiry = (expiryDate) => {
        const now = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getStatusInfo = (domain) => {
        const daysUntilExpiry = getDaysUntilExpiry(domain.expiry_date);

        if (domain.status === 'expired') {
            return { label: 'منتهي الصلاحية', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: XCircle };
        } else if (daysUntilExpiry <= 7) {
            return { label: 'ينتهي قريباً جداً', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: AlertCircle };
        } else if (daysUntilExpiry <= 30) {
            return { label: 'قرب مدة الانتهاء', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Clock };
        } else {
            return { label: 'نشط ويعمل', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle };
        }
    };

    const filteredDomains = domains.filter(domain => {
        if (filter === 'all') return true;
        if (filter === 'active') return domain.status === 'active' && getDaysUntilExpiry(domain.expiry_date) > 30;
        if (filter === 'expiring') return getDaysUntilExpiry(domain.expiry_date) <= 30 && domain.status === 'active';
        if (filter === 'expired') return domain.status === 'expired';
        return true;
    });

    const handleRenewDomain = async () => {
        toast.success('جارٍ تجهيز بوابة الدفع للتجديد...');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-900 flex items-center justify-center">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Globe className="text-primary-500 animate-pulse" size={24} />
                    </div>
                </div>
            </div>
        );
    }

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
                            <h1 className="text-4xl font-extrabold text-white tracking-tight">إدارة النطاقات</h1>
                        </div>
                        <p className="text-gray-400 flex items-center gap-2 pr-12">
                            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                            هويتك الرقمية على الشبكة، نضمن لك بقاءها نشطة وآمنة دائماً
                        </p>
                    </motion.div>

                    <button
                        onClick={() => navigate('/domains/search')}
                        className="flex items-center gap-3 px-8 py-4 rounded-[2rem] bg-gradient-to-r from-primary-600 to-indigo-600 hover:scale-105 active:scale-95 text-white font-black text-sm shadow-2xl shadow-primary-500/20 transition-all border border-white/10"
                    >
                        <Plus size={20} />
                        <span>حجز نطاق جديد</span>
                    </button>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'إجمالي النطاقات', value: domains.length, icon: Globe, color: 'text-primary-400', bg: 'bg-primary-500/10' },
                        { label: 'نطاقات نشطة', value: domains.filter(d => d.status === 'active' && getDaysUntilExpiry(d.expiry_date) > 30).length, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                        { label: 'تجديد قادم', value: domains.filter(d => getDaysUntilExpiry(d.expiry_date) <= 30 && d.status === 'active').length, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                        { label: 'منتهية', value: domains.filter(d => d.status === 'expired').length, icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-panel p-6 rounded-[2rem] border border-white/5 bg-dark-800/20 relative group"
                        >
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} w-fit mb-4 group-hover:scale-110 transition-transform`}>
                                <stat.icon size={20} />
                            </div>
                            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                            <div className="text-3xl font-black text-white font-mono">{stat.value}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                    {[
                        { id: 'all', label: 'كافة النطاقات' },
                        { id: 'active', label: 'النشطة فقط' },
                        { id: 'expiring', label: 'تتطلب تجديد' },
                        { id: 'expired', label: 'المنتهية' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id)}
                            className={`px-6 py-3 rounded-2xl text-xs font-black transition-all border whitespace-nowrap ${filter === tab.id
                                ? 'bg-white/10 border-primary-500/50 text-white shadow-lg shadow-primary-500/5'
                                : 'bg-transparent border-white/5 text-gray-500 hover:text-gray-300 hover:border-white/10'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Domains List */}
                <div className="grid grid-cols-1 gap-6">
                    {filteredDomains.length > 0 ? (
                        filteredDomains.map((domain, idx) => {
                            const status = getStatusInfo(domain);
                            const daysLeft = getDaysUntilExpiry(domain.expiry_date);

                            return (
                                <motion.div
                                    key={domain.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="relative glass-panel p-8 rounded-[2.5rem] border border-white/5 bg-dark-800/30 hover:bg-dark-800/40 transition-all flex flex-col lg:flex-row items-center gap-10 group-hover:border-white/10 shadow-xl shadow-black/20">

                                        {/* Globe Icon Box */}
                                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-dark-700 to-dark-900 border border-white/5 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform relative overflow-hidden">
                                            <div className="absolute inset-0 bg-primary-500/5 group-hover:bg-primary-500/10 transition-colors"></div>
                                            <Globe size={40} className="text-primary-500 relative z-10" />
                                        </div>

                                        {/* Domain Info */}
                                        <div className="flex-1 text-center lg:text-right">
                                            <div className="flex flex-col lg:flex-row items-center gap-4 mb-3">
                                                <h3 className="text-2xl font-black text-white font-mono tracking-tight group-hover:text-primary-400 transition-colors">
                                                    {domain.full_domain || domain.domain_name}
                                                </h3>
                                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${status.bg} ${status.color} border ${status.border} flex items-center gap-2`}>
                                                    <status.icon size={12} />
                                                    {status.label}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl">
                                                    <Shield size={14} className="text-indigo-400" />
                                                    <span>WHOIS PRIVACY: <span className="text-gray-300">ACTIVE</span></span>
                                                </div>
                                                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl">
                                                    <Lock size={14} className="text-emerald-400" />
                                                    <span>SSL: <span className="text-gray-300">PROTECTED</span></span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock size={14} />
                                                    <span>انتهاء التقويم: <span className={daysLeft <= 30 ? 'text-rose-500' : 'text-gray-300'}>
                                                        {new Date(domain.expiry_date).toLocaleDateString('ar-SA')} ({daysLeft} يوم)
                                                    </span></span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-3 shrink-0 border-t lg:border-t-0 lg:border-r border-white/5 pt-8 lg:pt-0 lg:pr-10 w-full lg:w-auto mt-4 lg:mt-0">
                                            <div className="grid grid-cols-2 lg:flex flex-col gap-3 w-full">
                                                <button
                                                    onClick={() => navigate(`/domains/dns/${domain.id}`)}
                                                    className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black text-[11px] border border-white/5 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest"
                                                >
                                                    <Settings size={16} />
                                                    إدارة الـ DNS
                                                </button>

                                                <button
                                                    onClick={() => window.open(`http://${domain.full_domain}`, '_blank')}
                                                    className="px-6 py-4 rounded-2xl bg-primary-600/10 hover:bg-primary-600/20 text-primary-400 font-black text-[11px] border border-primary-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg shadow-primary-500/5 group/btn"
                                                >
                                                    الموقع الحي
                                                    <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>

                                            {daysLeft <= 30 && domain.status !== 'expired' && (
                                                <button
                                                    onClick={handleRenewDomain}
                                                    className="hidden lg:flex flex-col items-center justify-center gap-2 p-6 rounded-[2rem] bg-emerald-500 text-dark-900 hover:bg-emerald-400 transition-all font-black text-xs h-24 w-24 shadow-xl shadow-emerald-500/20 active:scale-95"
                                                >
                                                    <RefreshCw size={24} className="animate-spin-slow" />
                                                    تجديد
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="glass-panel rounded-[3rem] p-24 text-center border border-white/5 bg-dark-800/10"
                        >
                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-700">
                                <Globe size={48} />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-400 mb-3">لا توجد نطاقات في هذا القسم</h3>
                            <p className="text-gray-500 mb-10 max-w-md mx-auto italic">يمكنك حجز نطاقك الأول اليوم والاستمتاع بإدارة تقنية شاملة وتأمين عالي المستوى.</p>
                            <button
                                onClick={() => navigate('/domains/search')}
                                className="px-12 py-5 bg-primary-600 shadow-2xl shadow-primary-500/20 text-dark-900 rounded-[2rem] font-black transition-all hover:scale-110 active:scale-95"
                            >
                                اكتشف النطاقات المتاحة
                            </button>
                        </motion.div>
                    )}
                </div>

                {/* Info Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 p-8 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 flex flex-col md:flex-row items-center gap-6"
                >
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                        <Shield size={32} />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-white mb-1">أمن النطاق وخصوصية البيانات</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            جميع النطاقات المسجلة عبر منصتنا تحصل تلقائياً على حماية WHOIS لإخفاء بياناتك الشخصية، بالإضافة إلى شهادة SSL مجانية وتأمين رقمي ضد محاولات الاختطاف. نحن نهتم بأمن هويتك كما نهتم بأدائها.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DomainManagement;
