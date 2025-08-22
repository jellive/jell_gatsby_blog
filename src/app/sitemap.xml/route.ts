import { NextResponse } from 'next/server'
import { getAllPosts, getAllTags } from '@/lib/markdown'
import { siteConfig } from '@/lib/config'

export const dynamic = 'force-static'

export async function GET() {
  const posts = await getAllPosts()
  const tags = await getAllTags()

  const staticRoutes = ['', '/tags', '/search']

  const postRoutes = posts.map(post => `/posts/${post.slug}`)
  const tagRoutes = tags.map(tag => `/tags/${encodeURIComponent(tag)}`)

  const allRoutes = [...staticRoutes, ...postRoutes, ...tagRoutes]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allRoutes
    .map(route => {
      const url = `${siteConfig.siteUrl}${route}`
      const lastmod = route.startsWith('/posts/')
        ? posts.find(post => `/posts/${post.slug}` === route)?.frontMatter.date
        : new Date().toISOString().split('T')[0]

      const priority =
        route === ''
          ? '1.0'
          : route.startsWith('/posts/')
            ? '0.8'
            : route.startsWith('/tags/')
              ? '0.6'
              : '0.7'

      return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${priority}</priority>
  </url>`
    })
    .join('\n')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
