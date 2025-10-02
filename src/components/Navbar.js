import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Sun, Moon, Code2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'الرئيسية', href: '#home' },
    { name: 'عني', href: '#about' },
    { name: 'المهارات', href: '#skills' },
    { name: 'المشاريع', href: '#projects' },
    { name: 'الأخبار', href: '#news' },
    { name: 'تواصل معي', href: '#contact' },
  ];

  const scrollToSection = href => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-dark-900/95 backdrop-blur-md border-b border-gray-800'
          : 'bg-transparent'
      }`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className='flex items-center space-x-2 space-x-reverse'
          >
            <Code2 className='h-8 w-8 text-primary-500' />
            <span className='text-xl font-bold gradient-text'>عمر التقني</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className='hidden md:block'>
            <div className='ml-10 flex items-baseline space-x-8 space-x-reverse'>
              {navItems.map(item => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className='nav-link px-3 py-2 text-sm font-medium'
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
