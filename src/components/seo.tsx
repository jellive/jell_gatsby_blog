import Head from 'next/head'
import { useRouter } from 'next/router'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
}

const SEO = ({
  title,
  description = '개발자의 기술 블로그입니다.',
  keywords = ['개발', '프로그래밍'],
  image = '/images/profile.jpeg',
  url
}: SEOProps) => {
  const router = useRouter()
  const siteTitle = 'Jell의 세상 사는 이야기'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.jell.kr'
  const canonical = url ? `${siteUrl}${url}` : `${siteUrl}${router.asPath}`
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${image}`} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${image}`} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}

export default SEO
