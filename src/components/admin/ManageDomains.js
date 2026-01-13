import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Search, CheckCircle, XCircle, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { dataService } from '../../utils/dataService';
import toast from 'react-hot-toast';

const ManageDomains = () => {
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, active, pending, expired
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const data = await dataService.fetchAllDomains();
        setDomains(data);
        setLoading(false);
    };

    const handleStatusUpdate = async (id, newStatus) => {
        if (window.confirm(`هل أنت متأكد من تغيير حالة الدومين إلى ${newStatus}؟`)) {
            const success = await dataService.updateDomainStatus(id, newStatus);
            if (success) {
                toast.success('تم تحديث حالة الدومين بنجاح');
                loadData();
            } else {
                toast.error('فشل تحديث الحالة');
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'text-green-400 bg-green-500/10 border-green-500/20';
            case 'pending': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            case 'expired': return 'text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return <CheckCircle size={16} />;
            case 'pending': return <Clock size={16} />;
            case 'expired': return <XCircle size={16} />;
            default: return <AlertCircle size={16} />;
        }
    };

    const filteredDomains = domains.filter(domain => {
        const matchesSearch = domain.domain_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (domain.leads?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || domain.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6 font-cairo" dir="rtl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                    <Globe className="text-primary-500" />
                    إدارة الدومينات
                    <span className="text-sm font-normal text-gray-500 bg-gray-800 px-2 py-1 rounded-lg">
                        {domains.length}
                    </span>
                </h2>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="بحث عن دومين أو عميل..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-dark-900 border border-gray-700 text-white pl-4 pr-10 py-2 rounded-xl focus:border-primary-500 outline-none w-64 text-sm"
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-dark-900 border border-gray-700 text-white px-4 py-2 rounded-xl focus:border-primary-500 outline-none text-sm"
                    >
                        <option value="all">الكل</option>
                        <option value="active">نشط</option>
                        <option value="pending">قيد الانتظار</option>
                        <option value="expired">منتهي</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-400">جاري تحميل البيانات...</p>
                </div>
            ) : filteredDomains.length === 0 ? (
                <div className="bg-dark-800/50 rounded-2xl p-12 text-center border border-dashed border-gray-700">
                    <Globe className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-400 mb-2">لا توجد دومينات</h3>
                    <p className="text-gray-500">للم يتم العثور على أي دومينات مطابقة لمعايير البحث.</p>
                </div>
            ) : (
                <div className="bg-dark-900 border border-gray-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-dark-800 text-gray-400 text-sm">
                                <tr>
                                    <th className="px-6 py-4 font-medium">اسم الدومين</th>
                                    <th className="px-6 py-4 font-medium">العميل</th>
                                    <th className="px-6 py-4 font-medium">تاريخ التسجيل</th>
                                    <th className="px-6 py-4 font-medium">تاريخ الانتهاء</th>
                                    <th className="px-6 py-4 font-medium">الحالة</th>
                                    <th className="px-6 py-4 font-medium">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {filteredDomains.map((domain) => (
                                    <motion.tr
                                        key={domain.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-dark-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-white dir-ltr font-bold text-lg">
                                                    {domain.domain_name}{domain.extension}
                                                </span>
                                                <a
                                                    href={`https://${domain.domain_name}${domain.extension}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-500 hover:text-primary-400"
                                                >
                                                    <ExternalLink size={14} />
                                                </a>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-white font-medium">
                                                    {domain.leads?.name || 'مستخدم غير معروف'}
                                                </span>
                                                <span className="text-xs text-gray-500 font-mono">
                                                    {domain.leads?.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm font-mono">
                                            {new Date(domain.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm font-mono">
                                            {new Date(domain.expiry_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(domain.status)}`}>
                                                {getStatusIcon(domain.status)}
                                                {domain.status === 'active' ? 'نشط' :
                                                    domain.status === 'pending' ? 'بانتظار التفعيل' :
                                                        domain.status === 'expired' ? 'منتهي' : domain.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {domain.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(domain.id, 'active')}
                                                        className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-lg transition-all text-xs font-bold"
                                                        title="تفعيل الدومين"
                                                    >
                                                        تفعيل
                                                    </button>
                                                )}
                                                {domain.status === 'active' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(domain.id, 'pending')}
                                                        className="p-2 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-white rounded-lg transition-all text-xs font-bold"
                                                        title="تعليق الدومين"
                                                    >
                                                        تعليق
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleStatusUpdate(domain.id, 'expired')}
                                                    className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                                    title="إنهاء الصلاحية"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            </div>
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

export default ManageDomains;
