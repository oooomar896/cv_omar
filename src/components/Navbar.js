import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Code2, Bell } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { dataService } from '../utils/dataService';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const loadNotifs = () => {
      setNotifications(dataService.getNotifications());
    };

    loadNotifs();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('storage_update', loadNotifs);
    window.addEventListener('new_notification', loadNotifs);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage_update', loadNotifs);
      window.removeEventListener('new_notification', loadNotifs);
    };
  }, []);

  const navItems = [
    { name: 'الرئيسية', href: '/' },
    { name: 'باني المشاريع (AI)', href: '/builder', isHighlight: true },
    { name: 'مكتبة المكونات', href: '/uikit' },
    { name: 'الدومينات', href: '/domains/search' },
    { name: 'طلب مشروع', href: '/request' },
    { name: 'المطور', href: '/developer' },
    { name: 'بوابة العميل', href: '/portal/login', isSecondary: true },
  ];

  const handleNotifClick = () => {
    setShowNotifs(!showNotifs);
    if (!showNotifs) {
      dataService.markAllNotificationsRead();
      setNotifications(dataService.getNotifications());
    }
  };

  const scrollToSection = (href) => {
    setIsOpen(false);
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      if (location.pathname === path || (path === '/' && location.pathname === '/')) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate(href);
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    } else {
      navigate(href);
      window.scrollTo(0, 0);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-dark-900/95 backdrop-blur-md border-b border-gray-800'
        : 'bg-transparent'
        }`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-20'>
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg blur opacity-40 group-hover:opacity-75 transition duration-200"></div>
              <div className="relative p-2 bg-dark-800 ring-1 ring-white/10 rounded-lg">
                <Code2 className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
            <span className="text-xl font-black font-mono text-white tracking-tight leading-none">OMAR<span className="text-emerald-500">.DEV</span></span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className='hidden lg:block'>
            <div className='flex items-center space-x-6 space-x-reverse'>
              {navItems.map(item => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`text-sm font-bold font-cairo transition-all py-2 ${item.isHighlight
                    ? 'text-primary-500 border border-primary-500/30 rounded-xl bg-primary-500/5 px-4 hover:bg-primary-500 hover:text-white shadow-lg shadow-primary-500/5'
                    : item.isSecondary
                      ? 'text-gray-400 border border-gray-700 rounded-xl px-4 hover:border-primary-500 hover:text-white'
                      : 'text-gray-400 hover:text-white hover:translate-y-[-1px]'
                    }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex items-center gap-3 relative'>
            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2.5 rounded-xl border transition-all relative group ${showNotifs ? 'bg-primary-500 border-primary-400 text-white' : 'bg-dark-800 border-gray-700 text-gray-400 hover:border-primary-500'}`}
                onClick={handleNotifClick}
              >
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-dark-900 rounded-full text-[10px] font-bold flex items-center justify-center text-white animate-pulse z-10">
                    {unreadCount}
                  </span>
                )}
                <Bell size={20} />
              </motion.button>

              <AnimatePresence>
                {showNotifs && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-14 left-0 w-80 bg-dark-800 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-50 origin-top-left"
                  >
                    <div className="p-4 border-b border-gray-700 bg-black/40 flex justify-between items-center">
                      <span className="text-xs font-bold text-white font-cairo">الإشعارات</span>
                      <span className="text-[10px] text-gray-500 font-mono">Real-time Feed</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div key={n.id} className="p-4 hover:bg-white/5 border-b border-gray-700/50 transition-colors group relative">
                            {!n.read && <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary-500" />}
                            <div className="flex gap-3">
                              <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${n.read ? 'bg-gray-600' : 'bg-primary-500 animate-pulse'}`} />
                              <div>
                                <h4 className="text-[13px] font-bold text-white font-cairo leading-tight">{n.title}</h4>
                                <p className="text-[11px] text-gray-400 mt-1 font-cairo line-clamp-2">{n.msg}</p>
                                <span className="text-[9px] text-primary-500/80 mt-2 block font-mono">{n.time}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-12 text-center space-y-3">
                          <div className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto">
                            <Bell className="text-gray-600" size={24} />
                          </div>
                          <p className="text-xs text-gray-500 font-cairo">لا توجد إشعارات حالياً</p>
                        </div>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <button
                        className="w-full py-3 bg-black/20 text-[10px] text-gray-500 font-bold hover:text-white transition-colors border-t border-gray-700 font-cairo"
                        onClick={() => {
                          setShowNotifs(false);
                          setNotifications([]);
                        }}
                      >
                        مسح جميع الإشعارات
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className='p-2.5 rounded-xl bg-dark-800 border border-gray-700 text-gray-400 hover:border-primary-500 transition-all duration-300'
            >
              {isDark ? (
                <Sun size={20} className='text-accent-500' />
              ) : (
                <Moon size={20} className='text-primary-500' />
              )}
            </motion.button>

            <div className='lg:hidden'>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className='p-2.5 rounded-xl text-gray-400 bg-dark-800 border border-gray-700 hover:text-white hover:border-primary-500 transition-all'
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='lg:hidden overflow-hidden bg-dark-900 shadow-2xl border-t border-gray-800'
          >
            <div className='px-4 pt-4 pb-6 space-y-2'>
              {navItems.map(item => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`block w-full text-right px-6 py-4 rounded-2xl text-base font-bold font-cairo transition-all ${item.isHighlight
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-white/5 active:bg-white/10'
                    }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
