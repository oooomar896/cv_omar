import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  Linkedin,
  Github,
  MapPin,
  Send,
  Copy,
  Check,
  MessageCircle,
  Download,
} from 'lucide-react';

const Contact = () => {
  const [copiedField, setCopiedField] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const contactInfo = [
    {
      icon: Mail,
      title: 'البريد الإلكتروني',
      value: 'oooomar123450@gmail.com',
      link: 'mailto:oooomar123450@gmail.com',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Phone,
      title: 'رقم الهاتف',
      value: '+966-55-853-9717',
      link: 'tel:+966558539717',
      color: 'from-green-500 to-blue-500',
    },
    {
      icon: Linkedin,
      title: 'LinkedIn',
      value: 'omar-hamid-288385235',
      link: 'https://linkedin.com/in/omar-hamid-288385235',
      color: 'from-blue-600 to-blue-700',
    },
    {
      icon: Github,
      title: 'GitHub',
      value: 'oooomar896',
      link: 'https://github.com/oooomar896',
      color: 'from-gray-500 to-gray-700',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: '+966-55-853-9717',
      link: 'https://wa.me/966558539717',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleInputChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // You can add email service integration here
  };

  return (
    <section id='contact' className='py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <h2 className='section-title'>تواصل معي</h2>
          <p className='text-xl text-gray-400 max-w-3xl mx-auto'>
            هل لديك مشروع تريد مناقشته؟ أو تريد معرفة المزيد عن خدماتي؟ لا تتردد
            في التواصل معي
          </p>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='space-y-6'
          >
            <h3 className='text-2xl font-bold text-white mb-8'>
              معلومات التواصل
            </h3>

            {contactInfo.map((contact, index) => (
              <motion.div
                key={contact.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className='flex items-center space-x-4 space-x-reverse p-4 bg-dark-800 border border-gray-700 rounded-xl hover:border-primary-500/50 transition-colors duration-300'
              >
                <div
                  className={`p-3 bg-gradient-to-br ${contact.color} rounded-full`}
                >
                  <contact.icon className='h-6 w-6 text-white' />
                </div>

                <div className='flex-1'>
                  <h4 className='font-semibold text-white mb-1'>
                    {contact.title}
                  </h4>
                  <p className='text-gray-400'>{contact.value}</p>
                </div>

                <div className='flex space-x-2 space-x-reverse'>
                  <a
                    href={contact.link}
                    target={
                      contact.link.startsWith('http') ? '_blank' : '_self'
                    }
                    rel={
                      contact.link.startsWith('http')
                        ? 'noopener noreferrer'
                        : ''
                    }
                    className='p-2 bg-dark-700 rounded-full hover:bg-primary-500/20 transition-colors duration-300'
                  >
                    <contact.icon className='h-4 w-4 text-gray-400 hover:text-primary-500' />
                  </a>

                  <button
                    onClick={() =>
                      copyToClipboard(contact.value, contact.title)
                    }
                    className='p-2 bg-dark-700 rounded-full hover:bg-primary-500/20 transition-colors duration-300'
                  >
                    {copiedField === contact.title ? (
                      <Check className='h-4 w-4 text-green-500' />
                    ) : (
                      <Copy className='h-4 w-4 text-gray-400 hover:text-primary-500' />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className='p-4 bg-dark-800 border border-gray-700 rounded-xl hover:border-primary-500/50 transition-colors duration-300'
            >
              <div className='flex items-center space-x-4 space-x-reverse'>
                <div className='p-3 bg-gradient-to-br from-accent-500 to-yellow-500 rounded-full'>
                  <MapPin className='h-6 w-6 text-white' />
                </div>
                <div>
                  <h4 className='font-semibold text-white mb-1'>الموقع</h4>
                  <p className='text-gray-400'>المملكة العربية السعودية</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='space-y-6'
          >
            <div className='flex items-center justify-between mb-8'>
              <h3 className='text-2xl font-bold text-white'>أرسل رسالة</h3>
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/cv.pdf';
                  link.download = 'Omar_Hamid_Al-Adini_CV.pdf';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className='btn-primary flex items-center space-x-2 space-x-reverse text-sm'
              >
                <Download className='h-4 w-4' />
                <span>تحميل السيرة الذاتية</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                <div>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-300 mb-2'
                  >
                    الاسم الكامل
                  </label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-3 bg-dark-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors duration-300'
                    placeholder='أدخل اسمك الكامل'
                  />
                </div>

                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-300 mb-2'
                  >
                    البريد الإلكتروني
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-3 bg-dark-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors duration-300'
                    placeholder='أدخل بريدك الإلكتروني'
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='subject'
                  className='block text-sm font-medium text-gray-300 mb-2'
                >
                  الموضوع
                </label>
                <input
                  type='text'
                  id='subject'
                  name='subject'
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className='w-full px-4 py-3 bg-dark-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors duration-300'
                  placeholder='أدخل موضوع الرسالة'
                />
              </div>

              <div>
                <label
                  htmlFor='message'
                  className='block text-sm font-medium text-gray-300 mb-2'
                >
                  الرسالة
                </label>
                <textarea
                  id='message'
                  name='message'
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className='w-full px-4 py-3 bg-dark-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors duration-300 resize-none'
                  placeholder='اكتب رسالتك هنا...'
                />
              </div>

              <button
                type='submit'
                className='w-full btn-primary flex items-center justify-center space-x-2 space-x-reverse'
              >
                <Send className='h-5 w-5' />
                <span>إرسال الرسالة</span>
              </button>
            </form>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mt-16'
        >
          <div className='bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20 rounded-2xl p-8'>
            <h3 className='text-2xl font-bold text-white mb-4'>متاح للعمل</h3>
            <p className='text-lg text-gray-300 mb-6'>
              أنا متاح للعمل على مشاريع جديدة ومثيرة. سواء كنت تريد تطبيق
              موبايل، موقع إلكتروني، أو نظام إدارة، يمكنني مساعدتك في تحقيق
              رؤيتك.
            </p>
            <div className='flex flex-wrap justify-center gap-4'>
              <span className='px-4 py-2 bg-green-500/20 text-green-400 rounded-full border border-green-500/30'>
                متاح للعمل
              </span>
              <span className='px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30'>
                استجابة سريعة
              </span>
              <span className='px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30'>
                دعم فني
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
