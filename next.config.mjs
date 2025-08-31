/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: false, // Desabilita otimização CSS que pode causar problemas
  },
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
