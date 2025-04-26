import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      // Optional: Add hostname for weather icons if using an API like OpenWeatherMap
      // {
      //   protocol: 'https',
      //   hostname: 'openweathermap.org',
      //   port: '',
      //   pathname: '/img/wn/**',
      // },
    ],
  },
  // Expose the API key to the client-side environment
  // Note: This makes the key public. Ensure your API provider allows client-side usage
  // or consider a backend proxy approach for better security if the key is sensitive.
  env: {
    NEXT_PUBLIC_WEATHER_API_KEY: process.env.WEATHER_API_KEY || '',
  },
};

export default nextConfig;
