import { motion } from 'framer-motion';
import { Download, Mail, Linkedin, Github, ArrowDown } from 'lucide-react';

const Hero = () => {
  const scrollToAbout = () => {
    document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id='home'
      className='min-h-screen flex items-center justify-center pt-16'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className='space-y-8'
          >
            <div className='space-y-4'>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className='text-5xl lg:text-6xl font-bold leading-tight'
              >
                <span className='gradient-text'>عمر حميد العديني</span>
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className='text-2xl lg:text-3xl text-gray-300 font-medium'
              >
                مطور تطبيقات محترف
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className='text-lg text-gray-400 leading-relaxed max-w-2xl'
              >
                مطور تطبيقات شغوف بخبرة واسعة في{' '}
                <span className='text-primary-400'>Flutter</span> و{' '}
                <span className='text-secondary-400'>React Native</span> و{' '}
                <span className='text-accent-400'>Odoo</span>، أمتلك القدرة على
                بناء أنظمة قوية ومرنة للمؤسسات.
              </motion.p>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className='grid grid-cols-3 gap-6'
            >
              <div className='text-center'>
                <div className='text-3xl font-bold text-primary-500'>8+</div>
                <div className='text-sm text-gray-400'>مشاريع منشورة</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-secondary-500'>4.8</div>
                <div className='text-sm text-gray-400'>تقييم المستخدمين</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-accent-500'>15K+</div>
                <div className='text-sm text-gray-400'>تحميل</div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className='flex flex-wrap gap-4'
            >
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/cv_arabic.pdf';
                  link.download = 'Omar_Hamid_Al-Adini_CV.pdf';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className='btn-primary flex items-center space-x-2 space-x-reverse'
              >
                <Download className='h-5 w-5' />
                <span>تحميل السيرة الذاتية</span>
              </button>

              <button
                onClick={scrollToAbout}
                className='btn-secondary flex items-center space-x-2 space-x-reverse'
              >
                <span>اعرف المزيد</span>
                <ArrowDown className='h-5 w-5' />
              </button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className='flex space-x-4 space-x-reverse'
            >
              <a
                href='mailto:oooomar123450@gmail.com'
                className='p-3 rounded-full bg-dark-800 border border-gray-700 hover:border-primary-500 hover:bg-primary-500/10 transition-all duration-300'
              >
                <Mail className='h-5 w-5 text-gray-400 hover:text-primary-500' />
              </a>
              <a
                href='https://linkedin.com/in/omar-hamid-288385235'
                target='_blank'
                rel='noopener noreferrer'
                className='p-3 rounded-full bg-dark-800 border border-gray-700 hover:border-primary-500 hover:bg-primary-500/10 transition-all duration-300'
              >
                <Linkedin className='h-5 w-5 text-gray-400 hover:text-primary-500' />
              </a>
              <a
                href='https://github.com/oooomar896'
                target='_blank'
                rel='noopener noreferrer'
                className='p-3 rounded-full bg-dark-800 border border-gray-700 hover:border-primary-500 hover:bg-primary-500/10 transition-all duration-300'
              >
                <Github className='h-5 w-5 text-gray-400 hover:text-primary-500' />
              </a>
            </motion.div>
          </motion.div>

          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='flex justify-center lg:justify-end'
          >
            <div className='relative'>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className='relative'
              >
                <div className='w-80 h-80 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 p-1'>
                  <div className='w-full h-full rounded-full overflow-hidden bg-dark-900'>
                    <img
                      src='/my_image.jpg'
                      alt='عمر حميد العديني'
                      className='w-full h-full object-cover'
                      onError={e => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div
                      className='w-full h-full hidden items-center justify-center text-6xl font-bold text-primary-500 bg-dark-800'
                      style={{ display: 'none' }}
                    >
                      ع
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className='absolute -top-4 -right-4 w-8 h-8 bg-accent-500 rounded-full opacity-80'
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className='absolute -bottom-4 -left-4 w-6 h-6 bg-secondary-500 rounded-full opacity-80'
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className='absolute top-1/2 -left-8 w-4 h-4 bg-primary-500 rounded-full opacity-60'
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
