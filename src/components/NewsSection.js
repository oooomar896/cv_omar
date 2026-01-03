import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Trophy, MessageCircle, Calendar } from 'lucide-react';
import { dataService } from '../utils/dataService';

const ROTATION_INTERVAL = 7000;

const SECTION_TITLE = 'أحدث الأخبار المهنية';
const SECTION_INTRO =
  'أتابع في هذا القسم أبرز المستجدات المهنية والإنجازات التقنية التي أعمل عليها مع الفرق المختلفة.';

const NewsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dynamicNews, setDynamicNews] = useState([]);

  const loadData = useCallback(() => {
    const adminNews = dataService.getNews();
    const adapted = adminNews.map(item => ({
      id: item.id.toString(),
      cardIcon: MessageCircle,
      cardTitle: item.title,
      cardSubtitle: 'إنجاز مهني',
      highlightTitle: item.title,
      description: item.content,
      details: [
        { icon: Calendar, text: new Date(item.date).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }) }
      ],
      cta: [
        ...(item.link ? [{
          type: 'primary',
          label: 'عرض التفاصيل',
          href: item.link
        }] : []),
        ...(item.certificate ? [{
          type: 'secondary',
          label: 'عرض الشهادة',
          href: item.certificate
        }] : []),
        { type: 'badge', label: 'تحديث جديد', icon: Trophy }
      ],
      image: {
        src: item.image || '/images/news-placeholder.jpg',
        alt: item.title,
        overlayTitle: item.title,
        overlaySubtitle: new Date(item.date).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' }),
        className: item.image?.includes('logob.png') || item.image?.includes('logorest.png')
          ? 'object-contain bg-white/5 p-8'
          : 'object-cover'
      },
      featuresTitle: 'تفاصيل الخبر',
      features: [{ type: 'text', title: 'المحتوى', description: item.content }],
      stats: [{ value: 'جديد', label: 'تحديث لحظي', color: 'primary' }]
    }));
    setDynamicNews(adapted);
  }, []);

  useEffect(() => {
    loadData();
    window.addEventListener('storage_update', loadData);
    return () => window.removeEventListener('storage_update', loadData);
  }, [loadData]);

  const NEWS_ITEMS = dynamicNews;

  useEffect(() => {
    if (NEWS_ITEMS.length === 0) return;
    const timer = setInterval(() => {
      setActiveIndex(prevIndex => (prevIndex + 1) % NEWS_ITEMS.length);
    }, ROTATION_INTERVAL);

    return () => clearInterval(timer);
  }, [NEWS_ITEMS.length]);

  if (NEWS_ITEMS.length === 0) return null;
  const activeNews = NEWS_ITEMS[activeIndex];
  const CardIcon = activeNews.cardIcon;

  return (
    <section
      id='news'
      className='py-20 bg-gradient-to-br from-dark-900 to-dark-950'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='space-y-12'>
          <div className='text-center space-y-6'>
            <div>
              <h2 className='section-title'>{SECTION_TITLE}</h2>
              <p className='text-xl text-gray-400 max-w-3xl mx-auto'>
                {SECTION_INTRO}
              </p>
              <div className='mt-4 flex items-center justify-center gap-2 text-sm text-gray-500'>
                <span>الخبر {activeIndex + 1} من {NEWS_ITEMS.length}</span>
              </div>
            </div>
            <div className='flex justify-center items-center gap-4'>
              <button
                onClick={() => setActiveIndex((activeIndex - 1 + NEWS_ITEMS.length) % NEWS_ITEMS.length)}
                className='p-2 rounded-full bg-dark-800 hover:bg-primary-500/20 border border-gray-700 hover:border-primary-500 transition-all'
                aria-label='الخبر السابق'
              >
                <svg className='w-5 h-5 text-gray-400 hover:text-primary-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                </svg>
              </button>

              <div className='flex space-x-3 space-x-reverse'>
                {NEWS_ITEMS.map((newsItem, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={newsItem.id}
                      onClick={() => setActiveIndex(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${isActive
                        ? 'bg-primary-500 w-12'
                        : 'bg-gray-700 hover:bg-primary-400 w-8'
                        }`}
                      aria-label={`عرض الخبر رقم ${index + 1}`}
                    />
                  );
                })}
              </div>

              <button
                onClick={() => setActiveIndex((activeIndex + 1) % NEWS_ITEMS.length)}
                className='p-2 rounded-full bg-dark-800 hover:bg-primary-500/20 border border-gray-700 hover:border-primary-500 transition-all'
                aria-label='الخبر التالي'
              >
                <svg className='w-5 h-5 text-gray-400 hover:text-primary-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
              </button>
            </div>
          </div>

          <AnimatePresence mode='wait'>
            <motion.div
              key={activeNews.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6 }}
              className='space-y-12'
            >
              {/* Main News Card */}
              <div className='bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border border-primary-500/20 rounded-3xl p-8'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'>
                  {/* Content */}
                  <div className='space-y-6'>
                    <div className='flex items-start justify-between'>
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
                      {/* شارة جديد للأخبار الحديثة */}
                      {(() => {
                        const newsDate = new Date(NEWS_ITEMS.find(n => n.id === activeNews.id)?.details[0]?.text || Date.now());
                        const daysDiff = Math.floor((Date.now() - newsDate.getTime()) / (1000 * 60 * 60 * 24));
                        return daysDiff < 30 && (
                          <span className='px-3 py-1 bg-accent-500/20 text-accent-500 text-xs font-bold rounded-full border border-accent-500/30'>
                            جديد
                          </span>
                        );
                      })()}
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
                        className={`w-full h-80 ${activeNews.image.className || 'object-cover'
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
                        className={`text-4xl font-bold mb-2 ${stat.color === 'accent'
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
      </div>
    </section>
  );
};

export default NewsSection;
