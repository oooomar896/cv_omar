import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    Smartphone,
    Globe,
    Bot,
    MessageSquare,
    CheckCircle,
    ArrowLeft,
    Loader
} from 'lucide-react';
import { dataService } from '../../utils/dataService';
import ServicesGallery from './ServicesGallery';

const RequestService = () => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        serviceType: '', // web, mobile, bot, custom
        budget: '',
        description: '',
        features: []
    });

    const services = [
        { id: 'web', title: 'موقع إلكتروني', icon: Globe, desc: 'مواقع تعريفية، متاجر إلكترونية، لوحات تحكم' },
        { id: 'mobile', title: 'تطبيق جوال', icon: Smartphone, desc: 'تطبيقات iOS و Android احترافية' },
        { id: 'bot', title: 'بوت ذكي', icon: Bot, desc: 'بوتات رد آلي، وكلاء ذكاء اصطناعي' },
        { id: 'custom', title: 'حلول مخصصة', icon: MessageSquare, desc: 'أنظمة ERP، برمجيات خاصة' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Save Lead (User Info)
            await dataService.addUser({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                role: 'client'
            });

            // Save Request
            await dataService.saveGeneratedProject(`req_${Date.now()}`, {
                userEmail: formData.email,
                userName: formData.name,
                userPhone: formData.phone,
                projectType: formData.serviceType,
                projectName: `${formData.serviceType.toUpperCase()} Project Request`,
                description: `PHONE: ${formData.phone} \n BUDGET: ${formData.budget} \n\n ${formData.description}`,
                features: formData.features,
                isManualRequest: true,
                status: 'pending_review'
            });

            setTimeout(() => {
                setIsLoading(false);
                setIsSuccess(true);
                setStep(3);
            }, 1000);

        } catch (error) {
            console.error(error);
            setIsLoading(false);
            alert('حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى');
        }
    };

    const waNumber = "9966558539717";
    const waMessage = encodeURIComponent(
        `*طلب مشروع جديد من المنصة* 🚀
---------------------------
*نوع الخدمة:* ${formData.serviceType === 'web' ? 'موقع إلكتروني' : formData.serviceType === 'mobile' ? 'تطبيق جوال' : 'بوت ذكي'}
*الاسم:* ${formData.name}
*الجوال:* ${formData.phone}
*الميزانية:* ${formData.budget}
---------------------------
*تفاصيل:*
${formData.description.substring(0, 500)}...
---------------------------
يرجى مراجعة الطلب في لوحة التحكم.`
    );

    // Auto-open WhatsApp on success
    useEffect(() => {
        if (isSuccess) {
            const url = `https://wa.me/${waNumber}?text=${waMessage}`;

            // 使用 Flash Message أو Toast لإخبار المستخدم
            // Use window.location.href to avoid popup blockers and ensure mobile app opens directly
            const timer = setTimeout(() => {
                window.location.href = url;
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [isSuccess, waMessage]);

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-xl w-full bg-dark-900 border border-gray-800 rounded-3xl p-8 text-center"
                >
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">تم استلام طلبك بنجاح!</h2>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        شكراً لثقتك بنا. جاري تحويلك إلى واتساب لإرسال تفاصيل الطلب للمطور مباشرة...
                    </p>

                    <div className="bg-dark-800 rounded-2xl p-6 mb-8 border border-gray-700">
                        <div className="animate-pulse mb-4 flex justify-center">
                            <span className="bg-emerald-500/10 text-emerald-500 text-xs px-2 py-1 rounded-full border border-emerald-500/20">جاري الفتح تلقائياً...</span>
                        </div>
                        <a
                            href={`https://wa.me/${waNumber}?text=${waMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 px-6 rounded-xl font-bold transition-all shadow-lg shadow-[#25D366]/20 hover:shadow-[#25D366]/40 transform hover:-translate-y-1"
                        >
                            <MessageSquare size={24} />
                            <span>اضغط هنا إذا لم يفتح واتساب تلقائياً</span>
                        </a>
                    </div>

                    <button
                        onClick={() => window.location.href = '/'}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        العودة للرئيسية
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-dark-950">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-6"
                    >
                        ابدأ مشروعك <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-500">التقني</span>
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto mb-8"
                    >
                        نوفر لك حلولاً برمجية متكاملة واحترافية. املأ النموذج أدناه لنبدأ في تحويل فكرتك إلى واقع.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="inline-block"
                    >
                        <a
                            href="/builder"
                            className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors border-b border-primary-500/30 hover:border-primary-500 pb-1"
                        >
                            <Bot size={18} />
                            <span>هل تفضل تجربة بناء مشروعك باستخدام الذكاء الاصطناعي؟</span>
                        </a>
                    </motion.div>
                </div>

                {/* Form Steps */}
                <div className="bg-dark-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">

                    {/* Progress Bar */}
                    <div className="h-1 bg-dark-800 w-full">
                        <motion.div
                            className="h-full bg-primary-500"
                            initial={{ width: '0%' }}
                            animate={{ width: step === 1 ? '50%' : '100%' }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <div className="w-full">
                                            <ServicesGallery
                                                title={null}
                                                onSelectService={(id) => {
                                                    setFormData({ ...formData, serviceType: id });
                                                    // Optional: Auto advance or let user click 'Next'
                                                    // setStep(2); 
                                                }}
                                            />

                                            {/* Selected Service Highlight */}
                                            {formData.serviceType && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="mt-6 p-4 bg-primary-500/10 border border-primary-500 rounded-2xl flex items-center justify-between"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                                                        <span className="text-white font-bold">
                                                            تم اختيار: {services.find(s => s.id === formData.serviceType)?.title}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setStep(2)}
                                                        className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all"
                                                    >
                                                        متابعة
                                                    </button>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (!formData.serviceType) return alert('يرجى اختيار نوع الخدمة');
                                                setStep(2);
                                            }}
                                            className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all"
                                        >
                                            <span>المتابعة للتفاصيل</span>
                                            <ArrowLeft size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step2"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="req-name" className="text-gray-400 text-sm">الاسم الكامل</label>
                                            <input
                                                id="req-name"
                                                required
                                                type="text"
                                                className="w-full bg-dark-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="req-phone" className="text-gray-400 text-sm">رقم الهاتف (مع فتح الخط)</label>
                                            <input
                                                id="req-phone"
                                                required
                                                type="tel"
                                                className="w-full bg-dark-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none font-mono"
                                                placeholder="+966..."
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="req-email" className="text-gray-400 text-sm">البريد الإلكتروني</label>
                                        <input
                                            id="req-email"
                                            required
                                            type="email"
                                            className="w-full bg-dark-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none font-mono"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="req-budget" className="text-gray-400 text-sm">الميزانية المتوقعة (اختياري)</label>
                                        <select
                                            id="req-budget"
                                            className="w-full bg-dark-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                                            value={formData.budget}
                                            onChange={e => setFormData({ ...formData, budget: e.target.value })}
                                        >
                                            <option value="">حدد الميزانية التقريبية</option>
                                            <option value="500-1000">$500 - $1,000</option>
                                            <option value="1000-3000">$1,000 - $3,000</option>
                                            <option value="3000-5000">$3,000 - $5,000</option>
                                            <option value="5000+">$5,000+</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="req-desc" className="text-gray-400 text-sm">تفاصيل المشروع</label>
                                        <textarea
                                            id="req-desc"
                                            required
                                            className="w-full h-32 bg-dark-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                                            placeholder="اشرح فكرتك باختصار..."
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        ></textarea>
                                    </div>

                                    <div className="pt-6 flex justify-between items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="text-gray-400 hover:text-white px-6 py-3 font-medium transition-colors"
                                        >
                                            عودة
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader className="animate-spin" size={20} />
                                                    <span>جاري الإرسال...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>إرسال الطلب</span>
                                                    <Send size={20} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RequestService;
