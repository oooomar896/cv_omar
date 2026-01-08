import { motion } from 'framer-motion';
import {
    Search,
    Layout,
    Code2,
    ShieldCheck,
    Rocket,
    CheckCircle2
} from 'lucide-react';

const ROADMAP_STAGES = [
    { id: 'analysis', label: 'تحليل المتطلبات', icon: Search, desc: 'فهم أهداف المشروع وتوثيقها' },
    { id: 'design', label: 'التصميم والواجهات', icon: Layout, desc: 'بناء تجربة مستخدم فريدة' },
    { id: 'dev', label: 'مرحلة البرمجة', icon: Code2, desc: 'كتابة السطور البرمجية والبنية التحتية' },
    { id: 'qa', label: 'فحص الجودة', icon: ShieldCheck, desc: 'اختبار المشروع لضمان خلوه من الأخطاء' },
    { id: 'launch', label: 'الإطلاق النهائي', icon: Rocket, desc: 'تسليم المشروع ونشره للجمهور' }
];

const ProjectRoadmap = ({ currentStage = 'analysis' }) => {
    const activeIndex = ROADMAP_STAGES.findIndex(s => s.id === currentStage);

    return (
        <div className="py-8 px-4">
            <h3 className="text-xl font-bold text-white mb-8 font-cairo flex items-center gap-3">
                <Layout className="text-primary-500" />
                <span>خارطة طريق المشروع (Roadmap)</span>
            </h3>

            <div className="relative">
                {/* Vertical Line for Mobile */}
                <div className="absolute right-6 top-0 bottom-0 w-0.5 bg-gray-800 md:hidden" />

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                    {/* Horizontal Line for Desktop */}
                    <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-800 hidden md:block z-0" />

                    {ROADMAP_STAGES.map((stage, index) => {
                        const Icon = stage.icon;
                        const isDone = index < activeIndex;
                        const isActive = index === activeIndex;

                        return (
                            <div key={stage.id} className="relative z-10 flex flex-col items-center">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${isDone ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20' :
                                        isActive ? 'bg-primary-500 border-primary-400 text-white animate-pulse shadow-lg shadow-primary-500/20' :
                                            'bg-dark-800 border-gray-700 text-gray-500'
                                        }`}
                                >
                                    {isDone ? <CheckCircle2 size={32} /> : <Icon size={32} />}
                                </motion.div>

                                <div className="mt-4 text-center md:px-2">
                                    <h4 className={`text-sm font-bold font-cairo ${isActive ? 'text-primary-400' : isDone ? 'text-emerald-400' : 'text-gray-400'
                                        }`}>
                                        {stage.label}
                                    </h4>
                                    <p className="text-[10px] text-gray-500 font-cairo mt-1 hidden md:block">
                                        {stage.desc}
                                    </p>
                                </div>

                                {isActive && (
                                    <motion.div
                                        layoutId="active-indicator"
                                        className="mt-2 bg-primary-500/10 text-primary-400 text-[9px] px-2 py-0.5 rounded-full border border-primary-500/20 font-bold font-cairo"
                                    >
                                        جاري العمل...
                                    </motion.div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProjectRoadmap;
