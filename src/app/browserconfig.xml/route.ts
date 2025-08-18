import { NextRequest, NextResponse } from 'next/server'
import { siteConfig } from '@/lib/config'

export const dynamic = 'force-static'

export async function GET(request: NextRequest) {
  const browserconfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="/icons/icon-144x144.png"/>
      <TileColor>#3b82f6</TileColor>
    </tile>
  </msapplication>
</browserconfig>`

  return new NextResponse(browserconfig, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
