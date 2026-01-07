import { useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { Bell } from 'lucide-react';

const AdminNotificationsManager = ({ onNotification }) => {
    useEffect(() => {
        const handleNewRequest = (request) => {
            const message = `طلب جديد: ${request.project_name || 'مشروع بدون عنوان'}`;

            // 1. App Toast Notification
            onNotification && onNotification({
                id: Date.now(),
                message: message,
                type: 'info',
                icon: Bell
            });

            // 2. Browser Notification
            if (Notification.permission === 'granted') {
                new Notification('منصة عمر التقنية', {
                    body: message,
                    icon: '/logo192.png'
                });
            }

            // 3. Play Sound
            try {
                const audio = new Audio('/notification.mp3');
                audio.play().catch(e => console.log('Audio play failed', e));
            } catch (error) {
                console.error(error);
            }
        };

        // Request permission for browser notifications
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }

        // Subscribe to real-time changes
        const subscription = supabase
            .channel('admin-notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'generated_projects'
                },
                (payload) => {
                    handleNewRequest(payload.new);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [onNotification]); // Added onNotification as dependency

    return null;
};

export default AdminNotificationsManager;
