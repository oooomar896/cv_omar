import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, CheckCircle, XCircle, Loader, TrendingUp, ShoppingCart, AlertCircle } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const DomainSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedExtensions, setSelectedExtensions] = useState(['.com']);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [pricing, setPricing] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const navigate = useNavigate();

    // Available extensions
    const availableExtensions = [
        { ext: '.com', label: 'COM', popular: true },
        { ext: '.net', label: 'NET', popular: true },
        { ext: '.org', label: 'ORG', popular: false },
        { ext: '.sa', label: 'SA', popular: true },
        { ext: '.com.sa', label: 'COM.SA', popular: false },
        { ext: '.info', label: 'INFO', popular: false },
        { ext: '.biz', label: 'BIZ', popular: false }
    ];

    // Fetch pricing on component mount
    useEffect(() => {
        fetchPricing();
        updateCartCount();
    }, []);

    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('domainCart') || '[]');
        setCartCount(cart.length);
    };

    const fetchPricing = async () => {
        try {
            const { data, error } = await supabase
                .from('domain_pricing')
                .select('*')
                .eq('is_available', true);

            if (error) throw error;
            setPricing(data || []);
        } catch (error) {
            console.error('Error fetching pricing:', error);
        }
    };

    const getPriceForExtension = (extension) => {
        const priceData = pricing.find(p => p.extension === extension);
        return priceData ? priceData.purchase_price : 0;
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            toast.error('الرجاء إدخال اسم الدومين');
            return;
        }

        // Validate domain name
        const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
        if (!domainRegex.test(searchTerm)) {
            toast.error('اسم الدومين غير صالح. استخدم حروف وأرقام فقط');
            return;
        }

        setIsSearching(true);
        try {
            // Check availability for each selected extension
            const results = await Promise.all(
                selectedExtensions.map(async (ext) => {
                    const fullDomain = searchTerm.toLowerCase() + ext;

                    // Check if domain already exists in database
                    const { data: existingDomain } = await supabase
                        .from('domains')
                        .select('id')
                        .eq('full_domain', fullDomain)
                        .single();

                    // For MVP, we'll simulate availability check
                    // In production, integrate with Namecheap API
                    const isAvailable = !existingDomain && Math.random() > 0.3;

                    return {
                        domain: fullDomain,
                        extension: ext,
                        available: isAvailable,
                        price: getPriceForExtension(ext)
                    };
                })
            );

            setSearchResults(results);

            // Generate suggestions if main domain is not available
            if (results.some(r => !r.available)) {
                generateSuggestions(searchTerm);
            }
        } catch (error) {
            console.error('Search error:', error);
            toast.error('حدث خطأ أثناء البحث');
        } finally {
            setIsSearching(false);
        }
    };

    const generateSuggestions = (baseName) => {
        const prefixes = ['my', 'get', 'the', 'pro', 'best'];
        const suffixes = ['online', 'hub', 'zone', 'site', 'web', 'app'];

        const suggestions = [];
        for (let i = 0; i < 3; i++) {
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
            suggestions.push(`${prefix}${baseName}`);
            suggestions.push(`${baseName}${suffix}`);
        }

        setSuggestions([...new Set(suggestions)].slice(0, 5));
    };

    const toggleExtension = (ext) => {
        setSelectedExtensions(prev =>
            prev.includes(ext)
                ? prev.filter(e => e !== ext)
                : [...prev, ext]
        );
    };

    const handleAddToCart = (domain) => {
        // Store in localStorage for checkout
        const cart = JSON.parse(localStorage.getItem('domainCart') || '[]');
        const existingItem = cart.find(item => item.domain === domain.domain);

        if (existingItem) {
            toast.error('هذا الدومين موجود بالفعل في السلة');
            return;
        }

        cart.push({
            ...domain,
            years: 1,
            addedAt: new Date().toISOString()
        });

        localStorage.setItem('domainCart', JSON.stringify(cart));
        updateCartCount();
        toast.success('تمت إضافة الدومين إلى السلة');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    {/* BETA NOTICE */}
                    <div className="bg-accent-500/10 border border-accent-500/20 rounded-xl p-4 mb-8 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-accent-400 font-bold text-sm">ميزة قيد التطوير (Beta)</h3>
                            <p className="text-gray-400 text-xs mt-1">
                                خدمة الدومينات تعمل حالياً في وضع المحاكاة. عمليات البحث والشراء لا تتم فعلياً على الإنترنت.
                                سيتم تفعيل الربط المباشر قريباً.
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-6 py-2">
                            <Globe className="w-5 h-5 text-primary-400" />
                            <span className="text-primary-400 font-semibold">ابحث عن دومينك المثالي</span>
                        </div>

                        {cartCount > 0 && (
                            <button
                                onClick={() => navigate('/domains/checkout')}
                                className="relative bg-gradient-to-l from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                <span>السلة</span>
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            </button>
                        )}
                    </div>

                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-l from-primary-400 to-accent-400 bg-clip-text text-transparent">
                            سجل دومينك الآن
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            ابحث عن الدومين المناسب لمشروعك واحجزه بأفضل الأسعار
                        </p>
                    </div>
                </motion.div>

                {/* Search Box */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-dark-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-8"
                >
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="اكتب اسم الدومين (مثال: mybusiness)"
                                className="w-full bg-dark-900/50 border border-gray-600/50 rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                                dir="ltr"
                            />
                        </div>

                        <button
                            onClick={handleSearch}
                            disabled={isSearching || !searchTerm.trim()}
                            className="bg-gradient-to-l from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 min-w-[150px]"
                        >
                            {isSearching ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    <span>جاري البحث...</span>
                                </>
                            ) : (
                                <>
                                    <Search className="w-5 h-5" />
                                    <span>بحث</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Extension Selection */}
                    <div>
                        <div className="block text-gray-400 mb-3 text-sm">اختر الامتدادات:</div>
                        <div className="flex flex-wrap gap-2">
                            {availableExtensions.map(({ ext, label, popular }) => (
                                <button
                                    key={ext}
                                    onClick={() => toggleExtension(ext)}
                                    className={`px-4 py-2 rounded-lg border transition-all duration-300 ${selectedExtensions.includes(ext)
                                        ? 'bg-primary-500 border-primary-500 text-white'
                                        : 'bg-dark-900/50 border-gray-600/50 text-gray-400 hover:border-primary-500/50'
                                        } ${popular ? 'ring-2 ring-accent-500/20' : ''}`}
                                >
                                    {label}
                                    {popular && <span className="mr-1 text-xs">⭐</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4 mb-8"
                    >
                        <h2 className="text-2xl font-bold text-white mb-4">نتائج البحث</h2>

                        {searchResults.map((result, index) => (
                            <motion.div
                                key={result.domain}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`bg-dark-800/50 backdrop-blur-sm border rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 ${result.available
                                    ? 'border-green-500/30 hover:border-green-500/50'
                                    : 'border-gray-700/50 opacity-75'
                                    }`}
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    {result.available ? (
                                        <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
                                    ) : (
                                        <XCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
                                    )}

                                    <div>
                                        <h3 className="text-xl font-bold text-white" dir="ltr">
                                            {result.domain}
                                        </h3>
                                        <p className={`text-sm ${result.available ? 'text-green-400' : 'text-red-400'}`}>
                                            {result.available ? 'متاح للحجز' : 'غير متاح'}
                                        </p>
                                    </div>
                                </div>

                                {result.available && (
                                    <>
                                        <div className="text-center">
                                            <p className="text-3xl font-bold text-primary-400">
                                                {result.price} <span className="text-lg">ر.س</span>
                                            </p>
                                            <p className="text-xs text-gray-500">سنوياً</p>
                                        </div>

                                        <button
                                            onClick={() => handleAddToCart(result)}
                                            className="bg-gradient-to-l from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
                                        >
                                            <span>إضافة للسلة</span>
                                            <TrendingUp className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Suggestions */}
                {suggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-dark-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
                    >
                        <h3 className="text-xl font-bold text-white mb-4">اقتراحات بديلة</h3>
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setSearchTerm(suggestion);
                                        handleSearch();
                                    }}
                                    className="bg-dark-900/50 hover:bg-primary-500/20 border border-gray-600/50 hover:border-primary-500/50 text-gray-300 hover:text-primary-400 px-4 py-2 rounded-lg transition-all duration-300"
                                    dir="ltr"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Popular Extensions Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {pricing.filter(p => p.is_available).slice(0, 3).map((price) => (
                        <div
                            key={price.extension}
                            className="bg-dark-800/30 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 text-center hover:border-primary-500/50 transition-all duration-300"
                        >
                            <div className="text-4xl font-bold text-primary-400 mb-2">
                                {price.extension}
                            </div>
                            <div className="text-2xl font-bold text-white mb-2">
                                {price.purchase_price} <span className="text-sm text-gray-400">ر.س/سنة</span>
                            </div>
                            <p className="text-gray-500 text-sm">
                                {price.extension === '.com' && 'الأكثر شعبية للأعمال'}
                                {price.extension === '.net' && 'مثالي للشبكات والتقنية'}
                                {price.extension === '.sa' && 'للمواقع السعودية'}
                            </p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default DomainSearch;
