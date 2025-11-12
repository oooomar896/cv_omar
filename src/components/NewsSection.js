import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Trophy, Users, MapPin } from 'lucide-react';

const ROTATION_INTERVAL = 7000;

const NEWS_ITEMS = [
  {
    id: 'bacura-2025',
    sectionTitle: 'أحدث الأخبار المهنية',
    intro:
      'سعيد بالإعلان عن انضمامي لفريق شركة باكورة التقنيات، خطوة جديدة لتعزيز خبرتي في بناء الحلول الرقمية المتكاملة',
    cardIcon: Users,
    cardTitle: 'انضمام إلى شركة باكورة التقنيات',
    cardSubtitle: 'فريق التحول الرقمي',
    highlightTitle: 'مرحلة جديدة في تطوير الحلول التقنية',
    description:
      'بدأت رحلتي المهنية الجديدة مع شركة باكورة التقنيات (BACURA Tec)، حيث أعمل على تطوير منتجات وخدمات رقمية مبتكرة تدعم المؤسسات في التحول التقني وتعزز حضورها الرقمي. أتطلع لتوظيف خبرتي في بناء تطبيقات متكاملة وتجارب مستخدم عالية الجودة لخدمة عملاء الشركة وشركائها.',
    details: [
      {
        icon: Users,
        text: 'فريق باكورة التقنيات',
      },
      {
        icon: MapPin,
        text: 'المملكة العربية السعودية',
      },
    ],
    cta: [
      {
        type: 'primary',
        label: 'زيارة موقع الشركة',
        href: 'https://bacuratec.sa/',
      },
      {
        type: 'badge',
        label: 'خطوة استراتيجية جديدة',
        icon: Trophy,
      },
    ],
    image: {
      src: '/images/projects/logob.png',
      alt: 'شعار شركة باكورة التقنيات',
      overlayTitle: 'شركة باكورة التقنيات',
      overlaySubtitle: 'حلول تقنية وشراكات استراتيجية لدعم التحول الرقمي',
      className: 'object-contain bg-white/5 p-8',
    },
    featuresTitle: 'رؤيتنا مع باكورة التقنيات',
    features: [
      {
        type: 'text',
        title: 'منتجات رقمية متكاملة',
        description:
          'التعاون على بناء حلول برمجية متصلة تعزز أداء الأعمال وتدعم رحلة التحول الرقمي للعملاء.',
      },
      {
        type: 'text',
        title: 'شراكات استراتيجية',
        description:
          'العمل جنباً إلى جنب مع فرق متعددة التخصصات لتقديم قيمة مضافة وشراكات طويلة الأمد.',
      },
      {
        type: 'text',
        title: 'تركيز على جودة التجربة',
        description:
          'تقديم تجارب استخدام مميزة تعتمد على أحدث الممارسات في التصميم والتطوير.',
      },
    ],
    stats: [
      {
        value: '2025',
        label: 'عام الانضمام',
        color: 'accent',
      },
      {
        value: '10+',
        label: 'مشاريع سنعمل على تطويرها',
        color: 'primary',
      },
      {
        value: '100%',
        label: 'التزام بالابتكار التقني المستمر',
        color: 'secondary',
      },
    ],
  },
  {
    id: 'aqarthon-2025',
    sectionTitle: 'حدث إعلان إخباري',
    intro: 'مشاركة مميزة في برنامج عقارثون وفوز ضمن الفرق المتأهلة',
    cardIcon: Trophy,
    cardTitle: 'عقارثون 2025',
    cardSubtitle: 'برنامج الابتكار العقاري',
    highlightTitle: 'فوز فريق ملهمة ضمن الخمس المتأهلين',
    description:
      'سعداء بالإعلان عن فوز فريق ملهمة ضمن الخمس المتأهلين الأكثر إبداعاً وريادة في التكنولوجيا العقارية في المملكة العربية السعودية. هذا الإنجاز يعكس التميز التقني والابتكار في مجال التطوير العقاري.',
    details: [
      {
        icon: Users,
        text: 'فريق ملهمة',
      },
      {
        icon: MapPin,
        text: 'المملكة العربية السعودية',
      },
    ],
    cta: [
      {
        type: 'primary',
        label: 'عرض المشروع',
        href: 'https://real-estateconsultations.netlify.app',
      },
      {
        type: 'secondary',
        label: 'شهادة الإبتكار الملهم',
        href: '/Thun property certificate.pdf',
      },
      {
        type: 'badge',
        label: 'متأهل للنهائيات',
        icon: Trophy,
      },
    ],
    image: {
      src: '/aqarthon_app.jpg',
      alt: 'مشروع الرؤية العقارية - عقارثون',
      overlayTitle: 'الرؤية العقارية',
      overlaySubtitle: 'منصة الاستشارات العقارية المتطورة',
      className: 'object-cover',
    },
    featuresTitle: 'صور من الحدث',
    features: [
      {
        type: 'image',
        src: '/aqarthon.jpg',
        alt: 'صورة من عقارثون 1',
        caption: 'صورة من عقارثون 1',
      },
      {
        type: 'image',
        src: '/aqarthon2.jpg',
        alt: 'صورة من عقارثون 2',
        caption: 'صورة من عقارثون 2',
      },
      {
        type: 'image',
        src: '/aqarthon3.jpg',
        alt: 'صورة من عقارثون 3',
        caption: 'صورة من عقارثون 3',
      },
    ],
    stats: [
      {
        value: '5',
        label: 'الفرق المتأهلة',
        color: 'accent',
      },
      {
        value: '1',
        label: 'فريق ملهمة',
        color: 'primary',
      },
      {
        value: '100%',
        label: 'التميز التقني',
        color: 'secondary',
      },
    ],
  },
];

const NewsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(prevIndex => (prevIndex + 1) % NEWS_ITEMS.length);
    }, ROTATION_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  const activeNews = NEWS_ITEMS[activeIndex];
  const CardIcon = activeNews.cardIcon;

  return (
    <section
      id='news'
      className='py-20 bg-gradient-to-br from-dark-900 to-dark-950'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeNews.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className='space-y-12'
          >
            <div className='text-center'>
              <h2 className='section-title'>{activeNews.sectionTitle}</h2>
              <p className='text-xl text-gray-400 max-w-3xl mx-auto'>
                {activeNews.intro}
              </p>
              <div className='mt-6 flex justify-center space-x-3 space-x-reverse'>
                {NEWS_ITEMS.map((newsItem, index) => (
                  <button
                    key={newsItem.id}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2 w-8 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? 'bg-primary-500 w-12'
                        : 'bg-gray-700 hover:bg-primary-400'
                    }`}
                    aria-label={`عرض الخبر رقم ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Main News Card */}
            <div className='bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border border-primary-500/20 rounded-3xl p-8'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'>
                {/* Content */}
                <div className='space-y-6'>
                  <div className='flex items-center space-x-3 space-x-reverse'>
                    <div className='p-3 bg-primary-500/20 rounded-full'>
                      <CardIcon className='h-8 w-8 text-primary-500' />
                    </div>
                    <div>
                      <h3 className='text-2xl font-bold text-white'>
                        {activeNews.cardTitle}
                      </h3>
                      <p className='text-primary-400'>
                        {activeNews.cardSubtitle}
                      </p>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <h4 className='text-xl font-semibold text-white'>
                      {activeNews.highlightTitle}
                    </h4>
                    <p className='text-gray-300 leading-relaxed'>
                      {activeNews.description}
                    </p>
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    {activeNews.details.map(detail => {
                      const DetailIcon = detail.icon;
                      return (
                        <div
                          key={detail.text}
                          className='flex items-center space-x-3 space-x-reverse'
                        >
                          <DetailIcon className='h-5 w-5 text-secondary-500' />
                          <span className='text-gray-300'>{detail.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className='flex flex-wrap gap-4'>
                    {activeNews.cta.map(action => {
                      if (action.type === 'primary') {
                        return (
                          <a
                            key={action.label}
                            href={action.href}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='btn-primary flex items-center space-x-2 space-x-reverse'
                          >
                            <span>{action.label}</span>
                            <ExternalLink className='h-5 w-5' />
                          </a>
                        );
                      }

                      if (action.type === 'secondary') {
                        return (
                          <a
                            key={action.label}
                            href={action.href}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='btn-secondary flex items-center space-x-2 space-x-reverse'
                          >
                            <span>{action.label}</span>
                            <ExternalLink className='h-5 w-5' />
                          </a>
                        );
                      }

                      const BadgeIcon = action.icon;
                      return (
                        <div
                          key={action.label}
                          className='flex items-center space-x-2 space-x-reverse text-accent-500'
                        >
                          {BadgeIcon && <BadgeIcon className='h-5 w-5' />}
                          <span className='font-semibold'>{action.label}</span>
                        </div>
                      );
                    })}
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
                      src={activeNews.image.src}
                      alt={activeNews.image.alt}
                      className={`w-full h-80 ${
                        activeNews.image.className || 'object-cover'
                      }`}
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />
                    <div className='absolute bottom-4 left-4 right-4'>
                      <h5 className='text-white font-bold text-lg mb-2'>
                        {activeNews.image.overlayTitle}
                      </h5>
                      <p className='text-gray-200 text-sm'>
                        {activeNews.image.overlaySubtitle}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Gallery Section */}
            <div className='mb-4'>
              <h3 className='text-2xl font-bold text-white text-center mb-8'>
                {activeNews.featuresTitle}
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {activeNews.features.map((feature, index) => (
                  <motion.div
                    key={feature.title || feature.src}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {feature.type === 'image' ? (
                      <div className='relative overflow-hidden rounded-xl group cursor-pointer'>
                        <img
                          src={feature.src}
                          alt={feature.alt}
                          className='w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                        <div className='absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                          <p className='text-white text-sm font-medium'>
                            {feature.caption}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className='bg-dark-800/60 border border-primary-500/10 rounded-xl p-6 backdrop-blur-sm h-full'>
                        <h4 className='text-lg font-semibold text-white mb-3'>
                          {feature.title}
                        </h4>
                        <p className='text-gray-300 leading-relaxed'>
                          {feature.description}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Achievement Stats */}
            <div className='bg-gradient-to-r from-accent-500/10 to-primary-500/10 border border-accent-500/20 rounded-2xl p-8'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
                {activeNews.stats.map(stat => (
                  <div key={stat.label}>
                    <div
                      className={`text-4xl font-bold mb-2 ${
                        stat.color === 'accent'
                          ? 'text-accent-500'
                          : stat.color === 'primary'
                          ? 'text-primary-500'
                          : 'text-secondary-500'
                      }`}
                    >
                      {stat.value}
                    </div>
                    <div className='text-gray-300'>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default NewsSection;
