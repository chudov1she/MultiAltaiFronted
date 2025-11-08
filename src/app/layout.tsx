import type { Metadata } from "next"
import { Play } from "next/font/google";
import "./globals.css"
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { fetchPrimaryContact } from "@/lib/api/fetchContacts";
import { Contact } from "@/types/site";

const play = Play({
  weight: ['400', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: "МультиАлтай - Эксклюзивные участки в Горном Алтае",
    template: "%s | МультиАлтай"
  },
  description: "Эксклюзивная недвижимость и земельные участки в сердце Алтая для жизни и выгодных инвестиций. Уникальные объекты в престижных локациях Горного Алтая и Алтайского края.",
  keywords: "МультиАлтай, недвижимость Горный Алтай, земельные участки Алтай, инвестиции в недвижимость, эксклюзивные участки, турбазы Алтай, отели Горный Алтай",
  authors: [{ name: "МультиАлтай" }],
  creator: "МультиАлтай",
  publisher: "МультиАлтай",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://multialtai.ru'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://multialtai.ru',
    siteName: 'МультиАлтай',
    title: 'МультиАлтай - Эксклюзивные участки в Горном Алтае',
    description: 'Эксклюзивная недвижимость и земельные участки в сердце Алтая для жизни и выгодных инвестиций.',
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
    description: 'Эксклюзивная недвижимость и земельные участки в сердце Алтая для жизни и выгодных инвестиций.',
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
  verification: {
    google: '66U22HJBI7aWWtf6qFeUJHLVp3yTT56jaWsrpCihWQ8',
    yandex: 'c3ac9fa39dacb865',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const contactData: Contact | null = await fetchPrimaryContact();

  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap" rel="stylesheet" />
        <meta name="google-site-verification" content="66U22HJBI7aWWtf6qFeUJHLVp3yTT56jaWsrpCihWQ8" />
      </head>
      <body className={play.className}>
        <Header />
        {children}
        <Footer contactData={contactData} />
      </body>
    </html>
  )
}