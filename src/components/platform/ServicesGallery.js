import { motion } from 'framer-motion';
import { Globe, Smartphone, Bot, Database, Zap, Code, Layout, MessageSquare } from 'lucide-react';

const ServiceCard = ({ service, index, onSelect }) => {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -10, scale: 1.02 }}
            onClick={() => onSelect(service.id)}
            className="relative group cursor-pointer"
        >
            {/* Background Glow */}
            <div className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-3xl`} />

            {/* Card Content */}
            <div className="relative h-full bg-dark-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col items-center text-center overflow-hidden hover:border-white/10 transition-colors">

                {/* Animated Icon Container */}
                <div className="relative mb-6">
                    {/* Orbiting Elements */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 -m-4 border border-dashed border-white/10 rounded-full"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 -m-8 border border-dashed border-white/5 rounded-full"
                    />

                    {/* Main Icon Box */}
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.gradient} p-0.5 relative z-10`}>
                        <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
                            <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-20 group-hover:opacity-40 transition-opacity`} />
                            <service.icon size={32} className="text-white relative z-10" />

                            {/* Inner Floating Particle */}
                            <motion.div
                                animate={{ y: [-2, 2, -2] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className={`absolute top-2 right-2 w-2 h-2 rounded-full bg-gradient-to-r ${service.gradient}`}
                            />
                        </div>
                    </div>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                    {service.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {service.desc}
                </p>

                {/* Animated Feature Tags */}
                <div className="flex flex-wrap justify-center gap-2 mt-auto">
                    {service.tags.map((tag, i) => (
                        <span
                            key={i}
                            className="text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/5 text-gray-400 group-hover:bg-white/10 group-hover:border-white/10 transition-colors"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Bottom Action Hint */}
                <div className={`mt-6 flex items-center gap-2 text-sm font-bold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300`}>
                    <span>اطلب الخدمة الآن</span>
                </div>
            </div>
        </motion.div>
    );
};

const ServicesGallery = ({ onSelectService, title = "خدماتنا الإبداعية" }) => {
    const services = [
        {
            id: 'web',
            title: 'تطوير المواقع',
            desc: 'نحول فكرتك إلى موقع إلكتروني تفاعلي، سريع، ومتجاوب مع جميع الشاشات باستخدام أحدث تقنيات الويب.',
            icon: Globe,
            gradient: 'from-blue-500 to-cyan-400',
            tags: ['React', 'Next.js', 'UI/UX', 'SEO']
        },
        {
            id: 'mobile',
            title: 'تطبيقات الجوال',
            desc: 'تطبيقات احترافية لنظامي iOS و Android مع تجربة مستخدم سلسة وأداء عالي الجودة.',
            icon: Smartphone,
            gradient: 'from-purple-500 to-pink-500',
            tags: ['Flutter', 'React Native', 'iOS', 'Android']
        },
        {
            id: 'bot',
            title: 'الذكاء الاصطناعي',
            desc: 'حلول ذكية، بوتات محادثة، وأنظمة تعلم آلي لرفع كفاءة عملك وتقليل التكاليف التشغيلية.',
            icon: Bot,
            gradient: 'from-emerald-400 to-green-600',
            tags: ['AI Agents', 'Chatbots', 'Automation', 'NLP']
        },
        {
            id: 'custom',
            title: 'أنظمة مخصصة',
            desc: 'برمجيات ERP، أنظمة إدارة، وحلول سحابية مصممة خصيصاً لتناسب احتياجات مؤسستك.',
            icon: Database,
            gradient: 'from-amber-400 to-orange-600',
            tags: ['SaaS', 'ERP', 'Odoo', 'Cloud']
        }
    ];

    return (
        <div className="w-full">
            {title && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-8"
                >
                    <h2 className="text-3xl font-bold text-white mb-4">
                        {title}
                    </h2>
                    <div className="h-1 w-24 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full" />
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {services.map((service, index) => (
                    <ServiceCard
                        key={service.id}
                        service={service}
                        index={index}
                        onSelect={onSelectService}
                    />
                ))}
            </div>
        </div>
    );
};

export default ServicesGallery;
