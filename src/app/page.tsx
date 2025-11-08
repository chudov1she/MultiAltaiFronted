import React from 'react';
import { Metadata } from 'next';
import Hero from '@/components/sections/Hero';
import WhyAltai from '@/components/sections/WhyAltai';
import SpecialOffer from '@/components/sections/SpecialOffer';
import RecommendedListings from '@/components/sections/RecommendedListings';

export const metadata: Metadata = {
  title: 'МультиАлтай - Продажа эксклюзивных земельных участков в Горном Алтае',
  description: 'Инвестируйте в земли, перспективные строительные проекты и готовый бизнес в экологически чистом регионе России. Эксклюзивные участки для строительства турбаз, отелей и частных домов.',
  keywords: 'земельные участки Горный Алтай, купить участок Алтай, недвижимость Горный Алтай, инвестиции в Алтай, участки для турбаз, эксклюзивная недвижимость',
  openGraph: {
    title: 'МультиАлтай - Эксклюзивные участки в Горном Алтае',
    description: 'Продажа эксклюзивных земельных участков для инвестиций и развития в Горном Алтае',
    type: 'website',
    locale: 'ru_RU',
    url: 'https://multialtai.ru',
    siteName: 'МультиАлтай',
    images: [
      {
        url: '/images/altai-panorama.webp',
        width: 1200,
        height: 630,
        alt: 'Панорамный пейзаж Горного Алтая',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'МультиАлтай - Эксклюзивные участки в Горном Алтае',
    description: 'Продажа эксклюзивных земельных участков для инвестиций и развития в Горном Алтае',
    images: ['/images/altai-panorama.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://multialtai.ru',
  },
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <WhyAltai />
      <SpecialOffer />
      <RecommendedListings />
    </main>
  );
}
