  // 'use client';

import React from 'react';

export const metadata = {
  title: "Канал",
  description: "Новости и статьи о проекте МультиАлатай. Будьте в курсе последних событий и обновлений.",
  keywords: "новости, статьи, МультиАлатай, Алтай, недвижимость, проекты",
  openGraph: {
    title: "Канал | МультиАлатай",
    description: "Новости и статьи о проекте МультиАлатай",
    type: "website",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Канал | МультиАлатай",
    description: "Новости и статьи о проекте МультиАлатай",
  },
};

export default function ChannelPage() {
  return (
    <>
      {/* Основной контент */}
      <div className="min-h-[100vh] flex items-center justify-center bg-gray-50">
        <div className="text-center px-6">
          {/* Иконка */}
          <div className="w-24 h-24 bg-[#0095c6]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg 
              className="w-12 h-12 text-[#0095c6]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" 
              />
            </svg>
          </div>
          
          {/* Заголовок */}
          <h2 className="text-2xl md:text-3xl font-bold text-[#011315] mb-4">
            Новостей пока нет
          </h2>
          
          {/* Описание */}
          <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
            Мы работаем над созданием интересного контента. Скоро здесь появятся новости о проекте МультиАлтай
          </p>
        </div>
      </div>
    </>
  );
}
