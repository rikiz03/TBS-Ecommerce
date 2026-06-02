import type { NextConfig } from "next";

// Heartbeat to force dev-server refresh: 2026-04-06 16:12

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'dev-premiumvaluemarketbackend.pantheonsite.io'
      },
      {
        protocol: 'https',
        hostname: 'lightgray-newt-598121.hostingersite.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'lightgray-newt-598121.hostingersite.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'fastly.picsum.photos',
      }
    ],
  },
};

export default nextConfig;
