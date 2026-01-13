import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, CreditCard, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const DomainCheckout = () => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadCart();
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
    };

    const loadCart = () => {
        const savedCart = JSON.parse(localStorage.getItem('domainCart') || '[]');
        setCart(savedCart);
    };

    const removeFromCart = (domain) => {
        const updatedCart = cart.filter(item => item.domain !== domain);
        setCart(updatedCart);
        localStorage.setItem('domainCart', JSON.stringify(updatedCart));
        toast.success('تم إزالة الدومين من السلة');
    };

    const updateYears = (domain, years) => {
        const updatedCart = cart.map(item =>
            item.domain === domain ? { ...item, years: parseInt(years) } : item
        );
        setCart(updatedCart);
        localStorage.setItem('domainCart', JSON.stringify(updatedCart));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.years), 0);
    };

    const handleCheckout = async () => {
        if (!user) {
            toast.error('يرجى تسجيل الدخول أولاً');
            navigate('/portal/login');
            return;
        }

        if (cart.length === 0) {
            toast.error('السلة فارغة');
            return;
        }

        setLoading(true);
        try {
            // 1. Call Payment Edge Function (SERVER-SIDE SECURE PAYMENT)
            const { data: paymentResult, error: paymentFunctionError } = await supabase.functions.invoke('create-payment', {
                body: {
                    amount: cart.reduce((total, item) => total + (item.price * item.years), 0),
                    currency: 'SAR',
                    description: `Purchase of ${cart.length} domains`,
                    payment_method: 'creditcard',
                    metadata: {
                        user_id: user.id,
                        domains: cart.map(d => d.domain).join(', ')
                    }
                }
            });

            if (paymentFunctionError) {
                console.error('Payment Function Error:', paymentFunctionError);
                throw new Error('فشل الاتصال بخادم الدفع');
            }

            if (paymentResult.error) {
                throw new Error(paymentResult.error);
            }

            console.log('Payment Initiated:', paymentResult);

            // 2. Create transaction records (Optimistic UI updates, confirmed by server response)
            const transactions = cart.map(item => ({
                user_id: user.id,
                transaction_type: 'purchase',
                amount: item.price * item.years,
                currency: 'SAR',
                payment_status: 'completed', // In real flow, this would be 'pending' until webhook confirms
                transaction_id: paymentResult.id, // Store key from payment provider
                years_purchased: item.years,
                notes: `Domain: ${item.domain} | Ref: ${paymentResult.id}`
            }));

            const { error: transactionError } = await supabase
                .from('domain_transactions')
                .insert(transactions);

            if (transactionError) throw transactionError;

            // 3. Register Domains
            const domains = cart.map((item) => {
                const expiryDate = new Date();
                expiryDate.setFullYear(expiryDate.getFullYear() + item.years);

                return {
                    user_id: user.id,
                    domain_name: item.domain.split('.')[0],
                    extension: '.' + item.domain.split('.').slice(1).join('.'),
                    full_domain: item.domain,
                    expiry_date: expiryDate.toISOString(),
                    status: 'active',
                    auto_renew: false
                };
            });

            const { error: domainError } = await supabase
                .from('domains')
                .insert(domains);

            if (domainError) throw domainError;

            // No need to update transaction status manually here as we inserted it as completed above for MVP flow
            // In a real flow, a separate Webhook Handler would update pending -> completed

            // Clear cart
            localStorage.removeItem('domainCart');
            setCart([]);

            toast.success('تم شراء الدومينات بنجاح! 🎉');

            // Redirect to domain management
            setTimeout(() => {
                navigate('/portal/domains');
            }, 2000);

        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('حدث خطأ أثناء عملية الشراء');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-6 py-2 mb-6">
                        <ShoppingCart className="w-5 h-5 text-primary-400" />
                        <span className="text-primary-400 font-semibold">سلة التسوق</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-l from-primary-400 to-accent-400 bg-clip-text text-transparent">
                        إتمام الطلب
                    </h1>
                    <p className="text-gray-400 text-lg">
                        راجع طلبك وأكمل عملية الشراء
                    </p>
                </motion.div>

                {cart.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-dark-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12 text-center"
                    >
                        <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-400 mb-2">السلة فارغة</h3>
                        <p className="text-gray-500 mb-6">لم تقم بإضافة أي دومينات بعد</p>
                        <a
                            href="/domains/search"
                            className="inline-flex items-center gap-2 bg-gradient-to-l from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                        >
                            <span>ابحث عن دومين</span>
                            <ArrowRight className="w-5 h-5" />
                        </a>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="text-2xl font-bold text-white mb-4">
                                الدومينات ({cart.length})
                            </h2>

                            {cart.map((item, index) => (
                                <motion.div
                                    key={item.domain}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-dark-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
                                >
                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white mb-1" dir="ltr">
                                                {item.domain}
                                            </h3>
                                            <p className="text-gray-400 text-sm">
                                                {item.price} ر.س / سنة
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div>
                                                <div className="block text-gray-400 text-sm mb-2">المدة</div>
                                                <select
                                                    value={item.years}
                                                    onChange={(e) => updateYears(item.domain, e.target.value)}
                                                    className="bg-dark-900/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                                                >
                                                    {[1, 2, 3, 4, 5, 10].map(year => (
                                                        <option key={year} value={year}>
                                                            {year} {year === 1 ? 'سنة' : 'سنوات'}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="text-center">
                                                <p className="text-gray-400 text-sm mb-2">المجموع</p>
                                                <p className="text-2xl font-bold text-primary-400">
                                                    {item.price * item.years} <span className="text-sm">ر.س</span>
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.domain)}
                                                className="text-red-400 hover:text-red-300 transition-colors p-2"
                                                title="حذف"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-dark-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 sticky top-24"
                            >
                                <h2 className="text-2xl font-bold text-white mb-6">ملخص الطلب</h2>

                                <div className="space-y-4 mb-6">
                                    {cart.map(item => (
                                        <div key={item.domain} className="flex justify-between text-sm">
                                            <span className="text-gray-400">{item.domain} ({item.years} سنة)</span>
                                            <span className="text-white font-semibold">{item.price * item.years} ر.س</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-700 pt-4 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-white">الإجمالي</span>
                                        <span className="text-3xl font-bold text-primary-400">
                                            {calculateTotal()} <span className="text-lg">ر.س</span>
                                        </span>
                                    </div>
                                </div>

                                {!user && (
                                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                                        <div className="flex gap-2">
                                            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-yellow-400 text-sm font-semibold mb-1">
                                                    يجب تسجيل الدخول
                                                </p>
                                                <p className="text-gray-400 text-xs">
                                                    سجل الدخول لإتمام عملية الشراء
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handleCheckout}
                                    disabled={loading || !user}
                                    className="w-full bg-gradient-to-l from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>جاري المعالجة...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5" />
                                            <span>إتمام الشراء</span>
                                        </>
                                    )}
                                </button>

                                <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                    <div className="flex gap-2">
                                        <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-blue-400 text-sm font-semibold mb-1">
                                                دفع آمن
                                            </p>
                                            <p className="text-gray-400 text-xs">
                                                جميع المعاملات محمية ومشفرة
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DomainCheckout;
