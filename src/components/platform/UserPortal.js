import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Cpu, Package, Download, LogOut, Code2,
    Smartphone, Bot, Globe, ExternalLink, Library, Palette, Loader2
} from 'lucide-react';
import { dataService } from '../../utils/dataService';
import { supabase } from '../../utils/supabaseClient';
import { downloadProjectBlueprint } from '../../utils/fileUtils';
import { STARTER_KITS, UI_UX_RESOURCES } from '../../constants/platformConstants';
import FileViewer from './FileViewer';
import ProjectRoadmap from './ProjectRoadmap';
import ProjectChat from './ProjectChat';
import LiveCodeEditor from './LiveCodeEditor';

const UserPortal = () => {
    const [userEmail, setUserEmail] = useState(null);
    const [userProjects, setUserProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthAndLoad = async () => {
            try {
                // 1. Verify Session
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error || !session) {
                    console.log('No valid session, redirecting to login');
                    localStorage.removeItem('portal_user');
                    localStorage.removeItem('portal_token');
                    navigate('/portal/login');
                    return;
                }

                setUserEmail(session.user.email);

                // 2. Fetch Projects Securely
                const projects = await dataService.fetchUserProjects(session.user.email);
                setUserProjects(projects);

            } catch (err) {
                console.error('Portal Error:', err);
                navigate('/portal/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthAndLoad();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('portal_user');
        localStorage.removeItem('portal_token');
        navigate('/portal/login');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-950 font-cairo text-white">
                <div className="text-center space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary-500 mx-auto" />
                    <p>جاري التحقق من بياناتك...</p>
                </div>
            </div>
        );
    }

    if (selectedProject) {
        return (
            <div className="min-h-screen pt-20">
                <div className="max-w-7xl mx-auto px-4 mb-6">
                    <button
                        onClick={() => setSelectedProject(null)}
                        className="text-primary-500 hover:text-primary-400 flex items-center gap-2 font-cairo"
                    >
                        <Package size={18} />
                        العودة للمشاريع
                    </button>
                </div>

                <div className="max-w-7xl mx-auto px-4 space-y-8 pb-12 text-right" dir="rtl">
                    {/* Project Header Info */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h2 className="text-3xl font-black text-white font-cairo mb-2">{selectedProject.projectName}</h2>
                            <p className="text-gray-400 font-cairo">{selectedProject.description}</p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={(e) => handleDownload(selectedProject, e)}
                                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-bold font-cairo flex items-center gap-3 transition-all"
                            >
                                <Download size={20} />
                                <span>تحميل ملفات المشروع</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-dark-900 border border-gray-800 p-6 rounded-2xl text-center space-y-2">
                            <p className="text-xs text-gray-500 font-cairo">عدد الملفات</p>
                            <p className="text-2xl font-bold text-white font-mono">{Object.keys(selectedProject.files || {}).length}</p>
                        </div>
                        <div className="bg-dark-900 border border-gray-800 p-6 rounded-2xl text-center space-y-2">
                            <p className="text-xs text-gray-500 font-cairo">توفير الوقت الذكي</p>
                            <p className="text-2xl font-bold text-emerald-500 font-mono">15+ ساعة</p>
                        </div>
                        <div className="bg-dark-900 border border-gray-800 p-6 rounded-2xl text-center space-y-2">
                            <p className="text-xs text-gray-500 font-cairo">جودة الكود (AI)</p>
                            <p className="text-2xl font-bold text-primary-500 font-mono">98%</p>
                        </div>
                        <div className="bg-dark-900 border border-gray-800 p-6 rounded-2xl text-center space-y-2">
                            <p className="text-xs text-gray-500 font-cairo">التكلفة المتوقعة</p>
                            <p className="text-2xl font-bold text-amber-500 font-mono">$499+</p>
                        </div>
                    </div>

                    <div className="bg-dark-900 border border-gray-800 rounded-3xl p-6">
                        <ProjectRoadmap currentStage={selectedProject.project_stage || selectedProject.projectStage || 'analysis'} />
                    </div>

                    {/* Chat Section */}
                    <div id="project-chat-section">
                        <ProjectChat project={selectedProject} userRole="user" />
                    </div>

                    {/* Starter Kits & Resources */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                                <Library size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-white font-cairo">أدوات ومكتبات بناء هذا المشروع</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(STARTER_KITS[selectedProject.projectType || 'web'] || []).map((kit) => (
                                <a
                                    key={kit.name}
                                    href={kit.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-dark-900 border border-gray-800 p-5 rounded-2xl group hover:border-amber-500/50 transition-all text-right"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <ExternalLink size={16} className="text-gray-600 group-hover:text-amber-500" />
                                        <h4 className="font-bold text-white font-cairo">{kit.name}</h4>
                                    </div>
                                    <p className="text-xs text-gray-400 font-cairo leading-relaxed">{kit.desc}</p>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* UI/UX Resources */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-pink-500/10 text-pink-500 rounded-lg">
                                <Palette size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-white font-cairo">موارد التصميم وتجربة المستخدم (UI/UX)</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {UI_UX_RESOURCES.map((resource) => (
                                <a
                                    key={resource.name}
                                    href={resource.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-dark-900 border border-gray-800 p-4 rounded-xl group hover:border-pink-500/50 transition-all text-right flex flex-col justify-between"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <ExternalLink size={14} className="text-gray-600 group-hover:text-pink-500" />
                                        <h4 className="font-bold text-white font-cairo text-sm">{resource.name}</h4>
                                    </div>
                                    <p className="text-[10px] text-gray-500 font-cairo leading-relaxed">{resource.desc}</p>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Live Developer Environment */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                                <Code2 size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white font-cairo">بيئة التطوير الحية (IDE)</h3>
                                <p className="text-sm text-gray-500">يمكنك تعديل كود المشروع وحفظ التغييرات مباشرة.</p>
                            </div>
                        </div>
                        <LiveCodeEditor project={selectedProject} userRole="user" />
                    </div>

                    <FileViewer
                        files={selectedProject.files}
                        onDownload={(e) => handleDownload(selectedProject, e)}
                    />
                </div>
            </div>
        );
    }

    const handleDownload = (project, e) => {
        if (e) e.stopPropagation();
        downloadProjectBlueprint(project);
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
            completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
            rejected: "bg-red-500/10 text-red-500 border-red-500/20"
        };
        const labels = {
            pending: "قيد المراجعة",
            completed: "مكتمل",
            rejected: "مرفوض"
        };
        return (
            <span className={`text-[10px] px-2 py-1 rounded-full border font-bold mb-1 ${styles[status] || styles.pending}`}>
                {labels[status] || "قيد المراجعة"}
            </span>
        );
    };

    return (
        <div className="min-h-screen font-cairo text-right" dir="rtl">
            {/* Header */}
            <header className="bg-dark-900/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center font-bold text-xl text-white">
                            {userEmail?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">{userEmail}</p>
                            <p className="text-primary-500 text-[10px] uppercase font-mono">Verified Client</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                        title="تسجيل الخروج"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-8 space-y-12">
                {/* Welcome Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-gradient-to-r from-primary-900/40 via-dark-900/40 to-dark-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-10 overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]" />
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl group-hover:bg-primary-500/30 transition-colors duration-1000" />

                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-xs font-bold border border-primary-500/20">
                                لوحة التحكم الذكية
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                            أهلاً بك في <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">مساحتك الخاصة</span> ⚡
                        </h1>
                        <p className="text-gray-400 max-w-2xl leading-relaxed text-lg">
                            هنا يمكنك تتبع كافة المشاريع التي قمت بتوليدها عبر باني مشاريع عمر.
                            يمكنك عرض الأكواد البرمجية، تحميلها، أو طلب تحويلها إلى تطبيق حقيقي بضغطة زر.
                        </p>
                    </div>

                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                        className="absolute left-10 top-1/2 -translate-y-1/2 opacity-10"
                    >
                        <Cpu size={200} className="text-primary-500" />
                    </motion.div>
                </motion.div>

                {/* Projects Grid */}
                <div className="space-y-8">
                    <div className="flex justify-between items-end border-b border-gray-800 pb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-1">
                                <Package className="text-primary-500" />
                                مشاريعك الحالية
                            </h2>
                            <p className="text-sm text-gray-500">تم العثور على {userProjects.length} مشروع</p>
                        </div>
                        <button
                            onClick={() => navigate('/builder')}
                            className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all border border-white/10"
                        >
                            + مشروع جديد
                        </button>
                    </div>

                    {userProjects.length === 0 ? (
                        <div className="bg-dark-900/50 border border-dashed border-gray-800 rounded-3xl p-20 text-center space-y-6">
                            <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto text-gray-600">
                                <Code2 size={40} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">لا توجد مشاريع سابقة</h3>
                                <p className="text-gray-500 max-w-md mx-auto">لم تقم ببناء أي مشروع بعد. ابدأ الآن واختبر قوة الذكاء الاصطناعي في تحويل فكرتك إلى كود.</p>
                            </div>
                            <button
                                onClick={() => navigate('/builder')}
                                className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary-500/20 hover:scale-105 transition-transform"
                            >
                                بناء مشروع جديد
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userProjects.map((project, idx) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    className="group relative bg-dark-900/60 backdrop-blur-sm border border-gray-800/[0.6] rounded-3xl p-6 hover:border-primary-500/50 transition-all cursor-default overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-3 bg-dark-800/80 rounded-2xl text-primary-500 border border-gray-700/50 group-hover:scale-110 transition-transform duration-300">
                                                    {project.projectType === 'mobile' ? <Smartphone size={24} /> :
                                                        project.projectType === 'ai-bot' ? <Bot size={24} /> : <Globe size={24} />}
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    {getStatusBadge(project.status)}
                                                    <span className="text-xs text-gray-500 font-mono">
                                                        {new Date(project.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-1">
                                                {project.projectName || (project.projectType ? `${project.projectType.toUpperCase()} Project` : "New Project")}
                                            </h3>
                                            <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                                                {project.description || "Project generated by Omar's AI Builder..."}
                                            </p>
                                        </div>

                                        <div className="flex gap-3 pt-4 border-t border-gray-800/50">
                                            <button
                                                onClick={() => setSelectedProject(project)}
                                                className="flex-grow bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all border border-white/5 hover:border-white/20"
                                            >
                                                <ExternalLink size={16} />
                                                <span>عرض الملفات</span>
                                            </button>
                                            <button
                                                onClick={(e) => handleDownload(project, e)}
                                                className="p-3 bg-primary-500/10 text-primary-400 hover:bg-primary-500 hover:text-white rounded-xl transition-all border border-primary-500/20"
                                            >
                                                <Download size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default UserPortal;
