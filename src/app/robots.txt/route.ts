import { NextRequest, NextResponse } from 'next/server'
import { siteConfig } from '@/lib/config'

export const dynamic = 'force-static'

export async function GET(request: NextRequest) {
  const robots = `User-agent: *
Allow: /

Sitemap: ${siteConfig.siteUrl}/sitemap.xml`

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
