import type { MetadataRoute } from 'next'
import { getAllPosts, getAllTags } from '@/lib/markdown'
import { siteConfig } from '@/lib/config'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()
  const tags = await getAllTags()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteConfig.siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteConfig.siteUrl}/tags`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteConfig.siteUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Post pages
  const postPages: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${siteConfig.siteUrl}/posts/${post.slug}`,
    lastModified: new Date(post.frontMatter.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Tag pages
  const tagPages: MetadataRoute.Sitemap = tags.map(tag => ({
    url: `${siteConfig.siteUrl}/tags/${encodeURIComponent(tag)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...postPages, ...tagPages]
}
