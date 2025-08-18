/** @type {import('next').NextConfig} */
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  // Conditional output for build vs dev
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export', // Enable static export for Netlify deployment only in production
    distDir: 'out',
  }),
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  // Generate unique build ID for cache busting
  generateBuildId: async () => {
    if (process.env.NODE_ENV === 'production') {
      // Use timestamp + commit hash for unique build ID
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      return `build-${timestamp}-${Date.now()}`
    }
    return 'development'
  },
  images: {
    unoptimized: true, // Required for static export
    domains: [],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
  },
  // Clean base configuration
  assetPrefix: '',
  basePath: '',
  // Enable React strict mode
  reactStrictMode: true,
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Experimental features for performance
  experimental: {
    optimizePackageImports: ['@fortawesome/react-fontawesome', 'lucide-react'],
  },
  // Headers for security and caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default withBundleAnalyzer(nextConfig)
