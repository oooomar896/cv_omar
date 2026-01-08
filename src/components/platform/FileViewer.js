import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileCode,
    Terminal,
    FileText,
    Package,
    Eye,
    Download,
    CheckCircle2,
    AlertTriangle,
    Save,
    RotateCcw
} from 'lucide-react';

const FileViewer = ({ files: initialFiles, onDownload, qaReport }) => {
    const [files, setFiles] = useState(initialFiles);
    const [selectedFile, setSelectedFile] = useState(Object.keys(initialFiles)[0]);
    const [isEdited, setIsEdited] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');

    useEffect(() => {
        setFiles(initialFiles);
        setSelectedFile(Object.keys(initialFiles)[0]);
    }, [initialFiles]);

    const handleCodeChange = (e) => {
        const newCode = e.target.value;
        setFiles(prev => ({
            ...prev,
            [selectedFile]: newCode
        }));
        setIsEdited(true);
    };

    const handleSave = () => {
        setSaveStatus('جاري الحفظ...');
        setTimeout(() => {
            setSaveStatus('تم الحفظ بنجاح!');
            setIsEdited(false);
            setTimeout(() => setSaveStatus(''), 2000);
        }, 800);
    };

    const handleReset = () => {
        if (window.confirm('هل أنت متأكد من استعادة الكود الأصلي؟')) {
            setFiles(initialFiles);
            setIsEdited(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 space-y-8">
            {/* Header with QA Score */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary-500 font-mono text-sm">
                        <Terminal className="h-4 w-4" />
                        <span>AI_LIVE_EDITOR_V2.0</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white font-cairo">محرر الأكواد المباشر</h2>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    {isEdited && (
                        <button
                            onClick={handleSave}
                            className="flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                        >
                            <Save className="h-5 w-5" />
                            <span>حفظ التعديلات</span>
                        </button>
                    )}
                    <button
                        onClick={() => onDownload(files)}
                        className="flex-1 md:flex-none bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-500/20"
                    >
                        <Download className="h-5 w-5" />
                        <span>تحميل المخطط (Blueprint)</span>
                    </button>
                </div>
            </div>

            {/* QA Insights Bar */}
            {qaReport && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 tracking-tight">
                    {qaReport.checks.map((check) => (
                        <div key={check.id} className="bg-dark-900/50 border border-gray-800 p-4 rounded-xl flex items-center gap-3">
                            {check.status === 'pass' ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                            ) : (
                                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                            )}
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-gray-200 truncate font-cairo">{check.title}</p>
                                <p className="text-[10px] text-gray-500 truncate font-cairo">{check.msg}</p>
                            </div>
                        </div>
                    ))}
                    {saveStatus && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-center gap-3 md:col-span-1"
                        >
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <span className="text-xs text-emerald-400 font-bold font-cairo">{saveStatus}</span>
                        </motion.div>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[650px]">
                {/* Sidebar - File Tree */}
                <div className="lg:col-span-1 bg-dark-800 border border-gray-700 rounded-2xl overflow-hidden flex flex-col shadow-xl">
                    <div className="p-4 border-b border-gray-700 bg-dark-700/50 flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-300 font-cairo">الملفات المصدرية</span>
                        <Package className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="p-2 overflow-y-auto flex-grow space-y-1 custom-scrollbar">
                        {Object.keys(files).map((filePath) => (
                            <button
                                key={filePath}
                                onClick={() => setSelectedFile(filePath)}
                                className={`w-full text-right px-4 py-3 rounded-xl text-sm flex items-center gap-3 transition-all ${selectedFile === filePath
                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                                    : 'text-gray-400 hover:bg-dark-700 hover:text-gray-200'
                                    }`}
                            >
                                <FileCode size={16} className={selectedFile === filePath ? 'text-white' : 'text-gray-500'} />
                                <span className="truncate flex-grow font-mono text-[13px]">{filePath}</span>
                                {selectedFile === filePath && <Eye size={12} />}
                            </button>
                        ))}
                    </div>
                    {isEdited && (
                        <div className="p-3 bg-red-500/5 border-t border-red-500/10 text-center">
                            <button
                                onClick={handleReset}
                                className="text-[10px] text-red-400 hover:text-red-300 flex items-center justify-center gap-1 mx-auto"
                            >
                                <RotateCcw size={10} />
                                <span>استعادة الأصلي</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Code Editor Body */}
                <div className="lg:col-span-3 bg-dark-900 border border-gray-700 rounded-2xl overflow-hidden flex flex-col shadow-2xl group">
                    <div className="p-4 border-b border-gray-800 bg-black/40 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/40" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                                <div className="w-3 h-3 rounded-full bg-green-500/40" />
                            </div>
                            <span className="text-xs font-mono text-primary-400 ml-4 font-bold">{selectedFile}</span>
                            {isEdited && <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" title="يوجد تعديلات غير محفوظة" />}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-600">
                            <span>Ln {files[selectedFile]?.split('\n').length}, Col 1</span>
                            <span>•</span>
                            <span>{selectedFile.split('.').pop()?.toUpperCase()}</span>
                        </div>
                    </div>

                    <div className="flex-grow relative bg-black/20">
                        {/* Line Numbers Simulation */}
                        <div className="absolute left-0 top-0 bottom-0 w-12 bg-black/40 border-r border-gray-800/50 flex flex-col items-center py-6 text-gray-700 font-mono text-[12px] select-none text-right pr-3 overflow-hidden">
                            {Array.from({ length: Math.min(files[selectedFile]?.split('\n').length || 1, 100) }).map((_, i) => (
                                <div key={i}>{i + 1}</div>
                            ))}
                        </div>

                        <textarea
                            value={files[selectedFile] || ''}
                            onChange={handleCodeChange}
                            spellCheck={false}
                            className="absolute inset-0 w-full h-full bg-transparent text-gray-300 p-6 pl-16 font-mono text-[14px] leading-relaxed resize-none outline-none focus:ring-1 focus:ring-primary-500/30 transition-shadow custom-scrollbar"
                            placeholder="// اكتب الكود هنا..."
                        />
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-primary-500/10 to-transparent border-l-4 border-primary-500 p-6 rounded-r-2xl flex items-start gap-4 shadow-xl">
                <div className="p-2 bg-primary-500/10 rounded-lg">
                    <FileText className="h-6 w-6 text-primary-500" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-white font-bold font-cairo">ميزة المحرر المباشر:</h4>
                    <p className="text-gray-400 text-sm font-cairo">
                        الآن يمكنك تعديل الكود المولد بالذكاء الاصطناعي مباشرة من المتصفح. التعديلات التي تقوم بها سيتم تضمينها تلقائياً عند تحميل المخطط (Blueprint).
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FileViewer;
