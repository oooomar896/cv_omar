import { Newspaper, Plus, Trash2, Calendar, MessageSquare, X, Edit2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dataService } from '../../utils/dataService';
import toast from 'react-hot-toast';
import OptimizedImage from '../../components/common/OptimizedImage';
import { convertGoogleDriveLink } from '../../utils/imageUtils';

const ManageNews = () => {
    const [news, setNews] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentItem, setCurrentItem] = useState({
        title: '',
        content: '',
        image: ''
    });

    useEffect(() => {
        const loadNews = async () => {
            await dataService.fetchNews();
            setNews(dataService.getNews());
        };
        loadNews();
    }, []);

    const handleSaveNews = (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                dataService.updateNews(currentItem.id, currentItem);
                toast.success('تم تحديث الخبر بنجاح');
            } else {
                dataService.addNews(currentItem);
                toast.success('تمت إضافة الخبر بنجاح');
            }
            setNews(dataService.getNews());
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            toast.error('حدث خطأ أثناء الحفظ');
        }
    };

    const handleEditClick = (item) => {
        setCurrentItem(item);
        setEditMode(true);
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setCurrentItem({ title: '', content: '', image: '' });
        setEditMode(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الخبر؟')) {
            try {
                dataService.deleteNews(id);
                setNews(dataService.getNews());
                toast.success('تم حذف الخبر بنجاح');
            } catch (error) {
                toast.error('فشل حذف الخبر');
            }
        }
    };

    return (
        <div className="space-y-6 font-cairo" dir="rtl">

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                    <Newspaper className="text-primary-500" />
                    إدارة الأخبار والنشاطات
                </h2>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-primary-500 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-600 transition-all font-cairo"
                >
                    <Plus size={18} />
                    خبر جديد
                </button>
            </div>

            <div className="space-y-4">
                {news.map(item => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-dark-900 border border-gray-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gray-700 transition-all group"
                    >
                        <div className="flex items-start gap-4 flex-grow">
                            {item.image && (
                                <div className="w-20 h-20 rounded-xl overflow-hidden hidden md:block border border-gray-800">
                                    <OptimizedImage
                                        src={convertGoogleDriveLink(item.image)}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
                                    <span className="flex items-center gap-1"><Calendar size={12} /> {item.date}</span>
                                    <span className="flex items-center gap-1"><MessageSquare size={12} /> تحديث مهني</span>
                                </div>
                                <h3 className="text-lg font-bold text-white transition-colors group-hover:text-primary-400">{item.title}</h3>
                                <p className="text-gray-400 text-sm line-clamp-2 max-w-2xl">{item.content}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 shrink-0 self-end md:self-center">
                            <button
                                onClick={() => handleEditClick(item)}
                                className="p-3 bg-primary-500/10 text-primary-500 hover:bg-primary-500 hover:text-white rounded-xl transition-all"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-dark-900 border border-gray-800 rounded-3xl w-full max-w-xl p-8 relative z-10 shadow-2xl h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">
                                    {editMode ? 'تعديل الخبر' : 'إضافة خبر أو نشاط'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X /></button>
                            </div>

                            <form onSubmit={handleSaveNews} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="news-title" className="text-sm text-gray-400">عنوان الخبر</label>
                                    <input
                                        id="news-title"
                                        required
                                        className="w-full bg-dark-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                                        value={currentItem.title}
                                        onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="news-image" className="text-sm text-gray-400">رابط الصورة (اختياري)</label>
                                    <input
                                        id="news-image"
                                        className="w-full bg-dark-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                                        value={currentItem.image || ''}
                                        onChange={(e) => setCurrentItem({ ...currentItem, image: e.target.value })}
                                        placeholder="/images/news/example.jpg"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="news-content" className="text-sm text-gray-400">المحتوى بالتفصيل</label>
                                    <textarea
                                        id="news-content"
                                        required
                                        className="w-full bg-dark-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none h-40"
                                        value={currentItem.content}
                                        onChange={(e) => setCurrentItem({ ...currentItem, content: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
                                >
                                    {editMode ? 'تحديث الخبر' : 'نشر الخبر الآن'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageNews;
