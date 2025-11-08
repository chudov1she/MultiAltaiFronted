'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Listing } from '@/types/catalog';
import { MapPin, Home, Trees, FileText, Plane } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  formatPrice: (price: string) => string;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, formatPrice }) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        duration: 0.6,
      },
    },
  };

  // Находим главное изображение или первое доступное
  const mainImage = listing.media_files?.find(file => file.is_main) || listing.media_files?.[0];

  // Проверяем наличие документов
  const hasDocuments = listing.media_files?.some(file => file.type === 'document') || false;

  // Формируем полный адрес
  const getFullAddress = () => {
    const parts = [];
    
    if (listing.location.locality) {
      parts.push(listing.location.locality);
    }
    
    if (listing.location.region) {
      parts.push(listing.location.region);
    }
    
    if (listing.location.address_line) {
      parts.push(listing.location.address_line);
    }
    
    return parts.length > 0 ? parts.join(', ') : 'Местоположение не указано';
  };

  // Определяем правильную ссылку в зависимости от типа объявления
  const getListingUrl = () => {
    if ('area' in listing) {
      return `/catalog/land-plots/${listing.slug}`;
    } else if ('capacity' in listing) {
      return `/catalog/helicopters/${listing.slug}`;
    } else {
      return `/catalog/properties/${listing.slug}`;
    }
  };

  return (
    <Link href={getListingUrl()}>
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group h-full flex flex-col"
      >
        {/* Изображение на всю ширину - больше места */}
        <div className="h-64 bg-gray-200 relative overflow-hidden flex-shrink-0">
          {mainImage ? (
            <img
              src={mainImage.file_url}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <Home className="w-12 h-12 text-gray-400" />
            </div>
          )}


          {/* Индикатор документов */}
          {hasDocuments && (
            <div className="absolute top-4 left-4 bg-[#0095c6]/90 backdrop-blur-sm p-2 rounded-xl shadow-sm">
              <FileText className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Информация - меньше места */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg  text-[#011315] mb-3 line-clamp-1 group-hover:text-[#0095c6] transition-colors flex-shrink-0">
            {listing.title}
          </h3>
          
          {/* Адрес и сотки в одну строку */}
          <div className="flex items-center justify-between mb-2 flex-shrink-0">
            <div className="flex items-center gap-2 text-gray-600 flex-1 min-w-0">
              <MapPin className="w-4 h-4 text-[#0095c6] flex-shrink-0" />
              <span className="text-sm truncate">
                {getFullAddress()}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600 flex-shrink-0 ml-2">
              {'area' in listing ? (
                <>
                  <Trees className="w-4 h-4 text-[#0095c6]" />
                  <span className="text-sm font-medium whitespace-nowrap">
                    {Number(listing.area).toFixed(0)} соток
                  </span>
                </>
              ) : 'capacity' in listing ? (
                <>
                  <Plane className="w-4 h-4 text-[#0095c6]" />
                  <span className="text-sm font-medium whitespace-nowrap">{listing.capacity}</span>
                </>
              ) : null}
            </div>
          </div>

          {/* Категория земли или тип вертолёта и цена */}
          <div className="mt-auto flex-shrink-0 flex items-center justify-between gap-3">
            <div className="flex-1 max-w-[50%] min-w-0">
              {'land_category' in listing && listing.land_category ? (
                <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-xl truncate w-full">
                  {listing.land_category.name}
                </div>
              ) : 'model' in listing ? (
                <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-xl truncate w-full">
                  {listing.model}
                </div>
              ) : null}
            </div>
            
            <div className="flex-shrink-0">
              {(listing as any).plot_status_display === 'Продан' ? (
                <div className="text-sm text-white bg-[#0A192F] px-3 py-2 rounded-xl">
                  ПРОДАН
                </div>
              ) : (
                <div className="text-sm text-white bg-[#0A192F] px-3 py-2 rounded-xl">
                  {listing.price === 'Цена по запросу' 
                    ? listing.price 
                    : `${formatPrice(listing.price)} ₽`
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ListingCard; 
