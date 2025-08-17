/** @type {import('next').NextConfig} */
const nextConfig = {
  // Conditional output for build vs dev
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export', // Enable static export for Netlify deployment only in production
    distDir: 'out',
  }),
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true, // Required for static export
    domains: [],
    formats: ['image/webp', 'image/avif']
  },
  // Clean base configuration
  assetPrefix: '',
  basePath: '',
  // Enable React strict mode
  reactStrictMode: true,
  // Note: swcMinify removed in Next.js 15 - SWC is default now
  // Note: compress removed - Next.js handles compression automatically
}

module.exports = nextConfig