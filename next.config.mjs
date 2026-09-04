/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    outputFileTracingIncludes: {
      "/**/*": ["./prisma/dev.db", "./prisma/schema.prisma"],
    },
  },
};

export default nextConfig;
