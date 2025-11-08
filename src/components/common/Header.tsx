'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ChevronDown, Phone, Mail, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ContactModal from './ContactModal';

interface HeaderProps {
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({ transparent = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-white shadow-lg">
      {/* Main Navigation */}
      <nav className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            {/* Logo */}
            <Link href="/" className="flex flex-col items-center flex-shrink-0 hover:opacity-80 transition-opacity duration-200">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 relative bg-white rounded-full p-1 mb-1">
                <Image
                  src="/images/logo.png"
                  alt="MultiAltai Logo"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              </div>
              <span className="text-xs font-bold text-gray-800 tracking-wide text-center">
                <span className="text-[#00B4D8]">МУЛЬТИ</span>
                <span className="text-gray-800">АЛТАЙ</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <Link 
                href="/" 
                className="text-sm text-gray-800 hover:text-[#00B4D8] transition-all duration-300"
              >
                ГЛАВНАЯ
              </Link>
              <Link 
                href="/catalog" 
                className="text-sm text-gray-800 hover:text-[#00B4D8] transition-all duration-300"
              >
                КАТАЛОГ
              </Link>
              <Link 
                href="/channel" 
                className="text-sm text-gray-800 hover:text-[#00B4D8] transition-all duration-300"
              >
                КАНАЛ
              </Link>
              <Link 
                href="/contacts" 
                className="text-sm text-gray-800 hover:text-[#00B4D8] transition-all duration-300"
              >
                КОНТАКТЫ
              </Link>
            </div>

            {/* Desktop CTA Button */}
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="bg-[#00B4D8] hover:bg-[#0096B3] text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
              >
                <span className="text-sm">СВЯЗАТЬСЯ</span>
                <Phone className="w-5 h-5 ml-2" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-800 hover:text-[#00B4D8] transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ 
                  type: "tween", 
                  duration: 0.3,
                  ease: "easeOut"
                }}
                className="lg:hidden fixed top-0 right-0 h-full w-64 bg-white shadow-2xl border-l border-gray-200 z-50"
              >
                <div className="p-6 h-full flex flex-col">
                  {/* Заголовок и кнопка закрытия */}
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-semibold text-[#0A192F]">Меню</h3>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 text-gray-600 hover:text-[#00B4D8] transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Навигационные ссылки */}
                  <div className="flex flex-col space-y-2 flex-1">
                    <Link 
                      href="/" 
                      className="text-base text-gray-800 hover:text-[#00B4D8] hover:bg-gray-50 transition-all duration-200 px-4 py-3 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      ГЛАВНАЯ
                    </Link>
                    <Link 
                      href="/catalog" 
                      className="text-base text-gray-800 hover:text-[#00B4D8] hover:bg-gray-50 transition-all duration-200 px-4 py-3 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      КАТАЛОГ
                    </Link>
                    <Link 
                      href="/channel" 
                      className="text-base text-gray-800 hover:text-[#00B4D8] hover:bg-gray-50 transition-all duration-200 px-4 py-3 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      КАНАЛ
                    </Link>
                    <Link 
                      href="/contacts" 
                      className="text-base text-gray-800 hover:text-[#00B4D8] hover:bg-gray-50 transition-all duration-200 px-4 py-3 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      КОНТАКТЫ
                    </Link>
                  </div>
                  
                  {/* CTA кнопка внизу */}
                  <div className="pt-4 border-t border-gray-200">
                    <button 
                      onClick={() => {
                        setIsContactModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="bg-[#00B4D8] hover:bg-[#0096B3] text-white font-medium px-4 py-3 rounded-lg transition-colors text-center flex items-center justify-center gap-2 w-full"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">СВЯЗАТЬСЯ</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
      
      {/* Модальное окно контактов */}
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </header>
  );
};

export default Header;
