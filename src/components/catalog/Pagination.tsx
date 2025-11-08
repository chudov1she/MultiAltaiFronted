'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  
  if (totalPages <= 1) return null;

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

  return (
    <motion.div
      className="mt-12 flex justify-center"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center gap-2">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Назад
        </Button>
        
        <span className="px-4 py-2 text-gray-600">
          Страница {currentPage} из {totalPages}
        </span>
        
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          variant="outline"
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Вперед
        </Button>
      </div>
    </motion.div>
  );
};

export default Pagination;
