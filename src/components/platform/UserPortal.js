import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Cpu, Package, Download, LogOut, Code2,
    Calendar, ExternalLink
} from 'lucide-react';
import { dataService } from '../../utils/dataService';
import FileViewer from './FileViewer';

const UserPortal = () => {
    const [userEmail, setUserEmail] = useState(null);
    const [userProjects, setUserProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const email = localStorage.getItem('portal_user');
        if (!email) {
            navigate('/portal/login');
            return;
        }
        setUserEmail(email);

        // جلب مشاريع هذا المستخدم فقط
        const allGenProjects = dataService.getGeneratedProjects();
        const myProjects = allGenProjects.filter(p => p.userEmail === email);
        setUserProjects(myProjects);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('portal_user');
        navigate('/portal/login');
    };

    if (selectedProject) {
        return (
            <div className="min-h-screen bg-dark-950 pt-20">
                <div className="max-w-7xl mx-auto px-4 mb-6">
                    <button
                        onClick={() => setSelectedProject(null)}
                        className="text-primary-500 hover:text-primary-400 flex items-center gap-2 font-cairo"
                    >
                        <Package size={18} />
                        العودة للمشاريع
                    </button>
                </div>
                <FileViewer
                    files={selectedProject.files}
                    onDownload={() => alert('بدأ التحميل...')}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-950 font-cairo text-right" dir="rtl">
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
                <div className="bg-gradient-to-r from-primary-500/20 via-transparent to-transparent border border-primary-500/10 rounded-3xl p-10 relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                        <h1 className="text-3xl md:text-4xl font-black text-white">أهلاً بك في مساحتك الخاصة ⚡</h1>
                        <p className="text-gray-400 max-w-2xl leading-relaxed">
                            هنا يمكنك تتبع كافة المشاريع التي قمت بتوليدها عبر باني مشاريع عمر التقني.
                            يمكنك عرض الأكواد البرمجية، تحميلها، أو طلب تحويلها إلى تطبيق حقيقي.
                        </p>
                    </div>
                    <Cpu className="absolute left-10 top-1/2 -translate-y-1/2 text-primary-500/10 h-40 w-40 -rotate-12" />
                </div>

                {/* Projects Grid */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <Package className="text-primary-500" />
                            مشاريعك الحالية ({userProjects.length})
                        </h2>
                    </div>

                    {userProjects.length === 0 ? (
                        <div className="bg-dark-900 border border-gray-800 rounded-3xl p-20 text-center space-y-4">
                            <Code2 className="h-16 w-16 text-gray-700 mx-auto" />
                            <h3 className="text-xl font-bold text-white">لا توجد مشاريع سابقة</h3>
                            <p className="text-gray-500">ابدأ ببناء مشروعك الأول بالذكاء الاصطناعي الآن.</p>
                            <button
                                onClick={() => navigate('/builder')}
                                className="bg-primary-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-600 transition-all font-cairo"
                            >
                                بناء مشروع جديد
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userProjects.map((project) => (
                                <motion.div
                                    key={project.id}
                                    whileHover={{ y: -5 }}
                                    className="bg-dark-900 border border-gray-800 rounded-3xl p-6 hover:border-primary-500/50 transition-all flex flex-col justify-between"
                                >
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="p-3 bg-dark-800 rounded-2xl text-primary-500">
                                                <Cpu size={24} />
                                            </div>
                                            <div className="text-[10px] bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/20 uppercase font-mono">
                                                Active
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-1">{project.projectType.toUpperCase()} Project</h3>
                                            <p className="text-xs text-gray-500 flex items-center gap-2">
                                                <Calendar size={12} />
                                                {new Date(project.timestamp).toLocaleDateString('ar-SA')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex gap-3">
                                        <button
                                            onClick={() => setSelectedProject(project)}
                                            className="flex-grow bg-dark-800 hover:bg-dark-700 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                                        >
                                            <ExternalLink size={16} />
                                            عرض الأكواد
                                        </button>
                                        <button className="p-3 bg-primary-500/10 text-primary-500 hover:bg-primary-500 hover:text-white rounded-xl transition-all">
                                            <Download size={18} />
                                        </button>
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
