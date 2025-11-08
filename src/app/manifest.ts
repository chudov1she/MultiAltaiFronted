import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'МультиАлтай - Эксклюзивные участки в Горном Алтае',
    short_name: 'МультиАлтай',
    description: 'Продажа эксклюзивных земельных участков в Горном Алтае для инвестиций и развития',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A192F',
    theme_color: '#00B4D8',
    orientation: 'portrait',
    icons: [
      {
        src: '/images/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['business', 'real-estate', 'travel'],
    lang: 'ru',
    dir: 'ltr',
  };
}
