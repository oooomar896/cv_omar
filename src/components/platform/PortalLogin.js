import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, ShieldCheck, Sparkles, Lock, UserPlus, LogIn } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import toast from 'react-hot-toast';

const PortalLogin = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                if (data.user) {
                    toast.success('تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني.');
                    setIsSignUp(false); // Switch to login view
                }
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;

                if (data.user) {
                    // Maintain backward compatibility for now
                    localStorage.setItem('portal_user', data.user.email);
                    localStorage.setItem('portal_token', data.session.access_token);

                    toast.success('تم تسجيل الدخول بنجاح');
                    setTimeout(() => navigate('/portal/dashboard'), 1000);
                }
            }
        } catch (error) {
            console.error('Auth error:', error);
            const msg = error.message === 'Invalid login credentials'
                ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
                : error.message;
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 font-cairo" dir="rtl">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="bg-dark-900 border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-3xl -mr-16 -mt-16 rounded-full" />

                    <div className="text-center space-y-4 mb-8">
                        <div className="inline-flex p-4 bg-primary-500/10 rounded-2xl mb-2">
                            <ShieldCheck className="h-8 w-8 text-primary-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                            {isSignUp ? 'إنشاء حساب جديد' : 'بوابة العميل الذكية'}
                        </h2>
                        <p className="text-gray-500 text-sm">
                            {isSignUp
                                ? 'أدخل بياناتك لإنشاء حساب وتأمين مشاريعك'
                                : 'أدخل بيانات الدخول لاستعراض مشاريعك المولدة'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="portal-email" className="text-sm text-gray-400 mr-1">البريد الإلكتروني</label>
                                <div className="relative">
                                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                                    <input
                                        id="portal-email"
                                        type="email"
                                        required
                                        className="w-full bg-dark-800 border border-gray-700 rounded-xl px-12 py-4 text-white focus:border-primary-500 outline-none transition-all font-sans"
                                        placeholder="your-email@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="portal-password" className="text-sm text-gray-400 mr-1">كلمة المرور</label>
                                <div className="relative">
                                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                                    <input
                                        id="portal-password"
                                        type="password"
                                        required
                                        minLength={6}
                                        className="w-full bg-dark-800 border border-gray-700 rounded-xl px-12 py-4 text-white focus:border-primary-500 outline-none transition-all font-sans"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 shadow-xl transition-all"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>{isSignUp ? 'إنشاء الحساب' : 'دخول للمنصة'}</span>
                                    {isSignUp ? <UserPlus className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
                                </>
                            )}
                        </button>

                        <div className="text-center pt-2">
                            <button
                                type="button"
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                {isSignUp
                                    ? 'لديك حساب بالفعل؟ تسجيل الدخول'
                                    : 'ليس لديك حساب؟ إنشاء حساب جديد'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-800 flex items-center justify-center gap-2 text-xs text-gray-500">
                        <Sparkles size={14} className="text-primary-500" />
                        <span>منصة عمر العديني للحلول الرقمية</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PortalLogin;
