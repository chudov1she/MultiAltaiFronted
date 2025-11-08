'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FooterData, MenuItem, SocialLink, Contact } from '@/types/site';
import { motion } from 'framer-motion';

// SVG иконки социальных сетей
const socialIcons: Record<string, React.ReactNode> = {
  vk: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.915 13.028c-.388-.49-.277-.708 0-1.146.005-.005 3.208-4.431 3.538-5.932l.002-.001c.164-.547 0-.949-.793-.949h-2.624c-.668 0-.976.345-1.141.731 0 0-1.336 3.198-3.226 5.271-.61.599-.892.791-1.225.791-.164 0-.419-.192-.419-.739V5.949c0-.656-.187-.949-.74-.949H9.161c-.419 0-.668.306-.668.591 0 .622.945.765 1.043 2.515v3.797c0 .832-.151.985-.486.985-.892 0-3.057-3.211-4.34-6.886-.259-.713-.512-1.001-1.185-1.001H.9c-.749 0-.9.345-.9.731 0 .682.892 4.073 4.148 8.553C6.318 17.343 9.374 19 12.154 19c1.671 0 1.875-.368 1.875-1.001 0-2.922-.151-3.198.686-3.198.388 0 1.056.192 2.616 1.667C19.114 18.217 19.407 19 20.405 19h2.624c.748 0 1.127-.368.909-1.094-.499-1.527-3.871-4.668-4.023-4.878z"/>
    </svg>
  ),
  telegram: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.77-1.17 3.35-1.37 3.73-1.37.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/>
    </svg>
  ),
  youtube: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
    </svg>
  ),
  whatsapp: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.05 4.91A9.816 9.816 0 0012.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.264 8.264 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 012.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.11-.23-.16-.48-.27z"/>
    </svg>
  )
};

interface FooterProps {
  contactData: Contact | null;
}

const Footer: React.FC<FooterProps> = ({ contactData }) => {
  // Используем только реальные данные, без fallback
  const contacts = contactData;

  // Формируем социальные ссылки из данных контактов
  const socialLinks: SocialLink[] = [];
  if (contacts?.telegram) {
    socialLinks.push({ id: "tg", name: "Telegram", icon: "telegram", url: contacts.telegram });
  }
  if (contacts?.whatsapp) {
    socialLinks.push({ 
      id: "wa", 
      name: "WhatsApp", 
      icon: "whatsapp", 
      url: `https://wa.me/${contacts.whatsapp.replace(/[^\d]/g, '')}` 
    });
  }

  const staticParts = {
    logo: {
      src: "/images/logo.png",
      alt: "МультиАлтай",
    },
    companyDescription:
      "Мы помогаем приобрести нашим партнерам земельные участки для строительства турбаз, отелей и частных домов в живописных местах Горного Алтая.",
    socialLinks,
    menu: [
      { id: 1, title: "Главная", path: "/" },
      { id: 2, title: "Каталог", path: "/catalog" },
      { id: 3, title: "Контакты", path: "/contacts" },
      { id: 4, title: "Канал", path: "/channel" },
    ],
    copyright: `© ${new Date().getFullYear()} МультиАлтай. Все права защищены.`,
    privacyPolicy: {
      text: "Политика конфиденциальности",
      url: "/privacy-policy",
    },
  };

  // Анимации в стиле сайта
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      y: 30, 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        duration: 0.6,
      },
    },
  };

  return (
    <footer className="bg-gray-50 text-[#011315] relative border-t border-gray-200 p-4 pb-25 md:pb-10">
      {/* Основной контент футера */}
      <div className="max-w-7xl mx-auto">
        <div className="pt-10 pb-10 sm:px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Логотип и описание компании */}
            <motion.div className="lg:col-span-5 flex flex-col items-start" variants={itemVariants}>
              <Link href="/" className="flex flex-col items-center mb-8 w-fit">
                                 <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden shadow-md hover:shadow-lg mb-2">
                   <Image 
                     src={staticParts.logo.src}
                     alt={staticParts.logo.alt}
                     width={48}
                     height={48}
                     className="object-contain"
                   />
                 </div>
                                 <span className="text-xs font-bold text-[#011315] tracking-wide text-center">
                   <span className="text-[#00B4D8]">МУЛЬТИ</span>
                   <span className="text-gray-800">АЛТАЙ</span>
                 </span>
              </Link>
              <p className="text-gray-600 mb-8 text-base leading-relaxed max-w-md sm:text-sm">
                {staticParts.companyDescription}
              </p>
              <div className="flex space-x-4">
                {staticParts.socialLinks.length > 0 && staticParts.socialLinks.map((social: SocialLink, index) => (
                  <motion.a 
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#0095c6] transition-all duration-300 bg-white p-3 rounded-2xl shadow-md hover:shadow-lg hover:scale-105"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    aria-label={social.name}
                  >
                    {socialIcons[social.icon] || social.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Навигация */}
            <motion.div className="lg:col-span-3" variants={itemVariants}>
              <h3 className="text-xl font-semibold mb-6 text-[#011315] sm:text-lg">Навигация</h3>
              <ul className="space-y-4">
                {staticParts.menu.map((item: MenuItem, index) => (
                  <motion.li 
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index + 0.2, duration: 0.5 }}
                  >
                    <Link 
                      href={item.path}
                      className="text-gray-600 hover:text-[#0095c6] transition-colors duration-300 inline-block"
                    >
                      {item.title}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Контакты */}
            {contacts && (
              <motion.div className="lg:col-span-4" variants={itemVariants}>
                <h3 className="text-xl font-semibold mb-6 text-[#011315] sm:text-lg">Контакты</h3>
                <ul className="space-y-4">
                  {/* Телефон */}
                  {contacts.phone && (
                    <motion.li 
                      className="flex items-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-10 h-10 flex items-center justify-center bg-[#0095c6] rounded-2xl mr-4 flex-shrink-0">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                        </svg>
                      </div>
                      <a href={`tel:${contacts.phone.replace(/[^\d+]/g, '')}`} className="text-gray-600 hover:text-[#0095c6] transition-colors duration-300">
                        {contacts.phone}
                      </a>
                    </motion.li>
                  )}
                  {/* Email */}
                  {contacts.email && (
                    <motion.li 
                      className="flex items-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-10 h-10 flex items-center justify-center bg-[#0095c6] rounded-2xl mr-4 flex-shrink-0">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                        </svg>
                      </div>
                      <a href={`mailto:${contacts.email}`} className="text-gray-600 hover:text-[#0095c6] transition-colors duration-300">
                        {contacts.email}
                      </a>
                    </motion.li>
                  )}
                </ul>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Нижняя часть футера */}
      <div className="border rounded-3xl border-gray-200 bg-white max-w-7xl mx-auto">
        <div className="mx-auto px-6 py-6 md:px-21 sm:px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.p 
              className="text-gray-500 text-sm mb-4 md:mb-0"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {staticParts.copyright}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Link 
                href={staticParts.privacyPolicy.url} 
                className="text-gray-500 hover:text-[#0095c6] text-sm transition-colors duration-300"
              >
                {staticParts.privacyPolicy.text}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 