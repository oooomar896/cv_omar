
import { motion } from 'framer-motion';
import { Code2, Mail, Linkedin, Github, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="col-span-1 md:col-span-2"
          >
            <div className="flex items-center space-x-2 space-x-reverse mb-4">
              <Code2 className="h-8 w-8 text-primary-500" />
              <span className="text-2xl font-bold gradient-text">عمر التقني</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              مطور تطبيقات محترف وخبير حلول تقنية، متخصص في بناء أنظمة قوية ومرنة
              تساعد المؤسسات على النمو والتطور في العصر الرقمي.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a
                href="mailto:oooomar123450@gmail.com"
                className="p-3 bg-dark-800 border border-gray-700 rounded-full hover:border-primary-500 hover:bg-primary-500/10 transition-all duration-300"
              >
                <Mail className="h-5 w-5 text-gray-400 hover:text-primary-500" />
              </a>
              <a
                href="https://linkedin.com/in/omar-hamid-288385235"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-dark-800 border border-gray-700 rounded-full hover:border-primary-500 hover:bg-primary-500/10 transition-all duration-300"
              >
                <Linkedin className="h-5 w-5 text-gray-400 hover:text-primary-500" />
              </a>
              <a
                href="https://github.com/oooomar896"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-dark-800 border border-gray-700 rounded-full hover:border-primary-500 hover:bg-primary-500/10 transition-all duration-300"
              >
                <Github className="h-5 w-5 text-gray-400 hover:text-primary-500" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              {[
                { name: 'الرئيسية', href: '#home' },
                { name: 'عني', href: '#about' },
                { name: 'المهارات', href: '#skills' },
                { name: 'المشاريع', href: '#projects' },
                { name: 'تواصل معي', href: '#contact' }
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-primary-500 transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">الخدمات</h3>
            <ul className="space-y-2">
              {[
                'تطوير تطبيقات الموبايل',
                'تطوير المواقع الإلكترونية',
                'أنظمة إدارة المؤسسات',
                'حلول Odoo مخصصة',
                'استشارات تقنية'
              ].map((service) => (
                <li key={service}>
                  <span className="text-gray-400">{service}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-right mb-4 md:mb-0">
              <p className="text-gray-400">
                © {currentYear} عمر حميد العديني. جميع الحقوق محفوظة.
              </p>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              {/* تم إزالة النص */}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
        onClick={scrollToTop}
        className="fixed bottom-8 left-8 p-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
      >
        <ArrowUp className="h-6 w-6" />
      </motion.button>
    </footer>
  );
};

export default Footer;
