import {
    Users,
    Briefcase,
    Zap,
    TrendingUp,
    Eye,
    MessageSquare,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

const DashboardHome = () => {
    const stats = [
        { label: 'إجمالي الزيارات', value: '1,284', icon: Eye, change: '+12%', isPositive: true },
        { label: 'طلبات المشاريع', value: '42', icon: Briefcase, change: '+5%', isPositive: true },
        { label: 'المستخدمين', value: '156', icon: Users, change: '+18%', isPositive: true },
        { label: 'معدل التحويل', value: '3.2%', icon: TrendingUp, change: '-2%', isPositive: false },
    ];

    return (
        <div className="space-y-8">
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
                            أحدث طلبات بناء المشاريع
                        </h2>
                        <button className="text-sm text-primary-500 hover:underline">عرض الكل</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-dark-800/50 text-gray-400 text-sm">
                                <tr>
                                    <th className="p-4">المستخدم</th>
                                    <th className="p-4">نوع المشروع</th>
                                    <th className="p-4">الحالة</th>
                                    <th className="p-4">التاريخ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800 text-sm">
                                {[1, 2, 3, 4].map((_, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center font-bold text-xs">
                                                    {['A', 'M', 'S', 'O'][i]}
                                                </div>
                                                <div>
                                                    <p className="font-bold">مستخدم تجريبي {i + 1}</p>
                                                    <p className="text-xs text-gray-500">user{i}@example.com</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono">WEB_APP</td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold">
                                                جاري المعالجة
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-400 text-xs">2026-01-03</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions / Notifications */}
                <div className="bg-dark-900/50 border border-gray-800 rounded-3xl p-6 space-y-6">
                    <h2 className="font-bold border-b border-gray-800 pb-4">إشعارات النظام</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex gap-4 items-start p-3 hover:bg-white/5 rounded-2xl transition-all">
                                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl mt-1">
                                    <MessageSquare size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">رسالة تواصل جديدة</p>
                                    <p className="text-xs text-gray-500 line-clamp-1">قام أحمد بإرسال استفسار حول خدمات الذكاء...</p>
                                    <p className="text-[10px] text-gray-600 mt-1">منذ 10 دقائق</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full py-4 border-2 border-dashed border-gray-700 rounded-2xl text-gray-500 hover:border-primary-500 hover:text-primary-500 transition-all font-bold text-sm">
                        إضافة تحديث للموقع +
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
