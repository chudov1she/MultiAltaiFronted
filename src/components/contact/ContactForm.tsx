'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle, Send } from "lucide-react";
import { getApiBaseUrl } from '@/lib/api/utils';

type SubmissionStatus = 'idle' | 'loading' | 'success' | 'error';

const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatPhoneNumber(value);
    setPhone(formatted);
  };

  // Обработчик вставки из буфера обмена
  const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const formatted = formatPhoneNumber(pastedText);
    setPhone(formatted);
  };

  // Обработчик нажатия клавиш для корректного удаления
  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const currentNumbers = phone.replace(/\D/g, '');
      if (currentNumbers.length > 0) {
        const newNumbers = currentNumbers.slice(0, -1);
        if (newNumbers.length > 0) {
          setPhone(formatPhoneNumber(newNumbers));
        } else {
          setPhone('');
        }
        e.preventDefault();
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setStatusMessage('');

    // Валидация обязательных полей
    if (!name || !phone) {
      setStatus('error');
      setStatusMessage('Пожалуйста, заполните обязательные поля (Имя, Телефон).');
      return;
    }

    // Проверяем, что номер телефона содержит достаточно цифр
    const cleanPhone = getCleanPhoneNumber(phone);
    const phoneDigits = cleanPhone.replace(/\D/g, '');
    if (phoneDigits.length < 11) {
      setStatus('error');
      setStatusMessage('Пожалуйста, введите корректный номер телефона (минимум 11 цифр).');
      return;
    }

    // Backend требует email и message (обязательные поля)
    if (!email || email.trim() === '') {
      setStatus('error');
      setStatusMessage('Пожалуйста, укажите электронную почту.');
      return;
    }

    // Простая валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setStatus('error');
      setStatusMessage('Пожалуйста, введите корректный адрес электронной почты.');
      return;
    }

    if (!message || message.trim() === '') {
      setStatus('error');
      setStatusMessage('Пожалуйста, укажите сообщение.');
      return;
    }

    // Prepare data for API
    const requestData = {
      name: name.trim(),
      phone: cleanPhone, // Format: +7XXXXXXXXXX
      email: email.trim(),
      message: message.trim(),
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
      setStatusMessage('Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.');
      
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');

    } catch (error) {
      console.error("Contact form submission error:", error);
      setStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'Произошла ошибка при отправке. Пожалуйста, проверьте введенные данные или попробуйте позже.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="bg-white rounded-3xl shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl text-[#011315]">
           Создайте заявку на покупку/продажу ЗУ
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#011315] font-medium">
                  Как к вам обращаться *
                </Label>
                <Input 
                  id="name" 
                  placeholder=""
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                  disabled={status === 'loading' || status === 'success'}
                  className="border-gray-200 focus:border-[#0095c6] focus:ring-[#0095c6]/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#011315] font-medium">
                  Телефон *
                </Label>
                <Input 
                  id="phone" 
                  type="tel"
                  placeholder=""
                  value={phone}
                  onChange={handlePhoneChange}
                  onPaste={handlePhonePaste}
                  onKeyDown={handlePhoneKeyDown}
                  required
                  disabled={status === 'loading' || status === 'success'}
                  className="border-gray-200 focus:border-[#0095c6] focus:ring-[#0095c6]/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#011315] font-medium">
                Электронная почта *
              </Label>
              <Input 
                id="email" 
                type="email"
                placeholder="example@mail.ru" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'loading' || status === 'success'}
                className="border-gray-200 focus:border-[#0095c6] focus:ring-[#0095c6]/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-[#011315] font-medium">
                Сообщение *
              </Label>
              <Textarea 
                id="message" 
                placeholder="Опишите ваш запрос на покупку объектов в свободной форме"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
                disabled={status === 'loading' || status === 'success'}
                className="border-gray-200 focus:border-[#0095c6] focus:ring-[#0095c6]/20 resize-none"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#0095c6] hover:bg-[#007a9e] disabled:bg-[#0095c6]/70 disabled:text-white/70 text-white border-0 py-3 text-lg font-medium" 
              disabled={status === 'loading' || status === 'success'}
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Отправляем...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Отправить заявку
                </>
              )}
            </Button>

            {/* Status messages */}
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800"
              >
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium">{statusMessage}</span>
              </motion.div>
            )}
            
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800"
              >
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="font-medium">{statusMessage}</span>
              </motion.div>
            )}
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContactForm;
