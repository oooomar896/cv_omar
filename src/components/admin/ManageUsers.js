import { Mail, Calendar, MapPin, Search } from 'lucide-react';

const ManageUsers = () => {
    const users = [
        { id: 1, name: 'عبدالله محمد', email: 'abdullah@example.com', location: 'الرياض', date: '2026-01-01' },
        { id: 2, name: 'سارة خالد', email: 'sara@example.com', location: 'جدة', date: '2025-12-30' },
        { id: 3, name: 'ياسين علي', email: 'yassin@example.com', location: 'دبي', date: '2026-01-02' },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-dark-900/50 border border-gray-800 rounded-3xl p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
                    <h2 className="text-xl font-bold font-cairo">المستخدمين المسجلين</h2>
                    <div className="relative">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="بحث ببريد المستخدم..."
                            className="bg-dark-800 border border-gray-700 rounded-xl pr-10 pl-4 py-2 text-sm focus:border-primary-500 outline-none w-full md:w-64"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map(user => (
                        <div key={user.id} className="bg-dark-800 border border-gray-700 p-6 rounded-2xl hover:border-gray-500 transition-all">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-lg">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{user.name}</h3>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Mail size={12} />
                                        <span>{user.email}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700 mt-2">
                                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                    <MapPin size={12} className="text-primary-500" />
                                    <span>{user.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                    <Calendar size={12} className="text-primary-500" />
                                    <span>{user.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
