'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Clock, Loader2, MessageCircle, ExternalLink, MapPin } from 'lucide-react';
import { getContacts } from '@/lib/api/contacts';
import { ContactInfo as ContactInfoType } from '@/types/contacts';

const ContactInfo: React.FC = () => {
  const [contactData, setContactData] = useState<ContactInfoType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await getContacts();
        if (data) {
          setContactData(data);
        } else {
          setError('Контактная информация недоступна');
        }
      } catch (err) {
        console.error('Error fetching contact data:', err);
        setError('Не удалось загрузить контактную информацию');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactData();
  }, []);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl p-8 shadow-lg"
      >
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-8 h-8 text-[#0095c6] animate-spin" />
        </div>
      </motion.div>
    );
  }

  // Если данных нет или ошибка - не показываем компонент
  if (error || !contactData) {
    return null;
  }

  // Форматирование режима работы
  const formatWorkingHours = (workingHours: typeof contactData.working_hours): string => {
    if (!workingHours || workingHours.length === 0) {
      return 'Режим работы не указан';
    }

    const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const hoursMap = new Map<string, number[]>();
    
    workingHours.forEach(wh => {
      if (wh.is_active && wh.start_time && wh.end_time) {
        const key = `${wh.start_time.substring(0, 5)}-${wh.end_time.substring(0, 5)}`;
        if (!hoursMap.has(key)) {
          hoursMap.set(key, []);
        }
        hoursMap.get(key)?.push(wh.day_of_week);
      } else if (!wh.is_active) {
        const key = 'Выходной';
        if (!hoursMap.has(key)) {
          hoursMap.set(key, []);
        }
        hoursMap.get(key)?.push(wh.day_of_week);
      }
    });

    // Функция для форматирования дней в диапазоны
    const formatDays = (days: number[]): string => {
      if (days.length === 0) return '';
      if (days.length === 1) return weekdays[days[0]];
      
      // Сортируем дни
      const sorted = [...days].sort((a, b) => a - b);
      
      // Проверяем, является ли последовательным диапазоном
      const isConsecutive = sorted.every((day, index) => 
        index === 0 || day === sorted[index - 1] + 1
      );
      
      if (isConsecutive && sorted.length > 1) {
        // Если последовательные дни - показываем диапазон
        return `${weekdays[sorted[0]]}-${weekdays[sorted[sorted.length - 1]]}`;
      } else {
        // Иначе показываем через запятую
        return sorted.map(d => weekdays[d]).join(', ');
      }
    };

    const lines: string[] = [];
    hoursMap.forEach((days, time) => {
      const formattedDays = formatDays(days);
      if (time === 'Выходной') {
        lines.push(`${formattedDays}: Выходной`);
      } else {
        lines.push(`${formattedDays}: ${time}`);
      }
    });

    return lines.join('\n');
  };

  const contactItems = [
    contactData.phone && {
      icon: <Phone className="w-6 h-6" />,
      title: 'Телефон',
      content: contactData.phone,
      link: `tel:${contactData.phone.replace(/[^\d+]/g, '')}`,
      isLink: true
    },
    contactData.whatsapp && {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'WhatsApp',
      content: contactData.whatsapp,
      link: `https://wa.me/${contactData.whatsapp.replace(/[^\d]/g, '')}`,
      isLink: true
    },
    contactData.email && {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      content: contactData.email,
      link: `mailto:${contactData.email}`,
      isLink: true
    },
    contactData.office_address && {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Адрес офиса',
      content: contactData.office_address,
      link: null,
      isLink: false
    },
    contactData.working_hours && contactData.working_hours.length > 0 && {
      icon: <Clock className="w-6 h-6" />,
      title: 'Режим работы',
      content: formatWorkingHours(contactData.working_hours),
      link: null,
      isLink: false
    }
  ].filter(Boolean) as Array<{
    icon: React.ReactElement;
    title: string;
    content: string;
    link: string | null;
    isLink: boolean;
  }>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-3xl p-8 shadow-lg"
    >
      <h2 className="text-2xl text-[#011315] mb-6 text-center font-bold">
        Свяжитесь для приобретения VIP-объектов
      </h2>
      
      <div className="space-y-4">
        {contactItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`flex items-start gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors ${
              item.isLink ? 'cursor-pointer hover:shadow-md' : ''
            }`}
            onClick={() => item.isLink && item.link && window.open(item.link, '_blank')}
          >
            <div className="w-12 h-12 bg-[#0095c6]/10 rounded-xl flex items-center justify-center text-[#0095c6] flex-shrink-0">
              {item.icon}
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-[#011315] mb-1">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 mb-1">
                {item.isLink ? (
                  <>
                    <p className="text-lg font-medium text-[#0095c6]">
                      {item.content}
                    </p>
                    <ExternalLink className="w-4 h-4 text-[#0095c6]" />
                  </>
                ) : (
                  <p className={`text-lg font-medium ${item.title === 'Режим работы' ? 'text-gray-700 whitespace-pre-line' : 'text-gray-700'}`}>
                    {item.content}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ContactInfo;
