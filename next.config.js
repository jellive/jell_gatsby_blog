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
  // Disable React strict mode to prevent hydration issues
  reactStrictMode: false,
  // Experimental features for better static export
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-slot']
  }
}

module.exports = nextConfig