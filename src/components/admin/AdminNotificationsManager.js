import { useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { Bell } from 'lucide-react';

const AdminNotificationsManager = ({ onNotification }) => {
    useEffect(() => {
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
                    table: 'generated_projects' // Using this table for requests
                },
                (payload) => {
                    handleNewRequest(payload.new);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

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
                icon: '/logo192.png' // Assuming standard React logo or custom one exists
            });
        }

        // 3. Play Sound
        try {
            const audio = new Audio('/notification.mp3'); // We might need to handle if this file doesn't exist, will just fail silently
            audio.play().catch(e => console.log('Audio play failed', e));
        } catch (error) {
            console.error(error);
        }
    };

    return null; // This component doesn't render anything visible directly
};

export default AdminNotificationsManager;
