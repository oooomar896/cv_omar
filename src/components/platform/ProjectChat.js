import { useState, useEffect, useRef } from 'react';
import { Send, User, Shield, Loader2, CheckCheck, Smile, MessageSquare } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import { dataService } from '../../utils/dataService';
import { motion } from 'framer-motion';

const ProjectChat = ({ project, userRole = 'client' }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const [currentUserEmail, setCurrentUserEmail] = useState('');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        let email = '';
        if (userRole === 'admin') {
            const adminData = localStorage.getItem('admin_user');
            if (adminData) {
                try {
                    const parsed = JSON.parse(adminData);
                    email = parsed.email || '';
                } catch (e) {
                    email = adminData; // fallback
                }
            }
        } else {
            email = localStorage.getItem('portal_user') || '';
        }
        setCurrentUserEmail(email);

        const loadMessages = async () => {
            const data = await dataService.fetchProjectMessages(project.id);
            setMessages(data || []);
        };

        loadMessages();

        const channel = supabase
            .channel(`project-chat-${project.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'project_messages',
                    filter: `project_id=eq.${project.id}`
                },
                (payload) => {
                    setMessages((current) => {
                        // Avoid duplicates if we just sent it
                        if (current.find(m => m.id === payload.new.id)) return current;
                        return [...current, payload.new];
                    });
                    scrollToBottom();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [project.id, userRole]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const text = newMessage;
        setNewMessage('');
        setLoading(true);

        try {
            await dataService.sendProjectMessage({
                project_id: project.id,
                sender_email: currentUserEmail,
                sender_role: userRole,
                text: text
            });
        } catch (error) {
            console.error('Failed to send:', error);
            setNewMessage(text); // Restore text on failure
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-dark-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden group shadow-2xl" dir="rtl">
            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                        <MessageSquare className="text-white" size={24} />
                    </div>
                    <div>
                        <h3 className="text-white font-black text-lg">الدردشة المباشرة</h3>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-gray-400 text-xs font-medium">فريق التطوير متواجد الآن</span>
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Secure Channel
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-dark-950/20">
                {messages.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full flex flex-col items-center justify-center text-center p-10"
                    >
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5">
                            <Shield size={32} className="text-primary-500/30" />
                        </div>
                        <h4 className="text-white font-bold mb-2">ابدأ المحادثة المشفرة</h4>
                        <p className="text-gray-500 text-sm max-w-[200px]">جميع الرسائل في هذه القناة مشفرة وخاصة بالمشروع</p>
                    </motion.div>
                )}

                <div className="space-y-6">
                    {messages.map((msg, idx) => {
                        const isMe = msg.sender_role === userRole;
                        const isAdmin = msg.sender_role === 'admin';
                        const showAvatar = idx === 0 || messages[idx - 1].sender_role !== msg.sender_role;

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                key={msg.id || idx}
                                className={`flex items-start gap-4 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                {/* Avatar */}
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform hover:scale-110 ${msg.sender_role === 'admin'
                                    ? 'bg-gradient-to-br from-primary-500 to-indigo-600 text-white'
                                    : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                                    } ${!showAvatar ? 'opacity-0' : 'opacity-100'}`}>
                                    {isAdmin ? <Shield size={18} /> : <User size={18} />}
                                </div>

                                {/* Bubble Container */}
                                <div className={`flex flex-col ${isMe ? 'items-start' : 'items-end'} max-w-[80%]`}>
                                    {showAvatar && (
                                        <span className="text-[10px] font-bold text-gray-500 mb-2 px-1 uppercase tracking-widest">
                                            {isAdmin ? 'الإدارة' : (isMe ? 'أنت' : 'العميل')}
                                        </span>
                                    )}
                                    <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-xl border ${isMe
                                        ? 'bg-primary-600 border-primary-500 text-white rounded-tr-none'
                                        : 'bg-dark-800 border-white/5 text-gray-200 rounded-tl-none'
                                        }`}>
                                        {msg.text}
                                        <div className={`flex items-center gap-1.5 mt-2 ${isMe ? 'justify-start' : 'justify-end'} opacity-50`}>
                                            <span className="text-[9px] font-mono">
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {isMe && <CheckCheck size={12} className="text-white" />}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white/5 border-t border-white/5">
                <form onSubmit={handleSend} className="relative flex gap-3">
                    <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary-400 transition-colors"
                    >
                        <Smile size={20} />
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="اكتب رسالتك الذكية هنا..."
                        className="flex-1 bg-dark-900/50 text-white border border-white/5 rounded-2xl pr-12 pl-4 py-4 text-sm focus:border-primary-500/50 outline-none transition-all placeholder:text-gray-600 backdrop-blur-md"
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={loading || !newMessage.trim()}
                        className="bg-gradient-to-r from-primary-600 to-indigo-600 disabled:opacity-50 disabled:grayscale hover:shadow-lg hover:shadow-primary-500/20 text-white w-14 rounded-2xl transition-all flex items-center justify-center shrink-0"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className={userRole === 'client' ? 'rotate-180' : ''} />}
                    </motion.button>
                </form>
                <p className="text-[9px] text-center text-gray-600 mt-4 uppercase tracking-[0.2em] font-bold">Encrypted End-to-End Communication</p>
            </div>
        </div>
    );
};


export default ProjectChat;
