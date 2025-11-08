'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { getContacts } from '@/lib/api/contacts';
import { ContactInfo } from '@/types/contacts';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Функция для форматирования режима работы
const formatWorkingHours = (workingHours: ContactInfo['working_hours']): string => {
  if (!workingHours || workingHours.length === 0) {
    return '';
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

  const formatDays = (days: number[]): string => {
    if (days.length === 0) return '';
    if (days.length === 1) return weekdays[days[0]];
    
    const sorted = [...days].sort((a, b) => a - b);
    const isConsecutive = sorted.every((day, index) => 
      index === 0 || day === sorted[index - 1] + 1
    );
    
    if (isConsecutive && sorted.length > 1) {
      return `${weekdays[sorted[0]]}-${weekdays[sorted[sorted.length - 1]]}`;
    } else {
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

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [contactData, setContactData] = useState<ContactInfo | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        const data = await getContacts();
        setContactData(data);
      };
      fetchData();
    }
  }, [isOpen]);

  const contactItems = [
    contactData?.phone && {
      icon: Phone,
      title: "Телефон",
      value: contactData.phone,
      link: `tel:${contactData.phone.replace(/[^\d+]/g, '')}`,
      color: "text-[#00B4D8]"
    },
    contactData?.whatsapp && {
      icon: MessageCircle,
      title: "WhatsApp",
      value: contactData.whatsapp,
      link: `https://wa.me/${contactData.whatsapp.replace(/[^\d]/g, '')}`,
      color: "text-[#00B4D8]"
    },
    contactData?.email && {
      icon: Mail,
      title: "Email",
      value: contactData.email,
      link: `mailto:${contactData.email}`,
      color: "text-[#00B4D8]"
    },
    contactData?.office_address && {
      icon: MapPin,
      title: "Адрес",
      value: contactData.office_address,
      link: null,
      color: "text-[#00B4D8]"
    },
    contactData?.working_hours && contactData.working_hours.length > 0 && {
      icon: Clock,
      title: "Время работы",
      value: formatWorkingHours(contactData.working_hours),
      link: null,
      color: "text-[#00B4D8]"
    }
  ].filter(Boolean) as Array<{
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: string;
    link: string | null;
    color: string;
  }>;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              duration: 0.3
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-[#0A192F]">
                  Связаться с нами
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-[#00B4D8] hover:bg-gray-50 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-6">
                  Свяжитесь с нами любым удобным способом. Мы готовы ответить на все ваши вопросы о недвижимости в Горном Алтае.
                </p>

                {/* Contact Info */}
                {contactItems.length > 0 ? (
                  <div className="space-y-4">
                    {contactItems.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                      >
                        <div className={`w-12 h-12 bg-[#00B4D8]/10 rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <item.icon className={`w-6 h-6 ${item.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">
                            {item.title}
                          </h3>
                          {item.link ? (
                            <a
                              href={item.link}
                              target={item.link.startsWith('http') ? '_blank' : undefined}
                              rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                              className="text-base font-semibold text-[#0A192F] hover:text-[#00B4D8] transition-colors break-all"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <p className={`text-base font-semibold text-[#0A192F] ${item.title === 'Время работы' ? 'whitespace-pre-line' : ''}`}>
                              {item.value}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Контактная информация недоступна</p>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100">
                <button
                  onClick={onClose}
                  className="w-full bg-[#00B4D8] hover:bg-[#0095c6] text-white font-bold py-3 px-6 rounded-2xl transition-colors"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
