/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Temporarily disabled for dev server
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
    domains: [],
    formats: ['image/webp', 'image/avif']
  }
  // Static images in public/ are automatically served by Next.js
}

module.exports = nextConfig