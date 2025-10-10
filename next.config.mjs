/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: false, // Desabilita otimização CSS que pode causar problemas
  },
  
  // Desabilita avisos de preload CSS em desenvolvimento
  ...(process.env.NODE_ENV === 'development' && {
    onDemandEntries: {
      maxInactiveAge: 25 * 1000,
      pagesBufferLength: 2,
    },
  }),
  webpack: (config, { dev }) => {
    if (dev) {
      // Em desenvolvimento, força a regeneração de CSS
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ['**/node_modules', '**/.git', '**/.next'],
      };
    }
    return config;
  },
};

export default nextConfig;
