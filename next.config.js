/** @type {import('next').NextConfig} */
// Conditionally import bundle analyzer (only available in development)
let withBundleAnalyzer = config => config

if (process.env.NODE_ENV !== 'production') {
  try {
    const bundleAnalyzer = require('@next/bundle-analyzer')
    withBundleAnalyzer = bundleAnalyzer({
      enabled: process.env.ANALYZE === 'true',
    })
  } catch (error) {
    // Bundle analyzer not available, continue without it
    console.log('Bundle analyzer not available, continuing without it')
  }
}

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
    domains: ['avatars.githubusercontent.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'blog.jell.kr',
      },
      {
        protocol: 'https',
        hostname: 'jell-gatsby-blog.netlify.app',
      },
    ],
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
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },
  // ESLint configuration for build
  eslint: {
    // Only run ESLint on these directories during build
    dirs: ['src'],
    // Allow production builds to complete even with ESLint warnings
    ignoreDuringBuilds: false,
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
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com *.google-analytics.com *.googlesyndication.com *.doubleclick.net *.gstatic.com *.disqus.com *.disquscdn.com",
              "style-src 'self' 'unsafe-inline' *.googleapis.com *.gstatic.com *.disquscdn.com",
              "img-src 'self' data: *.googletagmanager.com *.google-analytics.com *.googlesyndication.com *.doubleclick.net *.gstatic.com *.disqus.com *.disquscdn.com *.gravatar.com github.com *.githubusercontent.com",
              "font-src 'self' *.gstatic.com *.googleapis.com",
              "connect-src 'self' *.google-analytics.com *.analytics.google.com *.googletagmanager.com *.disqus.com *.disquscdn.com",
              'frame-src *.googlesyndication.com *.doubleclick.net *.disqus.com',
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join('; '),
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
