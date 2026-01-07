import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Sun, Moon, Code2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'طلب مشروع', href: '/' },
    { name: 'المطور', href: '/developer' },
    { name: 'المشاريع', href: '/developer#projects' },
    { name: 'عني', href: '/developer#about' },
    { name: 'تواصل معي', href: '/developer#contact' },
    { name: 'بوابة العميل', href: '/portal/login', isSecondary: true },
  ];

  const scrollToSection = (href) => {
    setIsOpen(false);

    // Check if it's a direct route or hash
    if (href.includes('#')) {
      const [path, hash] = href.split('#');

      // If we are already on the page, just scroll
      if (location.pathname === path || (path === '/' && location.pathname === '/')) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Navigate to the page, wait for load then scroll (handled by useEffect in target page preferably, but simple navigation for now)
        // We can just navigate to the full href, browser/router usually handles hash
        navigate(href);
        // Fallback for SPA routing if hash doesn't scroll automatically
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
        <div className='flex items-center justify-between h-16'>
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
            <span className="text-xl font-bold font-mono text-white tracking-tight">OMAR<span className="text-emerald-500">.DEV</span></span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className='hidden md:block'>
            <div className='ml-10 flex items-baseline space-x-8 space-x-reverse'>
              {navItems.map(item => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`nav-link px-3 py-2 text-sm font-medium transition-all ${item.isHighlight
                    ? 'text-primary-500 border border-primary-500/30 rounded-lg bg-primary-500/5 px-4 hover:bg-primary-500 hover:text-white'
                    : item.isSecondary
                      ? 'text-gray-400 border border-gray-700 rounded-lg px-4 hover:border-primary-500 hover:text-white'
                      : ''
                    }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className='flex items-center space-x-4 space-x-reverse'>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className='p-2 rounded-full bg-dark-800 border border-gray-700 hover:border-primary-500 transition-colors duration-300'
            >
              {isDark ? (
                <Sun className='h-5 w-5 text-accent-500' />
              ) : (
                <Moon className='h-5 w-5 text-primary-500' />
              )}
            </motion.button>

            <div className='md:hidden'>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className='p-2 rounded-md text-gray-400 hover:text-white hover:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500'
              >
                {isOpen ? (
                  <X className='h-6 w-6' />
                ) : (
                  <Menu className='h-6 w-6' />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          height: isOpen ? 'auto' : 0,
        }}
        transition={{ duration: 0.3 }}
        className='md:hidden overflow-hidden'
      >
        <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-dark-900/95 backdrop-blur-md border-t border-gray-800'>
          {navItems.map(item => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.href)}
              className='nav-link block px-3 py-2 text-base font-medium w-full text-right'
            >
              {item.name}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
