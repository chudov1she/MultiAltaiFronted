'use client'
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="hero-section bg-[#0A192F] relative overflow-hidden h-auto pt-20 pb-10 md:pb-20 sm:pt-32 lg:pt-25">
      {/* Hero Content */}
      <div className="relative z-10 flex items-start py-10 sm:py-16">
        <div className="container mx-auto px-3 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-1 gap-8 sm:gap-10 lg:gap-12 items-start">
              {/* Left Side - Content */}
              <div className="text-center md:text-left">
                {/* Main Headline */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mb-4 sm:mb-6"
                >
                  <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl text-white leading-tight">
                    Продажа эксклюзивных
                  </h1>
                  <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl text-white leading-tight">
                    земельных участков
                  </h1>
                  <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl text-white leading-tight">
                    в Горном Алтае
                  </h1>
                </motion.div>

                {/* Sub-headline */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="mb-6 sm:mb-8"
                >
                  <p className="text-base sm:text-lg lg:text-xl text-white leading-relaxed max-w-4xl">
                    Инвестируйте в земли, перспективные строительные проекты и готовый бизнес в экологически чистом регионе России.
                  </p>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex justify-start"
                >
                  <Link 
                    href="/catalog" 
                    className="flex items-center justify-center bg-[#00B4D8] hover:bg-[#0095c6] text-white font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl gap-2 sm:gap-3 w-full sm:w-auto"
                  >
                    <span className="text-center">Перейти в каталог</span>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panoramic Altai Landscape Image */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="relative w-full mt-16 sm:mt-20 lg:mt-24 max-w-7xl mx-auto px-3 sm:px-0"
      >
        <div className="w-full aspect-[9/16] sm:aspect-[16/9] lg:aspect-[21/9] relative overflow-hidden rounded-xl sm:rounded-2xl mb-16 sm:mb-20 lg:mb-24">
          <Image
            src="/images/altai-panorama.webp"
            alt="Панорамный пейзаж Горного Алтая"
            fill
            className="object-cover object-right"
            priority
          />
          {/* Dark overlay on the image */}
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* Gradient overlay from top to bottom */}
          {/* <div className="absolute inset-0 bg-gradient-to-b from-[#0A192F]/90 via-[#0A192F]/50 to-transparent"></div> */}
        </div>
      </motion.div>

      {/* Bottom Content Preview */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 lg:h-32 bg-gradient-to-t from-[#0A192F] to-transparent"></div> */}
    </section>
  );
};

export default Hero;