import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, Users, Cpu, Target, Calendar } from 'lucide-react';
import { systemAnalytics } from '../../utils/systemAnalytics';

const AnalyticsDashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        setStats(systemAnalytics.getDashboardStats());
    }, []);

    if (!stats) return <div className="p-20 text-center text-gray-500">جاري تحليل البيانات...</div>;

    const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981'];

    const pieData = Object.entries(stats.projectTypes).map(([name, value]) => ({ name, value }));

    return (
        <div className="space-y-8 font-cairo text-right" dir="rtl">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary-500/10 text-primary-500 rounded-2xl">
                    <TrendingUp size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">إحصائيات المنصة</h2>
                    <p className="text-gray-500 text-sm">تحليل دقيق لأداء باني المشاريع وتفاعل المستخدمين.</p>
                </div>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="إجمالي المسجلين"
                    value={stats.totalUsers}
                    icon={Users}
                    color="text-blue-500"
                    desc="عدد العملاء المحتملين"
                />
                <StatCard
                    title="مشاريع AI"
                    value={stats.totalGenProjects}
                    icon={Cpu}
                    color="text-purple-500"
                    desc="مشروع تم بناؤه بالذكاء الاصطناعي"
                />
                <StatCard
                    title="معدل التحويل"
                    value={`${stats.conversionRate}%`}
                    icon={Target}
                    color="text-emerald-500"
                    desc="زوار تحولوا لمستخدمين"
                />
                <StatCard
                    title="نشاط اليوم"
                    value={stats.last7Days[6].leads + stats.last7Days[6].projects}
                    icon={Calendar}
                    color="text-pink-500"
                    desc="عمليات خلال آخر 24 ساعة"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Graph - Timeline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 bg-dark-900 border border-gray-800 rounded-3xl p-8"
                >
                    <h3 className="text-lg font-bold text-white mb-8">نشاط المنصة (آخر 7 أيام)</h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.last7Days}>
                                <defs>
                                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px' }}
                                    itemStyle={{ fontFamily: 'Cairo' }}
                                />
                                <Area type="monotone" dataKey="projects" name="المشاريع" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                                <Area type="monotone" dataKey="leads" name="المسجلين" stroke="#ec4899" strokeWidth={3} fillOpacity={0} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Pie Chart - Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-dark-900 border border-gray-800 rounded-3xl p-8 flex flex-col items-center"
                >
                    <h3 className="text-lg font-bold text-white mb-8 w-full">توزيع أنواع المشاريع</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2 w-full">
                        {pieData.map((d, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    {d.name}
                                </span>
                                <span className="text-white font-bold">{d.value}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, color, desc }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-dark-900 border border-gray-800 p-6 rounded-3xl"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl bg-dark-800 ${color}`}>
                <Icon size={24} />
            </div>
        </div>
        <div>
            <p className="text-gray-500 text-sm mb-1">{title}</p>
            <h4 className="text-3xl font-black text-white">{value}</h4>
            <p className="text-[10px] text-gray-600 mt-2">{desc}</p>
        </div>
    </motion.div>
);

export default AnalyticsDashboard;
