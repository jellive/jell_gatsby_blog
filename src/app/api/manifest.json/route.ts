import { NextResponse } from 'next/server'

export async function GET() {
  const manifest = {
    "name": "Jell의 세상 사는 이야기",
    "short_name": "Jell의 세상 사는 이야기",
    "description": "이것 저것 해보는 블로그입니다.",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#3b82f6",
    "lang": "ko",
    "orientation": "portrait-primary",
    "icons": [
      {
        "src": "/icons/icon-48x48.png",
        "sizes": "48x48",
        "type": "image/png"
      },
      {
        "src": "/icons/icon-72x72.png",
        "sizes": "72x72",
        "type": "image/png"
      },
      {
        "src": "/icons/icon-96x96.png",
        "sizes": "96x96",
        "type": "image/png"
      },
      {
        "src": "/icons/icon-144x144.png",
        "sizes": "144x144",
        "type": "image/png"
      },
      {
        "src": "/icons/icon-192x192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/icons/icon-256x256.png",
        "sizes": "256x256",
        "type": "image/png"
      },
      {
        "src": "/icons/icon-384x384.png",
        "sizes": "384x384",
        "type": "image/png"
      },
      {
        "src": "/icons/icon-512x512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ],
    "categories": ["lifestyle", "news", "technology"],
    "scope": "/",
    "prefer_related_applications": false
  }

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
    },
  })
}