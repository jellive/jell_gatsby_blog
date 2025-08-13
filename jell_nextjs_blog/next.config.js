/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
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