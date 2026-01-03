import React from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    Lightbulb,
    Target,
    ShieldAlert,
    ArrowRight,
    Sparkles
} from 'lucide-react';

const AnalysisPreview = ({ ideaData, onConfirm }) => {
    // Mock analysis logic
    const analysis = {
        marketPotential: 'عالي',
        competition: 'متوسط',
        estimatedTime: '4-7 أيام للتطوير الأولي',
        suggestedStack: ideaData.type === 'web' ? 'Next.js + Supabase' : 'React Native + Firebase',
        businessValue: 'تحسين الكفاءة التشغيلية بنسبة 30%',
    };

    return (
        <div className="max-w-5xl mx-auto py-12 px-4 space-y-12">
            <div className="text-center space-y-4">
                <div className="inline-flex p-3 bg-primary-500/10 rounded-2xl border border-primary-500/20 mb-4">
                    <Sparkles className="h-8 w-8 text-primary-500 animate-pulse" />
                </div>
                <h2 className="text-3xl font-bold text-white font-cairo">تحليل الفكرة الاستراتيجي (AI Insight)</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">لقد قام محركنا بتحليل مسودة مشروعك، إليك نظرة أولية قبل البدء بالتنفيذ الكامل.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnalysisCard
                    icon={Target}
                    title="فرصة السوق"
                    value={analysis.marketPotential}
                    color="text-emerald-500"
                    desc="بناءً على التوجهات الحالية في المنطقة."
                />
                <AnalysisCard
                    icon={BarChart3}
                    title="المنافسة المحتملة"
                    value={analysis.competition}
                    color="text-amber-500"
                    desc="توجد مساحة كافية للتميز بالميزات المختارة."
                />
                <AnalysisCard
                    icon={Lightbulb}
                    title="التوصية التقنية"
                    value={analysis.suggestedStack}
                    color="text-primary-500"
                    desc="هذه الأدوات تضمن لك سرعة الإطلاق واستقرار النظام."
                />
            </div>

            <div className="bg-dark-800 border border-gray-700 rounded-3xl p-8 space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <ShieldAlert className="h-6 w-6 text-accent-500" />
                    <span>القيمة المقترحة (USP)</span>
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                    مشروعك بتميز بتركيزه على {ideaData.description.substring(0, 50)}...
                    مما يمنحك أفضلية في تجربة المستخدم وسهولة الوصول مقارنة بالمنافسين التقليديين.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 justify-center pt-8">
                <button
                    onClick={onConfirm}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-12 py-4 rounded-2xl font-bold text-xl shadow-2xl shadow-primary-500/30 transition-all flex items-center gap-4"
                >
                    <span>تأكيد وبدء التوليد (500 ريال)</span>
                    <ArrowRight className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
};

const AnalysisCard = ({ icon: Icon, title, value, color, desc }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-dark-800 border border-gray-700 p-6 rounded-2xl space-y-4"
    >
        <div className={`p-3 bg-dark-700 rounded-xl w-fit ${color}`}>
            <Icon className="h-6 w-6" />
        </div>
        <div className="space-y-1">
            <h4 className="text-gray-400 text-sm">{title}</h4>
            <div className={`text-xl font-bold ${color}`}>{value}</div>
        </div>
        <p className="text-xs text-gray-500 italic">{desc}</p>
    </motion.div>
);

export default AnalysisPreview;
