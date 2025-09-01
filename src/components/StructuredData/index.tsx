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
    // Calculate reading time (assuming average 200 words per minute, 4 chars per word in Korean)
    const textLength = data.description?.length || 1000
    const estimatedWords = Math.ceil(textLength / 4)
    const readingTimeMinutes = Math.max(1, Math.ceil(estimatedWords / 200))

    structuredData['@graph'].push({
      '@type': 'BlogPosting',
      '@id': `${data.url}/#article`,
      url: data.url || '',
      headline: data.title,
      alternativeHeadline: data.title,
      description: data.description,
      datePublished: data.datePublished,
      dateModified: data.dateModified || data.datePublished,
      author: {
        '@type': 'Person',
        '@id': `${siteConfig.siteUrl}/#person`,
        name: data.author || siteConfig.author,
        url: siteConfig.website,
        sameAs: [siteConfig.github, siteConfig.linkedin].filter(Boolean),
      },
      publisher: {
        '@type': 'Person',
        '@id': `${siteConfig.siteUrl}/#person`,
        name: siteConfig.author,
        url: siteConfig.website,
        logo: {
          '@type': 'ImageObject',
          url: `${siteConfig.siteUrl}/icons/icon-512x512.png`,
          width: 512,
          height: 512,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': data.url,
        url: data.url,
        name: data.title,
        isPartOf: {
          '@id': `${siteConfig.siteUrl}/#website`,
        },
        inLanguage: 'ko-KR',
        primaryImageOfPage: {
          '@id': `${data.url}/#primaryimage`,
        },
        breadcrumb: {
          '@id': `${data.url}/#breadcrumb`,
        },
      },
      inLanguage: 'ko-KR',
      keywords: data.tags?.join(', '),
      articleSection: data.category,
      about: {
        '@type': 'Thing',
        name: data.category,
      },
      mentions: data.tags?.map(tag => ({
        '@type': 'Thing',
        name: tag,
      })),
      image: {
        '@type': 'ImageObject',
        '@id': `${data.url}/#primaryimage`,
        url: `${siteConfig.siteUrl}/icons/icon-512x512.png`,
        contentUrl: `${siteConfig.siteUrl}/icons/icon-512x512.png`,
        width: 512,
        height: 512,
        caption: data.title,
      },
      wordCount: estimatedWords,
      timeRequired: `PT${readingTimeMinutes}M`,
      isAccessibleForFree: true,
      copyrightYear: new Date(data.datePublished || '').getFullYear(),
      copyrightHolder: {
        '@id': `${siteConfig.siteUrl}/#person`,
      },
    })

    // Add BreadcrumbList for better navigation context
    structuredData['@graph'].push({
      '@type': 'BreadcrumbList',
      '@id': `${data.url}/#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: '홈',
          item: siteConfig.siteUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: data.category,
          item: `${siteConfig.siteUrl}/tags/${encodeURIComponent(data.category || '')}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: data.title,
          item: data.url,
        },
      ],
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
