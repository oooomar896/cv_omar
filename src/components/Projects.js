import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  Github,
  Play,
  Globe,
  Database,
  Smartphone,
  Zap,
} from 'lucide-react';
import { dataService } from '../utils/dataService';
import OptimizedImage from './common/OptimizedImage';

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [dynamicProjects, setDynamicProjects] = useState([]);

  // Helper to convert Google Drive links to direct image links
  const convertGoogleDriveLink = (url) => {
    if (!url) return url;
    try {
      if (url.includes('drive.google.com') || url.includes('share.google')) {
        let id = '';
        const match1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        // Handle simplified share.google links if they follow a pattern like share.google/ID
        // Note: share.google is often a redirect, but if it has an ID, we assume standard Drive ID
        const match3 = url.match(/share\.google\/([a-zA-Z0-9_-]+)/);

        if (match1) id = match1[1];
        else if (match2) id = match2[1];
        else if (match3) id = match3[1];

        if (id) {
          return `https://drive.google.com/uc?export=view&id=${id}`;
        }
      }
    } catch (e) {
      console.error('Error converting Google Drive link:', e);
    }
    return url;
  };

  const loadData = useCallback(() => {
    const adminDocs = dataService.getProjects();
    const adapted = adminDocs.map(p => ({
      ...p,
      title: p.name,
      description: p.desc,
      icon: p.category === 'web' ? Globe :
        p.category === 'mobile' ? Smartphone :
          p.category === 'open-source' ? Github :
            p.category === 'odoo' ? Database : Zap,
      color: p.category === 'web' ? 'from-blue-500 to-cyan-500' :
        p.category === 'mobile' ? 'from-purple-500 to-indigo-500' :
          p.category === 'odoo' ? 'from-emerald-500 to-teal-500' :
            p.category === 'open-source' ? 'from-gray-500 to-slate-700' :
              'from-amber-500 to-orange-500',
    }));
    setDynamicProjects(adapted);
  }, []);

  useEffect(() => {
    loadData();
    window.addEventListener('storage_update', loadData);
    return () => window.removeEventListener('storage_update', loadData);
  }, [loadData]);

  const categories = [
    { id: 'all', name: 'الكل', icon: Globe },
    { id: 'mobile', name: 'تطبيقات موبايل', icon: Smartphone },
    { id: 'web', name: 'مواقع إلكترونية', icon: Globe },
    { id: 'ai-bots', name: 'بوتات ذكاء اصطناعي', icon: Zap },
    { id: 'odoo', name: 'موديولات Odoo', icon: Database },
    { id: 'open-source', name: 'مشاريع مفتوحة', icon: Github },
  ];

  const filteredProjects =
    activeCategory === 'all'
      ? dynamicProjects
      : dynamicProjects.filter(p => p.category === activeCategory);

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
              className={`flex items-center space-x-2 space-x-reverse px-6 py-3 rounded-full border transition-all duration-300 ${activeCategory === category.id
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
                    <OptimizedImage
                      src={convertGoogleDriveLink(project.image)}
                      alt={project.title}
                      className={`w-full h-full ${project.imageClass || 'object-cover'
                        } group-hover:scale-110 transition-transform duration-300`}
                    />
                    {/* Fallback overlay handled by OptimizedImage error state? 
                       Actually OptimizedImage shows error text. 
                       The previous code had a fallback overlay if error. 
                       OptimizedImage doesn't expose error state to parent easily.
                       However, for now let's use OptimizedImage.
                       If the user wants the icon fallback on error, we might need to modify OptimizedImage or keep the old structure for fallback.
                       Let's trust OptimizedImage for now, it shows a grey box with text.
                       To keep the icon fallback, we might need to modify OptimizedImage to accept a fallback component.
                       But simplicity is better.
                    */}
                  </>
                ) : (
                  <div className='w-full h-full flex items-center justify-center'>
                    <OptimizedImage
                      src='/images/projects/placeholder.svg' // Assuming this doesn't exist, it will fallback to error in OptimizedImage
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
