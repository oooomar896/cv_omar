import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, X, AlertCircle, CheckCircle, Globe, ArrowLeft } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';

const DNSManager = () => {
    const { domainId } = useParams();
    const navigate = useNavigate();
    const [domain, setDomain] = useState(null);
    const [dnsRecords, setDnsRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newRecord, setNewRecord] = useState({
        record_type: 'A',
        host: '@',
        value: '',
        ttl: 3600,
        priority: null
    });
    const [showAddForm, setShowAddForm] = useState(false);

    const recordTypes = [
        { value: 'A', label: 'A', description: 'IPv4 Address' },
        { value: 'AAAA', label: 'AAAA', description: 'IPv6 Address' },
        { value: 'CNAME', label: 'CNAME', description: 'Canonical Name' },
        { value: 'MX', label: 'MX', description: 'Mail Exchange' },
        { value: 'TXT', label: 'TXT', description: 'Text Record' },
        { value: 'NS', label: 'NS', description: 'Name Server' }
    ];

    const commonHosts = [
        { value: '@', label: '@', description: 'Root domain' },
        { value: 'www', label: 'www', description: 'www subdomain' },
        { value: 'mail', label: 'mail', description: 'Mail server' },
        { value: 'ftp', label: 'ftp', description: 'FTP server' },
        { value: '*', label: '*', description: 'Wildcard' }
    ];

    const ttlOptions = [
        { value: 300, label: '5 دقائق' },
        { value: 1800, label: '30 دقيقة' },
        { value: 3600, label: '1 ساعة' },
        { value: 14400, label: '4 ساعات' },
        { value: 86400, label: '24 ساعة' }
    ];

    useEffect(() => {
        if (domainId) {
            fetchDomain();
            fetchDNSRecords();
        }
    }, [domainId]);

    const fetchDomain = async () => {
        try {
            const { data, error } = await supabase
                .from('domains')
                .select('*')
                .eq('id', domainId)
                .single();

            if (error) throw error;
            setDomain(data);
        } catch (error) {
            console.error('Error fetching domain:', error);
            toast.error('حدث خطأ في تحميل بيانات الدومين');
        }
    };

    const fetchDNSRecords = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('dns_records')
                .select('*')
                .eq('domain_id', domainId)
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setDnsRecords(data || []);
        } catch (error) {
            console.error('Error fetching DNS records:', error);
            toast.error('حدث خطأ في تحميل سجلات DNS');
        } finally {
            setLoading(false);
        }
    };

    const handleAddRecord = async () => {
        if (!newRecord.value.trim()) {
            toast.error('الرجاء إدخال القيمة');
            return;
        }

        try {
            setSaving(true);
            const { data, error } = await supabase
                .from('dns_records')
                .insert([{
                    domain_id: domainId,
                    ...newRecord
                }])
                .select()
                .single();

            if (error) throw error;

            setDnsRecords([data, ...dnsRecords]);
            setNewRecord({
                record_type: 'A',
                host: '@',
                value: '',
                ttl: 3600,
                priority: null
            });
            setShowAddForm(false);
            toast.success('تمت إضافة السجل بنجاح');
        } catch (error) {
            console.error('Error adding DNS record:', error);
            toast.error('حدث خطأ في إضافة السجل');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteRecord = async (recordId) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا السجل؟')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('dns_records')
                .update({ is_active: false })
                .eq('id', recordId);

            if (error) throw error;

            setDnsRecords(dnsRecords.filter(r => r.id !== recordId));
            toast.success('تم حذف السجل بنجاح');
        } catch (error) {
            console.error('Error deleting DNS record:', error);
            toast.error('حدث خطأ في حذف السجل');
        }
    };

    const applyTemplate = (template) => {
        const templates = {
            website: [
                { record_type: 'A', host: '@', value: '192.0.2.1', ttl: 3600 },
                { record_type: 'A', host: 'www', value: '192.0.2.1', ttl: 3600 }
            ],
            email: [
                { record_type: 'MX', host: '@', value: 'mail.example.com', ttl: 3600, priority: 10 },
                { record_type: 'TXT', host: '@', value: 'v=spf1 include:_spf.example.com ~all', ttl: 3600 }
            ],
            cloudflare: [
                { record_type: 'A', host: '@', value: '104.21.0.0', ttl: 300 },
                { record_type: 'A', host: 'www', value: '104.21.0.0', ttl: 300 }
            ]
        };

        const selectedTemplate = templates[template];
        if (selectedTemplate && selectedTemplate.length > 0) {
            setNewRecord(selectedTemplate[0]);
            setShowAddForm(true);
            toast.success('تم تطبيق القالب');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-950 flex items-center justify-center pt-24">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
                    <p className="text-gray-400">جاري تحميل سجلات DNS...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate('/portal/domains')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>العودة إلى الدومينات</span>
                    </button>

                    <div className="bg-dark-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-l from-primary-400 to-accent-400 bg-clip-text text-transparent">
                                    إدارة DNS
                                </h1>
                                <p className="text-gray-400 flex items-center gap-2" dir="ltr">
                                    <Globe className="w-4 h-4" />
                                    {domain?.full_domain || 'Loading...'}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Content */}
                <div className="space-y-6">
                    {/* Quick Templates */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-3">قوالب سريعة</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <button
                                onClick={() => applyTemplate('website')}
                                className="bg-dark-800/50 hover:bg-dark-700/50 border border-gray-700/50 hover:border-primary-500/50 rounded-lg p-4 text-right transition-all duration-300"
                            >
                                <h4 className="text-white font-semibold mb-1">موقع ويب</h4>
                                <p className="text-gray-400 text-sm">A Records للموقع الرئيسي</p>
                            </button>

                            <button
                                onClick={() => applyTemplate('email')}
                                className="bg-dark-800/50 hover:bg-dark-700/50 border border-gray-700/50 hover:border-primary-500/50 rounded-lg p-4 text-right transition-all duration-300"
                            >
                                <h4 className="text-white font-semibold mb-1">بريد إلكتروني</h4>
                                <p className="text-gray-400 text-sm">MX و SPF Records</p>
                            </button>

                            <button
                                onClick={() => applyTemplate('cloudflare')}
                                className="bg-dark-800/50 hover:bg-dark-700/50 border border-gray-700/50 hover:border-primary-500/50 rounded-lg p-4 text-right transition-all duration-300"
                            >
                                <h4 className="text-white font-semibold mb-1">Cloudflare</h4>
                                <p className="text-gray-400 text-sm">إعدادات Cloudflare</p>
                            </button>
                        </div>
                    </div>

                    {/* Add Record Button */}
                    {!showAddForm && (
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="w-full bg-gradient-to-l from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 mb-6"
                        >
                            <Plus className="w-5 h-5" />
                            <span>إضافة سجل جديد</span>
                        </button>
                    )}

                    {/* Add Record Form */}
                    <AnimatePresence>
                        {showAddForm && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-dark-800/50 border border-primary-500/30 rounded-lg p-6 mb-6"
                            >
                                <h3 className="text-lg font-semibold text-white mb-4">سجل جديد</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    {/* Record Type */}
                                    <div>
                                        <div className="block text-gray-400 text-sm mb-2">نوع السجل</div>
                                        <select
                                            value={newRecord.record_type}
                                            onChange={(e) => setNewRecord({ ...newRecord, record_type: e.target.value })}
                                            className="w-full bg-dark-900/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                                        >
                                            {recordTypes.map(type => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label} - {type.description}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Host */}
                                    <div>
                                        <div className="block text-gray-400 text-sm mb-2">Host</div>
                                        <input
                                            type="text"
                                            value={newRecord.host}
                                            onChange={(e) => setNewRecord({ ...newRecord, host: e.target.value })}
                                            placeholder="@, www, mail, etc."
                                            className="w-full bg-dark-900/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                                            dir="ltr"
                                        />
                                    </div>

                                    {/* Value */}
                                    <div className="md:col-span-2">
                                        <div className="block text-gray-400 text-sm mb-2">القيمة</div>
                                        <input
                                            type="text"
                                            value={newRecord.value}
                                            onChange={(e) => setNewRecord({ ...newRecord, value: e.target.value })}
                                            placeholder="IP address, domain, or text value"
                                            className="w-full bg-dark-900/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                                            dir="ltr"
                                        />
                                    </div>

                                    {/* TTL */}
                                    <div>
                                        <div className="block text-gray-400 text-sm mb-2">TTL</div>
                                        <select
                                            value={newRecord.ttl}
                                            onChange={(e) => setNewRecord({ ...newRecord, ttl: parseInt(e.target.value) })}
                                            className="w-full bg-dark-900/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                                        >
                                            {ttlOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Priority (for MX records) */}
                                    {newRecord.record_type === 'MX' && (
                                        <div>
                                            <div className="block text-gray-400 text-sm mb-2">الأولوية</div>
                                            <input
                                                type="number"
                                                value={newRecord.priority || ''}
                                                onChange={(e) => setNewRecord({ ...newRecord, priority: parseInt(e.target.value) || null })}
                                                placeholder="10"
                                                className="w-full bg-dark-900/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleAddRecord}
                                        disabled={saving}
                                        className="flex-1 bg-gradient-to-l from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 text-white py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        {saving ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span>جاري الحفظ...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                <span>حفظ</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setShowAddForm(false)}
                                        className="px-6 bg-dark-700/50 hover:bg-dark-600/50 text-gray-300 py-2 rounded-lg font-semibold transition-all duration-300"
                                    >
                                        إلغاء
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* DNS Records List */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                            السجلات الحالية ({dnsRecords.length})
                        </h3>

                        {dnsRecords.length === 0 ? (
                            <div className="bg-dark-800/30 border border-gray-700/30 rounded-lg p-8 text-center">
                                <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-400">لا توجد سجلات DNS</p>
                                <p className="text-gray-500 text-sm mt-1">ابدأ بإضافة سجل جديد</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {dnsRecords.map((record, index) => (
                                    <motion.div
                                        key={record.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-dark-800/50 border border-gray-700/50 rounded-lg p-4 hover:border-primary-500/30 transition-all duration-300"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                                                <div>
                                                    <p className="text-gray-500 text-xs mb-1">النوع</p>
                                                    <p className="text-white font-semibold">{record.record_type}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs mb-1">Host</p>
                                                    <p className="text-white font-mono text-sm" dir="ltr">{record.host}</p>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <p className="text-gray-500 text-xs mb-1">القيمة</p>
                                                    <p className="text-white font-mono text-sm break-all" dir="ltr">
                                                        {record.value}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleDeleteRecord(record.id)}
                                                className="text-red-400 hover:text-red-300 transition-colors p-2"
                                                title="حذف"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-700/50">
                                            <span className="text-gray-500 text-xs">
                                                TTL: {record.ttl}s
                                            </span>
                                            {record.priority && (
                                                <span className="text-gray-500 text-xs">
                                                    Priority: {record.priority}
                                                </span>
                                            )}
                                            <span className="text-gray-500 text-xs">
                                                تم الإنشاء: {new Date(record.created_at).toLocaleDateString('ar-SA')}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info Box */}
                    <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                        <div className="flex gap-3">
                            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-blue-400 font-semibold mb-1">ملاحظة مهمة</h4>
                                <p className="text-gray-400 text-sm">
                                    قد يستغرق نشر تغييرات DNS من 24 إلى 48 ساعة حتى تصبح فعالة عالمياً.
                                    تأكد من صحة القيم قبل الحفظ.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DNSManager;
