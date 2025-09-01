import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/markdown'
import { siteConfig } from '@/lib/config'

export const dynamic = 'force-static'

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '&':
        return '&amp;'
      case "'":
        return '&apos;'
      case '"':
        return '&quot;'
    }
    return c
  })
}

export async function GET() {
  const posts = await getAllPosts()
  const latestPosts = posts.slice(0, 20) // Increased to 20 posts for better feed

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(siteConfig.title)}</title>
    <description>${escapeXml(siteConfig.description)}</description>
    <link>${siteConfig.siteUrl}</link>
    <atom:link href="${siteConfig.siteUrl}/rss" rel="self" type="application/rss+xml"/>
    <language>ko-KR</language>
    <copyright>© ${new Date().getFullYear()} ${escapeXml(siteConfig.author)}</copyright>
    <managingEditor>${siteConfig.email} (${siteConfig.author})</managingEditor>
    <webMaster>${siteConfig.email} (${siteConfig.author})</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${latestPosts[0]?.frontMatter.date ? new Date(latestPosts[0].frontMatter.date).toUTCString() : new Date().toUTCString()}</pubDate>
    <generator>Next.js Blog by ${escapeXml(siteConfig.author)}</generator>
    <ttl>1440</ttl>
    <image>
      <url>${siteConfig.siteUrl}/icons/icon-512x512.png</url>
      <title>${escapeXml(siteConfig.title)}</title>
      <link>${siteConfig.siteUrl}</link>
      <width>512</width>
      <height>512</height>
    </image>
    ${latestPosts
      .map(post => {
        const postUrl = `${siteConfig.siteUrl}/posts/${post.slug}`
        const pubDate = new Date(post.frontMatter.date).toUTCString()
        const description = post.content
          .replace(/<[^>]*>/g, '')
          .substring(0, 300)
          .trim()
        const excerpt =
          description.length > 295
            ? description.substring(0, 295) + '...'
            : description

        return `    <item>
      <title>${escapeXml(post.frontMatter.title)}</title>
      <description><![CDATA[${excerpt}]]></description>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <dc:creator><![CDATA[${siteConfig.author}]]></dc:creator>
      <category><![CDATA[${post.frontMatter.category}]]></category>
      ${post.frontMatter.tags.map(tag => `      <category><![CDATA[${tag}]]></category>`).join('\n')}
      <content:encoded><![CDATA[
        <p><strong>카테고리:</strong> ${post.frontMatter.category}</p>
        <p><strong>태그:</strong> ${post.frontMatter.tags.join(', ')}</p>
        <hr/>
        ${post.htmlContent}
        <hr/>
        <p><a href="${postUrl}">원문 보기</a></p>
      ]]></content:encoded>
    </item>`
      })
      .join('\n')}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
