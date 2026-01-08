import { motion } from 'framer-motion';
import { Bot, Code2, Rocket, ArrowLeft, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-dark-950 font-cairo text-right" dir="rtl">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-secondary-500/10 blur-[100px] rounded-full" />

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-800 border border-dark-700 text-primary-400 text-xs font-bold mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                            </span>
                            متاح لمشاريع جديدة
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-8">
                            نحول أفكارك إلى <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-500">
                                واقع رقمي
                            </span>
                        </h1>
                        <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-xl">
                            عمر العديني - مطور برمجيات شامل (Full Stack) ومتخصص في الذكاء الاصطناعي.
                            نساعدك في بناء تطبيقات، مواقع، وحلول تقنية متكاملة بأحدث التقنيات.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => navigate('/builder')}
                                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white rounded-2xl font-bold flex items-center gap-3 shadow-lg shadow-primary-500/20 transition-all hover:-translate-y-1"
                            >
                                <Bot size={24} />
                                <span>جرب باني المشاريع (AI)</span>
                            </button>
                            <button
                                onClick={() => navigate('/request')}
                                className="px-8 py-4 bg-dark-800 hover:bg-dark-700 text-white rounded-2xl font-bold flex items-center gap-3 border border-gray-700 transition-all hover:-translate-y-1"
                            >
                                <span>طلب خدمة خاصة</span>
                                <ArrowLeft size={20} />
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-secondary-500/20 rounded-full blur-3xl animate-pulse" />
                        <div className="relative bg-dark-900 border border-gray-800 rounded-3xl p-8 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                            <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                                <span className="font-mono text-xs text-gray-500">Project_Alpha_v1.0</span>
                            </div>
                            <div className="space-y-4 font-mono text-sm">
                                <div className="flex gap-4 text-gray-400">
                                    <span className="text-primary-500">const</span>
                                    <span>project</span>
                                    <span className="text-secondary-500">=</span>
                                    <span className="text-yellow-500">await</span>
                                    <span>AI.buildSolution(idea);</span>
                                </div>
                                <div className="flex gap-4 text-gray-400 ml-4">
                                    <span className="text-primary-500">if</span>
                                    <span>(project.isReady)</span>
                                    <span>{'{'}</span>
                                </div>
                                <div className="flex gap-4 text-gray-400 ml-8">
                                    <span>launch(project);</span>
                                </div>
                                <div className="flex gap-4 text-gray-400 ml-4">
                                    <span>{'}'}</span>
                                </div>
                                <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                                    <div className="bg-emerald-500 rounded-full p-1">
                                        <CheckCircleIcon />
                                    </div>
                                    <span className="text-emerald-500 font-bold">تم الإطلاق بنجاح 🚀</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Stats */}
            <section className="py-12 border-y border-gray-800/50 bg-black/20">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { num: '+50', label: 'مشروع ناجح' },
                        { num: '+5', label: 'سنوات خبرة' },
                        { num: '100%', label: 'رضا عملاء' },
                        { num: '24/7', label: 'دعم فني' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <h3 className="text-4xl font-black text-white mb-2">{stat.num}</h3>
                            <p className="text-gray-500 text-sm font-bold">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Services Preview */}
            <section className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">خدماتنا المميزة</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">نقدم مجموعة شاملة من الخدمات التقنية لتلبية احتياجاتك الرقمية</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ServiceCard
                            icon={<Rocket className="w-8 h-8 text-blue-500" />}
                            title="تطبيقات الجوال"
                            desc="تطبيقات iOS و Android أصلية أو هجينة بأداء عالي وتصميم جذاب."
                            color="blue"
                        />
                        <ServiceCard
                            icon={<Zap className="w-8 h-8 text-yellow-500" />}
                            title="منصات الويب"
                            desc="مواقع تفاعلية، متاجر إلكترونية، وأنظمة إدارة محتوى مخصصة."
                            color="yellow"
                        />
                        <ServiceCard
                            icon={<Bot className="w-8 h-8 text-purple-500" />}
                            title="حلول الذكاء الاصطناعي"
                            desc="بوتات محادثة، تحليل بيانات، وأتمتة المهام باستخدام أحدث تقنيات AI."
                            color="purple"
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto bg-gradient-to-br from-primary-900/50 to-dark-900 border border-primary-500/20 rounded-3xl p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px]" />

                    <h2 className="text-4xl font-bold text-white mb-6 relative z-10">جاهز لبدء مشروعك القادم؟</h2>
                    <p className="text-gray-300 mb-10 text-lg relative z-10 max-w-2xl mx-auto">
                        سواء كانت لديك فكرة تطبيق، موقع، أو حل ذكي، نحن هنا لتحويلها إلى واقع. ابدأ الآن بتجربة «باني المشاريع» المجاني.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                        <button
                            onClick={() => navigate('/builder')}
                            className="px-8 py-4 bg-white text-dark-950 hover:bg-gray-100 rounded-xl font-bold flex items-center gap-2 transition-all"
                        >
                            <Bot size={20} />
                            <span>ابنِ فكرتك بالذكاء الاصطناعي</span>
                        </button>
                        <button
                            onClick={() => navigate('/developer')}
                            className="px-8 py-4 bg-transparent border border-white/20 text-white hover:bg-white/5 rounded-xl font-bold transition-all"
                        >
                            تصفح معرض الأعمال
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

const ServiceCard = ({ icon, title, desc, color }) => (
    <div className={`bg-dark-900 border border-gray-800 p-8 rounded-2xl hover:border-${color}-500/50 transition-all group hover:-translate-y-2`}>
        <div className={`w-14 h-14 bg-dark-800 rounded-2xl flex items-center justify-center mb-6 border border-gray-700 group-hover:scale-110 transition-transform duration-300`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
    </div>
);

const CheckCircleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
)

export default Home;
