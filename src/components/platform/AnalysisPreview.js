import { motion } from 'framer-motion';
import {
    BarChart3,
    Lightbulb,
    Target,
    ShieldAlert,
    ArrowRight,
    Sparkles
} from 'lucide-react';

import { PROJECT_TYPES } from '../../constants/platformConstants';

const AnalysisPreview = ({ ideaData, onConfirm }) => {
    // Mock analysis logic
    const analysis = {
        marketPotential: 'عالي',
        competition: 'متوسط',
        estimatedTime: '4-7 أيام للتطوير الأولي',
        suggestedStack: ideaData.type === PROJECT_TYPES.WEB ? 'Next.js + Supabase' : 'React Native + Firebase',
        businessValue: 'تحسين الكفاءة التشغيلية بنسبة 30%',
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 space-y-16 animate-in fade-in duration-700">
            <div className="text-center relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/10 blur-[100px] rounded-full pointer-events-none"></div>
                <div className="relative z-10 inline-flex p-4 bg-primary-500/10 rounded-[2rem] border border-primary-500/20 mb-6 shadow-xl shadow-primary-500/10">
                    <Sparkles className="h-8 w-8 text-primary-400 animate-pulse" />
                </div>
                <h2 className="relative z-10 text-4xl md:text-5xl font-black text-white font-cairo mb-4 leading-tight">
                    تحليلنا الأولي لمشروعك
                </h2>
                <p className="relative z-10 text-gray-400 max-w-2xl mx-auto text-lg">
                    مرحباً <span className="text-white font-bold">{ideaData.userName}</span>، استناداً لمعطياتك، قمنا بإعداد دراسة جدوى تقنية مبدئية.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnalysisCard
                    icon={Target}
                    title="فرصة السوق"
                    value={analysis.marketPotential}
                    color="text-emerald-400"
                    bgColor="bg-emerald-500/10"
                    borderColor="border-emerald-500/20"
                    desc="مؤشر إيجابي بناءً على الطلب الحالي في السوق."
                />
                <AnalysisCard
                    icon={BarChart3}
                    title="المنافسة المحتملة"
                    value={analysis.competition}
                    color="text-amber-400"
                    bgColor="bg-amber-500/10"
                    borderColor="border-amber-500/20"
                    desc="يمكنك اختراق السوق بالتركيز على الميزات الفريدة."
                />
                <AnalysisCard
                    icon={Lightbulb}
                    title="التوصية التقنية"
                    value={analysis.suggestedStack}
                    color="text-primary-400"
                    bgColor="bg-primary-500/10"
                    borderColor="border-primary-500/20"
                    desc="أفضل توازن بين الأداء وسرعة التطوير لمشروعك."
                />
            </div>

            <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5 bg-dark-800/40 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/10 blur-[60px] rounded-full transition-all group-hover:bg-accent-500/20"></div>

                <h3 className="text-2xl font-bold text-white flex items-center gap-3 mb-6 relative z-10">
                    <div className="p-2 rounded-xl bg-accent-500/10 text-accent-400">
                        <ShieldAlert className="h-6 w-6" />
                    </div>
                    <span>القيمة المقترحة (USP)</span>
                </h3>

                <p className="text-gray-300 leading-loose text-lg relative z-10 font-light">
                    مشروعك يتميز بتركيزه على <span className="text-white font-bold border-b border-accent-500/50">{ideaData.description?.substring(0, 60)}...</span>
                    وهذا يمنحك أفضلية تنافسية قوية في تجربة المستخدم وسرعة الوصول للخدمة مقارنة بالحلول التقليدية.
                </p>
            </div>

            <div className="flex flex-col items-center justify-center pt-8">
                <button
                    onClick={onConfirm}
                    className="group relative bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white px-16 py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-primary-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-4 overflow-hidden"
                >
                    <span className="relative z-10">اعتمد المشروع وابدأ التنفيذ</span>
                    <div className="relative z-10 p-1 bg-white/20 rounded-full">
                        <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                    </div>
                </button>
                <p className="mt-4 text-sm text-gray-500 font-medium">✨ مجاني بالكامل لفترة محدودة (Beta)</p>
            </div>
        </div>
    );
};

const AnalysisCard = ({ icon: Icon, title, value, color, bgColor, borderColor, desc }) => (
    <motion.div
        whileHover={{ y: -8 }}
        className={`relative p-8 rounded-[2rem] border ${borderColor} bg-dark-900/50 backdrop-blur-sm transition-colors hover:bg-dark-800 flex flex-col gap-6 group overflow-hidden`}
    >
        <div className={`absolute top-0 right-0 w-24 h-24 ${bgColor} blur-[40px] rounded-full -mr-10 -mt-10 group-hover:blur-[50px] transition-all`}></div>

        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bgColor} ${color} border ${borderColor} relative z-10`}>
            <Icon size={28} />
        </div>

        <div className="space-y-2 relative z-10">
            <h4 className="text-gray-400 text-sm font-bold uppercase tracking-wider">{title}</h4>
            <div className={`text-xl font-black ${color} leading-tight`}>{value}</div>
        </div>

        <div className="pt-6 border-t border-white/5 relative z-10">
            <p className="text-xs text-gray-500 font-medium leading-relaxed">{desc}</p>
        </div>
    </motion.div>
);

export default AnalysisPreview;
