import { Settings, Shield, Bell, Database, Save, User, Laptop } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { dataService } from '../../utils/dataService';

const ManageSettings = () => {
    const [settings, setSettings] = useState({
        siteName: 'عمر التقني - Portfolio',
        adminEmail: 'oooomar123450@gmail.com',
        enableAIBuilder: true,
        maintenanceMode: false,
        notifications: true,
        saveLocalCopy: true
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('تم حفظ الإعدادات بنجاح!');
        }, 1000);
    };

    return (
        <div className="space-y-6 font-cairo text-right" dir="rtl">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary-500/10 text-primary-500 rounded-2xl">
                    <Settings size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">إعدادات المنصة</h2>
                    <p className="text-gray-500 text-sm">تخصيص الخيارات العامة وأمان النظام.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* General Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-dark-900 border border-gray-800 rounded-3xl p-8 space-y-6"
                >
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                        <User className="text-primary-500" size={20} />
                        الإعدادات العامة
                    </h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="site-name" className="text-sm text-gray-400">اسم الموقع</label>
                            <input
                                id="site-name"
                                type="text"
                                className="w-full bg-dark-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                                value={settings.siteName}
                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="admin-email" className="text-sm text-gray-400">بريد المسؤول التقني</label>
                            <input
                                id="admin-email"
                                type="email"
                                className="w-full bg-dark-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none font-sans"
                                value={settings.adminEmail}
                                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* System Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-dark-900 border border-gray-800 rounded-3xl p-8 space-y-6"
                >
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                        <Shield className="text-primary-500" size={20} />
                        التحكم بالنظام
                    </h3>

                    <div className="space-y-6">
                        <Toggle
                            icon={Laptop}
                            label="باني المشاريع (AI Builder)"
                            desc="تفعيل ميزة إنشاء المشاريع للزوار."
                            checked={settings.enableAIBuilder}
                            onChange={(val) => setSettings({ ...settings, enableAIBuilder: val })}
                        />
                        <Toggle
                            icon={Bell}
                            label="التنبيهات البريدية"
                            desc="إرسال إيميل عند تسجيل عميل جديد."
                            checked={settings.notifications}
                            onChange={(val) => setSettings({ ...settings, notifications: val })}
                        />
                        <Toggle
                            icon={Database}
                            label="النسخ الاحتياطي التلقائي"
                            desc="سيف البيانات في التخزين المحلي فوراً."
                            checked={settings.saveLocalCopy}
                            onChange={(val) => setSettings({ ...settings, saveLocalCopy: val })}
                        />
                    </div>
                </motion.div>
            </div>

            {/* Data Management Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-dark-900 border border-gray-800 rounded-3xl p-8 mt-8 border-red-500/20"
            >
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="space-y-2 text-center md:text-right">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Database className="text-red-500" size={20} />
                            إدارة بيانات النظام
                        </h3>
                        <p className="text-gray-500 text-sm">
                            يمكنك من هنا إعادة تعيين كافة البيانات (المشاريع، المهارات، الأخبار) إلى حالتها الافتراضية.
                            <span className="text-red-500/70 block mt-1 font-bold">تنبيه: هذا الإجراء سيحذف كافة التعديلات التي أجريتها.</span>
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            if (window.confirm('هل أنت متأكد من حذف كافة بياناتك واستعادة البيانات الافتراضية؟ لا يمكن التراجع عن هذا الإجراء.')) {
                                dataService.resetToDefaults();
                            }
                        }}
                        className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 px-8 py-4 rounded-2xl font-bold transition-all whitespace-nowrap"
                    >
                        استعادة بيانات المصنع
                    </button>
                </div>
            </motion.div>

            <div className="flex justify-end pt-6">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500/50 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-primary-500/20 transition-all"
                >
                    {isSaving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Save size={20} />
                    )}
                    <span>حفظ كافة التغييرات</span>
                </button>
            </div>
        </div>
    );
};

const Toggle = ({ icon: Icon, label, desc, checked, onChange }) => (
    <div className="flex items-center justify-between">
        <div className="flex gap-4">
            <div className="p-2 bg-dark-800 rounded-xl text-gray-400">
                <Icon size={20} />
            </div>
            <div>
                <p className="text-sm font-bold text-white">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
            </div>
        </div>
        <button
            onClick={() => onChange(!checked)}
            className={`w-12 h-6 rounded-full transition-all relative ${checked ? 'bg-primary-500' : 'bg-gray-700'}`}
        >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${checked ? 'left-1' : 'left-7'}`} />
        </button>
    </div>
);

export default ManageSettings;
