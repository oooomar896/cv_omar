import {
    Users,
    Briefcase,
    Zap,
    Newspaper,
    Activity,
    Clock,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { dataService } from '../../utils/dataService';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
    const [counts, setCounts] = useState({
        projects: 0,
        users: 0,
        news: 0,
        skills: 0
    });
    const [recentUsers, setRecentUsers] = useState([]);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const projects = dataService.getProjects();
        const users = dataService.getUsers();
        const news = dataService.getNews();
        const skills = dataService.getSkills();
        const acts = dataService.getActivities();

        setCounts({
            projects: projects.length,
            users: users.length,
            news: news.length,
            skills: skills.length
        });

        setRecentUsers(users.slice(-5).reverse());
        setActivities(acts.slice(0, 6)); // Get last 6 activities
    }, []);

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'منذ لحظات';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `منذ ${minutes} دقيقة`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `منذ ${hours} ساعة`;
        const days = Math.floor(hours / 24);
        return `منذ ${days} يوم`;
    };

    const stats = [
        { label: 'إجمالي المشاريع', value: counts.projects, icon: Briefcase, change: '+12%', isPositive: true },
        { label: 'طلبات العملاء', value: counts.users, icon: Zap, change: '+5%', isPositive: true },
        { label: 'المستخدمين النشطين', value: counts.users + 120, icon: Users, change: '+18%', isPositive: true },
        { label: 'الأخبار المنشورة', value: counts.news, icon: Newspaper, change: '+2', isPositive: true },
    ];

    // Helper functions removed as they were replacing inline logic


    return (
        <div className="space-y-8 font-cairo" dir="rtl">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="relative group overflow-hidden bg-dark-900/40 backdrop-blur-md border border-gray-800 rounded-3xl p-6 transition-all hover:border-primary-500/30 hover:scale-[1.02]">
                            {/* Decorative Background Blur */}
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl group-hover:bg-primary-500/20 transition-all" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-dark-800/80 rounded-2xl group-hover:bg-primary-500 group-hover:text-white text-gray-400 transition-all duration-300 shadow-sm">
                                        <Icon size={24} />
                                    </div>
                                    <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border ${stat.isPositive ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                                        }`}>
                                        {stat.change}
                                        {stat.isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                                    </div>
                                </div>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                                <h3 className="text-3xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                                    {stat.value}
                                </h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Project Requests */}
                <div className="lg:col-span-2 bg-dark-900/40 backdrop-blur-md border border-gray-800 rounded-3xl overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-800/50 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <span className="p-2 bg-primary-500/10 rounded-xl text-primary-500"><Zap size={20} /></span>
                            أحدث طلبات المشاريع (Leads)
                        </h2>
                        <Link to="/admin/users" className="text-sm font-bold text-primary-500 hover:text-primary-400 transition-colors">عرض الكل</Link>
                    </div>

                    <div className="overflow-x-auto flex-grow">
                        {recentUsers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500 h-full">
                                <Users size={48} className="mb-4 opacity-20" />
                                <p>لا توجد طلبات جديدة حالياً.</p>
                            </div>
                        ) : (
                            <table className="w-full text-right">
                                <thead className="bg-dark-800/30 text-gray-400 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4 font-medium">المستخدم</th>
                                        <th className="p-4 font-medium">نوع المشروع</th>
                                        <th className="p-4 font-medium">الحالة</th>
                                        <th className="p-4 font-medium">التاريخ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800/50 text-sm">
                                    {recentUsers.map((user, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors group cursor-pointer">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 p-[2px]">
                                                        <div className="w-full h-full rounded-full bg-dark-900 flex items-center justify-center text-white font-bold text-xs uppercase">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white group-hover:text-primary-400 transition-colors">{user.name}</p>
                                                        <p className="text-xs text-gray-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="font-mono text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300">
                                                    {user.projectType || 'WEB'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                    <span className="text-emerald-500 text-xs font-bold">نشط</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-500 text-xs font-mono">{user.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* System Activity Feed */}
                <div className="bg-dark-900/40 backdrop-blur-md border border-gray-800 rounded-3xl p-6 flex flex-col h-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-500/10 blur-3xl rounded-full" />

                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
                        <span className="p-2 bg-secondary-500/10 rounded-xl text-secondary-500"><Activity size={20} /></span>
                        سجل النشاطات
                    </h2>

                    <div className="space-y-6 relative ml-2 border-l border-gray-800 pl-6 flex-grow overflow-y-auto custom-scrollbar pr-2">
                        {activities.length === 0 ? (
                            <div className="text-center text-gray-500 py-8 text-sm">لا يوجد نشاطات مسجلة بعد.</div>
                        ) : (
                            activities.map((act, i) => (
                                <div key={act.id} className="relative">
                                    <div className={`absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 border-dark-900 ${i === 0 ? 'bg-primary-500 animate-pulse' : 'bg-gray-700'
                                        }`} />

                                    <div className="group">
                                        <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors mb-1">
                                            {act.message}
                                        </p>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                            <Clock size={10} />
                                            <span>{formatTimeAgo(act.timestamp)}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-700" />
                                            <span className="uppercase tracking-wider">{act.type}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <Link to="/admin/projects" className="mt-6 flex items-center justify-center gap-2 w-full py-4 border border-dashed border-gray-700 rounded-2xl text-gray-400 hover:border-primary-500 hover:text-primary-500 hover:bg-primary-500/5 transition-all font-bold text-sm relative z-10 group">
                        <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors">
                            <Zap size={12} />
                        </div>
                        إجراء سريع: مشروع جديد
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
