import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layout,
    Code2,
    Copy,
    Check,
    Search,
    Type,
    Layers,
    MousePointer2
} from 'lucide-react';

const UI_COMPONENTS = [
    {
        id: 'glass-card',
        title: 'Glassmorphism Card',
        desc: 'بطاقة زجاجية شفافة مع تعتيم خلفي وتدرج لوني.',
        code: `<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
    <h3 className="text-xl font-bold text-white mb-2 underline decoration-primary-500">Premium Card</h3>
    <p className="text-gray-400 text-sm">هذا المكون يستخدم خاصية backdrop-blur لإنشاء تأثير زجاجي حديث.</p>
</div>`,
        preview: (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-2 underline decoration-primary-500 font-cairo">Premium Card</h3>
                <p className="text-gray-400 text-sm font-cairo">هذا المكون يستخدم خاصية backdrop-blur لإنشاء تأثير زجاجي حديث.</p>
            </div>
        )
    },
    {
        id: 'neon-button',
        title: 'Neon Glow Button',
        desc: 'زر مع تأثير توهج نيوني عند الوقوف عليه.',
        code: `<button className="relative group px-8 py-3 bg-primary-500 text-white font-bold rounded-xl overflow-hidden transition-all hover:bg-primary-600 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
    <span className="relative z-10 transition-transform group-hover:scale-110">ابدأ الآن</span>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
</button>`,
        preview: (
            <button className="relative group px-8 py-3 bg-primary-500 text-white font-bold rounded-xl overflow-hidden transition-all hover:bg-primary-600 shadow-[0_0_20px_rgba(59,130,246,0.3)] font-cairo">
                <span className="relative z-10">ابدأ الآن</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
        )
    },
    {
        id: 'gradient-text',
        title: 'Animated Gradient Text',
        desc: 'نص ملون بتدرج متحرك يلفت الانتباه.',
        code: `<h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-500 to-primary-400 bg-[length:200%_auto] animate-gradient-x">
    مستقبل البرمجة بالذكاء الاصطناعي
</h2>`,
        preview: (
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-500 to-primary-400 bg-[length:200%_auto] font-cairo">
                مستقبل البرمجة بالذكاء الاصطناعي
            </h2>
        )
    }
];

const UIKitLibrary = () => {
    const [selectedId, setSelectedId] = useState(UI_COMPONENTS[0].id);
    const [copiedId, setCopiedId] = useState(null);

    const activeComp = UI_COMPONENTS.find(c => c.id === selectedId);

    const handleCopy = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="min-h-screen bg-dark-950 pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-2 bg-primary-500/10 text-primary-400 px-4 py-2 rounded-full border border-primary-500/20 text-sm font-bold font-cairo"
                    >
                        <Layers size={16} />
                        <span>مكتبة المكونات الجاهزة (UI Kit)</span>
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black text-white font-cairo">ابنِ واجهاتك <span className="text-primary-500">بلمسة واحدة</span></h1>
                    <p className="text-gray-400 max-w-2xl mx-auto font-cairo">مكونات واجهة مستخدم متميزة (Premium) تم تصميمها بعناية لتناسب أحدث معايير الويب الحديث.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Navigation Sidebar */}
                    <div className="lg:col-span-3 space-y-2">
                        <div className="p-4 bg-dark-900 border border-gray-800 rounded-2xl">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">التصنيفات</h3>
                            <div className="space-y-1">
                                {UI_COMPONENTS.map(comp => (
                                    <button
                                        key={comp.id}
                                        onClick={() => setSelectedId(comp.id)}
                                        className={`w-full text-right px-4 py-3 rounded-xl transition-all flex items-center justify-between group ${selectedId === comp.id
                                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                                                : 'text-gray-400 hover:bg-dark-800'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {comp.id === 'glass-card' ? <Layers size={18} /> :
                                                comp.id === 'neon-button' ? <MousePointer2 size={18} /> : <Type size={18} />}
                                            <span className="text-sm font-bold font-cairo">{comp.title}</span>
                                        </div>
                                        <Code2 size={14} className={selectedId === comp.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-primary-600 to-indigo-700 rounded-2xl text-white space-y-4 shadow-xl">
                            <h4 className="font-bold font-cairo">تحتاج مكونات خاصة؟</h4>
                            <p className="text-xs opacity-90 font-cairo">يمكننا تصميم وبرمجة مكونات واجهة مستخدم مخصصة تماماً لعلامتك التجارية.</p>
                            <a href="/request" className="block text-center bg-white text-primary-600 py-2 rounded-lg text-sm font-bold hover:shadow-lg transition-all font-cairo">طلب خدمة تصميم</a>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-9 space-y-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                {/* Preview Card */}
                                <div className="bg-dark-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
                                    <div className="p-6 border-b border-gray-800 bg-black/20 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold text-white font-cairo">{activeComp.title}</h2>
                                            <p className="text-sm text-gray-500 font-cairo">{activeComp.desc}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                                        </div>
                                    </div>
                                    <div className="p-12 flex items-center justify-center min-h-[300px] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]">
                                        {activeComp.preview}
                                    </div>
                                </div>

                                {/* Code Card */}
                                <div className="bg-dark-800 border border-gray-700 rounded-3xl overflow-hidden shadow-2xl relative group">
                                    <div className="p-4 bg-black/40 border-b border-gray-700 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Code2 size={16} className="text-primary-400" />
                                            <span className="text-xs font-mono text-gray-400">ComponentSource.jsx</span>
                                        </div>
                                        <button
                                            onClick={() => handleCopy(activeComp.code, activeComp.id)}
                                            className="flex items-center gap-2 bg-dark-700 hover:bg-dark-600 px-4 py-1.5 rounded-lg text-xs font-bold transition-all text-white border border-gray-600"
                                        >
                                            {copiedId === activeComp.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                            <span className="font-cairo">{copiedId === activeComp.id ? 'تم النسخ!' : 'نسخ الكود'}</span>
                                        </button>
                                    </div>
                                    <pre className="p-8 overflow-x-auto text-sm text-gray-300 font-mono leading-relaxed bg-black/40">
                                        <code>{activeComp.code}</code>
                                    </pre>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UIKitLibrary;
