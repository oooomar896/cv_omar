import { motion } from 'framer-motion';
import { ExternalLink, Trophy, Users, Calendar, MapPin } from 'lucide-react';

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
          <h2 className='section-title'>حدث إعلان إخباري</h2>
          <p className='text-xl text-gray-400 max-w-3xl mx-auto'>
            مشاركة مميزة في برنامج عقارثون وفوز ضمن الفرق المتأهلة
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
                  <Trophy className='h-8 w-8 text-primary-500' />
                </div>
                <div>
                  <h3 className='text-2xl font-bold text-white'>
                    عقارثون 2024
                  </h3>
                  <p className='text-primary-400'>برنامج الابتكار العقاري</p>
                </div>
              </div>

              <div className='space-y-4'>
                <h4 className='text-xl font-semibold text-white'>
                  فوز فريق ملهمة ضمن الخمس المتأهلين
                </h4>
                <p className='text-gray-300 leading-relaxed'>
                  سعداء بالإعلان عن فوز فريق ملهمة ضمن الخمس المتأهلين الأكثر
                  إبداعاً وريادة في التكنولوجيا العقارية في المملكة العربية
                  السعودية. هذا الإنجاز يعكس التميز التقني والابتكار في مجال
                  التطوير العقاري.
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
                  href='https://real-estateconsultations.netlify.app'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='btn-primary flex items-center space-x-2 space-x-reverse'
                >
                  <span>عرض المشروع</span>
                  <ExternalLink className='h-5 w-5' />
                </a>
                <div className='flex items-center space-x-2 space-x-reverse text-accent-500'>
                  <Trophy className='h-5 w-5' />
                  <span className='font-semibold'>متأهل للنهائيات</span>
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
                  src='/aqarthon_app.jpg'
                  alt='مشروع الرؤية العقارية - عقارثون'
                  className='w-full h-80 object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />
                <div className='absolute bottom-4 left-4 right-4'>
                  <h5 className='text-white font-bold text-lg mb-2'>
                    الرؤية العقارية
                  </h5>
                  <p className='text-gray-200 text-sm'>
                    منصة الاستشارات العقارية المتطورة
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
            صور من الحدث
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {[
              { src: '/aqarthon.jpg', alt: 'صورة من عقارثون 1' },
              { src: '/aqarthon2.jpg', alt: 'صورة من عقارثون 2' },
              { src: '/aqarthon3.jpg', alt: 'صورة من عقارثون 3' },
            ].map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className='relative overflow-hidden rounded-xl group cursor-pointer'
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className='w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                <div className='absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <p className='text-white text-sm font-medium'>{image.alt}</p>
                </div>
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
              <div className='text-4xl font-bold text-accent-500 mb-2'>5</div>
              <div className='text-gray-300'>الفرق المتأهلة</div>
            </div>
            <div>
              <div className='text-4xl font-bold text-primary-500 mb-2'>1</div>
              <div className='text-gray-300'>فريق ملهمة</div>
            </div>
            <div>
              <div className='text-4xl font-bold text-secondary-500 mb-2'>
                100%
              </div>
              <div className='text-gray-300'>التميز التقني</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsSection;
