import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, LogIn, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { dataService } from '../../utils/dataService';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const trimmedEmail = email.trim().toLowerCase();
            const trimmedPassword = password.trim();

            const admin = await dataService.loginAdmin(trimmedEmail, trimmedPassword);

            if (!admin) {
                toast.error('خطأ في البريد الإلكتروني أو كلمة المرور.');
                setIsLoading(false);
                return;
            }

            localStorage.setItem('admin_token', 'supabase_admin_session_active');
            localStorage.setItem('admin_user', JSON.stringify({ email: admin.email, role: admin.role }));
            toast.success('تم تسجيل الدخول بنجاح!');

            // Force redirection to ensure it works even if router state is stale
            // We use setTimeout to allow the toast to be seen briefly
            setTimeout(() => {
                navigate('/admin', { replace: true });
                // Fallback if navigate doesn't trigger
                window.location.href = '/admin';
            }, 500);

        } catch (error) {
            console.error("Login failed:", error);
            console.error("Error details:", error.message, error.code);
            toast.error('خطأ في البريد الإلكتروني أو كلمة المرور (أو خطأ في الاتصال).');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 font-cairo text-right" dir="rtl">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl animate-pulse delay-700" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-dark-900 border border-gray-800 rounded-3xl p-8 shadow-2xl relative z-10"
            >
                <div className="text-center mb-10 space-y-4">
                    <div className="inline-flex p-4 bg-primary-500/10 rounded-2xl border border-primary-500/20 mb-2">
                        <ShieldCheck className="h-10 w-10 text-primary-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">دخول الإدارة</h1>
                    <p className="text-gray-400">يرجى إدخال بيانات الاعتماد للوصول إلى لوحة التحكم</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">


                    <div className="space-y-2">
                        <label htmlFor="admin_email" className="text-sm text-gray-400 mr-2">البريد الإلكتروني</label>
                        <div className="relative">
                            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                            <input
                                id="admin_email"
                                type="email"
                                required
                                placeholder="name@example.com"
                                className="w-full bg-dark-800 border border-gray-700 rounded-2xl pr-12 pl-4 py-4 text-white focus:border-primary-500 outline-none transition-all placeholder:text-gray-600"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="admin_password" className="text-sm text-gray-400 mr-2">كلمة المرور</label>
                        <div className="relative">
                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                            <input
                                id="admin_password"
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="••••••••"
                                className="w-full bg-dark-800 border border-gray-700 rounded-2xl pr-12 pl-12 py-4 text-white focus:border-primary-500 outline-none transition-all placeholder:text-gray-600 font-sans"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500/50 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary-500/20 transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>دخول آمن</span>
                                <LogIn className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-500 hover:text-primary-400 text-sm transition-colors"
                    >
                        العودة للموقع الرئيسي
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
