'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

interface FilterPanelProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  priceRange: { min: string; max: string };
  areaRange: { min: string; max: string };
  onPriceRangeChange: (range: { min: string; max: string }) => void;
  onAreaRangeChange: (range: { min: string; max: string }) => void;
  onClearFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  priceRange,
  areaRange,
  onPriceRangeChange,
  onAreaRangeChange,
  onClearFilters,
}) => {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
      {/* Поиск */}
      <div className="mb-6">
        <form onSubmit={onSearchSubmit}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Поиск по названию участка..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 border-gray-200 focus:border-[#0095c6] focus:ring-[#0095c6]/20 focus:ring-[3px] transition-colors"
            />
          </div>
        </form>
      </div>

      {/* Фильтры */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-6 border-t border-gray-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Цена */}
          <div>
            <Label className="block text-sm font-semibold text-gray-700 mb-3">Цена, ₽</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="text"
                placeholder="От"
                value={priceRange.min}
                onChange={(e) => onPriceRangeChange({ ...priceRange, min: e.target.value })}
                className="border-gray-200 focus:border-[#0095c6] focus:ring-[#0095c6]/20 focus:ring-[3px] transition-colors"
              />
              <Input
                type="text"
                placeholder="До"
                value={priceRange.max}
                onChange={(e) => onPriceRangeChange({ ...priceRange, max: e.target.value })}
                className="border-gray-200 focus:border-[#0095c6] focus:ring-[#0095c6]/20 focus:ring-[3px] transition-colors"
              />
            </div>
          </div>

          {/* Площадь */}
          <div>
            <Label className="block text-sm font-semibold text-gray-700 mb-3">Площадь, соток</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="text"
                placeholder="От"
                value={areaRange.min}
                onChange={(e) => onAreaRangeChange({ ...areaRange, min: e.target.value })}
                className="border-gray-200 focus:border-[#0095c6] focus:ring-[#0095c6]/20 focus:ring-[3px] transition-colors"
              />
              <Input
                type="text"
                placeholder="До"
                value={areaRange.max}
                onChange={(e) => onAreaRangeChange({ ...areaRange, max: e.target.value })}
                className="border-gray-200 focus:border-[#0095c6] focus:ring-[#0095c6]/20 focus:ring-[3px] transition-colors"
              />
            </div>
          </div>

          {/* Кнопка очистки */}
          <div className="flex items-end">
            <Button
              onClick={onClearFilters}
              variant="outline"
              className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
            >
              Очистить фильтры
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FilterPanel; 