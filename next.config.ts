import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: false,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',
        pathname: '/api/portraits/**',
      },
    ],
  },
};

export default nextConfig;
