'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Users, Phone, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';
import { getContacts } from '@/lib/api/contacts';
import { ContactInfo } from '@/types/contacts';

const PrivacyPolicyContent: React.FC = () => {
  const [contactData, setContactData] = useState<ContactInfo | null>(null);

  useEffect(() => {
    const fetchContactData = async () => {
      const data = await getContacts();
      setContactData(data);
    };
    fetchContactData();
  }, []);

  const sections = [
    {
      icon: Shield,
      title: "Общие положения",
      content: "Настоящая политика конфиденциальности определяет порядок обработки и защиты информации о физических лицах, использующих сервисы сайта МультиАлтай. Мы обязуемся защищать вашу конфиденциальность и обеспечивать безопасность персональных данных.",
      color: "text-[#00B4D8]"
    },
    {
      icon: Eye,
      title: "Собираемая информация",
      content: "Мы собираем только необходимую информацию для предоставления качественных услуг: контактные данные, предпочтения по участкам, техническая информация о посещении сайта. Все данные собираются с вашего согласия.",
      color: "text-[#00B4D8]"
    },
    {
      icon: Lock,
      title: "Защита данных",
      content: "Ваши персональные данные защищены современными технологиями шифрования. Мы используем многоуровневую систему безопасности и регулярно проводим аудит защитных механизмов.",
      color: "text-[#00B4D8]"
    },
    {
      icon: Users,
      title: "Права пользователей",
      content: "Вы имеете полное право на доступ, исправление, удаление ваших данных. Также можете отозвать согласие на обработку в любое время. Мы уважаем ваши права и обеспечиваем их соблюдение.",
      color: "text-[#00B4D8]"
    },
    {
      icon: FileText,
      title: "Использование данных",
      content: "Собранная информация используется исключительно для улучшения качества услуг, обработки заявок и предоставления персонализированных предложений по участкам в Горном Алтае.",
      color: "text-[#00B4D8]"
    },
    {
      icon: Calendar,
      title: "Обновления политики",
      content: "Политика конфиденциальности может обновляться. Все изменения публикуются на этой странице с указанием даты. Мы рекомендуем периодически знакомиться с актуальной версией.",
      color: "text-[#00B4D8]"
    }
  ];

  // Формируем контактную информацию из данных backend
  const contactInfo = [
    contactData?.phone && {
      icon: Phone,
      title: "Телефон",
      value: contactData.phone,
      link: `tel:${contactData.phone.replace(/[^\d+]/g, '')}`
    },
    contactData?.email && {
      icon: Mail,
      title: "Email",
      value: contactData.email,
      link: `mailto:${contactData.email}`
    }
  ].filter(Boolean) as Array<{
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: string;
    link: string;
  }>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#0A192F]/5">
      {/* Hero Section */}
      <section className="bg-[#0A192F] text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="w-20 h-20 bg-[#00B4D8]/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Shield className="w-10 h-10 text-[#00B4D8]" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Политика конфиденциальности
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Мы ценим вашу конфиденциальность и обеспечиваем безопасность персональных данных
            </p>
            <div className="mt-8 flex items-center justify-center gap-4 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Последнее обновление: Август 2025</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Основные разделы */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="w-16 h-16 bg-[#00B4D8]/10 rounded-2xl flex items-center justify-center mb-6">
                    <section.icon className={`w-8 h-8 ${section.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-[#0A192F] mb-4">
                    {section.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {section.content}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Дополнительная информация */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
            >
              <h3 className="text-2xl font-bold text-[#0A192F] mb-6 text-center">
                Дополнительные гарантии
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-[#0A192F]">Мы гарантируем:</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#00B4D8] rounded-full mt-2 flex-shrink-0"></div>
                      <span>Не передаем данные третьим лицам</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#00B4D8] rounded-full mt-2 flex-shrink-0"></div>
                      <span>Используем данные только по назначению</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#00B4D8] rounded-full mt-2 flex-shrink-0"></div>
                      <span>Обеспечиваем безопасность хранения</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-[#0A192F]">Ваши права:</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#00B4D8] rounded-full mt-2 flex-shrink-0"></div>
                      <span>Получить копию ваших данных</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#00B4D8] rounded-full mt-2 flex-shrink-0"></div>
                      <span>Исправить неточную информацию</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#00B4D8] rounded-full mt-2 flex-shrink-0"></div>
                      <span>Удалить данные по запросу</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyContent;
