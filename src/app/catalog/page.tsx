import React from 'react';
import { Metadata } from 'next';
import CatalogClient from '@/components/catalog/CatalogClient';

export const metadata: Metadata = {
  title: 'Каталог земельных участков в Горном Алтае - МультиАлтай',
  description: 'Каталог эксклюзивных земельных участков в Горном Алтае. Выберите идеальный участок для строительства турбазы, отеля или частного дома. Инвестиции в недвижимость Алтая.',
  keywords: 'каталог участков Алтай, земельные участки каталог, купить участок Горный Алтай, недвижимость каталог, инвестиции в участки',
  openGraph: {
    title: 'Каталог земельных участков в Горном Алтае',
    description: 'Выберите эксклюзивный участок для инвестиций и развития в Горном Алтае',
    type: 'website',
    locale: 'ru_RU',
    url: 'https://multialtai.ru/catalog',
    siteName: 'МультиАлтай',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://multialtai.ru/catalog',
  },
};

export default function CatalogPage() {
  return <CatalogClient />;
} 
