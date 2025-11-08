import React from 'react';
import ContactInfo from '@/components/contact/ContactInfo';
import ContactForm from '@/components/contact/ContactForm';

export const metadata = {
  title: "Контакты | МультиАлатай",
  description: "Свяжитесь с нами для получения информации о проекте МультиАлатай",
};

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Основной контент */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Левая колонка - Контактная информация */}
          <ContactInfo />
          
          {/* Правая колонка - Форма обратной связи */}
          <ContactForm />
        </div>
      </div>
    </div>
  );
} 
