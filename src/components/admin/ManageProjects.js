import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Globe,
    Smartphone,
    Database,
    Zap,
    Github,
    X,
    Upload,
    Link as LinkIcon,
    Image as ImageIcon,
    Loader
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { dataService } from '../../utils/dataService';
import { supabase } from '../../utils/supabaseClient';
import Toast from '../../components/common/Toast';

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [imageInputType, setImageInputType] = useState('url');
    const [uploading, setUploading] = useState(false);
    const [currentProject, setCurrentProject] = useState({
        name: '',
        category: 'web',
        desc: '',
        link: '',
        image: '',
        status: 'published'
    });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    useEffect(() => {
        const loadProjects = async () => {
            await dataService.fetchProjects();
            setProjects(dataService.getProjects());
        };
        loadProjects();
    }, []);

    const handleSaveProject = (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                dataService.updateProject(currentProject.id, currentProject);
                showToast('تم تحديث المشروع بنجاح', 'success');
            } else {
                dataService.addProject(currentProject);
                showToast('تمت إضافة المشروع بنجاح', 'success');
            }
            setProjects(dataService.getProjects());
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            showToast('حدث خطأ أثناء الحفظ', 'error');
        }
    };

    const handleEditClick = (project) => {
        setCurrentProject(project);
        setEditMode(true);
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setCurrentProject({ name: '', category: 'web', desc: '', link: '', image: '', status: 'published' });
        setEditMode(false);
        setImageInputType('url');
    };

    const handleDelete = (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
            try {
                dataService.deleteProject(id);
                setProjects(dataService.getProjects());
                showToast('تم حذف المشروع بنجاح', 'success');
            } catch (error) {
                showToast('فشل حذف المشروع', 'error');
            }
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('projects')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('projects')
                .getPublicUrl(filePath);

            setCurrentProject({ ...currentProject, image: data.publicUrl });
            showToast('تم رفع الصورة بنجاح', 'success');
        } catch (error) {
            console.error('Error uploading image:', error);
            showToast('فشل رفع الصورة', 'error');
        } finally {
            setUploading(false);
        }
    };

    const convertGoogleDriveLink = (url) => {
        if (!url) return url;
        try {
            if (url.includes('drive.google.com') || url.includes('share.google')) {
                let id = '';
                const match1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
                const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
                const match3 = url.match(/share\.google\/([a-zA-Z0-9_-]+)/);

                if (match1) id = match1[1];
                else if (match2) id = match2[1];
                else if (match3) id = match3[1];

                if (id) {
                    return `https://drive.google.com/uc?export=view&id=${id}`;
                }
            }
        } catch (e) {
            console.error('Error converting Google Drive link:', e);
        }
        return url;
    };

    const categories = {
        web: { icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'موقع ويب' },
        mobile: { icon: Smartphone, color: 'text-purple-500', bg: 'bg-purple-500/10', label: 'تطبيق جوال' },
        'ai-bots': { icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'ذكاء اصطناعي' },
        odoo: { icon: Database, color: 'text-teal-500', bg: 'bg-teal-500/10', label: 'أودو' },
        'open-source': { icon: Github, color: 'text-gray-400', bg: 'bg-gray-500/10', label: 'مفتوح المصدر' },
    };

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 font-cairo" dir="rtl">
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="بحث عن مشروع..."
                        className="w-full bg-dark-900 border border-gray-800 rounded-xl pr-12 pl-4 py-3 text-sm focus:border-primary-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="flex-grow md:flex-grow-0 flex items-center justify-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-xl hover:bg-primary-600 transition-all font-bold text-sm shadow-lg shadow-primary-500/20"
                    >
                        <Plus size={18} />
                        <span>مشروع جديد</span>
                    </button>
                </div>
            </div>

            {/* Projects Grid/Table */}
            <div className="bg-dark-900/50 border border-gray-800 rounded-3xl overflow-hidden overflow-x-auto">
                <table className="w-full text-right min-w-[600px]">
                    <thead className="bg-dark-800/50 text-gray-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4 font-bold">المشروع</th>
                            <th className="p-4 font-bold">التصنيف</th>
                            <th className="p-4 font-bold">التاريخ</th>
                            <th className="p-4 font-bold">الحالة</th>
                            <th className="p-4 font-bold">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-sm">
                        {filteredProjects.map((project) => {
                            const CatInfo = categories[project.category] || categories.web;
                            const Icon = CatInfo.icon;

                            return (
                                <motion.tr
                                    key={project.id}
                                    layout
                                    className="hover:bg-white/5 transition-colors group"
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${CatInfo.bg} ${CatInfo.color}`}>
                                                <Icon size={20} />
                                            </div>
                                            <span className="font-bold text-gray-200">{project.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold ${CatInfo.bg} ${CatInfo.color}`}>
                                            {CatInfo.label}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-400 font-mono text-xs">{project.date}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${project.status === 'published' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-600'}`} />
                                            <span className={project.status === 'published' ? 'text-emerald-500' : 'text-gray-500'}>
                                                {project.status === 'published' ? 'منشور' : 'مسودة'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEditClick(project)}
                                                className="p-2 hover:bg-primary-500/10 hover:text-primary-500 rounded-lg transition-all text-gray-500"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all text-gray-500"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Add Project Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-dark-900 border border-gray-800 rounded-3xl w-full max-w-2xl p-8 relative z-10 shadow-2xl h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">
                                    {editMode ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X /></button>
                            </div>

                            <form onSubmit={handleSaveProject} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="proj-name" className="text-sm text-gray-400">اسم المشروع</label>
                                        <input
                                            id="proj-name"
                                            required
                                            className="w-full bg-dark-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                                            value={currentProject.name}
                                            onChange={(e) => setCurrentProject({ ...currentProject, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="proj-cat" className="text-sm text-gray-400">التصنيف</label>
                                        <select
                                            id="proj-cat"
                                            className="w-full bg-dark-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                                            value={currentProject.category}
                                            onChange={(e) => setCurrentProject({ ...currentProject, category: e.target.value })}
                                        >
                                            <option value="web">موقع ويب</option>
                                            <option value="mobile">تطبيق جوال</option>
                                            <option value="ai-bots">ذكاء اصطناعي</option>
                                            <option value="odoo">أودو</option>
                                            <option value="open-source">مفتوح المصدر</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <span className="block text-sm text-gray-400">صورة المشروع</span>

                                    <div className="flex gap-4 mb-2">
                                        <button
                                            type="button"
                                            onClick={() => setImageInputType('url')}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${imageInputType === 'url'
                                                ? 'bg-primary-500 text-white border-primary-500'
                                                : 'bg-dark-800 text-gray-400 border-gray-700 hover:border-gray-600'
                                                }`}
                                        >
                                            <LinkIcon size={16} />
                                            <span>رابط خارجي</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setImageInputType('upload')}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${imageInputType === 'upload'
                                                ? 'bg-primary-500 text-white border-primary-500'
                                                : 'bg-dark-800 text-gray-400 border-gray-700 hover:border-gray-600'
                                                }`}
                                        >
                                            <Upload size={16} />
                                            <span>رفع صورة</span>
                                        </button>
                                    </div>

                                    {imageInputType === 'url' ? (
                                        <div>
                                            <input
                                                id="proj-image"
                                                className="w-full bg-dark-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                                                value={currentProject.image || ''}
                                                onChange={(e) => setCurrentProject({ ...currentProject, image: convertGoogleDriveLink(e.target.value) })}
                                                placeholder="https://example.com/image.png أو رابط Google Drive"
                                            />
                                            <p className="text-xs text-gray-500 mt-1 mr-1">
                                                يدعم روابط الصور المباشرة وروابط Google Drive (تأكد من أن الرابط "عام").
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="image-upload"
                                            />
                                            <label
                                                htmlFor="image-upload"
                                                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${currentProject.image && imageInputType === 'upload'
                                                    ? 'border-primary-500 bg-primary-500/10'
                                                    : 'border-gray-700 hover:border-primary-500 hover:bg-dark-800/50'
                                                    }`}
                                            >
                                                {uploading ? (
                                                    <div className="flex flex-col items-center gap-2 text-primary-500">
                                                        <Loader className="animate-spin" size={24} />
                                                        <span>جاري الرفع...</span>
                                                    </div>
                                                ) : currentProject.image && imageInputType === 'upload' ? (
                                                    <div className="flex flex-col items-center gap-2 text-primary-500">
                                                        <ImageIcon size={32} />
                                                        <span>تم رفع الصورة بنجاح</span>
                                                        <span className="text-xs text-gray-400 truncate max-w-[200px]">{currentProject.image}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                                        <Upload size={32} />
                                                        <span>اضغط لرفع صورة</span>
                                                        <span className="text-xs text-gray-500">PNG, JPG up to 5MB</span>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    )}
                                    {currentProject.image && (
                                        <div className="mt-2 relative w-full h-40 rounded-xl overflow-hidden border border-gray-800">
                                            <img
                                                src={currentProject.image}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="proj-link" className="text-sm text-gray-400">رابط المشروع</label>
                                    <input
                                        id="proj-link"
                                        className="w-full bg-dark-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                                        value={currentProject.link || ''}
                                        onChange={(e) => setCurrentProject({ ...currentProject, link: e.target.value })}
                                        placeholder="https://example.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="proj-desc" className="text-sm text-gray-400">وصف المشروع</label>
                                    <textarea
                                        id="proj-desc"
                                        className="w-full bg-dark-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none h-24"
                                        value={currentProject.desc}
                                        onChange={(e) => setCurrentProject({ ...currentProject, desc: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
                                >
                                    {editMode ? 'تحديث التغييرات' : 'حفظ المشروع'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageProjects;
