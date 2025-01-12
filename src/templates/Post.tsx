import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { DiscussionEmbed } from 'disqus-react'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { faListUl, faLayerGroup, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import AdSense from 'react-adsense'
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  RedditShareButton,
  PocketShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  RedditIcon,
  PocketIcon,
  EmailIcon
} from 'react-share'

import Layout from '../components/Layout'
import Toc from '../components/Toc'
import SEO from '../components/seo'
import './post.scss'
import 'katex/dist/katex.min.css'
const config = require('../../config')

interface PostProps {
  post: {
    title: string
    date: string
    tags: string[]
    keywords: string[]
    html: string
    tableOfContents: string
    excerpt: string
    slug: string
  }
  series?: {
    title: string
    slug: string
    num: number
  }[]
}

const Post = ({ post, series = [] }: PostProps) => {
  const [isInsideToc, setIsInsideToc] = useState(false)
  const isTableOfContents = config.enablePostOfContents && post.tableOfContents !== ''

  const headings = React.useMemo(() => {
    if (typeof window === 'undefined') {
      console.log('Server-side rendering, skipping headings')
      return []
    }

    const content = document.querySelector('.blog-post-content')
    if (!content) {
      console.log('Blog post content not found')
      return []
    }

    const headingElements = Array.from(content.querySelectorAll('h1, h2, h3'))
    console.log('Found headings:', headingElements.length)

    return headingElements.map((heading) => {
      const id = heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, '-') || ''
      const title = heading.textContent || ''
      const level = parseInt(heading.tagName[1])

      console.log('Heading:', { id, title, level })
      return { id, title, level }
    })
  }, [post.html])

  useEffect(() => {
    console.log('isTableOfContents:', isTableOfContents)
    console.log('headings length:', headings.length)

    const content = document.querySelector('.blog-post-content')
    if (!content) {
      console.log('Content not found in useEffect')
      return
    }

    const elements = Array.from(content.querySelectorAll('h1, h2, h3'))
    console.log('Found elements in useEffect:', elements.length)

    elements.forEach((heading) => {
      if (!heading.id) {
        const newId = heading.textContent?.toLowerCase().replace(/\s+/g, '-') || ''
        heading.id = newId
        console.log('Added ID to heading:', newId)
      }
    })
  }, [post.html, isTableOfContents, headings.length])

  const TocWithLog = React.useMemo(() => {
    console.log('Rendering TOC with headings:', headings)
    return <Toc headings={headings} />
  }, [headings])

  return (
    <>
      <Head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
      </Head>

      <SEO title={post.title} description={post.excerpt} keywords={metaKeywords(post.keywords, post.tags)} />

      <Layout>
        <div className="blog-post-container">
          <div className="blog-post">
            <h1 className="blog-post-title">{post.title}</h1>

            <div className="blog-post-info">
              <span className="blog-post-date">{post.date}</span>

              {post.tags.length && post.tags[0] !== 'undefined' ? (
                <>
                  <span>·</span>
                  <ul className="blog-post-tag-list">{mapTags}</ul>
                </>
              ) : null}

              {!isTableOfContents ? null : (
                <div className="blog-post-inside-toc">
                  <div
                    className="toc-button"
                    role="button"
                    onClick={() => {
                      setIsInsideToc((prev: boolean) => {
                        return !prev
                      })
                    }}
                  >
                    <Fa icon={faListUl} />
                  </div>
                </div>
              )}
            </div>

            {isTableOfContents && (
              <div className="inside-toc-wrap" style={{ display: isInsideToc ? 'flex' : 'none' }}>
                <Toc headings={headings} />
              </div>
            )}

            {series.length > 1 ? (
              <>
                <div className="series">
                  <div className="series-head">
                    <span className="head">Post Series</span>
                    <div className="icon-wrap">
                      <Fa icon={faLayerGroup} />
                    </div>
                  </div>
                  <ul className="series-list">{mapSeries}</ul>
                </div>
              </>
            ) : null}

            <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: post.html }} />
          </div>

          {isSocialShare ? (
            <div className="social-share">
              <ul>
                <li className="social-share-item email">
                  <EmailShareButton url={config.siteUrl + post.slug}>
                    <EmailIcon size={24} round={true} />
                  </EmailShareButton>
                </li>
                <li className="social-share-item facebook">
                  <FacebookShareButton url={config.siteUrl + post.slug}>
                    <FacebookIcon size={24} round={true} />
                  </FacebookShareButton>
                </li>
                <li className="social-share-item twitter">
                  <TwitterShareButton url={config.siteUrl + post.slug}>
                    <TwitterIcon size={24} round={true} />
                  </TwitterShareButton>
                </li>
                <li className="social-share-item linkedin">
                  <LinkedinShareButton url={config.siteUrl + post.slug}>
                    <LinkedinIcon size={24} round={true} />
                  </LinkedinShareButton>
                </li>
                <li className="social-share-item reddit">
                  <RedditShareButton url={config.siteUrl + post.slug}>
                    <RedditIcon size={24} round={true} />
                  </RedditShareButton>
                </li>
                <li className="social-share-item pocket">
                  <PocketShareButton url={config.siteUrl + post.slug}>
                    <PocketIcon size={24} round={true} />
                  </PocketShareButton>
                </li>
              </ul>
            </div>
          ) : null}

          {isDevelopment ? (
            <>
              <aside className="ad ad-dev">
                <span>Ads</span>
                <span>displayed when you deploy</span>
              </aside>
              {isDisqus ? (
                <div className="comments comments-dev">
                  <span>Comments</span>
                  <span>displayed when you deploy</span>
                </div>
              ) : null}
            </>
          ) : (
            <>
              <aside className="ad">
                <AdSense.Google
                  client={config.googleAdsenseClient || 'ca-pub-5518615618879832'}
                  slot={config.googleAdsenseSlot || '6839238861'}
                  style={{ display: 'block' }}
                  format="auto"
                  responsive="true"
                />
              </aside>

              {isDisqus ? (
                <div className="comments">
                  <DiscussionEmbed {...disqusConfig} />
                </div>
              ) : null}
            </>
          )}
        </div>

        {isTableOfContents && headings.length > 0 && <div className="toc outside">{TocWithLog}</div>}
      </Layout>
    </>
  )
}

export default Post
