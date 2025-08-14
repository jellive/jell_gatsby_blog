'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { faListUl } from '@fortawesome/free-solid-svg-icons'
import Disqus from '@/components/Comments/Disqus'
import { AdBanner } from '@/components/Analytics/GoogleAdSense'
import Toc from '@/components/Toc'
import BackNavigation from '@/components/BackNavigation'
import SocialShare from '@/components/SocialShare'
import { siteConfig } from '@/lib/config'
import { PostData } from '@/lib/markdown'

interface PostContentProps {
  post: PostData
  slug: string
}

export default function PostContent({ post, slug }: PostContentProps) {
  const [isInsideToc, setIsInsideToc] = useState(false)
  const [yList, setYList] = useState<number[]>([])
  
  // Scroll highlighting effect for TOC
  useEffect(() => {
    if (!post?.tableOfContents) return
    
    const hs = Array.from(document.querySelectorAll('h2, h3')) as Array<HTMLHeadingElement>
    const positions = hs.map((h) => h.offsetTop)
    setYList(positions)
  }, [post])
  
  useEffect(() => {
    if (!post?.tableOfContents || yList.length === 0) return
    
    const handleScroll = () => {
      const index = yList.filter((v: number) => v < window.pageYOffset).length - 1
      const aList = document.querySelectorAll('.toc.outside li a') as NodeListOf<HTMLAnchorElement>
      
      Array.from(aList).forEach((link, i) => {
        link.style.opacity = i === index ? '1' : '0.4'
      })
    }
    
    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [yList])

  // Format date like original Gatsby format
  const formattedDate = new Date(post.frontMatter.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  const isTableOfContents = post.tableOfContents && post.tableOfContents !== ''

  const postUrl = `${siteConfig.siteUrl}/posts/${slug}`
  const postExcerpt = post.content.substring(0, 160).replace(/\n/g, ' ').trim()

  return (
    <>
      {/* Back Navigation */}
      <BackNavigation 
        category={post.frontMatter.category}
        title={post.frontMatter.title}
      />
      
      <div className="blog-post-container">
        <div>
          <article className="blog-post">
            <h1 className="blog-post-title">
              {post.frontMatter.title}
            </h1>
            
            <div className="blog-post-info">
              <div>
                <span>{formattedDate}</span>
                <span>·</span>
                <ul className="blog-post-tag-list">
                  {post.frontMatter.tags.map((tag) => (
                    <li key={tag} className="blog-post-tag">
                      <Link href={`/tags/${encodeURIComponent(tag)}`}>
                        #{tag}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              {isTableOfContents && (
                <div className="blog-post-inside-toc">
                  <div
                    className="toc-button"
                    role="button"
                    onClick={() => setIsInsideToc(prev => !prev)}
                  >
                    <Fa icon={faListUl} />
                  </div>
                </div>
              )}
            </div>
            
            {isTableOfContents && (
              <div className="inside-toc-wrap" style={{ display: isInsideToc ? 'flex' : 'none' }}>
                <Toc isOutside={false} toc={post.tableOfContents} />
              </div>
            )}

            <div 
              className="blog-post-content"
              dangerouslySetInnerHTML={{ __html: post.htmlContent }}
            />
            
            {/* Social Share Component */}
            <SocialShare
              url={postUrl}
              title={post.frontMatter.title}
              excerpt={postExcerpt}
            />
          </article>
        </div>
        
        <AdBanner
          slot={siteConfig.googleAdsenseSlot}
          className="ad"
        />
        
        <div className="comments">
          <Disqus
            url={postUrl}
            identifier={slug}
            title={post.frontMatter.title}
          />
        </div>
      </div>
        
      {/* Outside TOC - fixed position */}
      {isTableOfContents && <Toc isOutside={true} toc={post.tableOfContents} />}
    </>
  )
}