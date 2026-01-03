import { useState } from 'react';
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

    if (generatedProject) {
        return (
            <FileViewer
                files={generatedProject.files}
                qaReport={qaReport}
                onDownload={() => alert('جاري تحميل حزمة المشروع...')}
            />
        );
    }

    if (isProcessing) {
        return (
            <ProcessingStatus
                projectData={formData}
                onComplete={async () => {
                    const result = await coderAgent.generateProject(formData);
                    const report = await qaAgent.reviewProject();

                    // حفظ المشروع في سجل المستخدم
                    dataService.saveGeneratedProject(`proj_${Date.now()}`, {
                        userEmail: formData.email,
                        userName: formData.userName,
                        projectType: formData.type,
                        ...result
                    });

                    setGeneratedProject(result);
                    setQaReport(report);
                    setIsProcessing(false);
                }}
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
        <div className="max-w-4xl mx-auto py-12 px-4">
            {/* Beta Announcement */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-4 bg-primary-500/10 border border-primary-500/20 rounded-2xl flex items-center gap-4 text-primary-400"
            >
                <div className="p-2 bg-primary-500/20 rounded-lg">
                    <Sparkles className="h-5 w-5" />
                </div>
                <div className="text-sm">
                    <span className="font-bold ml-1">مرحلة البيتا (Beta):</span>
                    المنصة حالياً في طور التطوير، جميع ميزات توليد الكود متاحة
                    <span className="text-white font-bold mx-1 text-base">مجانًا</span>
                    لفترة محدودة لدعم المبتكرين.
                </div>
            </motion.div>

            {/* Progress Stepper */}
            <div className="flex justify-between mb-12 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 -translate-y-1/2 z-0" />
                {FORM_STEPS.map((step, idx) => (
                    <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${idx <= currentStep ? 'bg-primary-500 border-primary-500 text-white' : 'bg-dark-900 border-gray-700 text-gray-500'
                            }`}>
                            {idx < currentStep ? <CheckCircle2 className="h-6 w-6" /> : idx + 1}
                        </div>
                        <span className={`text-xs font-medium ${idx <= currentStep ? 'text-primary-500' : 'text-gray-500'}`}>{step.title}</span>
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-12 flex justify-between items-center bg-dark-800/50 p-6 rounded-2xl border border-gray-800">
                <button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${currentStep === 0 ? 'text-gray-700 cursor-not-allowed' : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <ArrowRight className="h-5 w-5" />
                    <span>السابق</span>
                </button>

                {currentStep > 0 && (
                    <button
                        onClick={handleNext}
                        className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-3 transition-all shadow-lg shadow-primary-500/20"
                    >
                        <span>{currentStep === FORM_STEPS.length - 1 ? 'إتمام وحفظ' : 'المتابعة'}</span>
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

const SelectionCard = ({ icon: Icon, title, desc, onClick, selected }) => (
    <button
        onClick={onClick}
        className={`p-8 rounded-3xl border-2 text-right transition-all group ${selected
            ? 'bg-primary-500/10 border-primary-500 shadow-xl shadow-primary-500/10'
            : 'bg-dark-800 border-gray-700 hover:border-primary-500/50'
            }`}
    >
        <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-all ${selected ? 'bg-primary-500 text-white' : 'bg-dark-700 text-gray-400 group-hover:text-primary-500'
            }`}>
            <Icon className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
    </button>
);

export default ProjectBuilderForm;
