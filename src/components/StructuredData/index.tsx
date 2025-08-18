'use client'

import { siteConfig } from '@/lib/config'

interface StructuredDataProps {
  type: 'website' | 'article' | 'blog'
  data?: {
    title?: string
    description?: string
    url?: string
    datePublished?: string
    dateModified?: string
    author?: string
    tags?: string[]
    category?: string
  }
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteConfig.siteUrl}/#website`,
        url: siteConfig.siteUrl,
        name: siteConfig.title,
        description: siteConfig.description,
        inLanguage: 'ko-KR',
        publisher: {
          '@id': `${siteConfig.siteUrl}/#person`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteConfig.siteUrl}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Person',
        '@id': `${siteConfig.siteUrl}/#person`,
        name: siteConfig.author,
        email: siteConfig.email,
        url: siteConfig.website,
        sameAs: [siteConfig.github, siteConfig.linkedin].filter(Boolean),
      },
    ],
  }

  if (type === 'article' && data) {
    ;(baseStructuredData['@graph'] as any[]).push({
      '@type': 'BlogPosting',
      '@id': `${data.url}/#article`,
      url: data.url || '',
      headline: data.title,
      description: data.description,
      datePublished: data.datePublished,
      dateModified: data.dateModified || data.datePublished,
      author: {
        '@id': `${siteConfig.siteUrl}/#person`,
      },
      publisher: {
        '@id': `${siteConfig.siteUrl}/#person`,
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': data.url,
      },
      inLanguage: 'ko-KR',
      keywords: data.tags?.join(', '),
      articleSection: data.category,
      image: {
        '@type': 'ImageObject',
        url: `${siteConfig.siteUrl}/icons/icon-512x512.png`,
        width: 512,
        height: 512,
      },
    })
  } else if (type === 'blog') {
    ;(baseStructuredData['@graph'] as any[]).push({
      '@type': 'Blog',
      '@id': `${siteConfig.siteUrl}/#blog`,
      url: siteConfig.siteUrl,
      name: siteConfig.title,
      description: siteConfig.description,
      inLanguage: 'ko-KR',
      publisher: {
        '@id': `${siteConfig.siteUrl}/#person`,
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': siteConfig.siteUrl,
      },
    })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(baseStructuredData, null, 2),
      }}
    />
  )
}
