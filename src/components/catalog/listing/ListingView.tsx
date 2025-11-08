'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListingDetail } from '@/types/catalog';
import ListingGallery from './ListingGallery';
import ListingInfo from './ListingInfo';
import ListingDetails from './ListingDetails';
import ListingSidebar from './ListingSidebar';

interface ListingViewProps {
  listing: ListingDetail;
  categorySlug: string; 
}

const ListingView: React.FC<ListingViewProps> = ({ listing, categorySlug }) => {
  // Фильтруем изображения (type уже в lowercase после адаптера)
  const images = listing.media_files?.filter(file => 
    file.type === 'image' || (!file.type && /\.(jpg|jpeg|png|gif|webp)$/i.test(file.file_url || file.url || ''))
  ) || [];

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
            <ListingGallery images={images} title={listing.title} />
            
            {/* Основная информация */}
            <ListingInfo listing={listing} />
            
            {/* Детальные характеристики */}
            <ListingDetails listing={listing} />
             </div>

          {/* Правая колонка - сайдбар */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ListingSidebar listing={listing} />
                </div>
             </div>
        </motion.div>
           </div>
     </div>
   );
 };

export default ListingView; 
