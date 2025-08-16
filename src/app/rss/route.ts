import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/markdown'
import { siteConfig } from '@/lib/config'

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
    return c;
  });
}

export async function GET(request: NextRequest) {
  const posts = await getAllPosts()
  const latestPosts = posts.slice(0, 10) // Get latest 10 posts
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.title)}</title>
    <description>${escapeXml(siteConfig.description)}</description>
    <link>${siteConfig.siteUrl}</link>
    <atom:link href="${siteConfig.siteUrl}/rss" rel="self" type="application/rss+xml"/>
    <language>ko-KR</language>
    <managingEditor>${siteConfig.email} (${siteConfig.author})</managingEditor>
    <webMaster>${siteConfig.email} (${siteConfig.author})</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${latestPosts[0]?.frontMatter.date ? new Date(latestPosts[0].frontMatter.date).toUTCString() : new Date().toUTCString()}</pubDate>
    <ttl>1440</ttl>
    ${latestPosts
      .map((post) => {
        const postUrl = `${siteConfig.siteUrl}/posts/${post.slug}`
        const pubDate = new Date(post.frontMatter.date).toUTCString()
        
        return `    <item>
      <title>${escapeXml(post.frontMatter.title)}</title>
      <description><![CDATA[${post.content.substring(0, 200)}...]]></description>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(post.frontMatter.category)}</category>
      ${post.frontMatter.tags.map(tag => `<category>${escapeXml(tag)}</category>`).join('\n      ')}
      <content:encoded xmlns:content="http://purl.org/rss/1.0/modules/content/"><![CDATA[${post.htmlContent}]]></content:encoded>
    </item>`
      })
      .join('\n')}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  })
}