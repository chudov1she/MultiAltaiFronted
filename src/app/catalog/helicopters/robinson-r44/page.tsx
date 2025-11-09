'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Users, Zap, TrendingUp, MapPin, Calendar, Shield, CheckCircle, Settings, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import HelicopterContactForm from '@/components/catalog/listing/HelicopterContactForm';
import HelicopterGallery from '@/components/catalog/listing/HelicopterGallery';

const HelicopterPage: React.FC = () => {
  const helicopterImages = [
    '/images/helicopter/helicopter-1.jpg',
    '/images/helicopter/helicopter-2.jpg',
    '/images/helicopter/helicopter-3.jpg',
    '/images/helicopter/helicopter-4.jpg',
    '/images/helicopter/helicopter-5.jpg',
    '/images/helicopter/helicopter-6.jpg',
  ];

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      {/* Кнопка "Назад" для мобильных */}
      <div className="md:hidden fixed bottom-10 right-4 z-40">
        <a href="/catalog">
          <Button 
            variant="outline"
            size="default"
            className="bg-white/90 backdrop-blur-sm shadow-lg rounded-full px-8 py-6 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Назад в каталог</span>
          </Button>
        </a>
      </div>

      {/* Основной контент */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-15">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Левая колонка - основная информация */}
          <div className="lg:col-span-2 space-y-8">
            {/* Галерея изображений */}
            <HelicopterGallery 
              images={helicopterImages}
              title="Вертолёт Robinson R44 R2"
            />
            
            {/* Основная информация */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Заголовок и цена */}
              <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl font-bold text-[#011315] leading-tight">
                  Вертолёт Robinson R44 R2
                </h1>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5 text-[#0095c6]" />
                  <span className="text-lg">VIP транспорт • Приватные полёты</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="text-3xl md:text-4xl font-bold text-[#0095c6]">
                      25 000 000 ₽
                    </div>
                    <div className="text-lg text-gray-600">
                      VIP транспорт для привилегированных клиентов
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Users className="w-5 h-5 text-[#0095c6]" />
                      <span className="text-lg font-medium">4 места</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Описание */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-3xl p-6 shadow-lg border border-[#0A192F]/10"
              >
                <h2 className="text-xl font-semibold text-[#011315] mb-4">Описание</h2>
                <div className="text-gray-700 leading-relaxed prose prose-sm max-w-none prose-headings:text-[#011315] prose-headings:font-semibold prose-p:mb-4 prose-strong:text-[#011315] prose-strong:font-semibold prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4 prose-li:mb-2">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => <h1 className="text-2xl font-semibold text-[#011315] mb-3 mt-4">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-xl font-semibold text-[#011315] mb-3 mt-4">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-lg font-semibold text-[#011315] mb-2 mt-3">{children}</h3>,
                      p: ({ children }) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
                      strong: ({ children }) => <strong className="font-semibold text-[#011315]">{children}</strong>,
                      ul: ({ children }) => <ul className="list-disc ml-6 mb-4 space-y-2">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal ml-6 mb-4 space-y-2">{children}</ol>,
                      li: ({ children }) => <li className="text-gray-700">{children}</li>,
                      blockquote: ({ children }) => <blockquote className="border-l-4 border-[#0095c6] pl-4 italic my-4 text-gray-600">{children}</blockquote>,
                      code: ({ children, className }) => {
                        const isInline = !className;
                        return isInline ? (
                          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-[#011315]">{children}</code>
                        ) : (
                          <code className="block bg-gray-100 p-4 rounded-lg text-sm font-mono text-[#011315] overflow-x-auto">{children}</code>
                        );
                      },
                      a: ({ href, children }) => (
                        <a href={href} className="text-[#0095c6] hover:text-[#007a9e] underline" target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {`Robinson R44 R2 2013 года выпуска находится в **отличном техническом состоянии** с налетом всего 1790 часов при ресурсе 2200 часов. До следующего технического обслуживания осталось 410 часов, что делает вертолёт идеальным выбором для немедленного ввода в эксплуатацию.

Вертолёт полностью обслужен и готов к полётам. Все системы работают безупречно, что гарантирует безопасность и надёжность в любых условиях. Новый салон обеспечивает максимальный комфорт для VIP-клиентов и бизнес-полётов.

**Премиальное оборудование включает:**
- Две гарнитуры Bose для комфортного общения
- Радиовысотометр для повышения безопасности полётов
- Дополнительные баки на 120 литров для значительного увеличения дальности полёта
- Буксировочные колёса для удобства наземного перемещения

Robinson R44 зарекомендовал себя как один из самых надёжных и востребованных вертолётов в мире. Отличное соотношение цена-качество, высокая ликвидность и стабильный спрос делают его привлекательной инвестицией для частных владельцев, авиакомпаний и туристических фирм.`}
                  </ReactMarkdown>
                </div>
              </motion.div>

              {/* Основные характеристики */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-3xl p-6 shadow-lg"
              >
                <h2 className="text-xl font-semibold text-[#011315] mb-4">Основные характеристики</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#0095c6]"></div>
                    <span className="text-gray-600">Статус:</span>
                    <span className="font-medium text-[#011315]">В продаже</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#0095c6]" />
                    <span className="text-gray-600">Год выпуска:</span>
                    <span className="font-medium text-[#011315]">2013</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-[#0095c6]" />
                    <span className="text-gray-600">Вместимость:</span>
                    <span className="font-medium text-[#011315]">4 пассажира + пилот</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-[#0095c6]" />
                    <span className="text-gray-600">Налет:</span>
                    <span className="font-medium text-[#011315]">1790 часов</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-[#0095c6]" />
                    <span className="text-gray-600">Остаток ресурса:</span>
                    <span className="font-medium text-[#011315]">410 часов</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#0095c6]" />
                    <span className="text-gray-600">Базирование:</span>
                    <span className="font-medium text-[#011315]">Екатеринбург</span>
                  </div>
                </div>
              </motion.div>

              {/* Дополнительное оборудование */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-3xl p-6 shadow-lg"
              >
                <h2 className="text-xl font-semibold text-[#011315] mb-4">Дополнительное оборудование</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                    <Shield className="w-5 h-5 text-[#0095c6]" />
                    <span className="text-gray-700">Дополнительные баки на 120 литров</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                    <Star className="w-5 h-5 text-[#0095c6]" />
                    <span className="text-gray-700">Две гарнитуры Bose</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                    <Settings className="w-5 h-5 text-[#0095c6]" />
                    <span className="text-gray-700">Радиовысотометр</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                    <Plane className="w-5 h-5 text-[#0095c6]" />
                    <span className="text-gray-700">Буксировочные колёса</span>
                  </div>
                </div>
              </motion.div>

              {/* Техническое состояние */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white rounded-3xl p-6 shadow-lg"
              >
                <h2 className="text-xl font-semibold text-[#011315] mb-4">Техническое состояние</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#0095c6]" />
                    <span className="text-gray-600">Состояние:</span>
                    <span className="font-medium text-[#011315]">Прекрасное, без нареканий</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#0095c6]" />
                    <span className="text-gray-600">Обслуживание:</span>
                    <span className="font-medium text-[#011315]">Полностью обслужен</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#0095c6]" />
                    <span className="text-gray-600">Салон:</span>
                    <span className="font-medium text-[#011315]">Новый</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#0095c6]" />
                    <span className="text-gray-600">Переведен по 273 ФАП:</span>
                    <span className="font-medium text-[#011315]">04.2025</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#0095c6]" />
                    <span className="text-gray-600">СЛГ до:</span>
                    <span className="font-medium text-[#011315]">18.04.2027</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Правая колонка - сайдбар */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Форма заявки */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className=""
                >
                  <HelicopterContactForm
                    listingTitle="Вертолёт Robinson R44 R2"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HelicopterPage;
