import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    X,
    Sparkles,
    Send,
    Zap,
    HelpCircle,
    Terminal,
    CheckCircle2
} from 'lucide-react';

const SUGGESTIONS = [
    { id: 'explain', label: 'اشرح لي الكود', icon: Terminal },
    { id: 'deploy', label: 'كيف أنشر مشروعي؟', icon: Zap },
    { id: 'cost', label: 'كم يكلف التطوير؟', icon: HelpCircle },
];

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'أهلاً بك! أنا مساعد عمر الذكي. كيف يمكنني مساعدتك اليوم بخصوص مشروعك؟' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = (text) => {
        const msg = text || inputText;
        if (!msg.trim()) return;

        setMessages(prev => [...prev, { role: 'user', text: msg }]);
        setInputText('');
        setIsTyping(true);

        // Mock AI thinking
        setTimeout(() => {
            let response = '';
            if (msg.includes('كود')) response = 'الأكواد المولدة مكتوبة بلغة React/Flutter حديثة، تتبع أفضل المعايير لضمان الأداء والقابلية للتوسع.';
            else if (msg.includes('نشر') || msg.includes('أنشر')) response = 'يمكنك نشر مشاريع الويب فوراً عبر Netlify أو Vercel. أما تطبيقات الجوال فنحن نساعدك في رفعها لمتاجر Google Play و App Store.';
            else if (msg.includes('تكلف') || msg.includes('سعر')) response = 'تعتمد التكلفة على حجم الميزات المطلوبة. غالباً ما تبدأ مشاريعنا الاحترافية من أسعار تنافسية جداً مع ضمان الجودة العالية.';
            else if (msg.includes('مكتبات') || msg.includes('قوالب') || msg.includes('بناء')) response = 'نوفر لك مكتبات برمجية جاهزة (Starter Kits) لكل نوع من المشاريع (ويب، جوال، بوت) لتسهيل عملية التطوير وتقليل الوقت المستغرق في البنية التحتية.';
            else response = 'فهمت ما تقصده. كفريق تقني، نحن نركز على تحويل هذه الرؤية لواقع ملموس بأسرع وقت وأعلى جودة.';

            setMessages(prev => [...prev, { role: 'assistant', text: response }]);
            setIsTyping(false);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="assistant-window"
                        initial={{ opacity: 0, y: 20, scale: 0.8, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        className="mb-4 w-80 md:w-96 bg-dark-900 border border-gray-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
                        style={{ maxHeight: '500px', pointerEvents: 'auto' }}
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-primary-600 to-indigo-700 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl">
                                    <Sparkles size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm font-cairo">مساعد عمر الذكي</h4>
                                    <p className="text-[10px] opacity-80 uppercase tracking-widest font-mono">Expert AI Support</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-lg transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-grow p-4 overflow-y-auto space-y-4 min-h-[300px] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]">
                            {messages.map((m, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: m.role === 'user' ? -20 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm font-cairo ${m.role === 'user'
                                        ? 'bg-dark-800 border border-gray-700 text-gray-200 rounded-bl-none'
                                        : 'bg-primary-500/10 border border-primary-500/30 text-primary-400 rounded-br-none'
                                        }`}>
                                        {m.text}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-end">
                                    <div className="bg-primary-500/10 p-3 rounded-2xl rounded-br-none flex gap-1 items-center">
                                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" />
                                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer & Input */}
                        <div className="p-4 border-t border-gray-800 bg-black/20 space-y-4">
                            {!inputText && messages.length < 3 && (
                                <div className="flex flex-wrap gap-2">
                                    {SUGGESTIONS.map(s => (
                                        <button
                                            key={s.id}
                                            onClick={() => handleSend(s.label)}
                                            className="text-[10px] bg-dark-800 hover:bg-dark-700 border border-gray-700 px-3 py-1.5 rounded-full text-gray-400 flex items-center gap-1.5 transition-all font-cairo"
                                        >
                                            <s.icon size={12} />
                                            <span>{s.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="اكتب استفسارك هنا..."
                                    className="w-full bg-dark-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:border-primary-500 outline-none transition-all pr-12 font-cairo"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <button
                                    onClick={() => handleSend()}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-primary-500 hover:text-primary-400"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                type="button"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all ${isOpen ? 'bg-red-500 shadow-red-500/30' : 'bg-primary-500 shadow-primary-500/30'
                    } group`}
            >
                {isOpen ? <X className="text-white" /> : (
                    <div className="relative">
                        <MessageSquare className="text-white" />
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center"
                        >
                            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                        </motion.div>
                    </div>
                )}
            </motion.button>
        </div>
    );
};

export default AIAssistant;
