'use client'

import { siteConfig } from '@/lib/config'

interface StructuredDataProps {
  type: 'website' | 'article' | 'blog'
  includeBaseData?: boolean // Control whether to include base website/person data
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

export default function StructuredData({
  type,
  data,
  includeBaseData = true,
}: StructuredDataProps) {
  const structuredData: any = {
    '@context': 'https://schema.org',
  }

  // Only include base data if explicitly requested (default true for backward compatibility)
  if (includeBaseData) {
    structuredData['@graph'] = [
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
    ]
  } else {
    structuredData['@graph'] = []
  }

  if (type === 'article' && data) {
    structuredData['@graph'].push({
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
    structuredData['@graph'].push({
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
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  )
}
