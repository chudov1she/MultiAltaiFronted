'use client';

import React, { useState, useEffect } from 'react';
import { Listing, FilterParams } from '@/types/catalog';
import { getLandPlots } from '@/lib/api/catalog';
import ListingGrid from './ListingGrid';
import Pagination from './Pagination';

const CatalogClient: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);


  // Загрузка данных
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const params: FilterParams = {
          page: currentPage,
          ordering: '-created_at', // По умолчанию - сначала новые
        };

        const response = await getLandPlots(params);
        setListings(response.results);
        setTotalCount(response.count);
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        setListings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [currentPage]);



  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatPrice = (price: string) => {
    // Если цена "Цена по запросу", возвращаем как есть
    if (price === 'Цена по запросу') return price;
    
    const num = parseFloat(price);
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="pt-4 m-4 mt-0 sm:mt-4 sm:pt-8 px-0 pb-10 z-10">


          {/* Сетка объявлений */}
          <ListingGrid
            listings={listings}
            isLoading={isLoading}
            formatPrice={formatPrice}
          />

          {/* Пагинация */}
          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={20}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CatalogClient; 