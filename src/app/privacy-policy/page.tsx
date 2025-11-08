import React from 'react';
import PrivacyPolicyContent from '@/components/privacy-policy/PrivacyPolicyContent';

export const metadata = {
  title: 'Политика конфиденциальности МультиАлтай - Защита персональных данных',
  description: 'Политика конфиденциальности МультиАлтай. Узнайте, как мы защищаем ваши персональные данные при работе с недвижимостью в Горном Алтае.',
  keywords: 'политика конфиденциальности, защита данных, МультиАлтай, недвижимость Алтай, персональные данные',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://multialtai.ru/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyContent />;
}
