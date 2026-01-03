import {
    Users,
    Briefcase,
    Zap,
    MessageSquare,
    ArrowUpRight,
    ArrowDownRight,
    Newspaper
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

    useEffect(() => {
        const projects = dataService.getProjects();
        const users = dataService.getUsers();
        const news = dataService.getNews();
        const skills = dataService.getSkills();

        setCounts({
            projects: projects.length,
            users: users.length,
            news: news.length,
            skills: skills.length
        });

        setRecentUsers(users.slice(-5).reverse());
    }, []);

    const stats = [
        { label: 'إجمالي المشاريع', value: counts.projects, icon: Briefcase, change: '+12%', isPositive: true },
        { label: 'طلبات العملاء', value: counts.users, icon: Zap, change: '+5%', isPositive: true },
        { label: 'المستخدمين النشطين', value: counts.users + 120, icon: Users, change: '+18%', isPositive: true },
        { label: 'الأخبار المنشورة', value: counts.news, icon: Newspaper, change: '+2', isPositive: true },
    ];

    return (
        <div className="space-y-8 font-cairo" dir="rtl">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="bg-dark-900/50 border border-gray-800 p-6 rounded-3xl hover:border-primary-500/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-dark-800 rounded-2xl group-hover:bg-primary-500/10 group-hover:text-primary-500 transition-all">
                                    <Icon size={24} />
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${stat.isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                                    }`}>
                                    {stat.change}
                                    {stat.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Project Requests */}
                <div className="lg:col-span-2 bg-dark-900/50 border border-gray-800 rounded-3xl overflow-hidden">
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                        <h2 className="font-bold flex items-center gap-2">
                            <Zap className="text-primary-500" size={20} />
                            أحدث طلبات بناء المشاريع (Leads)
                        </h2>
                        <Link to="/admin/users" className="text-sm text-primary-500 hover:underline">عرض الكل</Link>
                    </div>
                    <div className="overflow-x-auto">
                        {recentUsers.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">لا توجد طلبات جديدة حالياً.</div>
                        ) : (
                            <table className="w-full text-right text-white">
                                <thead className="bg-dark-800/50 text-gray-400 text-sm">
                                    <tr>
                                        <th className="p-4">المستخدم</th>
                                        <th className="p-4">نوع المشروع</th>
                                        <th className="p-4">الحالة</th>
                                        <th className="p-4">التاريخ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800 text-sm">
                                    {recentUsers.map((user, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center font-bold text-xs text-primary-500">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold">{user.name}</p>
                                                        <p className="text-xs text-gray-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 font-mono text-primary-400">{user.projectType || 'WEB'}</td>
                                            <td className="p-4">
                                                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                                                    نشط
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-400 text-xs">{user.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Quick Actions / Notifications */}
                <div className="bg-dark-900/50 border border-gray-800 rounded-3xl p-6 space-y-6">
                    <h2 className="font-bold border-b border-gray-800 pb-4">إشعارات النظام</h2>
                    <div className="space-y-4">
                        <div className="flex gap-4 items-start p-3 hover:bg-white/5 rounded-2xl transition-all border border-primary-500/20 bg-primary-500/5">
                            <div className="p-2 bg-primary-500/10 text-primary-500 rounded-xl mt-1">
                                <Zap size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-medium">جاهزية باني المشاريع</p>
                                <p className="text-xs text-gray-400">نظام الـ AI يعمل بكفاءة 100%.</p>
                                <p className="text-[10px] text-gray-600 mt-1">الآن</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start p-3 hover:bg-white/5 rounded-2xl transition-all">
                            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl mt-1">
                                <MessageSquare size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-medium">تحديث قاعدة البيانات</p>
                                <p className="text-xs text-gray-400">تمت مزامنة بيانات المشاريع بنجاح.</p>
                                <p className="text-[10px] text-gray-600 mt-1">منذ ساعة</p>
                            </div>
                        </div>
                    </div>
                    <Link to="/admin/projects" className="block text-center w-full py-4 border-2 border-dashed border-gray-700 rounded-2xl text-gray-500 hover:border-primary-500 hover:text-primary-500 transition-all font-bold text-sm">
                        إضافة مشروع جديد +
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
