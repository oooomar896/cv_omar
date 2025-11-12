import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  Github,
  Play,
  Globe,
  Database,
  Smartphone,
} from 'lucide-react';

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'الكل', icon: Globe },
    { id: 'mobile', name: 'تطبيقات موبايل', icon: Smartphone },
    { id: 'web', name: 'مواقع إلكترونية', icon: Globe },
    { id: 'odoo', name: 'موديولات Odoo', icon: Database },
    { id: 'open-source', name: 'مشاريع مفتوحة', icon: Github },
  ];

  const projects = {
    mobile: [
      {
        title: 'تطبيق المقايضة - Swap App',
        description: 'تطبيق مقايضة متقدم مع نظام إدارة ذكي',
        link: 'https://play.google.com/store/apps/details?id=com.molhimah.swap',
        icon: Play,
        color: 'from-blue-500 to-cyan-500',
        image: '/images/projects/swap-app.svg',
      },
      {
        title: 'مزادات لايف - Auction Live',
        description: 'منصة مزادات مباشرة مع دعم الفيديو',
        link: 'https://play.google.com/store/apps/details?id=com.mulhmah_auctionlive',
        icon: Play,
        color: 'from-green-500 to-blue-500',
        image: '/images/projects/auction-live.svg',
      },
      {
        title: 'التطبيق الخيري - Charity App',
        description: 'تطبيق للتبرعات والمشاريع الخيرية',
        link: 'https://www.play.google.com/store/apps/details?id=com.charity_show',
        icon: Play,
        color: 'from-purple-500 to-pink-500',
        image: '/images/projects/charity-app.svg',
      },
    ],
    web: [
      {
        title: 'YourHelp - مساعدك',
        description: 'منصة حجز الخدمات والمساعدة عبر الإنترنت',
        link: 'https://yourhelp.netlify.app/booking',
        icon: Globe,
        color: 'from-teal-500 to-emerald-500',
        image: '/images/projects/yourhelp.svg',
      },
      {
        title: 'الأخبار الاستثمارية - شركة باكورة',
        description:
          'منصة استثمارية تبرز أحدث الأخبار والبيانات المالية لشركة باكورة بطريقة تفاعلية وواضحة',
        link: 'https://investor-bacura.netlify.app/',
        icon: Globe,
        color: 'from-blue-600 to-cyan-500',
        image: '/images/projects/logob.png',
        imageClass: 'object-contain bg-white/10 p-6',
      },
      {
        title: 'العروض العقارية - Real Estate Offers',
        description:
          'منصة العروض العقارية الرائدة في المملكة العربية السعودية مع خريطة تفاعلية',
        link: 'https://real-estate-offers.netlify.app/',
        icon: Globe,
        color: 'from-emerald-500 to-teal-500',
        image: '/images/projects/real-estate-offers.svg',
      },
      {
        title: 'كنشار - Kenshar',
        description: 'منصة متكاملة لإنشاء وإدارة منصات استشارية مخصصة للشركات',
        link: 'https://korcher2.netlify.app/',
        icon: Globe,
        color: 'from-indigo-500 to-purple-500',
        image: '/images/projects/kenshar.svg',
      },
      {
        title: 'الرؤية العقارية',
        description: 'منصة للاستشارات العقارية',
        link: 'https://real-estateconsultations.netlify.app',
        icon: Globe,
        color: 'from-orange-500 to-red-500',
        image: '/images/projects/real-estate.svg',
      },
      {
        title: 'مزادلي - Mzadly.com',
        description: 'منصة مزادات إلكترونية متكاملة',
        link: 'https://mzadlly.netlify.app/',
        icon: Globe,
        color: 'from-green-500 to-blue-500',
        image: '/images/projects/mzadly.svg',
      },
      {
        title: 'ملهمة العقارية - Molhimah.sa',
        description: 'موقع عقاري احترافي',
        link: 'https://molhimah.sa',
        icon: Globe,
        color: 'from-blue-500 to-purple-500',
        image: '/images/projects/molhimah.svg',
      },
    ],
    odoo: [
      {
        title: 'نظام إدارة الأملاك',
        description: 'إدارة العقارات والعقود والمستأجرين',
        link: 'https://github.com/oooomar896/module-Real-state',
        icon: Github,
        color: 'from-green-500 to-blue-500',
        image: '/images/projects/real-estate-module.svg',
      },
      {
        title: 'نظام حجز القاعات',
        description: 'تقويم وجدولة الاجتماعات',
        link: 'https://github.com/oooomar896/module-room-bookung',
        icon: Github,
        color: 'from-blue-500 to-cyan-500',
        image: '/images/projects/room-booking.svg',
      },
      {
        title: 'نظام الموارد البشرية',
        description: 'إدارة الموظفين والحضور والإجازات',
        link: 'https://github.com/oooomar896/mangemen_HR',
        icon: Github,
        color: 'from-purple-500 to-pink-500',
        image: '/images/projects/hr-system.svg',
      },
      {
        title: 'نظام المزادات',
        description: 'ربط موقع المزادات مع Odoo',
        link: 'https://github.com/oooomar896/Website_Auction_odoo',
        icon: Github,
        color: 'from-orange-500 to-yellow-500',
        image: '/images/projects/auction-system.svg',
      },
    ],
    'open-source': [
      {
        title: 'تطبيق القهوة (UI/Animation)',
        description: 'تطبيق قهوة مع واجهة متحركة متقدمة',
        link: 'https://github.com/oooomar896/coffee_app',
        icon: Github,
        color: 'from-brown-500 to-orange-500',
        image: '/images/projects/coffee-app.svg',
      },
      {
        title: 'متجر الكهرباء',
        description: 'تطبيق متجر إلكتروني للمعدات الكهربائية',
        link: 'https://github.com/oooomar896/electrical_store_app',
        icon: Github,
        color: 'from-yellow-500 to-orange-500',
        image: '/images/projects/electrical-store.svg',
      },
      {
        title: 'الآلة الحاسبة',
        description: 'آلة حاسبة متقدمة مع واجهة جميلة',
        link: 'https://github.com/oooomar896/Calculter',
        icon: Github,
        color: 'from-gray-500 to-blue-500',
        image: '/images/projects/calculator.svg',
      },
      {
        title: 'تطبيق اللاعبين',
        description: 'تطبيق لإدارة فرق الألعاب',
        link: 'https://github.com/oooomar896/players',
        icon: Github,
        color: 'from-green-500 to-blue-500',
        image: '/images/projects/players-app.svg',
      },
      {
        title: 'تطبيق الملاحظات',
        description: 'تطبيق ملاحظات متقدم مع مزامنة',
        link: 'https://github.com/oooomar896/note2',
        icon: Github,
        color: 'from-purple-500 to-pink-500',
        image: '/images/projects/notes-app.svg',
      },
    ],
  };

  const filteredProjects =
    activeCategory === 'all'
      ? Object.values(projects).flat()
      : projects[activeCategory] || [];

  return (
    <section id='projects' className='py-20 bg-dark-900/50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <h2 className='section-title'>المشاريع</h2>
          <p className='text-xl text-gray-400 max-w-3xl mx-auto'>
            مجموعة متنوعة من المشاريع المنجزة في مختلف المجالات التقنية
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='flex flex-wrap justify-center gap-4 mb-12'
        >
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 space-x-reverse px-6 py-3 rounded-full border transition-all duration-300 ${
                activeCategory === category.id
                  ? 'border-primary-500 bg-primary-500/20 text-primary-500'
                  : 'border-gray-600 text-gray-400 hover:border-primary-500 hover:text-primary-500'
              }`}
            >
              <category.icon className='h-5 w-5' />
              <span>{category.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className='card group hover:scale-105 transition-all duration-300'
            >
              <div className='w-full h-48 rounded-t-xl mb-4 overflow-hidden relative'>
                {project.image ? (
                  <>
                    <img
                      src={project.image}
                      alt={project.title}
                      className={`w-full h-full ${
                        project.imageClass || 'object-cover'
                      } group-hover:scale-110 transition-transform duration-300`}
                      onError={e => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div
                      className={`w-full h-full bg-gradient-to-br ${project.color} flex items-center justify-center absolute inset-0`}
                      style={{ display: 'none' }}
                    >
                      <project.icon className='h-12 w-12 text-white' />
                    </div>
                  </>
                ) : (
                  <div className='w-full h-full flex items-center justify-center'>
                    <img
                      src='/images/projects/placeholder.svg'
                      alt='صورة افتراضية'
                      className='w-full h-full object-cover opacity-50'
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${project.color} flex items-center justify-center`}
                    >
                      <project.icon className='h-12 w-12 text-white' />
                    </div>
                  </div>
                )}
              </div>

              <div className='space-y-4'>
                <h3 className='text-xl font-bold text-white group-hover:text-primary-400 transition-colors duration-300'>
                  {project.title}
                </h3>

                <p className='text-gray-400 leading-relaxed'>
                  {project.description}
                </p>

                <div className='flex items-center justify-between'>
                  <a
                    href={project.link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center space-x-2 space-x-reverse text-primary-500 hover:text-primary-400 transition-colors duration-300'
                  >
                    <span>عرض المشروع</span>
                    <ExternalLink className='h-4 w-4' />
                  </a>

                  <div className='flex space-x-2 space-x-reverse'>
                    {project.icon === Github && (
                      <a
                        href={project.link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='p-2 bg-dark-700 rounded-full hover:bg-primary-500/20 transition-colors duration-300'
                      >
                        <Github className='h-4 w-4 text-gray-400 hover:text-primary-500' />
                      </a>
                    )}
                    {project.icon === Play && (
                      <a
                        href={project.link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='p-2 bg-dark-700 rounded-full hover:bg-primary-500/20 transition-colors duration-300'
                      >
                        <Play className='h-4 w-4 text-gray-400 hover:text-primary-500' />
                      </a>
                    )}
                    {project.icon === Globe && (
                      <a
                        href={project.link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='p-2 bg-dark-700 rounded-full hover:bg-primary-500/20 transition-colors duration-300'
                      >
                        <Globe className='h-4 w-4 text-gray-400 hover:text-primary-500' />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mt-16'
        >
          <div className='bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20 rounded-2xl p-8'>
            <h3 className='text-2xl font-bold text-white mb-4'>
              هل تريد مشروع مماثل؟
            </h3>
            <p className='text-lg text-gray-300 mb-6'>
              يمكنني مساعدتك في بناء مشروعك التقني باحترافية عالية
            </p>
            <a
              href='#contact'
              className='btn-primary inline-flex items-center space-x-2 space-x-reverse'
            >
              <span>تواصل معي الآن</span>
              <ExternalLink className='h-5 w-5' />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
