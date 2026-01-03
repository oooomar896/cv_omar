import { Mail, Calendar, MapPin, Search, Phone, Trash2, UserPlus, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { dataService } from '../../utils/dataService';
import { motion, AnimatePresence } from 'framer-motion';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setUsers(dataService.getUsers());
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
            dataService.deleteUser(id);
            setUsers(dataService.getUsers());
        }
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
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="absolute top-4 left-4 p-2 bg-red-500/10 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                    >
                                        <Trash2 size={16} />
                                    </button>

                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-primary-500/20">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-white text-lg truncate">{user.name}</h3>
                                            <div className="bg-primary-500/10 text-primary-400 px-2 py-0.5 rounded-lg text-[10px] inline-block font-mono">
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
                                                <span>انضم في: {user.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                                <MapPin size={12} />
                                                <span>AI Builder</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;
