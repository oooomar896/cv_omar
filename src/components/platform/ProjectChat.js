import { useState, useEffect, useRef } from 'react';
import { Send, User, Shield, Loader2 } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import { dataService } from '../../utils/dataService';

const ProjectChat = ({ project, userRole = 'user' }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
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
                    setMessages((current) => [...current, payload.new]);
                    scrollToBottom();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [project.id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadMessages = async () => {
        const data = await dataService.fetchProjectMessages(project.id);
        setMessages(data || []);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setLoading(true);
        try {
            await dataService.sendProjectMessage({
                project_id: project.id,
                sender_type: userRole,
                content: newMessage,
                is_read: false
            });
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[500px] bg-dark-900 border border-gray-800 rounded-2xl overflow-hidden font-cairo" dir="rtl">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 bg-dark-950 flex items-center justify-between">
                <div>
                    <h3 className="text-white font-bold text-sm">محادثة المشروع المباشرة</h3>
                    <p className="text-gray-500 text-xs">تواصل مباشر مع فريق التطوير</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    متصل الآن
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-900/50">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 py-10 flex flex-col items-center">
                        <div className="w-12 h-12 bg-dark-800 rounded-full flex items-center justify-center mb-3">
                            <Send size={20} className="ml-1 opacity-50" />
                        </div>
                        <p className="text-sm">ابدأ المحادثة حول هذا المشروع...</p>
                    </div>
                )}

                {messages.map((msg) => {
                    const isMe = msg.sender_type === userRole;
                    const isAdmin = msg.sender_type === 'admin';

                    return (
                        <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isAdmin ? 'bg-primary-500/20 text-primary-500' : 'bg-gray-700 text-gray-300'
                                }`}>
                                {isAdmin ? <Shield size={14} /> : <User size={14} />}
                            </div>

                            {/* Bubble */}
                            <div className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed ${isMe
                                    ? 'bg-primary-600 text-white rounded-bl-sm'
                                    : 'bg-dark-800 text-gray-200 border border-gray-700 rounded-br-sm'
                                }`}>
                                {msg.content}
                                <span className="text-[9px] opacity-50 block mt-1 text-left" dir="ltr">
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-dark-950 border-t border-gray-800 flex gap-3">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="اكتب رسالتك هنا..."
                    className="flex-1 bg-dark-900 text-white border border-gray-800 rounded-xl px-4 py-3 text-sm focus:border-primary-500 outline-none transition-colors"
                />
                <button
                    type="submit"
                    disabled={loading || !newMessage.trim()}
                    className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all flex items-center justify-center min-w-[50px]"
                >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className={userRole === 'user' ? 'rotate-180' : ''} />}
                </button>
            </form>
        </div>
    );
};

export default ProjectChat;
