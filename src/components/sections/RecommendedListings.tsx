'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import { getLandPlots } from '@/lib/api/catalog';
import { Listing, FilterParams } from '@/types/catalog';
import ListingGrid from '@/components/catalog/ListingGrid';

const RecommendedListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка данных точно как в каталоге
  useEffect(() => {
    const fetchRecommendedListings = async () => {
      setIsLoading(true);
      try {
        const params: FilterParams = {
          page: 1,
          limit: 6, // Ограничиваем до 6 объектов
          ordering: '-created_at', // По умолчанию - сначала новые
        };

        const response = await getLandPlots(params);
        
        // Принудительно ограничиваем до 6 объектов
        const limitedResults = response.results.slice(0, 6);
        setListings(limitedResults);
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        setListings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendedListings();
  }, []);

  const formatPrice = (price: string) => {
    // Если цена "Цена по запросу", возвращаем как есть
    if (price === 'Цена по запросу') return price;
    
    const num = parseFloat(price);
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-[#0A192F]/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Заголовок секции */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl text-[#0A192F] mb-6">
                Каталог{' '}
                <span className="text-[#00B4D8]">
                  земельных
                </span>
                {' '}участков
            </h2>
            <p className="text-[18px] text-[#0A192F] max-w-5xl mx-auto leading-relaxed">
              Лучшие земельные участки в Горном Алтае, отобранные экспертами. 
            </p>
          </motion.div>

          {/* Сетка объектов используя существующий ListingGrid */}
          <div className="mb-12">
            <ListingGrid 
              listings={listings}
              isLoading={isLoading}
              formatPrice={formatPrice}
            />
          </div>

          {/* Кнопка "Смотреть все" */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link 
              href="/catalog"
              className="bg-[#00B4D8] hover:bg-[#0095c6] text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-xl gap-2 sm:gap-3 flex items-center justify-center"
            >
              <span>Смотреть все объекты</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RecommendedListings;
