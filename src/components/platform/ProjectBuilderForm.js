import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Globe,
    Smartphone,
    Zap,
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Sparkles,
    Palette,
    Terminal,
    Briefcase,
    Mic
} from 'lucide-react';
import { PROJECT_TYPES, FORM_STEPS, DYNAMIC_QUESTIONS, AI_AGENTS, COUNTRY_CODES } from '../../constants/platformConstants';
import AnalysisPreview from './AnalysisPreview';
import ProcessingStatus from './ProcessingStatus';
import FileViewer from './FileViewer';
import { qaAgent } from '../../utils/qaAgentLogic';
import { dataService } from '../../utils/dataService';
import { supabase } from '../../utils/supabaseClient';
import { downloadProjectBlueprint } from '../../utils/fileUtils';
import toast from 'react-hot-toast';

const ProjectBuilderForm = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [generatedProject, setGeneratedProject] = useState(null);
    const [qaReport, setQaReport] = useState(null);
    const [countryCode, setCountryCode] = useState('+966');
    const [localPhone, setLocalPhone] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [formData, setFormData] = useState({
        type: '',
        agent: 'expert',
        description: '',
        specificAnswers: {},
        email: '',
    });

    const toggleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window)) {
            toast.error('خاصية التحدث غير مدعومة في هذا المتصفح. يرجى استخدام متصفح Chrome أو Edge.');
            return;
        }

        if (isListening) {
            setIsListening(false);
            window.speechRecognitionInstance?.stop();
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        window.speechRecognitionInstance = recognition;

        recognition.lang = 'ar-SA';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setFormData(prev => ({
                ...prev,
                description: prev.description ? `${prev.description} ${transcript}` : transcript
            }));
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    useEffect(() => {
        const loadUser = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) {
                    console.warn("Session check warning:", error);
                    return;
                }
                if (session?.user?.email) {
                    setFormData(prev => ({
                        ...prev,
                        email: session.user.email
                    }));
                }
            } catch (err) {
                console.error("Auth session check failed:", err);
            }
        };
        loadUser();
    }, []);

    const handleTypeSelect = (type) => {
        setFormData({ ...formData, type, specificAnswers: {} });
    };

    const handleNext = () => {
        if (currentStep === 3) {
            // التحقق من صحة البيانات قبل الانتقال للتحليل
            if (!formData.userName || !formData.email) {
                toast.error('يرجى إكمال بياناتك (الاسم والبريد الإلكتروني) للمتابعة');
                return;
            }
            setShowAnalysis(true);
        } else if (currentStep === 1) {
            // التحقق من إجابة الأسئلة المخصصة
            const questions = DYNAMIC_QUESTIONS[formData.type] || [];
            if (Object.keys(formData.specificAnswers).length < questions.length) {
                toast.error('يرجى الإجابة على جميع الأسئلة للمتابعة');
                return;
            }
            setCurrentStep(currentStep + 1);
        } else if (currentStep === 2) {
            if (!formData.description || formData.description.length < 10) {
                toast.error('يرجى كتابة وصف أطول لفكرتك لضمان جودة التحليل');
                return;
            }
            setCurrentStep(currentStep + 1);
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (isProcessing) return;
        if (showAnalysis) {
            setShowAnalysis(false);
        } else if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const updateSpecificAnswer = (id, value) => {
        setFormData({
            ...formData,
            specificAnswers: { ...formData.specificAnswers, [id]: value }
        });
    };

    const handleDownload = useCallback(() => {
        if (!generatedProject) return;
        downloadProjectBlueprint({
            ...generatedProject,
            projectName: formData.description?.split(' ').slice(0, 3).join(' ') || 'project'
        });
    }, [generatedProject, formData.description]);

    const handleProcessingComplete = useCallback(async () => {
        try {
            // 1. استدعاء المعالج الذكي (AI Edge Function)
            const { data: result, error } = await supabase.functions.invoke('generate-project-plan', {
                body: {
                    type: formData.type, description: formData.description, specificAnswers: formData.specificAnswers, agent: formData.agent
                }
            });

            if (error) throw error;
            if (result.error) throw new Error(result.error);

            console.log("AI Generation Result:", result);

            // 2. إنشاء تقرير الجودة
            const report = await qaAgent.reviewProject();

            // 3. حفظ المشروع في قاعدة البيانات
            const generatedName = formData.description ? formData.description.split(' ').slice(0, 4).join(' ') : 'مشروع جديد';

            await dataService.saveGeneratedProject(`proj_${Date.now()}`, {
                userEmail: formData.email,
                userName: formData.userName,
                projectType: formData.type,
                project_name: generatedName,
                projectName: generatedName,
                description: formData.description,
                specificAnswers: formData.specificAnswers,
                ...result
            });

            setGeneratedProject(result);
            setQaReport(report);
        } catch (err) {
            console.error('AI Generation Failed:', err);
            toast.error('حدث خطأ أثناء تحليل المشروع، يرجى المحاولة مرة أخرى.');
        } finally {
            setIsProcessing(false);
        }
    }, [formData]);

    if (generatedProject) {
        return (
            <div className="space-y-8 animate-in fade-in duration-700">
                <FileViewer
                    files={generatedProject.files}
                    qaReport={qaReport}
                    onDownload={handleDownload}
                />

                <div className="flex justify-center gap-4 py-8">
                    <button
                        onClick={() => navigate('/portal/requests')}
                        className="bg-dark-800 border border-gray-700 hover:bg-dark-700 hover:border-white/20 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-xl"
                    >
                        <Briefcase size={20} />
                        الذهاب لطلباتي
                    </button>
                    <button
                        onClick={handleDownload}
                        className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-primary-500/20 hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                        <Zap size={20} />
                        تحميل ملفات المشروع
                    </button>
                </div>
            </div>
        );
    }

    if (isProcessing) {
        return (
            <ProcessingStatus
                onComplete={handleProcessingComplete}
            />
        );
    }

    if (showAnalysis) {
        return (
            <AnalysisPreview
                ideaData={formData}
                onConfirm={() => {
                    dataService.addUser({
                        name: formData.userName || 'مستخدم مجهول',
                        email: formData.email,
                        phone: formData.phone || 'غير مفور',
                        projectType: formData.type
                    });
                    setIsProcessing(true);
                }}
            />
        );
    }

    const renderStep = () => {
        switch (currentStep) {
            case 0: // Step: Type Selection
                return (
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <SelectionCard
                                icon={Globe}
                                title="موقع إلكتروني"
                                desc="Web Applications & Landing Pages"
                                selected={formData.type === PROJECT_TYPES.WEB}
                                onClick={() => handleTypeSelect(PROJECT_TYPES.WEB)}
                            />
                            <SelectionCard
                                icon={Smartphone}
                                title="تطبيق جوال"
                                desc="Android & iOS Native Apps"
                                selected={formData.type === PROJECT_TYPES.MOBILE}
                                onClick={() => handleTypeSelect(PROJECT_TYPES.MOBILE)}
                            />
                            <SelectionCard
                                icon={Zap}
                                title="بوت ذكاء اصطناعي"
                                desc="AI Agents & Chatbots"
                                selected={formData.type === PROJECT_TYPES.AI_BOT}
                                onClick={() => handleTypeSelect(PROJECT_TYPES.AI_BOT)}
                            />
                        </div>

                        <AnimatePresence>
                            {formData.type && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="pt-10 border-t border-white/5"
                                >
                                    <div className="flex items-center gap-3 mb-8 justify-center">
                                        <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">
                                            <Sparkles size={20} />
                                        </div>
                                        <h3 className="text-xl font-bold text-white font-cairo">اختر شخصية المساعد الذكي</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {AI_AGENTS.map((agent) => {
                                            const Icon = agent.id === 'expert' ? Terminal : agent.id === 'creative' ? Palette : Briefcase;
                                            const isSelected = formData.agent === agent.id;
                                            return (
                                                <button
                                                    key={agent.id}
                                                    onClick={() => setFormData(prev => ({ ...prev, agent: agent.id }))}
                                                    className={`group relative p-6 rounded-[2rem] border transition-all duration-300 text-right overflow-hidden ${isSelected
                                                        ? 'bg-gradient-to-br from-primary-900/50 to-dark-800 border-primary-500/50 shadow-xl shadow-primary-500/10'
                                                        : 'bg-dark-800/50 border-white/5 hover:border-white/10 hover:bg-dark-800'
                                                        }`}
                                                >
                                                    <div className={`absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent opacity-0 transition-opacity duration-500 ${isSelected ? 'opacity-100' : 'group-hover:opacity-50'}`} />

                                                    <div className="relative z-10 flex flex-col items-start gap-4">
                                                        <div className="flex w-full justify-between items-start">
                                                            <div className={`p-4 rounded-2xl transition-colors ${isSelected ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white'}`}>
                                                                <Icon size={24} />
                                                            </div>
                                                            {isSelected && (
                                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-primary-400 bg-primary-500/10 p-1.5 rounded-full border border-primary-500/20">
                                                                    <CheckCircle2 size={16} />
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h4 className={`text-lg font-bold mb-1 transition-colors ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{agent.name}</h4>
                                                            <p className="text-xs text-gray-500 leading-relaxed font-medium">{agent.role}</p>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="flex justify-center mt-12">
                                        <button
                                            onClick={() => setCurrentStep(1)}
                                            className="group relative bg-primary-600 hover:bg-primary-500 px-16 py-4 rounded-2xl font-black font-cairo text-white shadow-2xl shadow-primary-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 overflow-hidden"
                                        >
                                            <span className="relative z-10">ابدأ بتخصيص المشروع</span>
                                            <ArrowLeft className="relative z-10 group-hover:-translate-x-1 transition-transform" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );

            case 1: { // Step: Specific Details based on Type
                const questions = DYNAMIC_QUESTIONS[formData.type] || [];
                return (
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 bg-dark-800/40 backdrop-blur-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none"></div>

                            <div className="relative z-10">
                                <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                                    <span className="w-1.5 h-8 bg-primary-500 rounded-full inline-block"></span>
                                    دعنا نحدد التفاصيل
                                    <span className="text-gray-500 text-lg font-medium self-end mb-1">
                                        ( {formData.type === PROJECT_TYPES.WEB ? 'للموقع' : formData.type === PROJECT_TYPES.MOBILE ? 'للتطبيق' : 'للبوت'} )
                                    </span>
                                </h3>

                                <div className="space-y-10">
                                    {questions.map((q, idx) => (
                                        <motion.div
                                            key={q.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="space-y-4"
                                        >
                                            <label className="text-lg font-bold text-gray-200 block">{q.question}</label>

                                            {q.type === 'boolean' ? (
                                                <div className="grid grid-cols-2 gap-4">
                                                    {['نعم', 'لا'].map(opt => {
                                                        const isYes = opt === 'نعم';
                                                        const isSelected = formData.specificAnswers[q.id] === isYes;
                                                        return (
                                                            <button
                                                                key={opt}
                                                                onClick={() => updateSpecificAnswer(q.id, isYes)}
                                                                className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-3 ${isSelected
                                                                    ? (isYes ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-rose-500/10 border-rose-500 text-rose-400')
                                                                    : 'bg-dark-900/50 border-transparent hover:bg-white/5 text-gray-400'
                                                                    }`}
                                                            >
                                                                {isYes ? <CheckCircle2 size={20} /> : <div className="text-xl font-bold">✕</div>}
                                                                <span className="font-bold">{opt}</span>
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {q.options.map((opt) => {
                                                        const isSelected = formData.specificAnswers[q.id] === opt;
                                                        return (
                                                            <button
                                                                key={opt}
                                                                onClick={() => updateSpecificAnswer(q.id, opt)}
                                                                className={`p-4 rounded-2xl border transition-all text-right relative overflow-hidden group ${isSelected
                                                                    ? 'bg-primary-500/10 border-primary-500 text-white shadow-lg shadow-primary-500/5'
                                                                    : 'bg-dark-900/50 border-white/5 text-gray-400 hover:bg-white/5 hover:border-white/10'
                                                                    }`}
                                                            >
                                                                <div className="relative z-10 flex items-center justify-between">
                                                                    <span className="font-bold text-sm">{opt}</span>
                                                                    {isSelected && <CheckCircle2 size={16} className="text-primary-500" />}
                                                                </div>
                                                                {isSelected && <div className="absolute inset-0 bg-primary-500/5 blur-sm"></div>}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

            case 2: // Step: Description
                return (
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-2">
                            <div>
                                <h3 className="text-2xl font-black text-white mb-2">وصف الفكرة والمميزات</h3>
                                <p className="text-gray-400 text-sm">صف مشروعك بحرية، سيقوم الذكاء الاصطناعي بتحليل النص واستخراج المتطلبات.</p>
                            </div>
                            <button
                                onClick={toggleVoiceInput}
                                className={`px-5 py-3 rounded-2xl transition-all flex items-center gap-3 font-bold shadow-lg ${isListening
                                    ? 'bg-red-500 text-white animate-pulse shadow-red-500/30'
                                    : 'bg-dark-800 text-gray-300 hover:text-white hover:bg-dark-700 border border-white/10'
                                    }`}
                            >
                                {isListening ? (
                                    <>
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                                        </span>
                                        <span>جاري الاستماع...</span>
                                    </>
                                ) : (
                                    <>
                                        <Mic size={18} />
                                        <span>تسجيل صوتي</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-[1.7rem] opacity-30 group-hover:opacity-100 transition duration-500 blur"></div>
                            <textarea
                                className="relative w-full h-64 bg-dark-900 border border-white/10 rounded-3xl p-8 text-white focus:outline-none focus:bg-dark-800 transition-all resize-none text-lg leading-relaxed placeholder:text-gray-600 shadow-2xl"
                                placeholder="مثلاً: أريد بناء متجر للعطور يدعم الدفع بالبطاقة ويحتوي على ميزة ترشيح العطور بالذكاء الاصطناعي بناءً على إجابات العميل..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                            <div className="absolute bottom-6 left-6 text-xs text-gray-500 font-mono bg-dark-900/80 px-3 py-1 rounded-lg border border-white/5 backdrop-blur-sm">
                                {formData.description.length} حرف
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5">
                                <CheckCircle2 size={14} className="text-primary-500" />
                                <span>تحليل تلقائي للمميزات</span>
                            </div>
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5">
                                <CheckCircle2 size={14} className="text-primary-500" />
                                <span>اقتراح التقنيات المناسبة</span>
                            </div>
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5">
                                <CheckCircle2 size={14} className="text-primary-500" />
                                <span>تقدير أولي للميزانية والوقت</span>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Step: Final Review & User Info
                return (
                    <div className="max-w-lg mx-auto py-8">
                        <div className="text-center mb-10">
                            <div className="inline-flex p-5 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-[2rem] mb-6 border border-emerald-500/20 shadow-xl shadow-emerald-500/10">
                                <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                            </div>
                            <h3 className="text-3xl font-black text-white mb-3">خطوة أخيرة!</h3>
                            <p className="text-gray-400 text-sm max-w-xs mx-auto">لإنشاء حسابك وحفظ المشروع، يرجى إكمال البيانات التالية</p>
                        </div>

                        <div className="space-y-6 bg-dark-800/50 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-sm">
                            <div className="space-y-2">
                                <label htmlFor="user-name" className="text-xs font-bold text-gray-400 mr-2 uppercase tracking-wide">الاسم الكامل</label>
                                <div className="relative">
                                    <input
                                        id="user-name"
                                        required
                                        type="text"
                                        className="w-full px-6 py-4 bg-dark-900/80 border border-white/10 rounded-2xl text-white focus:border-primary-500 focus:bg-dark-900 transition-all outline-none"
                                        placeholder="أدخل اسمك"
                                        value={formData.userName || ''}
                                        onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="user-email" className="text-xs font-bold text-gray-400 mr-2 uppercase tracking-wide">البريد الإلكتروني</label>
                                <input
                                    id="user-email"
                                    required
                                    type="email"
                                    className="w-full px-6 py-4 bg-dark-900/80 border border-white/10 rounded-2xl text-white focus:border-primary-500 focus:bg-dark-900 transition-all outline-none font-sans"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="user-phone" className="text-xs font-bold text-gray-400 mr-2 uppercase tracking-wide">رقم الهاتف</label>
                                <div className="flex gap-3" dir="ltr">
                                    <select
                                        className="bg-dark-900/80 border border-white/10 rounded-2xl px-3 py-4 text-white focus:border-primary-500 outline-none w-32 text-xs font-sans"
                                        value={countryCode}
                                        onChange={(e) => {
                                            const newCode = e.target.value;
                                            setCountryCode(newCode);
                                            setFormData({ ...formData, phone: `${newCode}${localPhone}` });
                                        }}
                                    >
                                        {COUNTRY_CODES.map((country) => (
                                            <option key={country.code} value={country.code}>
                                                {country.flag} {country.code}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        id="user-phone"
                                        type="tel"
                                        className="flex-1 px-6 py-4 bg-dark-900/80 border border-white/10 rounded-2xl text-white focus:border-primary-500 focus:bg-dark-900 transition-all outline-none font-sans text-left"
                                        placeholder="50xxxxxxx"
                                        value={localPhone}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            setLocalPhone(val);
                                            setFormData({ ...formData, phone: `${countryCode}${val}` });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8 md:py-16 px-4">
            {/* Header */}
            <div className="text-center mb-16 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/10 blur-[100px] rounded-full pointer-events-none"></div>
                <h1 className="text-3xl md:text-5xl font-black text-white relative z-10 mb-4">
                    ابنِ مشروعك <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-emerald-400">بالذكاء الاصطناعي</span>
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                    من الفكرة إلى الخطة التنفيذية في دقائق. اختر نوع المشروع، حدد التفاصيل، وسيقوم الذكاء الاصطناعي بالباقي.
                </p>
            </div>

            {/* Stepper */}
            <div className="mb-20 max-w-4xl mx-auto">
                <div className="relative flex justify-between items-center px-4 md:px-10">
                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-dark-800 -translate-y-1/2 z-0 rounded-full" />
                    <div
                        className="absolute top-1/2 right-0 h-[2px] bg-gradient-to-l from-primary-500 to-emerald-500 -translate-y-1/2 z-0 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${(currentStep / (FORM_STEPS.length - 1)) * 100}%` }}
                    />

                    {FORM_STEPS.map((step, idx) => {
                        const isCompleted = idx < currentStep;
                        const isCurrent = idx === currentStep;

                        return (
                            <div key={idx} className="relative z-10 flex flex-col items-center gap-3">
                                <motion.div
                                    initial={false}
                                    animate={{
                                        scale: isCurrent ? 1.1 : 1,
                                        backgroundColor: isCompleted || isCurrent ? '#10b981' : '#111827',
                                        borderColor: isCompleted || isCurrent ? '#10b981' : '#374151'
                                    }}
                                    className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center border-4 transition-all shadow-xl ${isCurrent
                                        ? 'bg-dark-900 border-primary-500 shadow-primary-500/30'
                                        : isCompleted
                                            ? 'bg-emerald-500 border-emerald-500 text-dark-900'
                                            : 'bg-dark-900 border-dark-700 text-gray-600'
                                        }`}
                                >
                                    {isCompleted ? <CheckCircle2 size={isCurrent ? 24 : 20} className="text-white" /> : <span className={`font-black ${isCurrent ? 'text-white' : 'text-gray-600'}`}>{idx + 1}</span>}
                                </motion.div>
                                <motion.span
                                    animate={{
                                        color: isCurrent ? '#fff' : isCompleted ? '#10b981' : '#4b5563',
                                        y: isCurrent ? 0 : 0
                                    }}
                                    className="text-[10px] md:text-sm font-bold tracking-wide"
                                >
                                    {step.title}
                                </motion.span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Content Area */}
            <motion.div
                className="min-h-[400px] relative"
                initial={false}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            {/* Navigation */}
            <div className="mt-16 flex justify-between items-center p-8 border-t border-white/5 bg-dark-900/50 backdrop-blur-sm rounded-[2rem]">
                <button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${currentStep === 0
                        ? 'opacity-0 pointer-events-none'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <ArrowRight className="h-5 w-5" />
                    <span>العودة</span>
                </button>

                {currentStep > 0 && (
                    <button
                        onClick={handleNext}
                        className="group bg-white text-dark-900 hover:bg-primary-400 hover:text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl shadow-white/5 hover:shadow-primary-500/20 transform hover:-translate-y-1"
                    >
                        <span>{currentStep === FORM_STEPS.length - 1 ? 'إنهاء وإرسال' : 'التالي'}</span>
                        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                )}
            </div>
        </div>
    );
};

const SelectionCard = ({ icon: Icon, title, desc, onClick, selected }) => (
    <motion.div
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`relative cursor-pointer group h-full`}
    >
        <div className={`absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-[2rem] blur-xl transition-opacity duration-500 ${selected ? 'opacity-40' : 'opacity-0 group-hover:opacity-20'}`} />

        <div className={`relative h-full border rounded-[2rem] p-8 overflow-hidden transition-all duration-300 flex flex-col items-center text-center gap-6 ${selected
            ? 'bg-dark-900 border-primary-500/50'
            : 'bg-dark-900 border-white/5 hover:border-white/10 hover:bg-dark-800'
            }`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <div className={`relative flex items-center justify-center w-20 h-20 rounded-2xl transition-all duration-300 ${selected
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                : 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white'
                }`}>
                <Icon size={32} />
            </div>

            <div className="relative z-10">
                <h3 className={`text-xl font-bold mb-2 transition-colors ${selected ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>{title}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{desc}</p>
            </div>

            {selected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-6 right-6 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary-500/20"
                >
                    <CheckCircle2 size={16} />
                </motion.div>
            )}
        </div>
    </motion.div>
);

export default ProjectBuilderForm;
