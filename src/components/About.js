import { motion } from 'framer-motion';
import {
  GraduationCap,
  Award,
  Target,
  Users,
  Clock,
  CheckCircle,
  Download,
} from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Target,
      title: 'شغف بالحلول الإبداعية',
      description: 'أبحث دائماً عن طرق مبتكرة لحل المشاكل التقنية',
    },
    {
      icon: Clock,
      title: 'التزام صارم بالمواعيد',
      description: 'أنجز المهام في الوقت المحدد تحت أي ظروف',
    },
    {
      icon: Users,
      title: 'تنظيم العمل',
      description: 'أستخدم أدوات مثل Obsidian وTrello لتنظيم المشاريع',
    },
    {
      icon: CheckCircle,
      title: 'قابلية التوسع',
      description: 'أبني أنظمة قابلة للتطوير والنمو',
    },
  ];

  return (
    <section id='about' className='py-20 bg-dark-900/50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <h2 className='section-title'>عني</h2>
          <p className='text-xl text-gray-400 max-w-3xl mx-auto'>
            مطور تطبيقات شغوف بخبرة واسعة في بناء أنظمة قوية ومرنة للمؤسسات، مع
            التركيز على الأداء، سهولة الاستخدام، وقابلية التوسع.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20'>
          {/* Education */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='space-y-6'
          >
            <div className='flex items-center space-x-4 space-x-reverse'>
              <div className='p-3 bg-primary-500/20 rounded-full'>
                <GraduationCap className='h-8 w-8 text-primary-500' />
              </div>
              <div>
                <h3 className='text-2xl font-bold text-white'>التعليم</h3>
                <p className='text-gray-400'>بكالوريوس تقنية المعلومات</p>
              </div>
            </div>

            <div className='space-y-4'>
              <div className='bg-dark-800 border border-gray-700 rounded-xl p-6'>
                <h4 className='text-xl font-semibold text-white mb-2'>
                  جامعة المدينة العالمية (MEDIU)
                </h4>
                <p className='text-gray-400 mb-3'>
                  ركزت على تطوير البرمجيات وهندسة النظم
                </p>
                <a
                  href='https://www.mediu.edu.my/ar/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary-500 hover:text-primary-400 transition-colors duration-300 inline-flex items-center space-x-2 space-x-reverse'
                >
                  <span>رابط الموقع الرسمي للجامعة</span>
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                    />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Experience Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='space-y-6'
          >
            <div className='flex items-center space-x-4 space-x-reverse'>
              <div className='p-3 bg-secondary-500/20 rounded-full'>
                <Award className='h-8 w-8 text-secondary-500' />
              </div>
              <div>
                <h3 className='text-2xl font-bold text-white'>
                  الخبرة العملية
                </h3>
                <p className='text-gray-400'>
                  تصميم حلول مخصصة وإدارة المشاريع
                </p>
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className='bg-dark-800 border border-gray-700 rounded-xl p-4 hover:border-primary-500/50 transition-colors duration-300'
                >
                  <div className='flex items-center space-x-3 space-x-reverse mb-3'>
                    <feature.icon className='h-6 w-6 text-accent-500' />
                    <h4 className='font-semibold text-white'>
                      {feature.title}
                    </h4>
                  </div>
                  <p className='text-sm text-gray-400'>{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center'
        >
          <div className='bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20 rounded-2xl p-8'>
            <h3 className='text-2xl font-bold text-white mb-4'>مهمتي</h3>
            <p className='text-lg text-gray-300 leading-relaxed max-w-4xl mx-auto mb-6'>
              أسعى دومًا لتقديم قيمة حقيقية عبر الابتكار والانضباط التقني، مع
              التركيز على بناء حلول تقنية متقدمة تساعد المؤسسات على النمو
              والتطور في العصر الرقمي.
            </p>
            <a
              href='/cv.pdf'
              download='السيرة_الذاتية_عمر_حميد_العديني.pdf'
              className='btn-primary inline-flex items-center space-x-2 space-x-reverse'
            >
              <Download className='h-5 w-5' />
              <span>تحميل السيرة الذاتية</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
