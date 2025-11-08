'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface HelicopterGalleryProps {
  images: string[];
  title: string;
}

const HelicopterGallery: React.FC<HelicopterGalleryProps> = ({ images, title }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [mouseStart, setMouseStart] = useState<number | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-100 rounded-3xl h-96 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Нет изображений</p>
      </div>
    );
  }

  const openModal = (index: number) => setSelectedImage(index);
  const closeModal = () => setSelectedImage(null);
  
  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };
  
  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
    }
  };

  // Функции для свайпа
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || isTransitioning) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && selectedImage !== null) {
      setSlideDirection('left');
      setIsTransitioning(true);
      setTimeout(() => {
        nextImage();
        setSlideDirection(null);
        setIsTransitioning(false);
      }, 300);
    }
    if (isRightSwipe && selectedImage !== null) {
      setSlideDirection('right');
      setIsTransitioning(true);
      setTimeout(() => {
        prevImage();
        setSlideDirection(null);
        setIsTransitioning(false);
      }, 300);
    }
  };

  // Функции для свайпа мышью
  const onMouseDown = (e: React.MouseEvent) => {
    setIsMouseDown(true);
    setMouseStart(e.clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !mouseStart || isTransitioning) return;
    
    const distance = mouseStart - e.clientX;
    const isLeftSwipe = distance > 100;
    const isRightSwipe = distance < -100;

    if (isLeftSwipe && selectedImage !== null) {
      setSlideDirection('left');
      setIsTransitioning(true);
      setTimeout(() => {
        nextImage();
        setSlideDirection(null);
        setIsTransitioning(false);
      }, 300);
      setIsMouseDown(false);
      setMouseStart(null);
    }
    if (isRightSwipe && selectedImage !== null) {
      setSlideDirection('right');
      setIsTransitioning(true);
      setTimeout(() => {
        prevImage();
        setSlideDirection(null);
        setIsTransitioning(false);
      }, 300);
      setIsMouseDown(false);
      setMouseStart(null);
    }
  };

  const onMouseUp = () => {
    setIsMouseDown(false);
    setMouseStart(null);
  };

  return (
    <>
      {/* Основная галерея с Swiper */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-4 rounded-[5px] overflow-hidden"
      >
         {/* Главный слайдер */}
         <div className="relative h-120">
           {/* Градиентные края для эффекта появления */}
           <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50/10 to-transparent z-10 pointer-events-none"></div>
           <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50/10 to-transparent z-10 pointer-events-none"></div>
           <Swiper
             spaceBetween={16}
             slidesPerView={1}
             breakpoints={{
               640: {
                 slidesPerView: 1.3,
               },
               1024: {
                 slidesPerView: 1.3,
               }
             }}
             navigation={true}
             pagination={{
               clickable: true,
               dynamicBullets: true,
             }}
             modules={[Navigation, Pagination]}
             className="main-gallery-swiper overflow-hidden"
            onSwiper={(swiper) => {
              // Кастомные стили для навигации
              const prevButton = swiper.navigation.prevEl;
              const nextButton = swiper.navigation.nextEl;
              if (prevButton && nextButton) {
                prevButton.classList.add('custom-nav-btn', 'custom-nav-prev');
                nextButton.classList.add('custom-nav-btn', 'custom-nav-next');
              }
            }}
          >
                         {images.map((image, index) => (
               <SwiperSlide key={index}>
                 <div className="relative group cursor-pointer" onClick={() => openModal(index)}>
                   <div className="w-full h-120 bg-gray-200 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                                       <img
                    src={image}
                    alt={`${title} - фото ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    draggable={false}
                  />
                   </div>
                 </div>
               </SwiperSlide>
             ))}
          </Swiper>
                 </div>
      </motion.div>

      {/* Улучшенное модальное окно */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center h-full"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Верхняя панель с информацией */}
              <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-6 w-full">
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <h3 className="text-xl font-semibold mb-1">{title}</h3>
                    <p className="text-white/80">
                      Фото {selectedImage + 1} из {images.length}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    
                    <button
                      onClick={closeModal}
                      className="bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm"
                      title="Закрыть"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

                                            {/* Основное изображение */}
               <div 
                 className="flex items-center justify-center w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
                 onTouchStart={onTouchStart}
                 onTouchMove={onTouchMove}
                 onTouchEnd={onTouchEnd}
                 onMouseDown={onMouseDown}
                 onMouseMove={onMouseMove}
                 onMouseUp={onMouseUp}
                 onMouseLeave={onMouseUp}
               >
                 <motion.img
                   key={selectedImage}
                   src={images[selectedImage]}
                   alt={`${title} - фото ${selectedImage + 1}`}
                   className="w-full h-full object-contain"
                   draggable={false}
                   initial={{ 
                     x: slideDirection === 'left' ? 300 : slideDirection === 'right' ? -300 : 0,
                     opacity: slideDirection ? 0.7 : 1
                   }}
                   animate={{ 
                     x: 0, 
                     opacity: 1 
                   }}
                   transition={{ 
                     type: "spring", 
                     damping: 25, 
                     stiffness: 300,
                     duration: 0.3
                   }}
                 />
               </div>

               {/* Нижняя панель с градиентом */}
               <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-6 w-full">
                 <div className="flex items-center justify-center">
                   <div className="text-white text-center">
                     <p className="text-white/80 text-sm">
                       Фото {selectedImage + 1} из {images.length}
                     </p>
                   </div>
                 </div>
               </div>

              {/* Навигация */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute top-1/2 -translate-y-1/2 left-6 z-20 bg-white/20 hover:bg-white/30 text-white rounded-full p-4 transition-all duration-300 backdrop-blur-sm group"
                    title="Предыдущее фото"
                  >
                    <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute top-1/2 -translate-y-1/2 right-6 z-20 bg-white/20 hover:bg-white/30 text-white rounded-full p-4 transition-all duration-300 backdrop-blur-sm group"
                    title="Следующее фото"
                  >
                    <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  </button>
                </>
              )}

              
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

             {/* Кастомные стили для Swiper */}
       <style jsx global>{`
         .main-gallery-swiper .swiper-button-next,
         .main-gallery-swiper .swiper-button-prev {
           color: white;
           background: rgba(0, 0, 0, 0.5);
           width: 48px;
           height: 48px;
           border-radius: 50%;
           backdrop-filter: blur(10px);
           transition: all 0.3s ease;
         }
         
         .main-gallery-swiper .swiper-button-next:hover,
         .main-gallery-swiper .swiper-button-prev:hover {
           background: rgba(0, 0, 0, 0.7);
           transform: scale(1.1);
         }
         
         .main-gallery-swiper .swiper-button-next::after,
         .main-gallery-swiper .swiper-button-prev::after {
           font-size: 18px;
           font-weight: bold;
         }
         
         .main-gallery-swiper .swiper-pagination-bullet {
           background: white;
           opacity: 0.7;
           transition: all 0.3s ease;
         }
         
         .main-gallery-swiper .swiper-pagination-bullet-active {
           background: #0095c6;
           opacity: 1;
           transform: scale(1.2);
         }
         
         /* Запрет перетаскивания изображений */
         img {
           user-select: none;
           -webkit-user-select: none;
           -moz-user-select: none;
           -ms-user-select: none;
           pointer-events: none;
         }
         
         /* Разрешаем события только для контейнера с свайпом */
         .cursor-grab {
           pointer-events: auto;
         }
         
         /* Плавные переходы для изображений */
         .cursor-grab img {
           transition: transform 0.3s ease, opacity 0.3s ease;
         }
         
         /* Анимация свайпа */
         @media (max-width: 768px) {
           .cursor-grab img {
             transition: transform 0.2s ease, opacity 0.2s ease;
           }
         }
       `}</style>
    </>
  );
};

export default HelicopterGallery;
