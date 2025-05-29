const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error('Environment variable NEXT_PUBLIC_API_URL is not defined');
}

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    domains: ['yourcdn.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*', // Updated destination
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);