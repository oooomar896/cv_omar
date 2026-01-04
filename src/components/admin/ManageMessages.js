import { MessageSquare, Trash2, Mail, Clock, CheckCircle, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dataService } from '../../utils/dataService';
import Toast from '../../components/common/Toast';

const ManageMessages = () => {
    const [messages, setMessages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        setMessages(dataService.getMessages().reverse());
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (window.confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
            dataService.deleteMessage(id);
            setMessages(dataService.getMessages().reverse());
            if (selectedMessage?.id === id) setSelectedMessage(null);
            showToast('تم حذف الرسالة بنجاح');
        }
    };

    const handleSelectMessage = (msg) => {
        if (!msg.read) {
            dataService.markMessageRead(msg.id);
            setMessages(dataService.getMessages().reverse());
        }
        setSelectedMessage(msg);
    };

    const filteredMessages = messages.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatTime = (isoString) => {
        return new Date(isoString).toLocaleString('ar-EG');
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6 font-cairo" dir="rtl">
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}

            {/* Messages List */}
            <div className={`w-full md:w-1/3 bg-dark-900/50 border border-gray-800 rounded-3xl flex flex-col overflow-hidden ${selectedMessage ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-800">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <MessageSquare className="text-primary-500" />
                        الرسائل الواردة
                        <span className="bg-primary-500/20 text-primary-500 text-xs px-2 py-1 rounded-full">{messages.length}</span>
                    </h2>
                    <div className="relative">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="بحث في الرسائل..."
                            className="w-full bg-dark-800 border border-gray-700 rounded-xl pr-10 pl-4 py-2 text-sm text-white focus:border-primary-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto custom-scrollbar p-2 space-y-2">
                    {filteredMessages.length === 0 ? (
                        <div className="text-center text-gray-500 py-10">لا توجد رسائل</div>
                    ) : (
                        filteredMessages.map(msg => (
                            <motion.div
                                key={msg.id}
                                layout
                                onClick={() => handleSelectMessage(msg)}
                                className={`p-4 rounded-xl cursor-pointer border transition-all ${selectedMessage?.id === msg.id
                                    ? 'bg-primary-500/10 border-primary-500'
                                    : 'bg-dark-900 border-gray-800 hover:border-gray-600'
                                    } ${!msg.read ? 'border-r-4 border-r-primary-500' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`font-bold ${!msg.read ? 'text-white' : 'text-gray-400'}`}>{msg.name}</h3>
                                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                        <Clock size={10} />
                                        {formatTime(msg.date).split(',')[0]}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-300 truncate mb-1">{msg.subject}</p>
                                <p className="text-xs text-gray-500 truncate">{msg.message}</p>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Message Detail View */}
            <div className={`w-full md:w-2/3 bg-dark-900 border border-gray-800 rounded-3xl p-6 md:p-8 flex-col ${selectedMessage ? 'flex' : 'hidden md:flex'}`}>
                {selectedMessage ? (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={selectedMessage.id}
                        className="h-full flex flex-col"
                    >
                        {/* Mobile Back Button */}
                        <button
                            onClick={() => setSelectedMessage(null)}
                            className="md:hidden text-gray-400 hover:text-white mb-4 self-end"
                        >
                            إغلاق
                        </button>

                        <div className="flex justify-between items-start border-b border-gray-800 pb-6 mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-primary-500 flex items-center justify-center text-white font-bold text-xl">
                                    {selectedMessage.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">{selectedMessage.subject}</h2>
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                        <span className="flex items-center gap-1"><Mail size={14} /> {selectedMessage.email}</span>
                                        <span className="flex items-center gap-1"><Clock size={14} /> {formatTime(selectedMessage.date)}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={(e) => handleDelete(e, selectedMessage.id)}
                                className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                title="حذف الرسالة"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>

                        <div className="flex-grow bg-dark-950/50 rounded-2xl p-6 border border-gray-800 text-gray-300 leading-relaxed overflow-y-auto custom-scrollbar">
                            {selectedMessage.message}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <a
                                href={`mailto:${selectedMessage.email}`}
                                className="bg-primary-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-600 transition-all flex items-center gap-2"
                            >
                                <CheckCircle size={18} />
                                الرد على المرسل
                            </a>
                        </div>
                    </motion.div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                        <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mb-4">
                            <Mail size={32} className="opacity-50" />
                        </div>
                        <p>اختر رسالة من القائمة لعرض التفاصيل</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageMessages;
