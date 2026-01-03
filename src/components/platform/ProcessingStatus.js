import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Code2,
    Terminal,
    CheckCircle2,
    Loader2,
    Download,
    Settings,
    Search,
    FileCode
} from 'lucide-react';

const ProcessingStatus = ({ projectData, onComplete }) => {
    const [stage, setStage] = useState(0);
    const [logs, setLogs] = useState([]);
    const [isFinished, setIsFinished] = useState(false);

    const stages = [
        { id: 'analysis', label: 'تحليل المتطلبات وهندسة البرومبتات', icon: Search },
        { id: 'structure', label: 'بناء هيكل المجلدات والملفات', icon: Settings },
        { id: 'coding', label: 'توليد الكود البرمجي (AI Coding)', icon: Code2 },
        { id: 'packaging', label: 'تجهيز ملف الـ ZIP والوثائق', icon: Terminal },
    ];

    useEffect(() => {
        const runSimulation = async () => {
            addLog("🚀 بدأ وكيل البرمجة العمل على مشروعك...");

            for (let i = 0; i < stages.length; i++) {
                setStage(i);
                addLog(`جاري تنفيذ: ${stages[i].label}...`);
                await delay(2000 + Math.random() * 2000);
                addLog(`✅ اكتملت مرحلة ${stages[i].label}`);
            }

            setIsFinished(true);
        };

        runSimulation();
    }, []);

    const addLog = (msg) => {
        setLogs(prev => [...prev.slice(-4), { id: Date.now(), msg }]);
    };

    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-white mb-2">جاري بناء مشروعك بواسطة الذكاء الاصطناعي</h2>
                <p className="text-gray-400">يرجى عدم إغلاق الصفحة، العقل الاصطناعي يقوم الآن بكتابة السطور البرمجية...</p>
            </div>

            {/* Progress Circles */}
            <div className="flex justify-between relative max-w-2xl mx-auto">
                {stages.map((s, idx) => {
                    const Icon = s.icon;
                    const isActive = idx === stage;
                    const isDone = idx < stage || isFinished;

                    return (
                        <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${isDone ? 'bg-green-500 text-white shadow-green-500/20' :
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
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
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

                {/* Deliverables Card */}
                <AnimatePresence>
                    {isFinished && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-primary-500/30 rounded-2xl p-8 flex flex-col justify-center items-center text-center space-y-6"
                        >
                            <div className="p-4 bg-white/10 rounded-full">
                                <FileCode className="h-10 w-10 text-primary-400" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white">مشروعك جاهز للتحميل!</h3>
                                <p className="text-gray-300 text-sm">تم ضغط كامل الملفات والوثائق في حزمة واحدة.</p>
                            </div>
                            <button
                                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-primary-500/20"
                                onClick={() => alert('جاري بدء التحميل...')}
                            >
                                <Download className="h-6 w-6" />
                                <span>تحميل المشروع (ZIP)</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ProcessingStatus;
