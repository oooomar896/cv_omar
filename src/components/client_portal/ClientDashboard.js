
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    FileText,
    MessageSquare,
    CheckCircle,
    Clock,
    Bell,
    CreditCard
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
    const navigate = useNavigate();
    // Mock Data for Client Project
    const projectStatus = {
        name: "منصة التجارة الإلكترونية AI",
        phase: "development", // planning, design, development, testing, delivery
        progress: 65,
        nextMilestone: "إطلاق النسخة التجريبية (Beta)",
        dueDate: "2024-02-15"
    };

    const timeline = [
        { id: 1, title: 'تحليل المتطلبات', status: 'completed', date: '10 يناير' },
        { id: 2, title: 'تصميم الواجهات UI/UX', status: 'completed', date: '20 يناير' },
        { id: 3, title: 'تطوير النظام (Backend)', status: 'active', date: 'جاري العمل' },
        { id: 4, title: 'ربط الواجهات (Frontend)', status: 'pending', date: '1 فبراير' },
        { id: 5, title: 'الاختبار والتسليم', status: 'pending', date: '15 فبراير' },
    ];

    const recentUpdates = [
        { id: 1, type: 'dev', message: 'تم الانتهاء من تطوير قاعدة البيانات وتجهيز API المنتجات.', time: 'منذ ساعتين' },
        { id: 2, type: 'design', message: 'تم اعتماد تصميم الصفحة الرئيسية من قبل فريق التصميم.', time: 'أمس' },
        { id: 3, type: 'system', message: 'تم استلام الدفعة الثانية من المستحقات المالية.', time: 'منذ يومين' },
    ];

    return (
        <div className="min-h-screen bg-dark-900 text-white font-cairo" dir="rtl">
            {/* Top Navigation Bar */}
            <nav className="glass-panel border-b border-white/5 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20">
                                <span className="text-xl font-bold text-white">B</span>
                            </div>
                            <span className="text-lg font-bold text-gray-200 hidden md:block">لوحة العميل</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-2 rounded-full hover:bg-white/5 transition-colors relative">
                                <Bell size={20} className="text-gray-400" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-dark-900"></span>
                            </button>
                            <div className="flex items-center gap-3 pr-4 border-r border-white/10">
                                <span className="text-sm text-gray-300">أحمد محمد</span>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 border border-white/10"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8 relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
                    <h1 className="text-3xl font-bold mb-2">مرحباً، أحمد 👋</h1>
                    <p className="text-gray-400">إليك نظرة عامة على سير العمل في مشروعك &quot;<span className="text-primary-400">{projectStatus.name}</span>&quot;.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area (Timeline & Status) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Project Pulse Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-8 rounded-3xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50"></div>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-2xl font-bold text-white">حالة المشروع</h2>
                                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold animate-pulse">
                                            نشط الآن
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm">المرحلة الحالية: <span className="text-white font-medium">تطوير النظام (Backend Development)</span></p>
                                </div>
                                <div className="text-left md:text-right">
                                    <div className="text-3xl font-black text-white mb-1">{projectStatus.progress}%</div>
                                    <div className="text-xs text-gray-500 font-mono">نسبة الإنجاز الكلية</div>
                                </div>
                            </div>

                            {/* Timeline Visualization */}
                            <div className="relative">
                                {/* Connector Line */}
                                <div className="absolute top-4 right-0 left-0 h-0.5 bg-gray-800 -z-10 rounded-full"></div>
                                <div className="absolute top-4 right-0 left-0 h-0.5 bg-primary-500 -z-10 rounded-full" style={{ width: '40%' }}></div> {/* Dynamic width based on progress */}

                                <div className="flex justify-between items-start w-full overflow-x-auto pb-4 gap-4 no-scrollbar">
                                    {timeline.map((item, index) => (
                                        <div key={item.id} className="flex flex-col items-center min-w-[100px] group cursor-default">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${item.status === 'completed' ? 'bg-primary-500 border-primary-900 text-white' :
                                                item.status === 'active' ? 'bg-dark-900 border-primary-500 text-primary-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' :
                                                    'bg-dark-800 border-gray-700 text-gray-600'
                                                }`}>
                                                {item.status === 'completed' ? <CheckCircle size={16} /> :
                                                    item.status === 'active' ? <Clock size={16} className="animate-spin-slow" /> :
                                                        <span className="text-xs font-mono">{index + 1}</span>}
                                            </div>
                                            <div className="text-center mt-3">
                                                <div className={`text-xs font-bold mb-1 ${item.status === 'active' ? 'text-white' : 'text-gray-500'}`}>{item.title}</div>
                                                <div className="text-[10px] text-gray-600 font-mono">{item.date}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Recent Updates Feed */}
                        <div className="glass-panel p-6 rounded-3xl">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <LayoutDashboard className="text-blue-400" size={20} />
                                آخر التحديثات
                            </h3>
                            <div className="space-y-6">
                                {recentUpdates.map((update, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex gap-4 group"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="w-2 h-2 rounded-full bg-gray-700 group-hover:bg-primary-500 transition-colors mt-2"></div>
                                            <div className="w-0.5 h-full bg-gray-800 my-1 group-last:hidden"></div>
                                        </div>
                                        <div className="pb-6 w-full">
                                            <div className="bg-dark-800/50 p-4 rounded-2xl border border-white/5 group-hover:border-primary-500/20 transition-all hover:bg-dark-800">
                                                <p className="text-gray-300 text-sm mb-2 leading-relaxed">{update.message}</p>
                                                <div className="flex justify-between items-center text-xs text-gray-500">
                                                    <span className="flex items-center gap-1"><Clock size={10} /> {update.time}</span>
                                                    <span className={`px-2 py-0.5 rounded-full bg-gray-700/50 ${update.type === 'dev' ? 'text-blue-400' : update.type === 'design' ? 'text-pink-400' : 'text-green-400'}`}>
                                                        {update.type === 'dev' ? 'تطوير' : update.type === 'design' ? 'تصميم' : 'نظام'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Area (Quick Actions & Files) */}
                    <div className="space-y-6">

                        {/* Quick Actions */}
                        <div className="glass-panel p-6 rounded-3xl">
                            <h3 className="text-lg font-bold text-white mb-4">إجراءات سريعة</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => navigate('/portal/requests')}
                                    className="p-4 rounded-2xl bg-dark-800 border border-white/5 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all flex flex-col items-center gap-2 text-center group"
                                >
                                    <LayoutDashboard className="text-gray-400 group-hover:text-blue-400 transition-colors" size={24} />
                                    <span className="text-xs font-medium text-gray-300">طلباتي</span>
                                </button>
                                <button className="p-4 rounded-2xl bg-dark-800 border border-white/5 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all flex flex-col items-center gap-2 text-center group">
                                    <MessageSquare className="text-gray-400 group-hover:text-purple-400 transition-colors" size={24} />
                                    <span className="text-xs font-medium text-gray-300">الدعم الفني</span>
                                </button>
                                <button
                                    onClick={() => navigate('/portal/contracts')}
                                    className="p-4 rounded-2xl bg-dark-800 border border-white/5 hover:bg-red-500/10 hover:border-red-500/30 transition-all flex flex-col items-center gap-2 text-center group"
                                >
                                    <FileText className="text-gray-400 group-hover:text-red-400 transition-colors" size={24} />
                                    <span className="text-xs font-medium text-gray-300">العقود</span>
                                </button>
                                <button
                                    onClick={() => navigate('/portal/finance')}
                                    className="p-4 rounded-2xl bg-dark-800 border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all flex flex-col items-center gap-2 text-center group"
                                >
                                    <CreditCard className="text-gray-400 group-hover:text-emerald-400 transition-colors" size={24} />
                                    <span className="text-xs font-medium text-gray-300">المالية</span>
                                </button>
                            </div>
                        </div>

                        {/* Project Details */}
                        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
                            <h3 className="text-lg font-bold text-white mb-4">تفاصيل العقد</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-sm text-gray-500">تاريخ التسليم المتوقع</span>
                                    <span className="text-sm font-mono text-white bg-dark-800 px-2 py-1 rounded-lg border border-white/5">{projectStatus.dueDate}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-sm text-gray-500">التكلفة الإجمالية</span>
                                    <span className="text-sm font-bold text-white">45,000 ر.س</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-sm text-gray-500">المدفوع</span>
                                    <span className="text-sm font-bold text-green-400">15,000 ر.س</span>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-sm text-gray-500">المتبقي</span>
                                    <span className="text-sm font-bold text-gray-300">30,000 ر.س</span>
                                </div>
                            </div>
                            <div className="mt-6">
                                <button
                                    onClick={() => navigate('/portal/finance')}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-dark-900 font-bold text-sm shadow-lg shadow-primary-500/20 transition-all transform hover:scale-[1.02]"
                                >
                                    سداد دفعة مستحقة 💳
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default ClientDashboard;
