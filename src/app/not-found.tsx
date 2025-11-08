import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Страница не найдена - МультиАлтай',
  description: 'Страница не найдена. Вернитесь на главную страницу МультиАлтай или воспользуйтесь поиском по сайту.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A192F] flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-8">
        {/* Номер ошибки */}
        <h1 className="text-8xl font-bold text-white">404</h1>
        
        {/* Заголовок */}
        <h2 className="text-2xl font-semibold text-[#00B4D8]">
          Страница не найдена
        </h2>

        {/* Кнопка */}
        <Button asChild className="bg-[#00B4D8] hover:bg-[#0096B3] text-white px-8 py-3 rounded-2xl font-semibold">
          <Link href="/" className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            <span>На главную</span>
          </Link>
        </Button>
      </div>
    </div>
  )
} 