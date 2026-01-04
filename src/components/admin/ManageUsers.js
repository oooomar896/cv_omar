import { Mail, Calendar, Search, Phone, Trash2, UserPlus, Shield, Eye, FileText, Code, X, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { dataService } from '../../utils/dataService';
import { motion, AnimatePresence } from 'framer-motion';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userProject, setUserProject] = useState(null);

    useEffect(() => {
        setUsers(dataService.getUsers());
        setProjects(dataService.getGeneratedProjects());
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
            dataService.deleteUser(id);
            setUsers(dataService.getUsers());
        }
    };

    const handleViewDetails = (user) => {
        const project = projects.find(p => p.userEmail === user.email) || null;
        setUserProject(project);
        setSelectedUser(user);
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 font-cairo" dir="rtl">
            <div className="bg-dark-900/50 border border-gray-800 rounded-3xl p-8">
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-10 items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Shield className="text-primary-500" />
                            إدارة العملاء وطلبات المشاريع (AI Leads)
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">تتبع كافة المستخدمين الذين طلبوا بناء مشاريع عبر المنصة.</p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="بحث بالاسم أو البريد..."
                            className="bg-dark-800 border border-gray-700 rounded-2xl pr-12 pl-4 py-3 text-sm focus:border-primary-500 outline-none w-full text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {filteredUsers.length === 0 ? (
                    <div className="text-center py-20 bg-dark-800/20 rounded-2xl border border-dashed border-gray-700">
                        <UserPlus className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                        <p className="text-gray-400">لا يوجد مستخدمون حالياً.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredUsers.map(user => (
                                <motion.div
                                    key={user.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-dark-800 border border-gray-700 p-6 rounded-3xl hover:border-primary-500/50 transition-all relative group"
                                >
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <button
                                            onClick={() => handleViewDetails(user)}
                                            className="p-2 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"
                                            title="عرض التفاصيل"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <a
                                            href={`mailto:${user.email}`}
                                            className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center"
                                            title="إرسال بريد إلكتروني"
                                        >
                                            <Mail size={16} />
                                        </a>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                            title="حذف"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-primary-500/20">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-bold text-white text-lg truncate w-3/4">{user.name}</h3>
                                            <div className="bg-primary-500/10 text-primary-400 px-2 py-0.5 rounded-lg text-[10px] inline-block font-mono mt-1">
                                                {user.projectType || 'MEMBER'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-gray-700/50">
                                        <div className="flex items-center gap-3 text-sm text-gray-400">
                                            <Mail size={16} className="text-gray-500" />
                                            <span className="truncate">{user.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-400">
                                            <Phone size={16} className="text-gray-500" />
                                            <span>{user.phone}</span>
                                        </div>
                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                                <Calendar size={12} />
                                                <span>{user.date}</span>
                                            </div>
                                            {projects.find(p => p.userEmail === user.email) && (
                                                <div className="flex items-center gap-1 text-[10px] text-emerald-500">
                                                    <CheckCircle size={12} />
                                                    <span>مشروع جاهز</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* User Details Modal */}
            <AnimatePresence>
                {selectedUser && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedUser(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-dark-900 border border-gray-800 rounded-3xl w-full max-w-2xl p-0 relative z-10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                        >
                            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-dark-950">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FileText className="text-primary-500" />
                                    تفاصيل الطلب: {selectedUser.name}
                                </h2>
                                <button onClick={() => setSelectedUser(null)} className="text-gray-500 hover:text-white">
                                    <X />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
                                {/* Basic Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-dark-800 rounded-xl border border-gray-700">
                                        <div className="text-xs text-gray-500 mb-1">البريد الإلكتروني</div>
                                        <div className="text-white font-mono text-sm">{selectedUser.email}</div>
                                    </div>
                                    <div className="p-4 bg-dark-800 rounded-xl border border-gray-700">
                                        <div className="text-xs text-gray-500 mb-1">رقم الهاتف</div>
                                        <div className="text-white font-mono text-sm">{selectedUser.phone}</div>
                                    </div>
                                </div>

                                {userProject ? (
                                    <>
                                        {/* Project Description */}
                                        <div className="space-y-3">
                                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                <Eye className="text-primary-500" size={18} />
                                                وصف المشروع المطلوب
                                            </h3>
                                            <div className="bg-dark-800/50 p-4 rounded-xl border border-gray-700/50 text-gray-300 leading-relaxed text-sm">
                                                {userProject.description || 'لم يتم تقديم وصف تفصيلي (تم الحفظ قبل التحديث الأخير).'}
                                            </div>
                                        </div>

                                        {/* Specific Answers */}
                                        {userProject.specificAnswers && Object.keys(userProject.specificAnswers).length > 0 && (
                                            <div className="space-y-3">
                                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                    <CheckCircle className="text-emerald-500" size={18} />
                                                    المتطلبات الخاصة
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {Object.entries(userProject.specificAnswers).map(([key, value]) => (
                                                        <div key={key} className="flex justify-between items-center p-3 bg-dark-800 rounded-lg border border-gray-700">
                                                            <span className="text-gray-400 text-xs">{key}</span>
                                                            <span className={`text-xs font-bold px-2 py-1 rounded ${typeof value === 'boolean'
                                                                ? (value ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500')
                                                                : 'bg-primary-500/10 text-primary-500'
                                                                }`}>
                                                                {value === true ? 'نعم' : value === false ? 'لا' : value}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Generated Files Preview */}
                                        <div className="space-y-3">
                                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                <Code className="text-purple-500" size={18} />
                                                هيكل الملفات المولدة (AI)
                                            </h3>
                                            <div className="bg-dark-950 p-4 rounded-xl border border-gray-800 font-mono text-xs text-gray-400 max-h-40 overflow-y-auto custom-scrollbar">
                                                {userProject.files ? (
                                                    Object.keys(userProject.files).map((file, i) => (
                                                        <div key={i} className="flex items-center gap-2 py-1 border-b border-gray-800/50 last:border-0 hover:text-white transition-colors">
                                                            <div className="text-primary-500"><FileText size={14} /></div>
                                                            <span>{file}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-center py-4">لا توجد ملفات محفوظة لهذا المشروع.</p>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-10">
                                        <p className="text-gray-500">هذا المستخدم لم يقم بتوليد مشروع كامل، أو لم يتم العثور على بيانات المشروع.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageUsers;
