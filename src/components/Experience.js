import { motion } from 'framer-motion';
import { Briefcase, Calendar, ExternalLink, Building2 } from 'lucide-react';

const Experience = () => {
    const experiences = [
        {
            company: 'شركة باكورة التقنية',
            website: 'bacura.sa',
            url: 'https://bacuratec.sa/',
            role: 'مدير تنفيذي بالبرمجيات',
            period: '2024 - الحالي',
            description: 'قيادة الفرق التقنية وتطوير الحلول البرمجية المبتكرة للمؤسسات والشركات، مع التركيز على الكفاءة والابتكار الرقمي والتحول التقني الشامل.',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            company: 'شركة TPS',
            website: 'tps-ksa.com',
            url: 'https://tps-ksa.com/',
            role: 'مدير تنفيذي بالبرمجيات',
            period: '2023 - 2024',
            description: 'الإشراف على المشاريع البرمجية الكبرى وتطوير الاستراتيجيات التقنية لضمان تقديم أفضل الحلول للعملاء وتحقيق الأهداف الاستراتيجية.',
            color: 'from-purple-500 to-indigo-500'
        },
        {
            company: 'شركة ملهمة العقارية',
            website: 'mulhimah.sa',
            url: 'https://mulhimah.sa',
            role: 'مطور برمجيات تطبيقات ومنصات وأنظمة مؤسسة',
            period: '2022 - 2023',
            description: 'بناء وتطوير المنصات العقارية المتقدمة والأنظمة المؤسسية التي تخدم قطاع العقارات، مع تطوير تطبيقات موبايل وحلول ويب متكاملة.',
            color: 'from-emerald-500 to-teal-500'
        },
        {
            company: 'شركة تركية للاستثمار',
            role: 'مطور تطبيقات استثمارية',
            period: '2021 - 2022',
            description: 'تطوير حلول برمجية متخصصة في قطاع الاستثمار والتجارة، مع التركيز على دقة البيانات المالية وتحسين تجربة المستخدم في تطبيقات الاستثمار.',
            color: 'from-amber-500 to-orange-500'
        }
    ];

    return (
        <section id="experience" className="py-20 bg-dark-950/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="section-title">الخبرة المهنية</h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        مسيرة مهنية حافلة بالبناء والتطوير في كبرى الشركات التقنية والعقارية والاستثمارية.
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Vertical Line for Desktop */}
                    <div className="absolute right-1/2 transform translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary-500/50 via-secondary-500/50 to-transparent hidden md:block" />

                    <div className="space-y-12">
                        {experiences.map((exp, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                                    }`}
                            >
                                {/* Timeline Dot */}
                                <div className="absolute right-1/2 transform translate-x-1/2 w-4 h-4 rounded-full bg-primary-500 border-4 border-dark-900 z-10 hidden md:block" />

                                {/* Content Card */}
                                <div className="w-full md:w-5/12">
                                    <div className="card group hover:scale-[1.02] transition-all duration-300">
                                        <div className={`h-1.5 w-full bg-gradient-to-r ${exp.color} absolute top-0 left-0 rounded-t-xl`} />

                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-2 bg-dark-800 rounded-lg">
                                                    <Building2 className="h-6 w-6 text-primary-500" />
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500 text-sm font-mono">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{exp.period}</span>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">
                                                {exp.company}
                                            </h3>
                                            <p className="text-primary-500 font-medium mb-4">{exp.role}</p>

                                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                                {exp.description}
                                            </p>

                                            {exp.website && (
                                                <a
                                                    href={exp.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-sm text-secondary-500 hover:text-secondary-400 transition-colors"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                    <span>{exp.website}</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Spacer for Timeline Flow */}
                                <div className="hidden md:block md:w-2/12" />
                                <div className="hidden md:block md:w-5/12" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;
