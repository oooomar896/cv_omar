import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Code2, Smartphone, Globe, Database, Palette, Zap } from 'lucide-react';
import { dataService } from '../utils/dataService';

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [dynamicSkills, setDynamicSkills] = useState([]);

  const loadData = useCallback(() => {
    const adminSkills = dataService.getSkills();
    const adapted = adminSkills.map(s => ({
      ...s,
      level: parseInt(s.level) || 75,
      color: s.category === 'mobile' ? 'from-blue-500 to-indigo-500' :
        s.category === 'web' ? 'from-orange-500 to-red-500' :
          s.category === 'backend' ? 'from-green-500 to-emerald-500' :
            s.category === 'ai' ? 'from-purple-500 to-pink-500' :
              s.category === 'erp' ? 'from-amber-400 to-orange-600' :
                s.category === 'design' ? 'from-cyan-400 to-blue-500' :
                  'from-primary-500 to-secondary-500'
    }));
    setDynamicSkills(adapted);
  }, []);

  useEffect(() => {
    loadData();
    window.addEventListener('storage_update', loadData);
    return () => window.removeEventListener('storage_update', loadData);
  }, [loadData]);

  const skillCategories = [
    { id: 'all', name: 'الكل', icon: Code2 },
    { id: 'mobile', name: 'تطبيقات موبايل', icon: Smartphone },
    { id: 'web', name: 'الواجهات الأمامية', icon: Globe },
    { id: 'backend', name: 'البرمجة الخلفية', icon: Database },
    { id: 'ai', name: 'الذكاء الاصطناعي', icon: Zap },
    { id: 'erp', name: 'أنظمة ERP', icon: Zap },
    { id: 'design', name: 'التصميم', icon: Palette },
  ];

  const filteredSkills =
    activeCategory === 'all'
      ? dynamicSkills
      : dynamicSkills.filter(s => s.category === activeCategory);

  return (
    <section id='skills' className='py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <h2 className='section-title'>المهارات التقنية</h2>
          <p className='text-xl text-gray-400 max-w-3xl mx-auto'>
            مجموعة شاملة من المهارات التقنية المكتسبة عبر سنوات من الخبرة
            العملية
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
          {skillCategories.map(category => (
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

        {/* Skills Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        >
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className='card group hover:scale-105 transition-transform duration-300'
            >
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-white'>
                  {skill.name}
                </h3>
                <span className='text-sm text-gray-400'>{skill.level}%</span>
              </div>

              <div className='w-full bg-gray-700 rounded-full h-2 mb-4'>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`h-2 rounded-full bg-gradient-to-r ${skill.color}`}
                />
              </div>

              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-400'>مبتدئ</span>
                <span className='text-gray-400'>متقدم</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Skills */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='mt-20'
        >
          <h3 className='text-3xl font-bold text-center text-white mb-12'>
            مهارات إضافية
          </h3>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {[
              'Git & GitHub',
              'Docker',
              'REST APIs',
              'GraphQL',
              'Agile/Scrum',
              'JIRA',
              'Postman',
              'VS Code',
              'Linux/Unix',
              'AWS',
              'CI/CD',
              'Testing',
              'Performance Optimization',
              'Security',
              'SEO',
              'Analytics',
            ].map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className='text-center p-4 bg-dark-800 border border-gray-700 rounded-xl hover:border-primary-500/50 transition-colors duration-300'
              >
                <span className='text-gray-300 font-medium'>{skill}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
