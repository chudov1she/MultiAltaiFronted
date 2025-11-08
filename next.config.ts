import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Разрешаем любые картинки из интернета (любой протокол, любой хост, любой путь)
    domains: [],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/media/**',
      },
      
    ],
    // Отключаем Image Optimization для внешних изображений
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

