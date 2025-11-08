'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ListingDetail, isLandPlotDetail } from '@/types/catalog';

interface ListingDetailsProps {
  listing: ListingDetail;
}

const ListingDetails: React.FC<ListingDetailsProps> = ({ listing }) => {
  const [copiedNumbers, setCopiedNumbers] = useState<Set<string>>(new Set());
  
  const isLand = isLandPlotDetail(listing);

  // Функция для копирования кадастрового номера
  const handleCopyCadastralNumber = async (number: string) => {
    try {
      await navigator.clipboard.writeText(number);
      setCopiedNumbers(prev => new Set([...prev, number]));
      
      // Сбрасываем состояние через 2 секунды
      setTimeout(() => {
        setCopiedNumbers(prev => {
          const newSet = new Set(prev);
          newSet.delete(number);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      console.error('Ошибка при копировании:', error);
    }
  };

  // Получаем кадастровые номера для земельных участков
  const getCadastralNumbers = () => {
    if (!isLand || !('cadastral_numbers' in listing) || !listing.cadastral_numbers) return null;
    
    // Если уже массив - возвращаем как есть
    if (Array.isArray(listing.cadastral_numbers)) {
      return listing.cadastral_numbers;
    }
    
    // Если строка - разбиваем по запятым
    if (typeof listing.cadastral_numbers === 'string') {
      return listing.cadastral_numbers.split(/[,\s]+/).filter(Boolean);
    }
    
    return null;
  };

  const cadastralNumbers = getCadastralNumbers();

  // Группируем особенности по типам
  const getFeaturesByType = () => {
    if (!isLand || !('features' in listing) || !listing.features) return {};
    
    return listing.features.reduce((acc, feature) => {
      const type = feature.type_display || 'Другие';
      if (!acc[type]) acc[type] = [];
      acc[type].push(feature);
      return acc;
    }, {} as Record<string, typeof listing.features>);
  };

  const featuresByType = getFeaturesByType();

  // Получаем документы из media_files
  const getDocuments = () => {
    if (!listing.media_files) return [];
    
    return listing.media_files.filter(file => file.type === 'document');
  };

  const documents = getDocuments();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="space-y-6"
    >
      

      {/* Документы */}
      {documents && documents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="bg-white rounded-3xl p-6 shadow-lg"
        >
                     <h2 className="text-xl font-semibold text-[#011315] mb-4">Закрепленные документы</h2>
          <div className="space-y-3">
            {documents.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0095c6]/10 rounded-xl flex items-center justify-center">
                    <svg 
                      className="w-5 h-5 text-[#0095c6]" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[#011315]">
                      {document.description || 'Документ'}
                    </p>
                                                              <p className="text-sm text-gray-500">
                        Вложение
                      </p>
                  </div>
                </div>
                <a
                  href={document.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#0095c6] hover:bg-[#007a9e] text-white rounded-xl transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  </svg>
                  Скачать
                </a>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Особенности участка */}
      {isLand && Object.keys(featuresByType).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-3xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-[#011315] mb-4">Особенности участка</h2>
          
          {Object.entries(featuresByType).map(([type, features]) => (
            <div key={type} className="mb-6 last:mb-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {features.map((feature) => (
                  <div
                    key={feature.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#0095c6]"></div>
                    <span className="text-gray-700">{feature.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Дополнительные атрибуты для недвижимости */}
      {!isLand && 'attributes' in listing && listing.attributes && Object.keys(listing.attributes).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white rounded-3xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-[#011315] mb-4">Дополнительные характеристики</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(listing.attributes).map(([key, value]) => {
              if (value === null || value === '') return null;
              
              const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              const displayValue = typeof value === 'boolean' ? (value ? 'Да' : 'Нет') : String(value);
              
              return (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                  <span className="text-gray-600">{label}:</span>
                  <span className="font-medium text-[#011315]">{displayValue}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ListingDetails;
