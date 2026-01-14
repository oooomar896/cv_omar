import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Globe, CheckCircle, XCircle, Loader2, ShoppingCart } from 'lucide-react';
import { dataService } from '../../utils/dataService';
import toast from 'react-hot-toast';

const ProjectDomainReg = ({ project }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [results, setSearchResults] = useState([]);
    const [pricing, setPricing] = useState([]);

    useEffect(() => {
        const loadPricing = async () => {
            const data = await dataService.fetchDomainPricing();
            setPricing(data);
        };
        loadPricing();
    }, []);

    const handleSearch = async () => {
        if (!searchTerm) return;
        setIsSearching(true);
        try {
            // Simplified search for integration
            const extensions = ['.com', '.net', '.sa'];
            const searchResults = extensions.map(ext => ({
                domain: searchTerm.toLowerCase() + ext,
                extension: ext,
                available: Math.random() > 0.4,
                price: pricing.find(p => p.tld === ext)?.price_per_year || 50
            }));
            setSearchResults(searchResults);
        } catch (e) {
            toast.error('خطأ في البحث');
        } finally {
            setIsSearching(false);
        }
    };

    const handlePurchase = (domain) => {
        // Mock purchase flow
        toast.success(`تم بدء عملية حجز ${domain.domain}`);
        // In real app, push to cart or checkout
        const cart = JSON.parse(localStorage.getItem('domainCart') || '[]');
        cart.push({ ...domain, project_id: project.id });
        localStorage.setItem('domainCart', JSON.stringify(cart));
        window.location.href = '/domains/checkout';
    };

    return (
        <div className="glass-panel p-6 rounded-[2rem] border border-white/5 bg-dark-800/20">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Globe size={20} className="text-primary-400" />
                حجز دومين للموقع
            </h3>

            <div className="flex gap-2 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                        type="text"
                        placeholder="ابحث عن اسم النطاق..."
                        className="w-full bg-dark-900 border border-white/5 rounded-xl pr-10 pl-4 py-3 text-sm focus:border-primary-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <button
                    onClick={handleSearch}
                    disabled={isSearching || !searchTerm}
                    className="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-dark-900 px-4 rounded-xl font-bold transition-all"
                >
                    {isSearching ? <Loader2 size={18} className="animate-spin" /> : 'بحث'}
                </button>
            </div>

            <AnimatePresence>
                {results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-3"
                    >
                        {results.map((res, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-3">
                                    {res.available ? <CheckCircle size={16} className="text-emerald-500" /> : <XCircle size={16} className="text-rose-500" />}
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white font-mono">{res.domain}</span>
                                        <span className={`text-[10px] ${res.available ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {res.available ? `${res.price} ر.س / سنة` : 'غير متاح'}
                                        </span>
                                    </div>
                                </div>
                                {res.available && (
                                    <button
                                        onClick={() => handlePurchase(res)}
                                        className="p-2 rounded-lg bg-primary-500/10 text-primary-400 hover:bg-primary-500 hover:text-dark-900 transition-all"
                                    >
                                        <ShoppingCart size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {!results.length && (
                <p className="text-xs text-gray-500 text-center py-4">أدخل اسم النطاق الذي ترغب به لمشروعك</p>
            )}
        </div>
    );
};

export default ProjectDomainReg;
