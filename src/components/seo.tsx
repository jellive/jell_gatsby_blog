import Head from 'next/head'
import { useRouter } from 'next/router'

interface SEOProps {
  title: string
  description?: string
  image?: string
  keywords?: string[]
}

export default function SEO({ title, description, image, keywords }: SEOProps) {
  const router = useRouter()
  const config = require('../../config')

  const siteMetadata = {
    title: config.title,
    description: config.description,
    author: config.author
  }

  const metaDescription = description || siteMetadata.description

  return (
    <Head>
      <title>{`${title} | ${siteMetadata.title}`}</title>
      <meta name="description" content={metaDescription} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}${router.asPath}`} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={siteMetadata.author} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Keywords */}
      {keywords && keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
    </Head>
  )
}
