import { motion } from 'framer-motion';
import { ExternalLink, Trophy, Users, MapPin } from 'lucide-react';

const NewsSection = () => {
  return (
    <section
      id='news'
      className='py-20 bg-gradient-to-br from-dark-900 to-dark-950'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <h2 className='section-title'>أحدث الأخبار المهنية</h2>
          <p className='text-xl text-gray-400 max-w-3xl mx-auto'>
            سعيد بالإعلان عن انضمامي لفريق شركة باكورة التقنيات، خطوة جديدة
            لتعزيز خبرتي في بناء الحلول الرقمية المتكاملة
          </p>
        </motion.div>

        {/* Main News Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className='bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border border-primary-500/20 rounded-3xl p-8 mb-12'
        >
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'>
            {/* Content */}
            <div className='space-y-6'>
              <div className='flex items-center space-x-3 space-x-reverse'>
                <div className='p-3 bg-primary-500/20 rounded-full'>
                  <Users className='h-8 w-8 text-primary-500' />
                </div>
                <div>
                  <h3 className='text-2xl font-bold text-white'>
                    إنضمام إلى شركة باكورة التقنيات
                  </h3>
                  <p className='text-primary-400'>فريق التحول الرقمي</p>
                </div>
              </div>

              <div className='space-y-4'>
                <h4 className='text-xl font-semibold text-white'>
                  مرحلة جديدة في تطوير الحلول التقنية
                </h4>
                <p className='text-gray-300 leading-relaxed'>
                  بدأت رحلتي المهنية الجديدة مع شركة باكورة التقنيات
                  (BACURA&nbsp;Tec)، حيث أعمل على تطوير منتجات وخدمات رقمية
                  مبتكرة تدعم المؤسسات في التحول التقني وتعزز حضورها الرقمي.
                  أتطلع لتوظيف خبرتي في بناء تطبيقات متكاملة وتجارب مستخدم
                  عالية الجودة لخدمة عملاء الشركة وشركائها.
                </p>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='flex items-center space-x-3 space-x-reverse'>
                  <Users className='h-5 w-5 text-secondary-500' />
                  <span className='text-gray-300'>فريق ملهمة</span>
                </div>
                <div className='flex items-center space-x-3 space-x-reverse'>
                  <MapPin className='h-5 w-5 text-secondary-500' />
                  <span className='text-gray-300'>
                    المملكة العربية السعودية
                  </span>
                </div>
              </div>

              <div className='flex flex-wrap gap-4'>
                <a
                  href='https://bacuratec.sa/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='btn-primary flex items-center space-x-2 space-x-reverse'
                >
                  <span>زيارة موقع الشركة</span>
                  <ExternalLink className='h-5 w-5' />
                </a>
                <div className='flex items-center space-x-2 space-x-reverse text-accent-500'>
                  <Trophy className='h-5 w-5' />
                  <span className='font-semibold'>خطوة استراتيجية جديدة</span>
                </div>
              </div>
            </div>

            {/* Project Image */}
            <div className='relative'>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className='relative overflow-hidden rounded-2xl'
              >
                <img
                  src='/images/projects/investor-bacura.svg'
                  alt='شعار شركة باكورة التقنيات'
                  className='w-full h-80 object-contain bg-white/5 p-8'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />
                <div className='absolute bottom-4 left-4 right-4'>
                  <h5 className='text-white font-bold text-lg mb-2'>
                    شركة باكورة التقنيات
                  </h5>
                  <p className='text-gray-200 text-sm'>
                    حلول تقنية وشراكات استراتيجية لدعم التحول الرقمي
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Gallery Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className='mb-12'
        >
          <h3 className='text-2xl font-bold text-white text-center mb-8'>
            رؤيتنا مع باكورة التقنيات
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {[
              {
                title: 'منتجات رقمية متكاملة',
                description:
                  'التعاون على بناء حلول برمجية متصلة تعزز أداء الأعمال وتدعم رحلة التحول الرقمي للعملاء.',
              },
              {
                title: 'شراكات استراتيجية',
                description:
                  'العمل جنباً إلى جنب مع فرق متعددة التخصصات لتقديم قيمة مضافة وشراكات طويلة الأمد.',
              },
              {
                title: 'تركيز على جودة التجربة',
                description:
                  'تقديم تجارب استخدام مميزة تعتمد على أحدث الممارسات في التصميم والتطوير.',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className='bg-dark-800/60 border border-primary-500/10 rounded-xl p-6 backdrop-blur-sm'
              >
                <h4 className='text-lg font-semibold text-white mb-3'>
                  {feature.title}
                </h4>
                <p className='text-gray-300 leading-relaxed'>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievement Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className='bg-gradient-to-r from-accent-500/10 to-primary-500/10 border border-accent-500/20 rounded-2xl p-8'
        >
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
            <div>
              <div className='text-4xl font-bold text-accent-500 mb-2'>2025</div>
              <div className='text-gray-300'>عام الانضمام</div>
            </div>
            <div>
              <div className='text-4xl font-bold text-primary-500 mb-2'>10+</div>
              <div className='text-gray-300'>مشاريع سنعمل على تطويرها</div>
            </div>
            <div>
              <div className='text-4xl font-bold text-secondary-500 mb-2'>
                100%
              </div>
              <div className='text-gray-300'>التزام بالابتكار التقني المستمر</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsSection;
