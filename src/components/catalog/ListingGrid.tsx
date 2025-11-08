'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Listing } from '@/types/catalog';
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
      {listings.map((listing) => (
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