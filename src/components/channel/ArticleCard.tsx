'use client';

import React from 'react';
// import Image from 'next/image'; // ЗАКОММЕНТИРОВАНО - не нужен для backend изображений
import { motion } from 'framer-motion';
import { FiCalendar, FiArrowRight, FiImage } from 'react-icons/fi';
import { NewsArticle } from "@/types/news";
import { fadeIn } from "@/lib/animations/scrollAnimations";
import { getPublicImageUrl } from "@/lib/api/utils";

interface ArticleCardProps {
  post: NewsArticle;
  index: number;
}

const formatDate = (dateString: string) => {
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateString));
  } catch (e) {
    console.error("Date formatting error:", e);
    return "Invalid date";
  }
};

export const ArticleCard = ({ post, index }: ArticleCardProps) => {
  const excerptLength = 150; // Max length for the excerpt
  const excerpt = post.content 
                  ? (post.content.length > excerptLength 
                      ? post.content.substring(0, excerptLength) + '...'
                      : post.content)
                  : 'Нет описания';

  // --- Find the main image URL and process it --- 
  const mainImage = post.media_files?.find(file => file.is_main && file.type === 'image');
  const rawImageUrl = mainImage?.file_url;
  const processedImageUrl = getPublicImageUrl(rawImageUrl);
  const imageSrc = processedImageUrl || '/images/placeholder.jpg';

  // Log for debugging (optional, can be removed later)
  // console.log(`[ArticleCard] Title: ${post.title}, Raw: ${rawImageUrl}, Processed: ${processedImageUrl}, Final src: ${imageSrc}`);

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full"
      variants={fadeIn("up", "medium", index * 0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {/* --- Заменено на обычный img для backend изображений --- */}
      <div className="relative h-48 w-full">
        <img
          src={imageSrc}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => { 
            if ((e.target as HTMLImageElement).src !== '/images/placeholder.jpg') {
              console.error(`Image Load Error for: ${processedImageUrl}. Original src was: ${rawImageUrl}`);
              (e.target as HTMLImageElement).src = '/images/placeholder.jpg'; 
            }
          }}
        />
      </div>
      {/* --- Render placeholder if no image --- */}
      {!processedImageUrl && (
          <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center">
              <FiImage className="w-16 h-16 text-gray-300" /> {/* Placeholder Icon */}
          </div>
      )}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {post.title}
        </h3>
        {post.created_at && (
          <div className="text-xs text-gray-500 mb-3">
            <span>{formatDate(post.created_at)}</span>
          </div>
        )}
        <p className="text-sm text-gray-600 mb-4 flex-grow whitespace-pre-wrap line-clamp-3">
          {excerpt}
        </p>
        <div className="mt-auto pt-2 text-sm text-[#0095c6] hover:text-[#007a9e] font-medium">
          
        </div>
      </div>
    </motion.div>
  );
};
