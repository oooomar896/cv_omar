import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileCode,
    Terminal,
    FileText,
    Package,
    Eye,
    Download,
    ShieldCheck,
    CheckCircle2,
    AlertTriangle
} from 'lucide-react';

const FileViewer = ({ files, onDownload, qaReport }) => {
    const [selectedFile, setSelectedFile] = useState(Object.keys(files)[0]);

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 space-y-8">
            {/* Header with QA Score */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary-500 font-mono text-sm">
                        <Terminal className="h-4 w-4" />
                        <span>AI_GENERATED_SOURCE_V1.0</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white">معاينة ملفات المشروع</h2>
                </div>

                {qaReport && (
                    <div className="flex items-center gap-4 bg-dark-800 border border-gray-700 p-2 rounded-2xl pr-6">
                        <div className="text-left">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-none mb-1">QA Score</p>
                            <p className="text-2xl font-black text-white leading-none">{qaReport.score}%</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                            <ShieldCheck className="h-7 w-7 text-emerald-500" />
                        </div>
                    </div>
                )}

                <button
                    onClick={onDownload}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary-500/20 w-full md:w-auto justify-center"
                >
                    <Download className="h-5 w-5" />
                    <span>تحميل المخطط (Blueprint)</span>
                </button>
            </div>

            {/* QA Insights Bar */}
            {qaReport && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {qaReport.checks.map((check) => (
                        <div key={check.id} className="bg-dark-900/50 border border-gray-800 p-4 rounded-xl flex items-center gap-3">
                            {check.status === 'pass' ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                            ) : (
                                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                            )}
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-gray-200 truncate">{check.title}</p>
                                <p className="text-[10px] text-gray-500 truncate">{check.msg}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
                {/* Sidebar - File Tree */}
                <div className="lg:col-span-1 bg-dark-800 border border-gray-700 rounded-2xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-700 bg-dark-700/50 flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-300">هيكل المجلدات</span>
                        <Package className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="p-2 overflow-y-auto flex-grow space-y-1">
                        {Object.keys(files).map((filePath) => (
                            <button
                                key={filePath}
                                onClick={() => setSelectedFile(filePath)}
                                className={`w-full text-right px-4 py-3 rounded-xl text-sm flex items-center gap-3 transition-all ${selectedFile === filePath
                                    ? 'bg-primary-500/10 text-primary-500 border border-primary-500/20'
                                    : 'text-gray-400 hover:bg-dark-700 hover:text-gray-200'
                                    }`}
                            >
                                <FileCode className={`h-4 w-4 ${selectedFile === filePath ? 'text-primary-500' : 'text-gray-500'}`} />
                                <span className="truncate flex-grow">{filePath}</span>
                                {selectedFile === filePath && <Eye className="h-3 w-3" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Code Editor Preview */}
                <div className="lg:col-span-3 bg-dark-900 border border-gray-700 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
                    <div className="p-4 border-b border-gray-800 bg-black/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20" />
                            </div>
                            <span className="text-xs font-mono text-gray-500 ml-4">{selectedFile}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-600">
                            <span>UTF-8</span>
                            <span>•</span>
                            <span>JavaScript / Markdown</span>
                        </div>
                    </div>
                    <div className="flex-grow overflow-auto p-6 font-mono text-sm leading-relaxed">
                        <AnimatePresence mode="wait">
                            <motion.pre
                                key={selectedFile}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-gray-300 whitespace-pre-wrap"
                            >
                                {files[selectedFile] || '// No content available'}
                            </motion.pre>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div className="bg-primary-500/5 border border-primary-500/10 p-6 rounded-2xl flex items-start gap-4">
                <div className="p-2 bg-primary-500/10 rounded-lg">
                    <FileText className="h-6 w-6 text-primary-500" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-white font-bold">ملاحظة الذكاء الاصطناعي:</h4>
                    <p className="text-gray-400 text-sm">
                        هذا الكود هو &quot;الأساس المتين&quot; لمشروعك. لقد قمنا بإعداد هيكل المجلدات، ملفات الإعدادات، والمكونات الرئيسية.
                        يمكنك تحميله الآن وفتحه في برنامج **Cursor** لاستكمال التفاصيل بمساعدة AI البرمجي.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FileViewer;
