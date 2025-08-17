/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static export for Netlify deployment
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true, // Required for static export
    domains: [],
    formats: ['image/webp', 'image/avif']
  },
  // Additional optimization for static export
  distDir: 'out',
  assetPrefix: '',
  basePath: '',
  // Enable React strict mode - stable in Next.js 14.x
  reactStrictMode: true,
  // Remove experimental features - not needed in 14.x
  swcMinify: true,
  compress: true
}

module.exports = nextConfig