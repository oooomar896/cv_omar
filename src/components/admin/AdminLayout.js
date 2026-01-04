import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Briefcase,
    Layers,
    MessageSquare,
    TrendingUp,
    Newspaper
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            navigate('/admin/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        navigate('/admin/login');
    };

    const menuItems = [
        { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, path: '/admin' },
        { id: 'analytics', label: 'التحليلات والمبيعات', icon: TrendingUp, path: '/admin/analytics' },
        { id: 'messages', label: 'الرسائل الواردة', icon: MessageSquare, path: '/admin/messages' },
        { id: 'projects', label: 'إدارة المشاريع', icon: Briefcase, path: '/admin/projects' },
        { id: 'skills', label: 'إدارة المهارات', icon: Layers, path: '/admin/skills' },
        { id: 'news', label: 'الأخبار والنشاطات', icon: Newspaper, path: '/admin/news' },
        { id: 'users', label: 'المستخدمين', icon: Users, path: '/admin/users' },
        { id: 'settings', label: 'الإعدادات', icon: Settings, path: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-dark-950 flex text-white font-cairo overflow-hidden">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className="bg-dark-900 border-l border-gray-800 flex flex-col relative z-50 shrink-0"
            >
                {/* Toggle Button */}
                <button
                    onClick={() => setSidebarOpen(!isSidebarOpen)}
                    className="absolute -left-3 top-10 bg-primary-500 rounded-full p-1 border-2 border-dark-950 hover:scale-110 transition-transform"
                >
                    {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
                </button>

                {/* Logo */}
                <div className="p-6 mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center font-bold text-xl">
                        ع
                    </div>
                    {isSidebarOpen && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-bold text-xl tracking-wider"
                        >
                            مدير النظام
                        </motion.span>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-grow px-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === (item.path === '/admin' ? '/admin' : item.path);
                        // Handling sub-routes activation
                        const isSubActive = !isActive && location.pathname.startsWith(item.path) && item.path !== '/admin';
                        const FinalActive = isActive || isSubActive;

                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                className={`flex items-center gap-4 p-4 rounded-xl transition-all group ${FinalActive
                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                                    : 'text-gray-400 hover:bg-dark-800 hover:text-white'
                                    }`}
                            >
                                <Icon className={`h-6 w-6 ${FinalActive ? '' : 'group-hover:scale-110 transition-transform'}`} />
                                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 p-4 text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                    >
                        <LogOut className="h-6 w-6" />
                        {isSidebarOpen && <span className="font-medium">تسجيل الخروج</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main className="flex-grow overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-500/5 via-dark-950 to-dark-950">
                <header className="h-20 border-b border-gray-800 flex items-center justify-between px-8 bg-dark-950/50 backdrop-blur-md sticky top-0 z-40">
                    <h1 className="text-xl font-bold font-cairo text-gray-200">
                        {menuItems.find(i => i.path === location.pathname || (location.pathname.startsWith(i.path) && i.path !== '/admin'))?.label || 'لوحة التحكم'}
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="text-left font-cairo">
                            <p className="text-sm font-bold">عمر العديني</p>
                            <p className="text-xs text-primary-500 text-center">Super Admin</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-dark-800 border border-gray-700 overflow-hidden">
                            <img src="/my_image.jpg" alt="Admin" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
