import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';
import { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const variants = {
        initial: { opacity: 0, y: 50, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 20, scale: 0.95 }
    };

    const types = {
        success: {
            icon: CheckCircle,
            className: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
            iconColor: 'text-emerald-500'
        },
        error: {
            icon: XCircle,
            className: 'bg-red-500/10 border-red-500/20 text-red-500',
            iconColor: 'text-red-500'
        },
        warning: {
            icon: AlertTriangle,
            className: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
            iconColor: 'text-amber-500'
        }
    };

    const currentType = types[type] || types.success;
    const Icon = currentType.icon;

    return (
        <AnimatePresence>
            <motion.div
                layout
                initial="initial"
                animate="animate"
                exit="exit"
                variants={variants}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl border backdrop-blur-md shadow-2xl ${currentType.className}`}
                dir="rtl"
            >
                <Icon size={24} className={currentType.iconColor} />
                <p className="font-bold text-sm md:text-base">{message}</p>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors mr-2"
                >
                    <X size={16} className="opacity-60 hover:opacity-100" />
                </button>
            </motion.div>
        </AnimatePresence>
    );
};

export default Toast;
