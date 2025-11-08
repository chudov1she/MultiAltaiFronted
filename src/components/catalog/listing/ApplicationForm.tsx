'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
// Типы для заявки
interface ApplicationRequestBody {
  name: string;
  phone: string;
  email?: string | null;
  user_message?: string;
  request_type: string;
  status: string;
  related_object_content_type_app_label?: string;
  related_object_model_name?: string;
  related_object_id?: number;
} 

interface ApplicationFormProps {
  listingId: number | string; // Can be UUID string or number
  listingTitle: string;
  // Add props for related object info
  modelName: string; // e.g., 'landplot', 'property'
  appLabel: string;  // e.g., 'listings'
}

type SubmissionStatus = 'idle' | 'loading' | 'success' | 'error';

const ApplicationForm: React.FC<ApplicationFormProps> = ({ listingId, listingTitle, modelName, appLabel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // Функция форматирования телефона
  const formatPhoneNumber = (value: string): string => {
    // Убираем все кроме цифр
    const numbers = value.replace(/\D/g, '');
    
    // Если номер начинается с 8, заменяем на 7
    let formatted = numbers;
    if (numbers.startsWith('8') && numbers.length >= 11) {
      formatted = '7' + numbers.slice(1);
    }
    
    // Если номер начинается с 7 и длина 11 цифр
    if (formatted.startsWith('7') && formatted.length === 11) {
      return `+7 (${formatted.slice(1, 4)}) ${formatted.slice(4, 7)}-${formatted.slice(7, 9)}-${formatted.slice(9, 11)}`;
    }
    
    // Если номер начинается с 7 и длина 10 цифр (без кода страны)
    if (formatted.length === 10) {
      return `+7 (${formatted.slice(0, 3)}) ${formatted.slice(3, 6)}-${formatted.slice(6, 8)}-${formatted.slice(8, 10)}`;
    }
    
    // Возвращаем как есть, если не подходит под формат
    return value;
  };

  // Функция для получения чистого номера телефона в формате +7XXXXXXXXXX
  const getCleanPhoneNumber = (phone: string): string => {
    let clean = phone.replace(/\D/g, '');
    
    // Если номер начинается с 8, заменяем на 7
    if (clean.startsWith('8') && clean.length >= 11) {
      clean = '7' + clean.slice(1);
    }
    
    // Если номер 10 цифр, добавляем 7 в начало
    if (clean.length === 10) {
      clean = '7' + clean;
    }
    
    // Добавляем плюс в начало для формата +7XXXXXXXXXX
    return clean.startsWith('+') ? clean : `+${clean}`;
  };

  // Обработчик изменения телефона
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
      // При удалении убираем форматирование и удаляем последнюю цифру
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
    // For land plots, use the specific endpoint with landPlotId
    const isLandPlot = modelName === 'landplot';
    
    let requestData: any;
    let endpoint: string;

    if (isLandPlot) {
      // Use land plot specific endpoint
      endpoint = '/v1/applications/land-plot';
      requestData = {
        name: name.trim(),
        phone: cleanPhone, // Format: +7XXXXXXXXXX
        email: email.trim(),
        message: message.trim(),
        landPlotId: String(listingId), // Backend expects UUID string
      };
    } else {
      // Use generic endpoint for other types
      endpoint = '/v1/applications/contact';
      requestData = {
        name: name.trim(),
        phone: cleanPhone, // Format: +7XXXXXXXXXX
        email: email.trim(),
        message: message.trim(),
      };
    }

    console.log('Submitting application with data:', requestData);

    try {
      // Отправляем заявку на наш API endpoint
      // Use getApiBaseUrl for consistency
      const { getApiBaseUrl } = await import('@/lib/api/utils');
      const baseUrl = getApiBaseUrl();
      
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
      setStatusMessage('Ваша заявка успешно отправлена!');
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');

    } catch (error) {
      console.error("Application submission error:", error);
      setStatus('error');
      // Provide a more helpful error message if possible
      setStatusMessage(error instanceof Error ? error.message : 'Произошла ошибка при отправке. Пожалуйста, проверьте введенные данные или попробуйте позже.');
    }
  };

  return (
    <div className="bg-white">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Оставить заявку на объект</h3>
        <p className="text-sm text-gray-600">{listingTitle}</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-6">
          <div className="space-y-1.5">
            <Label htmlFor="name">Как к вам обращаться *</Label>
            <Input 
              id="name" 
              placeholder=""
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
              disabled={status === 'loading' || status === 'success'}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Телефон *</Label>
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
            />
          </div>
           <div className="space-y-1.5">
            <Label htmlFor="email">Электронная почта *</Label>
            <Input 
              id="email" 
              type="email"
              placeholder="example@mail.ru" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === 'loading' || status === 'success'}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message">Сообщение *</Label>
            <Textarea 
              id="message" 
              placeholder="Опишите ваш запрос на покупку этого объекта в свободной форме"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
              disabled={status === 'loading' || status === 'success'}
            />
          </div>
        </div>
        
        <div className="flex flex-col items-start">
          <Button 
            type="submit" 
            className="w-full mb-3 bg-[#0095c6] hover:bg-[#007a9e] disabled:bg-[#0095c6]/70 disabled:text-white/70 text-white border-0" 
            disabled={status === 'loading' || status === 'success'}
          >
            {status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {status === 'success' ? 'Отправлено!' : 'Отправить заявку'}
          </Button>
          {/* Status messages */} 
          {status === 'success' && (
            <p className="text-sm text-[#0095c6] flex items-center">
              <CheckCircle className="mr-1 h-4 w-4"/> {statusMessage}
            </p>
          )}
          {status === 'error' && (
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="mr-1 h-4 w-4"/> {statusMessage}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm; 