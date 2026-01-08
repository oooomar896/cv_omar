import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { TrendingUp, Users, Cpu, Target, MessageSquare, Eye, Fingerprint } from 'lucide-react';
import { dataService } from '../../utils/dataService';
import { systemAnalytics } from '../../utils/systemAnalytics';
import { supabase } from '../../utils/supabaseClient';
import Toast from '../common/Toast';

const AnalyticsDashboard = () => {
    const [stats, setStats] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

    const loadAnalyticsData = async () => {
        const [, , , pageVisits] = await Promise.all([
            dataService.fetchUsers(),
            dataService.fetchMessages(),
            dataService.fetchGeneratedProjects(),
            dataService.fetchPageVisits()
        ]);
        setStats(systemAnalytics.getDashboardStats(pageVisits));
    };

    useEffect(() => {
        loadAnalyticsData();

        // Real-time Subscription
        const channel = supabase
            .channel('dashboard-realtime')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages' },
                async () => {
                    setToast({ show: true, message: '📩 رسالة جديدة وصلت!', type: 'success' });
                    await loadAnalyticsData();
                }
            )
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'leads' },
                async () => {
                    setToast({ show: true, message: '👤 مستخدم جديد سجل في المنصة!', type: 'success' });
                    await loadAnalyticsData();
                }
            )
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'page_visits' },
                async () => {
                    // Update silently without toast for visits to avoid spam, or maybe just a subtle indicator
                    // For now, we just reload the data to update the counters and charts live
                    await loadAnalyticsData();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };

    }, []);

    if (!stats) return <div className="p-20 text-center text-gray-500">جاري تحليل البيانات...</div>;

    const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981'];

    const pieData = Object.entries(stats.projectTypes).map(([name, value]) => ({ name, value }));

    return (
        <div className="space-y-8 font-cairo text-right" dir="rtl">
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary-500/10 text-primary-500 rounded-2xl">
                    <TrendingUp size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">إحصائيات المنصة (Live)</h2>
                    <p className="text-gray-500 text-sm">متابعة لحظية لأداء باني المشاريع وتفاعل المستخدمين.</p>
                </div>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="الزيارات (آخر شهر)"
                    value={stats.totalVisits}
                    icon={Eye}
                    color="text-emerald-500"
                    desc="إجمالي مشاهدات الصفحات"
                />
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
                    title="رسائل التواصل"
                    value={stats.totalMessages}
                    icon={MessageSquare}
                    color="text-orange-500"
                    desc={`${stats.unreadMessages} رسائل غير مقروءة`}
                />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard
                    title="معدل التحويل"
                    value={`${stats.conversionRate}%`}
                    icon={Target}
                    color="text-yellow-500"
                    desc="زوار تحولوا لمستخدمين"
                />
                <StatCard
                    title="زوار فريدين"
                    value={stats.uniqueVisitors}
                    icon={Fingerprint}
                    color="text-teal-400"
                    desc="عدد الأجهزة المختلفة"
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
                                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px' }}
                                    itemStyle={{ fontFamily: 'Cairo' }}
                                />
                                <Area type="monotone" dataKey="visits" name="الزيارات" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                                <Area type="monotone" dataKey="projects" name="المشاريع" stroke="#8b5cf6" strokeWidth={3} fillOpacity={0} />
                                <Area type="monotone" dataKey="messages" name="الرسائل" stroke="#f97316" strokeWidth={3} fillOpacity={0} />
                                <Area type="monotone" dataKey="leads" name="المسجلين" stroke="#ec4899" strokeWidth={3} fillOpacity={0} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Top Pages */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-dark-900 border border-gray-800 rounded-3xl p-8 flex flex-col items-center"
                >
                    <h3 className="text-lg font-bold text-white mb-8 w-full">الصفحات الأكثر زيارة</h3>
                    <div className="h-[300px] w-full text-xs">
                        {stats.topPages.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    layout="vertical"
                                    data={stats.topPages}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <XAxis type="number" stroke="#6b7280" hide />
                                    <YAxis dataKey="path" type="category" width={100} stroke="#9ca3af" tick={{ fontSize: 10 }} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px' }}
                                    />
                                    <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-500">لا توجد بيانات كافية</div>
                        )}

                    </div>
                </motion.div>
            </div>

            {/* Project Types Pie Chart (Moving to bottom row) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
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
                    <div className="mt-4 flex flex-wrap gap-4 justify-center">
                        {pieData.map((d, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                <span className="text-gray-400 text-sm">{d.name} <span className="text-white font-bold">({d.value})</span></span>
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
