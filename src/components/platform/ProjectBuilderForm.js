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
    Mic,
    Upload,
    Save,
    Trash2,
    FileText
} from 'lucide-react';
import { PROJECT_TYPES, FORM_STEPS, DYNAMIC_QUESTIONS, AI_AGENTS, COUNTRY_CODES } from '../../constants/platformConstants';
import AnalysisPreview from './AnalysisPreview';
import ProcessingStatus from './ProcessingStatus';
import FileViewer from './FileViewer';
import { qaAgent } from '../../utils/qaAgentLogic';
import { dataService } from '../../utils/dataService';
import { supabase } from '../../utils/supabaseClient';
import { downloadProjectBlueprint, uploadFile } from '../../utils/fileUtils';
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
        userName: '',
        userPhone: '',
        email: '',
        uploadedFiles: []
    });
    const [isSavingDraft, setIsSavingDraft] = useState(false);

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
        const loadInitialData = async () => {
            try {
                // 1. Check for existing draft
                const lastDraft = dataService.getProjectDraft('last_builder_draft');
                if (lastDraft) {
                    setFormData(lastDraft.formData);
                    setCurrentStep(lastDraft.currentStep);
                    toast.success('تم استعادة مسودة العمل السابقة', { icon: '📝' });
                }

                // 2. Load Auth User
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user?.email) {
                    setFormData(prev => ({
                        ...prev,
                        email: session.user.email,
                        userName: session.user.user_metadata?.full_name || prev.userName
                    }));
                }
            } catch (err) {
                console.error("Initialization failed:", err);
            }
        };
        loadInitialData();
    }, []);

    // Auto-save draft
    useEffect(() => {
        if (currentStep > 0 && !isProcessing && !generatedProject) {
            const timer = setTimeout(() => {
                setIsSavingDraft(true);
                dataService.saveProjectDraft('last_builder_draft', { formData, currentStep });
                setTimeout(() => setIsSavingDraft(false), 1000);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [formData, currentStep, isProcessing, generatedProject]);

    const handleTypeSelect = (type) => {
        setFormData({ ...formData, type, specificAnswers: {} });
    };

    const handleNext = () => {
        if (currentStep === 0) {
            if (!formData.type) {
                toast.error('يرجى اختيار نوع المشروع للمتابعة');
                return;
            }
            setCurrentStep(1);
        } else if (currentStep === 1) {
            const questions = DYNAMIC_QUESTIONS[formData.type] || [];
            if (Object.keys(formData.specificAnswers).length < questions.length) {
                toast.error('يرجى الإجابة على جميع الأسئلة للمتابعة');
                return;
            }
            if (!formData.description || formData.description.length < 10) {
                toast.error('يرجى كتابة وصف قصير لمشروعك');
                return;
            }
            setCurrentStep(2);
        } else if (currentStep === 2) {
            // Assets step is optional but we can add validation if needed
            setCurrentStep(3);
        } else if (currentStep === 3) {
            if (!formData.userName || !formData.email) {
                toast.error('يرجى إكمال بياناتك للمتابعة');
                return;
            }
            setShowAnalysis(true);
        }
    };

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setIsProcessing(true);
        const toastId = toast.loading('جاري رفع الملفات...');

        try {
            const uploadPromises = files.map(async (file) => {
                const path = `${formData.email || 'guest'}/${Date.now()}_${file.name}`;
                const url = await uploadFile(supabase, 'project-assets', path, file);
                return { name: file.name, url, size: file.size, type: file.type };
            });

            const uploadedResults = await Promise.all(uploadPromises);
            setFormData(prev => ({
                ...prev,
                uploadedFiles: [...prev.uploadedFiles, ...uploadedResults]
            }));
            toast.success('تم رفع الملفات بنجاح', { id: toastId });
        } catch (err) {
            console.error('Upload error:', err);
            toast.error('فشل رفع بعض الملفات', { id: toastId });
        } finally {
            setIsProcessing(false);
        }
    };

    const removeFile = (index) => {
        setFormData(prev => ({
            ...prev,
            uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index)
        }));
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
            const report = await qaAgent.reviewProject(result);

            // 3. حفظ المشروع في قاعدة البيانات
            const generatedName = formData.description ? formData.description.split(' ').slice(0, 4).join(' ') : 'مشروع جديد';

            await dataService.saveGeneratedProject(`proj_${Date.now()}`, {
                userEmail: formData.email,
                userName: formData.userName,
                userPhone: formData.userPhone,
                projectType: formData.type,
                projectName: generatedName,
                description: formData.description,
                specificAnswers: formData.specificAnswers,
                analysis: result.analysis || {},
                ...result,
                files: result.files || {}
            });

            setGeneratedProject(result);
            setQaReport(report);

            // 4. مسح المسودة وإضافة إشعار نجاح
            dataService.clearProjectDraft('last_builder_draft');
            toast.success('تم إنشاء مشروعك بنجاح! يمكنك الآن استعراض التفاصيل', { duration: 5000 });

        } catch (err) {
            console.error('AI Generation Failed:', err);
            const errorMessage = err.message || 'حدث خطأ غير متوقع';
            toast.error(`فشل تحليل المشروع: ${errorMessage}`);
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
                                    دعنا نحدد التفاصيل والمتطلبات
                                    <span className="text-gray-500 text-lg font-medium self-end mb-1">
                                        ( {formData.type === PROJECT_TYPES.WEB ? 'للموقع' : formData.type === PROJECT_TYPES.MOBILE ? 'للتطبيق' : 'للبوت'} )
                                    </span>
                                </h3>

                                <div className="space-y-10">
                                    {/* Description Field moved here */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <label htmlFor="description" className="text-lg font-bold text-gray-200 block">وصف الفكرة والمميزات</label>
                                            <button
                                                onClick={toggleVoiceInput}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                                            >
                                                <Mic size={14} />
                                                <span>{isListening ? 'جاري الاستماع...' : 'إدخال صوتي'}</span>
                                            </button>
                                        </div>
                                        <textarea
                                            id="description"
                                            className="w-full h-32 bg-dark-900 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary-500 transition-all resize-none"
                                            placeholder="اشرح فكرتك باختصار..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>

                                    {questions.map((q, idx) => (
                                        <motion.div
                                            key={q.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="space-y-4"
                                        >
                                            <span className="text-lg font-bold text-gray-200 block">{q.question}</span>

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

            case 2: // Step: Assets & Files
                return (
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 bg-dark-800/40 backdrop-blur-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                                    <span className="w-1.5 h-8 bg-primary-500 rounded-full inline-block"></span>
                                    الهوية والملفات المرفقة
                                </h3>

                                <div className="space-y-8">
                                    {/* Color Palette Choice */}
                                    <div className="space-y-4">
                                        <span className="text-lg font-bold text-gray-200 block">الألوان المقترحة (اختياري)</span>
                                        <div className="grid grid-cols-4 gap-4">
                                            {[
                                                { id: 'modern', name: 'عصري', colors: ['#3b82f6', '#1e293b'] },
                                                { id: 'eco', name: 'بيئي', colors: ['#10b981', '#064e3b'] },
                                                { id: 'luxury', name: 'فخم', colors: ['#f59e0b', '#000000'] },
                                                { id: 'creative', name: 'إبداعي', colors: ['#ec4899', '#4c1d95'] }
                                            ].map(palette => (
                                                <button
                                                    key={palette.id}
                                                    onClick={() => setFormData(prev => ({ ...prev, palette: palette.id }))}
                                                    className={`p-3 rounded-2xl border transition-all ${formData.palette === palette.id ? 'border-primary-500 bg-primary-500/10' : 'border-white/5 bg-dark-900/40'}`}
                                                >
                                                    <div className="flex gap-1 mb-2">
                                                        {palette.colors.map(c => <div key={c} className="w-full h-8 rounded-lg" style={{ backgroundColor: c }} />)}
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-400">{palette.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* File Upload Area */}
                                    <div className="space-y-4">
                                        <span className="text-lg font-bold text-gray-200 block">رفع شعار أو ملفات توضيحية</span>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                multiple
                                                onChange={handleFileUpload}
                                                className="hidden"
                                                id="file-upload"
                                            />
                                            <label
                                                htmlFor="file-upload"
                                                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/10 rounded-3xl hover:border-primary-500/50 hover:bg-primary-500/5 transition-all cursor-pointer group"
                                            >
                                                <Upload className="w-10 h-10 text-gray-500 group-hover:text-primary-500 mb-4 transition-colors" />
                                                <span className="text-gray-400 group-hover:text-white font-bold transition-colors">اسحب الملفات هنا أو اضغط للاختيار</span>
                                                <span className="text-[10px] text-gray-600 mt-2">PDF, PNG, JPG, ZIP (Max 10MB)</span>
                                            </label>
                                        </div>

                                        {/* Uploaded Files List */}
                                        <AnimatePresence>
                                            {formData.uploadedFiles.length > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="grid grid-cols-1 gap-3"
                                                >
                                                    {formData.uploadedFiles.map((file, idx) => (
                                                        <div key={idx} className="flex items-center justify-between p-4 bg-dark-900/60 rounded-2xl border border-white/5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-primary-500/10 text-primary-400 rounded-lg">
                                                                    <FileText size={18} />
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-bold text-white truncate max-w-[200px]">{file.name}</span>
                                                                    <span className="text-[10px] text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => removeFile(idx)}
                                                                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Step: Review & User Info
                return (
                    <div className="max-w-4xl mx-auto py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                            {/* Summary Card */}
                            <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-dark-800/60 order-2 lg:order-1">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <FileText size={20} className="text-primary-500" />
                                    مخلص المشروع
                                </h3>

                                <div className="space-y-6">
                                    <div className="p-4 bg-white/5 rounded-2xl">
                                        <span className="text-[10px] text-gray-500 font-bold block mb-1">نوع المشروع</span>
                                        <span className="text-sm font-bold text-primary-400 capitalize">{formData.type}</span>
                                    </div>

                                    <div className="p-4 bg-white/5 rounded-2xl">
                                        <span className="text-[10px] text-gray-500 font-bold block mb-1">المساعد الذكي</span>
                                        <span className="text-sm font-bold text-white">{AI_AGENTS.find(a => a.id === formData.agent)?.name}</span>
                                    </div>

                                    <div className="p-4 bg-white/5 rounded-2xl">
                                        <span className="text-[10px] text-gray-500 font-bold block mb-1">وصف الفكرة</span>
                                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{formData.description}</p>
                                    </div>

                                    {formData.uploadedFiles.length > 0 && (
                                        <div className="p-4 bg-white/5 rounded-2xl">
                                            <span className="text-[10px] text-gray-500 font-bold block mb-1">الملفات المرفقة</span>
                                            <span className="text-xs text-white">{formData.uploadedFiles.length} ملف</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* User Info Form */}
                            <div className="space-y-6 order-1 lg:order-2">
                                <div className="text-right mb-6">
                                    <h3 className="text-2xl font-black text-white mb-2">البيانات الشخصية</h3>
                                    <p className="text-gray-400 text-sm">سنقوم بإنشاء حساب لك وربط المشروع ببريدك الإلكتروني</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="user-name" className="text-xs font-bold text-gray-500 mr-2 uppercase tracking-wide">الاسم الكامل</label>
                                        <input
                                            id="user-name"
                                            required
                                            type="text"
                                            className="w-full px-6 py-4 bg-dark-900/80 border border-white/10 rounded-2xl text-white focus:border-primary-500 outline-none transition-all"
                                            placeholder="أدخل اسمك"
                                            value={formData.userName}
                                            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="user-email" className="text-xs font-bold text-gray-500 mr-2 uppercase tracking-wide">البريد الإلكتروني</label>
                                        <input
                                            id="user-email"
                                            required
                                            type="email"
                                            className="w-full px-6 py-4 bg-dark-900/80 border border-white/10 rounded-2xl text-white focus:border-primary-500 outline-none font-sans transition-all"
                                            placeholder="name@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="user-phone" className="text-xs font-bold text-gray-500 mr-2 uppercase tracking-wide">رقم الهاتف</label>
                                        <div className="flex gap-3" dir="ltr">
                                            <select
                                                className="bg-dark-900/80 border border-white/10 rounded-2xl px-3 py-4 text-white focus:border-primary-500 outline-none w-32 text-xs font-sans"
                                                value={countryCode}
                                                onChange={(e) => setCountryCode(e.target.value)}
                                            >
                                                {COUNTRY_CODES.map((country) => (
                                                    <option key={country.code} value={country.code}>{country.flag} {country.code}</option>
                                                ))}
                                            </select>
                                            <input
                                                id="user-phone"
                                                type="tel"
                                                className="flex-1 px-6 py-4 bg-dark-900/80 border border-white/10 rounded-2xl text-white focus:border-primary-500 outline-none font-sans text-left"
                                                placeholder="50xxxxxxx"
                                                value={localPhone}
                                                onChange={(e) => setLocalPhone(e.target.value.replace(/\D/g, ''))}
                                            />
                                        </div>
                                    </div>
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

            {/* Draft Saved Indicator */}
            <div className="flex justify-center mb-6 h-8">
                <AnimatePresence>
                    {isSavingDraft && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 shadow-lg shadow-emerald-500/5"
                        >
                            <Save size={10} />
                            <span>تم حفظ مسودة العمل تلقائياً</span>
                        </motion.div>
                    )}
                </AnimatePresence>
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
