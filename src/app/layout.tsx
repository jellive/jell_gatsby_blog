import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Jell의 세상 사는 이야기',
    template: '%s | Jell의 세상 사는 이야기'
  },
  description: '개발자의 기술 블로그입니다.',
  keywords: ['개발', '프로그래밍'],
  authors: [{ name: 'Jell' }],
  creator: 'Jell',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://blog.jell.kr',
    siteName: 'Jell의 세상 사는 이야기',
    images: [
      {
        url: '/images/profile.jpeg',
        width: 1200,
        height: 630,
        alt: 'Jell의 세상 사는 이야기'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@Jell'
  },
  robots: {
    index: true,
    follow: true
  }
}
