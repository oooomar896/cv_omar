import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileCode,
    Terminal,
    Download,
    CheckCircle2,
    AlertTriangle,
    Save,
    RotateCcw,
    FolderOpen,
    Play,
    Share2,
    Code2,
    Maximize2
} from 'lucide-react';

const FileViewer = ({ files: initialFiles, onDownload, qaReport }) => {
    const [files, setFiles] = useState(initialFiles);
    const [selectedFile, setSelectedFile] = useState(Object.keys(initialFiles)[0]);
    const [isEdited, setIsEdited] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');

    useEffect(() => {
        const hasFiles = initialFiles && Object.keys(initialFiles).length > 0;
        if (hasFiles) {
            setFiles(initialFiles);
            setSelectedFile(Object.keys(initialFiles)[0]);
        } else {
            setFiles({});
            setSelectedFile(null);
        }
    }, [initialFiles]);

    const handleCodeChange = (e) => {
        if (!selectedFile) return;
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
        <div className="max-w-7xl mx-auto py-12 px-4 space-y-8 animate-in fade-in duration-700">
            {/* Top Toolbar */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 pb-6 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                        <Code2 size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white font-cairo">المحرر الذكي</h2>
                        <div className="flex items-center gap-2 text-primary-400 text-xs font-mono bg-primary-500/10 px-2 py-1 rounded-md border border-primary-500/10 w-fit mt-1">
                            <Terminal size={10} />
                            <span>LIVE_ENV_ACTIVE</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 w-full xl:w-auto">
                    {isEdited && (
                        <button
                            onClick={handleSave}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                        >
                            <Save size={18} />
                            <span>حفظ التعديلات</span>
                        </button>
                    )}
                    <button
                        onClick={() => onDownload(files)}
                        className="bg-dark-800 hover:bg-dark-700 text-white border border-white/10 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all hover:border-white/20 active:scale-95"
                    >
                        <Download size={18} />
                        <span>تصدير المشروع</span>
                    </button>
                    <button className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary-500/20 active:scale-95">
                        <Play size={18} fill="currentColor" />
                        <span>تشغيل المعاينة</span>
                    </button>
                </div>
            </div>

            {/* QA Insights Bar */}
            {qaReport && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {qaReport.checks.map((check) => (
                        <div key={check.id} className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${check.status === 'pass'
                                ? 'bg-emerald-500/5 border-emerald-500/10 hover:bg-emerald-500/10'
                                : 'bg-amber-500/5 border-amber-500/10 hover:bg-amber-500/10'
                            }`}>
                            {check.status === 'pass' ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                            ) : (
                                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                            )}
                            <div>
                                <p className="text-xs font-bold text-white mb-1 font-cairo">{check.title}</p>
                                <p className="text-[10px] text-gray-400 leading-relaxed font-cairo">{check.msg}</p>
                            </div>
                        </div>
                    ))}
                    {saveStatus && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center justify-center gap-2"
                        >
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            <span className="text-sm text-emerald-400 font-bold font-cairo">{saveStatus}</span>
                        </motion.div>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[700px]">
                {/* Sidebar - File Tree */}
                <div className="lg:col-span-3 bg-dark-900/50 border border-white/5 rounded-[1.5rem] overflow-hidden flex flex-col backdrop-blur-sm">
                    <div className="p-5 border-b border-white/5 bg-white/5 flex items-center justify-between">
                        <span className="text-sm font-bold text-white font-cairo flex items-center gap-2">
                            <FolderOpen size={16} className="text-primary-500" />
                            متصفح الملفات
                        </span>
                        <div className="flex gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500/50"></span>
                            <span className="w-2 h-2 rounded-full bg-yellow-500/50"></span>
                            <span className="w-2 h-2 rounded-full bg-green-500/50"></span>
                        </div>
                    </div>

                    <div className="p-3 overflow-y-auto flex-grow space-y-1 custom-scrollbar">
                        {Object.keys(files).map((filePath) => (
                            <button
                                key={filePath}
                                onClick={() => setSelectedFile(filePath)}
                                className={`w-full text-right px-4 py-3 rounded-xl text-sm flex items-center gap-3 transition-all group relative overflow-hidden ${selectedFile === filePath
                                    ? 'bg-primary-500 text-white font-bold shadow-lg shadow-primary-500/20'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <div className={`p-1.5 rounded-lg ${selectedFile === filePath ? 'bg-white/20' : 'bg-dark-800 group-hover:bg-dark-700'}`}>
                                    <FileCode size={14} className={selectedFile === filePath ? 'text-white' : 'text-primary-500'} />
                                </div>
                                <span className="truncate flex-grow font-mono text-[12px] tracking-wide" dir="ltr">{filePath}</span>
                                {selectedFile === filePath && <motion.div layoutId="active-dot" className="w-1.5 h-1.5 rounded-full bg-white ml-2" />}
                            </button>
                        ))}
                    </div>

                    {isEdited && (
                        <div className="p-4 border-t border-white/5 bg-white/5">
                            <button
                                onClick={handleReset}
                                className="w-full py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-red-500/20"
                            >
                                <RotateCcw size={12} />
                                <span>تراجع عن التعديلات</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Main Editor */}
                <div className="lg:col-span-9 bg-[#0d1117] border border-white/10 rounded-[1.5rem] overflow-hidden flex flex-col shadow-2xl relative group">
                    {selectedFile ? (
                        <>
                            {/* Editor Header */}
                            <div className="h-12 border-b border-white/5 bg-[#161b22] flex items-center justify-between px-6 select-none">
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-mono text-gray-400">{selectedFile}</span>
                                    {isEdited && <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20">Unsaved</span>}
                                </div>
                                <div className="flex items-center gap-4 text-gray-500">
                                    <Share2 size={14} className="hover:text-white cursor-pointer transition-colors" />
                                    <Maximize2 size={14} className="hover:text-white cursor-pointer transition-colors" />
                                </div>
                            </div>

                            <div className="flex-grow relative overflow-hidden">
                                <div className="absolute inset-0 flex">
                                    {/* Line Numbers */}
                                    <div className="w-12 bg-[#0d1117] border-r border-white/5 text-gray-600 font-mono text-[13px] leading-relaxed py-6 text-right pr-4 select-none opacity-50">
                                        {Array.from({ length: Math.min((files[selectedFile] || '').split('\n').length || 1, 999) }).map((_, i) => (
                                            <div key={i} className="h-6">{i + 1}</div>
                                        ))}
                                    </div>

                                    {/* Editor Area */}
                                    <textarea
                                        value={files[selectedFile] || ''}
                                        onChange={handleCodeChange}
                                        spellCheck={false}
                                        className="flex-grow bg-transparent text-gray-300 p-6 font-mono text-[13px] leading-relaxed resize-none outline-none focus:bg-[#161b22]/50 transition-colors custom-scrollbar"
                                        style={{ lineHeight: '1.5rem' }}
                                    />
                                </div>
                            </div>

                            {/* Status Bar */}
                            <div className="h-8 bg-[#161b22] border-t border-white/5 flex items-center justify-between px-4 text-[10px] text-gray-500 font-mono select-none">
                                <div className="flex gap-4">
                                    <span>UTF-8</span>
                                    <span>JavaScript</span>
                                    <span>Ln {(files[selectedFile] || '').split('\n').length}, Col 1</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span>Online</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-4">
                            <div className="p-4 rounded-full bg-white/5">
                                <Code2 size={48} opacity={0.5} />
                            </div>
                            <p className="font-mono text-sm">Select a file to start editing</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileViewer;
