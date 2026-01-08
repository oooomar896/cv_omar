import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Globe,
    Smartphone,
    Zap,
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Sparkles
} from 'lucide-react';
import { PROJECT_TYPES, FORM_STEPS, DYNAMIC_QUESTIONS } from '../../constants/platformConstants';
import AnalysisPreview from './AnalysisPreview';
import ProcessingStatus from './ProcessingStatus';
import FileViewer from './FileViewer';
import { coderAgent } from '../../utils/coderAgentLogic';
import { qaAgent } from '../../utils/qaAgentLogic';
import { dataService } from '../../utils/dataService';
import { downloadProjectBlueprint } from '../../utils/fileUtils';

const ProjectBuilderForm = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [generatedProject, setGeneratedProject] = useState(null);
    const [qaReport, setQaReport] = useState(null);
    const [formData, setFormData] = useState({
        type: '',
        description: '',
        specificAnswers: {},
        email: '',
    });

    const handleTypeSelect = (type) => {
        setFormData({ ...formData, type, specificAnswers: {} });
        setCurrentStep(1);
    };

    const handleNext = () => {
        if (currentStep === 3) {
            // التحقق من صحة البيانات قبل الانتقال للتحليل
            if (!formData.userName || !formData.email) {
                alert('يرجى إكمال بياناتك (الاسم والبريد الإلكتروني) للمتابعة');
                return;
            }
            setShowAnalysis(true);
        } else if (currentStep === 1) {
            // التحقق من إجابة الأسئلة المخصصة
            const questions = DYNAMIC_QUESTIONS[formData.type] || [];
            if (Object.keys(formData.specificAnswers).length < questions.length) {
                alert('يرجى الإجابة على جميع الأسئلة للمتابعة');
                return;
            }
            setCurrentStep(currentStep + 1);
        } else if (currentStep === 2) {
            if (!formData.description || formData.description.length < 10) {
                alert('يرجى كتابة وصف أطول لفكرتك لضمان جودة التحليل');
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
        const result = await coderAgent.generateProject(formData);
        const report = await qaAgent.reviewProject();

        dataService.saveGeneratedProject(`proj_${Date.now()}`, {
            userEmail: formData.email,
            userName: formData.userName,
            projectType: formData.type,
            description: formData.description,
            specificAnswers: formData.specificAnswers,
            ...result
        });

        setGeneratedProject(result);
        setQaReport(report);
        setIsProcessing(false);
    }, [formData]);

    if (generatedProject) {
        return (
            <FileViewer
                files={generatedProject.files}
                qaReport={qaReport}
                onDownload={handleDownload}
            />
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
                    // حفظ المستخدم في قاعدة البيانات (Lead Generation)
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
                );

            case 1: { // Step: Specific Details based on Type
                const questions = DYNAMIC_QUESTIONS[formData.type] || [];
                return (
                    <div className="space-y-8">
                        <div className="bg-dark-800 p-6 rounded-2xl border border-gray-700">
                            <h3 className="text-xl font-bold text-white mb-6">أخبرنا المزيد عن {formData.type === PROJECT_TYPES.WEB ? 'الموقع' : formData.type === PROJECT_TYPES.MOBILE ? 'التطبيق' : 'البوت'}</h3>
                            <div className="space-y-6">
                                {questions.map((q) => (
                                    <div key={q.id} className="space-y-3">
                                        <label className="text-gray-300 block font-medium">{q.question}</label>
                                        {q.type === 'boolean' ? (
                                            <div className="flex gap-4">
                                                {['نعم', 'لا'].map(opt => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => updateSpecificAnswer(q.id, opt === 'نعم')}
                                                        className={`px-6 py-2 rounded-lg border transition-all ${formData.specificAnswers[q.id] === (opt === 'نعم')
                                                            ? 'bg-primary-500 border-primary-500 text-white'
                                                            : 'border-gray-600 text-gray-400 hover:border-primary-500'
                                                            }`}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-3">
                                                {q.options.map(opt => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => updateSpecificAnswer(q.id, opt)}
                                                        className={`px-4 py-3 rounded-xl border text-sm transition-all ${formData.specificAnswers[q.id] === opt
                                                            ? 'bg-primary-500/20 border-primary-500 text-primary-500'
                                                            : 'border-gray-700 text-gray-400 hover:border-gray-500'
                                                            }`}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            }

            case 2: // Step: Description
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-white">وصف الفكرة (بشكل حر)</h3>
                        <textarea
                            className="w-full h-48 bg-dark-800 border border-gray-700 rounded-2xl p-6 text-white focus:border-primary-500 outline-none transition-all"
                            placeholder="مثلاً: أريد بناء متجر للعطور يدعم الدفع بالبطاقة ويحتوي على ميزة ترشيح العطور بالذكاء الاصطناعي..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                        <p className="text-sm text-gray-500">سيقوم محلل اللغة لدينا باستخلاص المتطلبات التقنية من هذا الوصف.</p>
                    </div>
                );

            case 3: // Step: Final Review & User Info
                return (
                    <div className="space-y-8 text-center max-w-lg mx-auto">
                        <div className="inline-flex p-4 bg-green-500/20 rounded-full mb-4">
                            <CheckCircle2 className="h-12 w-12 text-green-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">خطوة واحدة باقية!</h3>
                        <p className="text-gray-400">يرجى تزويدنا ببياناتك لنتمكن من حفظ المشروع في حسابك والتواصل معك بشأن التطبيق.</p>

                        <div className="space-y-4 text-right">
                            <div className="space-y-2">
                                <label htmlFor="user-name" className="text-sm text-gray-400 mr-2">الاسم الكامل</label>
                                <input
                                    id="user-name"
                                    required
                                    type="text"
                                    className="w-full px-6 py-4 bg-dark-800 border border-gray-700 rounded-xl text-white focus:border-primary-500 outline-none"
                                    placeholder="أدخل اسمك الكريم"
                                    value={formData.userName || ''}
                                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="user-email" className="text-sm text-gray-400 mr-2">البريد الإلكتروني</label>
                                <input
                                    id="user-email"
                                    required
                                    type="email"
                                    className="w-full px-6 py-4 bg-dark-800 border border-gray-700 rounded-xl text-white focus:border-primary-500 outline-none font-sans"
                                    placeholder="your-email@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="user-phone" className="text-sm text-gray-400 mr-2">رقم الهاتف</label>
                                <input
                                    id="user-phone"
                                    type="tel"
                                    className="w-full px-6 py-4 bg-dark-800 border border-gray-700 rounded-xl text-white focus:border-primary-500 outline-none font-sans"
                                    placeholder="+966 5X XXX XXXX"
                                    value={formData.phone || ''}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-4">
            {/* SEO Title */}
            <h1 className="text-3xl md:text-5xl font-black text-center text-white mb-12 relative z-10">
                ابنِ هيكل مشروعك <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-500">بالذكاء الاصطناعي</span>
            </h1>

            {/* Beta Announcement */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-12 p-1 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-2xl border border-primary-500/20"
            >
                <div className="bg-dark-950/80 backdrop-blur-md rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 text-center md:text-right">
                    <div className="p-3 bg-primary-500/20 rounded-xl">
                        <Sparkles className="h-6 w-6 text-primary-400" />
                    </div>
                    <div className="text-sm md:text-base text-gray-300">
                        <span className="font-bold text-white ml-2">مرحلة البيتا (Beta):</span>
                        المنصة حالياً في طور التطوير، جميع ميزات توليد الكود متاحة
                        <span className="text-secondary-400 font-bold mx-1 text-lg">مجانًا</span>
                        لفترة محدودة لدعم المبتكرين.
                    </div>
                </div>
            </motion.div>

            {/* Progress Stepper */}
            <div className="mb-16">
                <div className="flex justify-between relative max-w-3xl mx-auto">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 -translate-y-1/2 z-0" />
                    {FORM_STEPS.map((step, idx) => (
                        <div key={idx} className="relative z-10 flex flex-col items-center gap-4">
                            <motion.div
                                initial={false}
                                animate={{
                                    scale: idx === currentStep ? 1.2 : 1,
                                    borderColor: idx <= currentStep ? 'rgba(16, 185, 129, 0.5)' : 'rgba(55, 65, 81, 1)'
                                }}
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all shadow-lg ${idx <= currentStep ? 'bg-gradient-to-br from-primary-600 to-secondary-600 text-white shadow-primary-500/20 border-transparent' : 'bg-dark-900 border-gray-700 text-gray-500'
                                    }`}
                            >
                                {idx < currentStep ? <CheckCircle2 className="h-6 w-6" /> : <span className="font-bold text-lg">{idx + 1}</span>}
                            </motion.div>
                            <span className={`text-xs md:text-sm font-bold ${idx <= currentStep ? 'text-white' : 'text-gray-600'}`}>{step.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-16 flex justify-between items-center pt-8 border-t border-gray-800/50">
                <button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <ArrowRight className="h-5 w-5" />
                    <span>العودة للسابق</span>
                </button>

                {currentStep > 0 && (
                    <button
                        onClick={handleNext}
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg hover:shadow-primary-500/25 text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 transition-all transform hover:-translate-y-1"
                    >
                        <span>{currentStep === FORM_STEPS.length - 1 ? 'إتمام بناء المشروع' : 'الخطوة التالية'}</span>
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

const SelectionCard = ({ icon: Icon, title, desc, onClick, selected }) => (
    <motion.div
        whileHover={{ y: -10 }}
        onClick={onClick}
        className={`relative cursor-pointer group rounded-3xl p-1 transition-all duration-300 ${selected ? 'bg-gradient-to-br from-primary-500 to-secondary-500 shadow-2xl shadow-primary-500/20' : 'bg-transparent hover:bg-white/5'
            }`}
    >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />

        <div className="relative h-full bg-dark-900 border border-gray-800 rounded-[22px] p-8 overflow-hidden">
            {/* Ornament Circles */}
            <div className={`absolute -right-20 -top-20 w-40 h-40 rounded-full transition-all duration-500 ${selected ? 'bg-primary-500/10' : 'bg-gray-800/20 group-hover:bg-primary-500/5'}`} />

            <div className="relative z-10 flex flex-col items-center text-center">
                {/* Icon Container with Orbit */}
                <div className="relative mb-6 w-24 h-24">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className={`absolute inset-0 border-2 border-dashed rounded-full ${selected ? 'border-primary-500/30' : 'border-gray-700'}`}
                    />
                    <div className={`absolute inset-2 rounded-full flex items-center justify-center transition-colors ${selected ? 'bg-gradient-to-br from-primary-500 to-secondary-600 text-white' : 'bg-dark-800 text-gray-400 group-hover:text-primary-500 group-hover:bg-dark-700'}`}>
                        <Icon size={32} />
                    </div>
                </div>

                <h3 className={`text-xl font-bold mb-3 transition-colors ${selected ? 'text-primary-400' : 'text-white'}`}>{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-light">{desc}</p>

                {/* Selection Indicator */}
                <div className={`mt-6 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'border-primary-500 bg-primary-500 text-white' : 'border-gray-700 text-transparent group-hover:border-primary-500/50'}`}>
                    <CheckCircle2 size={16} />
                </div>
            </div>
        </div>
    </motion.div>
);

export default ProjectBuilderForm;
