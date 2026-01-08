import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const generateVisitorId = () => {
    let vid = localStorage.getItem('visitor_id');
    if (!vid) {
        vid = (window.crypto?.randomUUID ? window.crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36));
        localStorage.setItem('visitor_id', vid);
    }
    return vid;
};

const usePageTracking = () => {
    const location = useLocation();
    const lastPathRef = useRef(null);

    useEffect(() => {
        const trackPage = async () => {
            const path = location.pathname + location.search;

            // Prevent duplicate tracking for the same path in immediate succession (React StrictMode fix)
            if (lastPathRef.current === path) return;
            lastPathRef.current = path;

            try {
                const visitorId = generateVisitorId();

                // Optional: Get logged in user
                const { data: { session } } = await supabase.auth.getSession();
                const userId = session?.user?.id || null;

                await supabase.from('page_visits').insert({
                    path,
                    visitor_id: visitorId,
                    user_id: userId,
                    metadata: {
                        referrer: document.referrer,
                        userAgent: navigator.userAgent,
                        screen: `${window.screen.width}x${window.screen.height}`
                    }
                });
            } catch (error) {
                // Silently fail for analytics to not disturb user flow
                console.warn('Error tracking page view:', error);
            }
        };

        trackPage();
    }, [location]);
};

export default usePageTracking;
