'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, Clock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Contact, WorkingHours } from '@/types/site'; // Импортируем тип Contact
import { getApiBaseUrl } from '@/lib/api/utils';

// Определяем тип пропсов
interface ContactViewProps {
  contactData: Contact | null;
}

// Вспомогательная функция для форматирования рабочего времени
const formatWorkingHours = (workingHours: WorkingHours[] | undefined): string => {
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

// Define submission status type
type SubmissionStatus = 'idle' | 'loading' | 'success' | 'error';

const ContactView: React.FC<ContactViewProps> = ({ contactData }) => {

  // --- DEBUG LOG (Component Start) ---
  console.log("[ContactView - Component] Received contactData prop:", JSON.stringify(contactData, null, 2));
  const isClient = typeof window !== 'undefined';
  console.log(`[ContactView - Component] Running on ${isClient ? 'CLIENT' : 'SERVER'}`);
  // --- END DEBUG LOG ---

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // Функция форматирования телефона
  const formatPhoneNumber = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    let formatted = numbers;
    if (numbers.startsWith('8') && numbers.length >= 11) {
      formatted = '7' + numbers.slice(1);
    }
    if (formatted.startsWith('7') && formatted.length === 11) {
      return `+7 (${formatted.slice(1, 4)}) ${formatted.slice(4, 7)}-${formatted.slice(7, 9)}-${formatted.slice(9, 11)}`;
    }
    if (formatted.length === 10) {
      return `+7 (${formatted.slice(0, 3)}) ${formatted.slice(3, 6)}-${formatted.slice(6, 8)}-${formatted.slice(8, 10)}`;
    }
    return value;
  };

  // Функция для получения чистого номера телефона в формате +7XXXXXXXXXX
  const getCleanPhoneNumber = (phone: string): string => {
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('8') && clean.length >= 11) {
      clean = '7' + clean.slice(1);
    }
    if (clean.length === 10) {
      clean = '7' + clean;
    }
    return clean.startsWith('+') ? clean : `+${clean}`;
  };

  // Обработчик изменения телефона
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatPhoneNumber(value);
    setFormData(prev => ({ ...prev, phone: formatted }));
    if (status === 'error' || status === 'success') {
      setStatus('idle');
      setStatusMessage('');
    }
  };

  // Обработчик вставки из буфера обмена
  const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const formatted = formatPhoneNumber(pastedText);
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  // Обработчик нажатия клавиш для корректного удаления
  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const currentNumbers = formData.phone.replace(/\D/g, '');
      if (currentNumbers.length > 0) {
        const newNumbers = currentNumbers.slice(0, -1);
        if (newNumbers.length > 0) {
          setFormData(prev => ({ ...prev, phone: formatPhoneNumber(newNumbers) }));
        } else {
          setFormData(prev => ({ ...prev, phone: '' }));
        }
        e.preventDefault();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Для телефона используем специальный обработчик
    if (name === 'phone') {
      return; // Обрабатывается через handlePhoneChange
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    if (status === 'error' || status === 'success') {
        setStatus('idle');
        setStatusMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setStatusMessage('');

    // Валидация обязательных полей
    if (!formData.name || !formData.phone) {
        setStatus('error');
        setStatusMessage('Пожалуйста, заполните обязательные поля (Имя, Телефон).');
        return;
    }

    // Проверяем, что номер телефона содержит достаточно цифр
    const cleanPhone = getCleanPhoneNumber(formData.phone);
    const phoneDigits = cleanPhone.replace(/\D/g, '');
    if (phoneDigits.length < 11) {
        setStatus('error');
        setStatusMessage('Пожалуйста, введите корректный номер телефона (минимум 11 цифр).');
        return;
    }

    // Backend требует email и message (обязательные поля)
    if (!formData.email || formData.email.trim() === '') {
        setStatus('error');
        setStatusMessage('Пожалуйста, укажите электронную почту.');
        return;
    }

    // Простая валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
        setStatus('error');
        setStatusMessage('Пожалуйста, введите корректный адрес электронной почты.');
        return;
    }

    if (!formData.message || formData.message.trim() === '') {
        setStatus('error');
        setStatusMessage('Пожалуйста, укажите сообщение.');
        return;
    }

    // Prepare data for API
    const requestData = {
      name: formData.name.trim(),
      phone: cleanPhone, // Format: +7XXXXXXXXXX
      email: formData.email.trim(),
      message: formData.message.trim(),
    };

    try {
      const baseUrl = getApiBaseUrl();
      const endpoint = '/v1/applications/contact';
      
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        let errorMessage = 'Ошибка при отправке заявки';
        try {
          const errorData = await response.json();
          // Backend может вернуть массив ошибок или объект с message
          if (Array.isArray(errorData.message)) {
            errorMessage = errorData.message.join(', ');
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // Если не удалось распарсить JSON, используем статус
          errorMessage = `Ошибка ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      setStatus('success');
      setStatusMessage('Ваше сообщение успешно отправлено! Мы скоро свяжемся с вами.');
      setFormData({ name: '', phone: '', email: '', message: '' });

    } catch (error) {
      console.error("Contact form submission error:", error);
      setStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'Произошла ошибка при отправке. Пожалуйста, проверьте введенные данные или попробуйте позже.');
    } 
  };

  // Анимации для колонок
  const columnVariantsLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { delay: 0.3, duration: 0.6 }
    }
  };
  const columnVariantsRight = {
    hidden: { opacity: 0, x: 30 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { delay: 0.4, duration: 0.6 }
    }
  };
  const mapVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5, // Чуть позже колонок
        duration: 0.6
      }
    }
  };

  // Если данных нет - не показываем компонент
  if (!contactData) {
    return null;
  }

  const displayWorkingHours = formatWorkingHours(contactData.working_hours);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pb-16 opacity-0 md:pb-24"
    >

      {/* Основной контент */}
      <div className="content-container -mt-16 md:-mt-20 relative z-10">
        {/* Общий контейнер без ограничения max-width */}
        <div className="mx-auto bg-white rounded-2xl md:rounded-[30px] shadow-xl p-6 sm:p-8 md:p-12 lg:p-16">
          
          {/* --- Сетка: Информация (слева) и Форма (справа) --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-20 mb-12 md:mb-16 lg:mb-20">
            
            {/* Колонка 1: Контактная информация - Новый порядок и режим работы */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={columnVariantsLeft}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-5 md:mb-6">Свяжитесь с нами</h2>
              <p className="text-base text-gray-600 mb-8 md:mb-10">Мы всегда рады ответить на ваши вопросы. Вы можете связаться с нами любым удобным способом.</p>
              
              <div className="space-y-6 md:space-y-7">
                {/* Телефон */}
                {contactData.phone && (
                  <div className="flex items-start">
                    <Phone size={22} className="text-[#0095c6] mr-3 md:mr-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-1">Телефон</h3>
                      <a href={`tel:${contactData.phone.replace(/[^\d+]/g, '')}`} className="text-sm md:text-base text-[#0095c6] hover:text-[#007a9e] block">{contactData.phone}</a>
                    </div>
                  </div>
                )}
                
                {/* WhatsApp */}
                {contactData.whatsapp && (
                  <>
                    <hr className="border-gray-200 my-3" />
                    <div className="flex items-center">
                      <FaWhatsapp size={22} className="text-[#0095c6] mr-3 md:mr-4 flex-shrink-0" />
                      <a 
                        href={`https://wa.me/${contactData.whatsapp.replace(/[^\d]/g, '')}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm md:text-base text-[#0095c6] hover:text-[#007a9e] inline-flex items-center"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </>
                )}
                
                {/* Email */}
                {contactData.email && (
                  <>
                    <hr className="border-gray-200 my-3" />
                    <div className="flex items-start">
                      <Mail size={22} className="text-[#0095c6] mr-3 md:mr-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-1">Email</h3>
                        <a href={`mailto:${contactData.email}`} className="text-sm md:text-base text-[#0095c6] hover:text-[#007a9e]">{contactData.email}</a>
                      </div>
                    </div>
                  </>
                )}

                {/* Адрес */}
                {contactData.office_address && (
                  <>
                    <hr className="border-gray-200 my-3" />
                    <div className="flex items-start">
                      <MapPin size={22} className="text-[#0095c6] mr-3 md:mr-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-1">Адрес офиса</h3>
                        <p className="text-sm md:text-base text-gray-500">{contactData.office_address}</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Режим работы */}
                {contactData.working_hours && contactData.working_hours.length > 0 && displayWorkingHours !== 'Режим работы не указан' && (
                  <>
                    <hr className="border-gray-200 my-3" />
                    <div className="flex items-start">
                      <Clock size={22} className="text-[#0095c6] mr-3 md:mr-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-1">Режим работы</h3>
                        <p className="text-sm md:text-base text-gray-500 whitespace-pre-line">{displayWorkingHours}</p>
                      </div>
                    </div>
                  </>
                )}

              </div>
            </motion.div>

            {/* Колонка 2: Форма обратной связи */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={columnVariantsRight}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-5 md:mb-6">Отправьте нам сообщение</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                <div>
                  <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-1.5">Имя *</label>
                  <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} disabled={status === 'loading' || status === 'success'} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#0095c6] focus:border-[#0095c6] transition duration-150 ease-in-out text-base" placeholder="Ваше имя"/>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-base font-medium text-gray-700 mb-1.5">Номер телефона *</label>
                  <input type="tel" name="phone" id="phone" required value={formData.phone} onChange={handlePhoneChange} onPaste={handlePhonePaste} onKeyDown={handlePhoneKeyDown} disabled={status === 'loading' || status === 'success'} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#0095c6] focus:border-[#0095c6] transition duration-150 ease-in-out text-base" placeholder="+7 (___) ___-__-__"/>
                </div>
                <div>
                  <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-1.5">Email *</label>
                  <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} disabled={status === 'loading' || status === 'success'} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#0095c6] focus:border-[#0095c6] transition duration-150 ease-in-out text-base" placeholder="example@mail.ru"/>
                </div>
                <div>
                  <label htmlFor="message" className="block text-base font-medium text-gray-700 mb-1.5">Сообщение *</label>
                  <textarea name="message" id="message" rows={5} required value={formData.message} onChange={handleChange} disabled={status === 'loading' || status === 'success'} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#0095c6] focus:border-[#0095c6] transition duration-150 ease-in-out text-base" placeholder="Ваше сообщение..."></textarea>
                </div>
                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[#0095c6] hover:bg-[#007a9e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0095c6] transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    {status === 'success' ? 'Сообщение отправлено!' : 'Отправить сообщение'}
                  </button>
                </div>
                {status === 'success' && (
                    <p className="mt-3 text-sm text-[#0095c6] flex items-center">
                      <CheckCircle className="mr-1 h-4 w-4"/> {statusMessage}
                    </p>
                )}
                {status === 'error' && (
                    <p className="mt-3 text-sm text-red-600 flex items-center">
                      <AlertCircle className="mr-1 h-4 w-4"/> {statusMessage}
                    </p>
                )}
              </form>
            </motion.div>

          </div>

          {/* Разделитель перед картой для четкого разделения секций */}
          <hr className="border-gray-200" />

          {/* --- Секция 3: Карта --- */}
          {/* Добавляем отступ сверху к карте */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={mapVariants}
            className="mt-12 md:mt-16 lg:mt-20" // Отступ сверху
           >
             <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-6 md:mb-8 text-center">Карта</h2>
             <div className="w-full h-80 md:h-96 lg:h-[500px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 overflow-hidden">
               {/* Здесь можно будет вставить iframe с картой */}
               
             </div>
           </motion.div>
           
         </div>
       </div>
     </motion.div>
  );
};

export default ContactView; 
