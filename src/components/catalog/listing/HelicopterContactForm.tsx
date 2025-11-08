'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

// Типы для формы обратной связи
interface ContactRequestBody {
  name: string;
  phone: string;
  email?: string | null;
  user_message?: string | null;
  request_type: string; // 'contact' для обратной связи
  status: string; // 'new'
}

interface HelicopterContactFormProps {
  listingTitle: string;
}

type SubmissionStatus = 'idle' | 'loading' | 'success' | 'error';

const HelicopterContactForm: React.FC<HelicopterContactFormProps> = ({ listingTitle }) => {
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

  // Функция для получения чистого номера телефона (только цифры)
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
    
    return clean;
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

    if (!name || !phone) {
        setStatus('error');
        setStatusMessage('Пожалуйста, заполните обязательные поля (Имя, Телефон).');
        return;
    }

    // Проверяем, что номер телефона содержит достаточно цифр
    const cleanPhone = getCleanPhoneNumber(phone);
    if (cleanPhone.length < 11) {
        setStatus('error');
        setStatusMessage('Пожалуйста, введите корректный номер телефона (минимум 11 цифр).');
        return;
    }

    // Добавляем информацию о вертолёте в сообщение
    const fullMessage = message 
      ? `Сообщение: ${message}\n\nИнтерес к: ${listingTitle}`
      : `Интерес к: ${listingTitle}`;

    // Prepare data for API - отправляем как обратную связь
    const requestData: ContactRequestBody = {
      name,
      phone: cleanPhone,
      email: email || null,
      user_message: fullMessage,
      request_type: 'contact', // Отправляем как обратную связь
      status: 'new',
    };

    console.log('Submitting helicopter contact form with data:', requestData);

    try {
      // Отправляем через API обратной связи
      const response = await fetch('/api/v1/requests/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при отправке сообщения');
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
      console.error("Helicopter contact form submission error:", error);
      setStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'Произошла ошибка при отправке. Пожалуйста, проверьте введенные данные или попробуйте позже.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Обратная связь по объявлению</CardTitle>
        <p className="text-sm text-muted-foreground">{listingTitle}</p>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Имя *</Label>
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
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email"
              placeholder="" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading' || status === 'success'}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message">Сообщение</Label>
            <Textarea 
              id="message" 
              placeholder="Напишите ваш запрос или комментарий"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              disabled={status === 'loading' || status === 'success'}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <Button 
            type="submit" 
            className="w-full mb-3 bg-[#0095c6] hover:bg-[#007a9e] disabled:bg-[#0095c6]/70 disabled:text-white/70 text-white border-0" 
            disabled={status === 'loading' || status === 'success'}
          >
            {status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {status === 'success' ? 'Отправлено!' : 'Отправить сообщение'}
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
        </CardFooter>
      </form>
    </Card>
  );
};

export default HelicopterContactForm;
