import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Globe,
    RefreshCw,
    Settings,
    AlertCircle,
    CheckCircle,
    XCircle,
    Shield,
    Clock
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import toast from 'react-hot-toast';

const DomainManagement = () => {
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, active, expiring, expired
    const [websites, setWebsites] = useState([]);

    useEffect(() => {
        fetchDomains();
        fetchWebsites();
    }, []);

    const fetchDomains = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast.error('يرجى تسجيل الدخول');
                return;
            }

            const { data, error } = await supabase
                .from('domains')
                .select(`
          *,
          linked_website:websites(id, name, type)
        `)
                .eq('user_id', user.id)
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

    const fetchWebsites = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('websites')
                .select('id, name, type, status')
                .eq('user_id', user.id)
                .eq('status', 'active');

            if (error) throw error;
            setWebsites(data || []);
        } catch (error) {
            console.error('Error fetching websites:', error);
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
            return { label: 'منتهي', color: 'red', icon: XCircle };
        } else if (daysUntilExpiry <= 7) {
            return { label: 'ينتهي قريباً', color: 'red', icon: AlertCircle };
        } else if (daysUntilExpiry <= 30) {
            return { label: 'قارب على الانتهاء', color: 'yellow', icon: Clock };
        } else {
            return { label: 'نشط', color: 'green', icon: CheckCircle };
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
        // This would integrate with payment gateway
        toast.success('سيتم توجيهك لصفحة الدفع قريباً');
        // TODO: Implement renewal flow
    };

    const handleLinkWebsite = async (domainId, websiteId) => {
        try {
            const { error } = await supabase
                .from('domains')
                .update({ linked_website_id: websiteId })
                .eq('id', domainId);

            if (error) throw error;

            toast.success('تم ربط الدومين بالموقع بنجاح');
            fetchDomains();
        } catch (error) {
            console.error('Error linking website:', error);
            toast.error('حدث خطأ في ربط الموقع');
        }
    };

    const handleToggleAutoRenew = async (domainId, currentValue) => {
        try {
            const { error } = await supabase
                .from('domains')
                .update({ auto_renew: !currentValue })
                .eq('id', domainId);

            if (error) throw error;

            toast.success(!currentValue ? 'تم تفعيل التجديد التلقائي' : 'تم إيقاف التجديد التلقائي');
            fetchDomains();
        } catch (error) {
            console.error('Error toggling auto-renew:', error);
            toast.error('حدث خطأ في تحديث الإعدادات');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
                    <p className="text-gray-400">جاري تحميل الدومينات...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-l from-primary-400 to-accent-400 bg-clip-text text-transparent">
                                إدارة الدومينات
                            </h1>
                            <p className="text-gray-400">
                                إدارة وتجديد دوميناتك من مكان واحد
                            </p>
                        </div>

                        <a
                            href="/domains/search"
                            className="bg-gradient-to-l from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
                        >
                            <Globe className="w-5 h-5" />
                            <span>شراء دومين جديد</span>
                        </a>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-dark-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">إجمالي الدومينات</p>
                                    <p className="text-2xl font-bold text-white">{domains.length}</p>
                                </div>
                                <Globe className="w-10 h-10 text-primary-400 opacity-50" />
                            </div>
                        </div>

                        <div className="bg-dark-800/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">نشط</p>
                                    <p className="text-2xl font-bold text-green-400">
                                        {domains.filter(d => d.status === 'active' && getDaysUntilExpiry(d.expiry_date) > 30).length}
                                    </p>
                                </div>
                                <CheckCircle className="w-10 h-10 text-green-400 opacity-50" />
                            </div>
                        </div>

                        <div className="bg-dark-800/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">قارب على الانتهاء</p>
                                    <p className="text-2xl font-bold text-yellow-400">
                                        {domains.filter(d => getDaysUntilExpiry(d.expiry_date) <= 30 && d.status === 'active').length}
                                    </p>
                                </div>
                                <AlertCircle className="w-10 h-10 text-yellow-400 opacity-50" />
                            </div>
                        </div>

                        <div className="bg-dark-800/50 backdrop-blur-sm border border-red-500/20 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">منتهي</p>
                                    <p className="text-2xl font-bold text-red-400">
                                        {domains.filter(d => d.status === 'expired').length}
                                    </p>
                                </div>
                                <XCircle className="w-10 h-10 text-red-400 opacity-50" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Filters */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {[
                        { value: 'all', label: 'الكل' },
                        { value: 'active', label: 'نشط' },
                        { value: 'expiring', label: 'قارب على الانتهاء' },
                        { value: 'expired', label: 'منتهي' }
                    ].map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => setFilter(value)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap ${filter === value
                                ? 'bg-primary-500 text-white'
                                : 'bg-dark-800/50 text-gray-400 hover:bg-dark-700/50'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Domains List */}
                {filteredDomains.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-dark-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-12 text-center"
                    >
                        <Globe className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-400 mb-2">
                            {filter === 'all' ? 'لا توجد دومينات' : 'لا توجد نتائج'}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {filter === 'all' ? 'ابدأ بشراء دومينك الأول' : 'جرب فلتر آخر'}
                        </p>
                        {filter === 'all' && (
                            <a
                                href="/domains/search"
                                className="inline-flex items-center gap-2 bg-gradient-to-l from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                            >
                                <Globe className="w-5 h-5" />
                                <span>ابحث عن دومين</span>
                            </a>
                        )}
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {filteredDomains.map((domain, index) => {
                                const statusInfo = getStatusInfo(domain);
                                const StatusIcon = statusInfo.icon;
                                const daysUntilExpiry = getDaysUntilExpiry(domain.expiry_date);

                                return (
                                    <motion.div
                                        key={domain.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`bg-dark-800/50 backdrop-blur-sm border rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300 ${statusInfo.color === 'green' ? 'border-green-500/20' :
                                            statusInfo.color === 'yellow' ? 'border-yellow-500/20' :
                                                'border-red-500/20'
                                            }`}
                                    >
                                        <div className="flex flex-col lg:flex-row gap-6">
                                            {/* Domain Info */}
                                            <div className="flex-1">
                                                <div className="flex items-start gap-3 mb-4">
                                                    <Globe className="w-6 h-6 text-primary-400 mt-1 flex-shrink-0" />
                                                    <div className="flex-1">
                                                        <h3 className="text-2xl font-bold text-white mb-1" dir="ltr">
                                                            {domain.full_domain}
                                                        </h3>
                                                        <div className="flex flex-wrap items-center gap-3 text-sm">
                                                            <span className={`flex items-center gap-1 ${statusInfo.color === 'green' ? 'text-green-400' :
                                                                statusInfo.color === 'yellow' ? 'text-yellow-400' :
                                                                    'text-red-400'
                                                                }`}>
                                                                <StatusIcon className="w-4 h-4" />
                                                                {statusInfo.label}
                                                            </span>

                                                            {domain.auto_renew && (
                                                                <span className="flex items-center gap-1 text-blue-400">
                                                                    <RefreshCw className="w-4 h-4" />
                                                                    تجديد تلقائي
                                                                </span>
                                                            )}

                                                            {domain.whois_privacy && (
                                                                <span className="flex items-center gap-1 text-purple-400">
                                                                    <Shield className="w-4 h-4" />
                                                                    خصوصية محمية
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-500 mb-1">تاريخ الشراء</p>
                                                        <p className="text-white font-semibold">
                                                            {new Date(domain.purchase_date).toLocaleDateString('ar-SA')}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500 mb-1">تاريخ الانتهاء</p>
                                                        <p className={`font-semibold ${daysUntilExpiry <= 30 ? 'text-red-400' : 'text-white'
                                                            }`}>
                                                            {new Date(domain.expiry_date).toLocaleDateString('ar-SA')}
                                                            <span className="text-gray-500 mr-2">
                                                                ({daysUntilExpiry} يوم)
                                                            </span>
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500 mb-1">مرتبط بـ</p>
                                                        <p className="text-white font-semibold">
                                                            {domain.linked_website?.name || 'غير مرتبط'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col gap-2 lg:w-48">
                                                {daysUntilExpiry <= 30 && domain.status === 'active' && (
                                                    <button
                                                        onClick={() => handleRenewDomain(domain.id)}
                                                        className="bg-gradient-to-l from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                                                    >
                                                        <RefreshCw className="w-4 h-4" />
                                                        <span>تجديد</span>
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => handleToggleAutoRenew(domain.id, domain.auto_renew)}
                                                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${domain.auto_renew
                                                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                        : 'bg-dark-700/50 text-gray-400 border border-gray-600/30 hover:border-blue-500/50'
                                                        }`}
                                                >
                                                    <RefreshCw className="w-4 h-4" />
                                                    <span>{domain.auto_renew ? 'إيقاف' : 'تفعيل'} التجديد</span>
                                                </button>

                                                <button
                                                    className="bg-dark-700/50 hover:bg-dark-600/50 text-gray-300 px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 border border-gray-600/30"
                                                >
                                                    <Settings className="w-4 h-4" />
                                                    <span>إدارة DNS</span>
                                                </button>

                                                {!domain.linked_website_id && websites.length > 0 && (
                                                    <select
                                                        onChange={(e) => handleLinkWebsite(domain.id, e.target.value)}
                                                        className="bg-dark-700/50 text-gray-300 px-4 py-2 rounded-lg border border-gray-600/30 focus:outline-none focus:border-primary-500"
                                                    >
                                                        <option value="">ربط بموقع</option>
                                                        {websites.map(website => (
                                                            <option key={website.id} value={website.id}>
                                                                {website.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DomainManagement;
