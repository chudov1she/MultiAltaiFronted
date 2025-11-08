'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, X } from 'lucide-react';

import { ListingDetail } from '@/types/catalog';

import ApplicationForm from './ApplicationForm';

interface ListingSidebarProps {
  listing: ListingDetail;
}

const ListingSidebar: React.FC<ListingSidebarProps> = ({ listing }) => {


  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="space-y-6"
    >


      

      {/* Форма заявки или статус "Продан" */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-white rounded-3xl p-6 shadow-lg"
      >
        {(listing as any).plot_status_display === 'Продан' ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#00B4D8]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-[#00B4D8] mb-2">Участок уже продан</h3>
            <p className="text-gray-600 mb-4">
              Это архивное объявление. Участок был реализован и больше не доступен для покупки.
            </p>
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-sm text-gray-500">
                Если у вас есть вопросы по другим участкам, свяжитесь с нами.
              </p>
            </div>
          </div>
        ) : (
          <ApplicationForm
            listingId={(listing as any)._originalId || listing.id} // Use original UUID if available
            listingTitle={listing.title}
            modelName={'land_type' in listing ? 'landplot' : 'property'}
            appLabel="catalog"
          />
        )}
      </motion.div>

      
    </motion.div>
  );
};

export default ListingSidebar;
