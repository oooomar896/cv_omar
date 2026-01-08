import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Code2,
    Terminal,
    CheckCircle2,
    Settings,
    Search,
    FileCode,
    ShieldCheck
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
        setLogs(prev => [...prev.slice(-4), { id: Date.now() + Math.random(), msg }]);
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
    }, [onComplete]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-white mb-2 font-cairo">جاري بناء مشروعك بواسطة الذكاء الاصطناعي</h2>
                <p className="text-gray-400 font-cairo">يرجى عدم إغلاق الصفحة، العقل الاصطناعي يقوم الآن بكتابة السطور البرمجية...</p>
            </div>

            {/* Progress Circles */}
            <div className="flex justify-between relative max-w-2xl mx-auto">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 -translate-y-1/2 z-0" />
                {stages.map((s, idx) => {
                    const Icon = s.icon;
                    const isActive = idx === stage;
                    const isDone = idx < stage || isFinished;

                    return (
                        <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${isDone ? 'bg-emerald-500 text-white shadow-emerald-500/20' :
                                isActive ? 'bg-primary-500 text-white animate-pulse shadow-primary-500/20' :
                                    'bg-dark-800 text-gray-600 border border-gray-700'
                                }`}>
                                {isDone ? <CheckCircle2 className="h-7 w-7" /> : <Icon className="h-7 w-7" />}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Terminal/Logs */}
                <div className="bg-black/50 border border-gray-800 rounded-2xl p-6 font-mono text-sm space-y-2 h-48 overflow-hidden shadow-inner">
                    <div className="flex gap-2 mb-4 border-b border-gray-800 pb-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        <span className="text-gray-600 ml-2">ai-coder-logs</span>
                    </div>
                    {logs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-gray-400"
                        >
                            <span className="text-primary-500/70 mr-2">$</span> {log.msg}
                        </motion.div>
                    ))}
                    {!isFinished && (
                        <div className="flex items-center gap-2 text-primary-500 animate-pulse">
                            <span>_</span>
                        </div>
                    )}
                </div>

                {/* Status Info */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-dark-900/50 border border-gray-800 rounded-2xl p-8 flex flex-col justify-center items-center text-center space-y-6"
                >
                    <div className="p-4 bg-primary-500/10 rounded-full">
                        <FileCode className="h-10 w-10 text-primary-400" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-white font-cairo">{isFinished ? 'اكتمل البناء!' : 'جاري التوليد...'}</h3>
                        <p className="text-gray-400 text-sm font-cairo">
                            {isFinished ? 'نقوم الآن بتجهيز لوحة العرض الخاصة بك.' : 'بمجرد الانتهاء، ستتمكن من استعراض المخطط الكامل للمشروع.'}
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProcessingStatus;
