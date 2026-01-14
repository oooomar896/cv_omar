import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Code2,
    Terminal,
    CheckCircle2,
    Settings,
    Search,
    FileCode,
    ShieldCheck,
    Cpu,
    Loader2
} from 'lucide-react';

const stages = [
    { id: 'analysis', label: 'تحليل المتطلبات', icon: Search },
    { id: 'structure', label: 'بناء الهيكل', icon: Settings },
    { id: 'coding', label: 'توليد الكود', icon: Code2 },
    { id: 'qa', label: 'فحص الجودة (QA)', icon: ShieldCheck },
    { id: 'packaging', label: 'تجهيز الملفات', icon: Terminal },
];

const ProcessingStatus = ({ onComplete }) => {
    const [stage, setStage] = useState(0);
    const [logs, setLogs] = useState([]);
    const [isFinished, setIsFinished] = useState(false);
    const simulationStarted = useRef(false);

    const addLog = useCallback((msg) => {
        setLogs(prev => [...prev.slice(-6), { id: Date.now() + Math.random(), msg }]);
    }, []);

    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    useEffect(() => {
        if (simulationStarted.current) return;
        simulationStarted.current = true;

        const runSimulation = async () => {
            addLog("🚀 بدأ وكيل البرمجة العمل على مشروعك...");

            for (let i = 0; i < stages.length; i++) {
                setStage(i);
                addLog(`🔄 جاري تنفيذ: ${stages[i].label}...`);

                if (stages[i].id === 'qa') {
                    await delay(800);
                    addLog("🔍 فحص بنية الملفات (Linting)...");
                    await delay(1000);
                    addLog("🛡️ التأكد من المعايير الأمنية...");
                    await delay(800);
                    addLog("✨ وكيل الـ QA: الكود سليم وجاهز للتجهيز.");
                } else {
                    await delay(1500 + Math.random() * 1000);
                }

                addLog(`✅ اكتملت مرحلة ${stages[i].label}`);
            }

            setIsFinished(true);
            // Wait a small moment so user sees 100% completion before switching
            setTimeout(() => {
                if (onComplete) onComplete();
            }, 1000);
        };

        runSimulation();
    }, [onComplete, addLog]);

    return (
        <div className="max-w-5xl mx-auto py-16 px-4 space-y-16 animate-in fade-in duration-1000">
            <div className="text-center space-y-4 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="relative inline-flex mb-4">
                    <div className="absolute inset-0 bg-primary-500 blur-xl opacity-20 animate-pulse"></div>
                    <div className="relative p-4 rounded-2xl bg-dark-800/50 border border-white/10 backdrop-blur-md">
                        <Cpu className="h-10 w-10 text-primary-400 animate-spin-slow" />
                    </div>
                </div>

                <h2 className="relative z-10 text-3xl md:text-5xl font-black text-white font-cairo leading-tight">
                    جاري بناء مشروعك <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-emerald-400">بالذكاء الاصطناعي</span>
                </h2>
                <p className="relative z-10 text-gray-400 max-w-xl mx-auto text-lg font-cairo">
                    يرجى الانتظار قليلاً، يقوم محركنا الآن بكتابة الأكواد وبناء الهيكلية الكاملة لمشروعك.
                </p>
            </div>

            {/* Progress Circles */}
            <div className="flex justify-between relative max-w-3xl mx-auto px-4 md:px-0">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-dark-700 -translate-y-1/2 z-0 rounded-full" />
                <div
                    className="absolute top-1/2 right-0 h-0.5 bg-gradient-to-l from-primary-500 to-emerald-500 -translate-y-1/2 z-0 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${(stage / (stages.length - 1)) * 100}%` }}
                />

                {stages.map((s, idx) => {
                    const Icon = s.icon;
                    const isActive = idx === stage;
                    const isDone = idx < stage || isFinished;

                    return (
                        <div key={s.id} className="relative z-10 flex flex-col items-center gap-4">
                            <motion.div
                                initial={false}
                                animate={{
                                    scale: isActive ? 1.2 : 1,
                                    borderColor: isActive || isDone ? '#10b981' : '#374151',
                                    backgroundColor: isActive ? '#111827' : isDone ? '#10b981' : '#111827'
                                }}
                                className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border-2 transition-all shadow-xl ${isDone ? 'text-white shadow-emerald-500/20' :
                                        isActive ? 'text-primary-400 border-primary-500 shadow-primary-500/30' :
                                            'text-gray-600 border-dark-700'
                                    }`}
                            >
                                {isDone ? (
                                    <CheckCircle2 className="h-6 w-6 md:h-8 md:w-8" />
                                ) : (
                                    isActive ? <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin" /> : <Icon className="h-5 w-5 md:h-7 md:w-7" />
                                )}
                            </motion.div>
                            <span className={`text-[10px] md:text-sm font-bold font-cairo tracking-wide transition-colors ${isActive || isDone ? 'text-white' : 'text-gray-600'}`}>{s.label}</span>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Terminal/Logs */}
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500/30 to-purple-500/30 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                    <div className="relative bg-black/80 border border-white/10 rounded-2xl p-6 font-mono text-sm space-y-3 h-64 overflow-hidden shadow-2xl backdrop-blur-xl">
                        <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-2">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-sm shadow-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-sm shadow-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-sm shadow-green-500/50" />
                            </div>
                            <span className="text-xs text-gray-500 font-bold tracking-widest uppercase">ai-agent@core:~</span>
                        </div>

                        <div className="space-y-2 relative h-full">
                            <AnimatePresence mode="popLayout">
                                {logs.map((log) => (
                                    <motion.div
                                        key={log.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-gray-300 flex items-start gap-3"
                                    >
                                        <span className="text-emerald-500 shrink-0">➜</span>
                                        <span className="text-primary-100 font-medium">{log.msg}</span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {!isFinished && (
                                <div className="flex items-center gap-2 text-primary-400 animate-pulse mt-2">
                                    <span className="w-2 h-4 bg-primary-500 block"></span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status Info */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel p-8 rounded-[2rem] border border-white/5 bg-dark-800/40 relative overflow-hidden flex flex-col justify-center items-center text-center space-y-6"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-[50px] rounded-full"></div>

                    <div className="relative p-6 rounded-3xl bg-gradient-to-br from-primary-500/10 to-transparent border border-primary-500/20 shadow-lg mb-2">
                        <FileCode className="h-12 w-12 text-primary-400" />
                    </div>

                    <div className="space-y-3 relative z-10">
                        <h3 className="text-2xl font-black text-white font-cairo">
                            {isFinished ? 'تم استكمال البناء بنجاح! 🎉' : 'جاري معالجة البيانات...'}
                        </h3>
                        <p className="text-gray-400 text-sm font-cairo leading-relaxed max-w-xs mx-auto">
                            {isFinished
                                ? 'يتم الآن تحويلك تلقائياً لاستعراض ملفات المشروع...'
                                : 'سيتم توجيهك إلى محرر الأكواد المباشر فور الانتهاء لمراجعة النتائج.'}
                        </p>
                    </div>

                    {!isFinished && (
                        <div className="flex items-center gap-2 text-xs font-bold text-primary-500 bg-primary-500/5 px-4 py-2 rounded-full border border-primary-500/10 animate-pulse">
                            <Loader2 size={12} className="animate-spin" />
                            <span>تتم المعالجة في السحابة</span>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ProcessingStatus;
