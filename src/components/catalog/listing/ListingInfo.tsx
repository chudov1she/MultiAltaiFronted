'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Trees, Calendar, Eye, Circle, FileText, Building2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ListingDetail, isLandPlotDetail } from '@/types/catalog';
import { formatPrice } from '@/utils/formatting';

interface ListingInfoProps {
  listing: ListingDetail;
}

const ListingInfo: React.FC<ListingInfoProps> = ({ listing }) => {
  const isLand = isLandPlotDetail(listing);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Формируем полный адрес
  const getFullAddress = () => {
    const parts = [];
    if (listing.location.locality) parts.push(listing.location.locality);
    if (listing.location.region) parts.push(listing.location.region);
    if (listing.location.address_line) parts.push(listing.location.address_line);
    return parts.length > 0 ? parts.join(', ') : 'Местоположение не указано';
  };

  // Рассчитываем цену за сотку для земельных участков
  const getPricePerSotka = () => {
    if (isLand && 'area' in listing && listing.area && listing.price) {
      const area = parseFloat(listing.area);
      const price = parseFloat(listing.price);
      if (area > 0 && price > 0) {
        return formatPrice(price / area);
      }
    }
    return null;
  };

  const pricePerSotka = getPricePerSotka();

  // Функция копирования с уведомлением
  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(String(text).replace(/[\[\]"]/g, ''));
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000); // Сброс через 2 секунды
    } catch (err) {
      console.error('Ошибка копирования:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="space-y-6"
    >
      {/* Заголовок и цена */}
      <div className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold text-[#011315] leading-tight">
          {listing.title}
        </h1>
        
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-5 h-5 text-[#0095c6]" />
          <span className="text-lg">{getFullAddress()}</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="space-y-2">
            {(listing as any).plot_status_display === 'Продан' ? (
              <div className="text-3xl md:text-4xl font-bold text-[#00B4D8]">
                ПРОДАН
              </div>
            ) : (
              <>
                <div className="text-3xl md:text-4xl font-bold text-[#0095c6]">
                  {formatPrice(listing.price)}
                </div>
                {pricePerSotka && (
                  <div className="text-lg text-gray-600">
                    {pricePerSotka} за сотку
                  </div>
                )}
              </>
            )}
          </div>
          
          {isLand && 'area' in listing && listing.area && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Trees className="w-5 h-5 text-[#0095c6]" />
                <span className="text-sm font-medium text-gray-500">Площадь</span>
              </div>
              <div className="text-2xl text-[#011315]">
                {Number(listing.area).toFixed(0)} соток
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Описание */}
      {listing.description && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-lg"
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
              {listing.description}
            </ReactMarkdown>
          </div>
        </motion.div>
      )}

      {/* Основные характеристики */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white rounded-3xl p-6 shadow-lg"
      >
        <h2 className="text-xl font-semibold text-[#011315] mb-4">Основные характеристики</h2>
        
        <div className="space-y-4">
          {/* Статус */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Circle className="w-4 h-4 text-[#0095c6] fill-[#0095c6]" />
              <span className="text-gray-600">Статус:</span>
            </div>
            <div className="ml-7">
              <span className="font-medium text-[#011315]">
                {isLand ? listing.plot_status_display : ('listing_status_display' in listing ? listing.listing_status_display : 'Опубликовано')}
              </span>
            </div>
          </div>
          
          {/* Категория земли */}
          {isLand && 'land_category' in listing && listing.land_category && (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Trees className="w-4 h-4 text-[#0095c6]" />
                <span className="text-gray-600">Категория:</span>
              </div>
              <div className="ml-7">
                <span className="font-medium text-[#011315]">{listing.land_category.name}</span>
              </div>
            </div>
          )}
          
          {/* Виды разрешенного использования */}
          {isLand && 'land_use_types' in listing && listing.land_use_types && listing.land_use_types.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-[#0095c6]" />
                <span className="text-gray-600">Виды разрешенного использования:</span>
              </div>
              <div className="ml-7">
                <span className="font-medium text-[#011315]">
                  {listing.land_use_types.map(useType => useType.name).join(', ')}
                </span>
              </div>
            </div>
          )}
          
          {/* Кадастровые номера */}
          {isLand && 'cadastral_numbers' in listing && listing.cadastral_numbers && (() => {
            // Нормализуем кадастровые номера в массив
            const numbers = Array.isArray(listing.cadastral_numbers)
              ? listing.cadastral_numbers
              : String(listing.cadastral_numbers).split(/[,\s]+/).filter(Boolean);
            
            return (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-[#0095c6]" />
                  <span className="text-gray-600">Кадастровые номера:</span>
                </div>
                <div className="ml-7 space-y-2">
                  {numbers.map((number, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <span className="font-mono text-sm text-[#011315]">
                        {String(number).trim()}
                      </span>
                      <button 
                        className={`text-xs font-medium transition-all duration-200 ${
                          copiedIndex === index 
                            ? 'text-green-600 bg-green-100 px-2 py-1 rounded-md' 
                            : 'text-[#0095c6] hover:text-[#007a9e] hover:bg-blue-50 px-2 py-1 rounded-md'
                        }`}
                        onClick={() => handleCopy(String(number).trim(), index)}
                      >
                        {copiedIndex === index ? 'Скопировано!' : 'Копировать'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ListingInfo;
