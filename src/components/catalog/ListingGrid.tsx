'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Listing, Helicopter } from '@/types/catalog';
import ListingCard from './ListingCard';
import { Home } from 'lucide-react';

interface ListingGridProps {
  listings: Listing[];
  isLoading: boolean;
  formatPrice: (price: string) => string;
}

const ListingGrid: React.FC<ListingGridProps> = ({ listings, isLoading, formatPrice }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  // Создаём объект вертолёта для вставки в каталог
  const helicopterListing: Helicopter = useMemo(() => ({
    id: 'helicopter-robinson-r44',
    slug: 'robinson-r44',
    title: 'Вертолёт Robinson R44 R2',
    description: `Robinson R44 R2 2013 года выпуска находится в **отличном техническом состоянии** с налетом всего 1790 часов при ресурсе 2200 часов. До следующего технического обслуживания осталось 410 часов, что делает вертолёт идеальным выбором для немедленного ввода в эксплуатацию.

Вертолёт полностью обслужен и готов к полётам. Все системы работают безупречно, что гарантирует безопасность и надёжность в любых условиях. Новый салон обеспечивает максимальный комфорт для VIP-клиентов и бизнес-полётов.

**Премиальное оборудование включает:**
- Две гарнитуры Bose для комфортного общения
- Радиовысотометр для повышения безопасности полётов
- Дополнительные баки на 120 литров для значительного увеличения дальности полёта
- Буксировочные колёса для удобства наземного перемещения

Robinson R44 зарекомендовал себя как один из самых надёжных и востребованных вертолётов в мире. Отличное соотношение цена-качество, высокая ликвидность и стабильный спрос делают его привлекательной инвестицией для частных владельцев, авиакомпаний и туристических фирм.`,
    price: '25000000',
    listing_status: 'published',
    location: {
      id: 0,
      locality: 'Екатеринбург',
      region: '',
      address_line: 'VIP транспорт • Приватные полёты',
      latitude: '',
      longitude: '',
    },
    media_files: [
      {
        id: 0,
        url: '/images/helicopter/helicopter-1.jpg',
        file_url: '/images/helicopter/helicopter-1.jpg',
        is_main: true,
        type: 'image',
      },
    ],
    model: 'Robinson R44 R2',
    capacity: '4 места',
    engine: '',
    max_speed: '',
    range: '',
    features: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }), []);

  // Вставляем вертолёт в середину списка
  const listingsWithHelicopter = useMemo(() => {
    if (listings.length === 0) return listings;
    
    const middleIndex = Math.floor(listings.length / 2);
    const result = [...listings];
    result.splice(middleIndex, 0, helicopterListing);
    return result;
  }, [listings, helicopterListing]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-lg animate-pulse">
            <div className="h-48 bg-gray-200 rounded-2xl mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 mb-4">
          <Home className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Объекты не найдены</h3>
        <p className="text-gray-500">В каталоге пока нет доступных объектов</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {listingsWithHelicopter.map((listing) => (
        <ListingCard 
          key={listing.id} 
          listing={listing} 
          formatPrice={formatPrice}
        />
      ))}
    </motion.div>
  );
};

export default ListingGrid; 