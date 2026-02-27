'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Disqus from '@/components/Comments/Disqus'
import { AdBanner } from '@/components/Analytics/GoogleAdSense'
import Toc from '@/components/Toc'
import BackNavigation from '@/components/BackNavigation'
import SocialShare from '@/components/SocialShare'
import ReadingProgress from '@/components/ReadingProgress'
import ImageModal from '@/components/ImageModal'
import { siteConfig } from '@/lib/config'
import type { PostData } from '@/lib/markdown'
import { useMobileOptimization } from '@/hooks/useDeviceType'

interface ImageData {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
}

interface PostContentProps {
  post: PostData
  slug: string
}

export default function PostContent({ post, slug }: PostContentProps) {
  const [isInsideToc, setIsInsideToc] = useState(false)
  const [yList, setYList] = useState<number[]>([])

  // Mobile optimization hook
  const { isMobile, desktopOnly } = useMobileOptimization()

  // Image modal state
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [images, setImages] = useState<ImageData[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Scroll highlighting effect for TOC
  useEffect(() => {
    if (!post?.tableOfContents) return

    const hs = Array.from(
      document.querySelectorAll('h2, h3')
    ) as Array<HTMLHeadingElement>
    const positions = hs.map(h => h.offsetTop)
    setYList(positions)
  }, [post])

  useEffect(() => {
    if (!post?.tableOfContents || yList.length === 0) return undefined

    const handleScroll = () => {
      const index =
        yList.filter((v: number) => v < window.pageYOffset + 100).length - 1
      const aList = document.querySelectorAll(
        '.toc-container .toc-content a'
      ) as NodeListOf<HTMLAnchorElement>

      Array.from(aList).forEach(link => {
        link.classList.remove('toc-active')
        link.style.opacity = ''
        link.style.fontWeight = ''
        link.style.color = ''
      })

      if (index >= 0 && index < aList.length) {
        const activeLink = aList[index]
        if (activeLink) {
          activeLink.classList.add('toc-active')
        }
      }
    }

    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [yList, post?.tableOfContents])

  // Setup image click handlers for modal
  useEffect(() => {
    const timeout = setTimeout(() => {
      const contentElement = document.querySelector('.blog-post-content')
      if (!contentElement) return undefined

      const imageElements = contentElement.querySelectorAll(
        'img'
      ) as NodeListOf<HTMLImageElement>
      if (imageElements.length === 0) return undefined

      const imageData: ImageData[] = Array.from(imageElements).map(img => ({
        src: img.src,
        alt: img.alt ?? '',
        caption: img.title ?? img.getAttribute('data-caption') ?? '',
        width: img.naturalWidth || undefined,
        height: img.naturalHeight || undefined,
      }))

      setImages(imageData)

      const handleImageClick = (index: number) => () => {
        setCurrentImageIndex(index)
        setIsImageModalOpen(true)
      }

      imageElements.forEach((img, index) => {
        img.style.cursor = 'zoom-in'
        img.style.transition = 'transform 0.2s ease, filter 0.2s ease'

        const handleMouseEnter = () => {
          img.style.transform = 'scale(1.02)'
          img.style.filter = 'brightness(1.1)'
        }

        const handleMouseLeave = () => {
          img.style.transform = 'scale(1)'
          img.style.filter = 'brightness(1)'
        }

        const clickHandler = handleImageClick(index)

        img.addEventListener('click', clickHandler)
        img.addEventListener('mouseenter', handleMouseEnter)
        img.addEventListener('mouseleave', handleMouseLeave)

        img.setAttribute('data-click-handler', 'true')
      })

      return () => {
        imageElements.forEach(img => {
          if (img.getAttribute('data-click-handler')) {
            img.removeEventListener('click', handleImageClick(0))
            img.removeEventListener('mouseenter', () => {})
            img.removeEventListener('mouseleave', () => {})
            img.removeAttribute('data-click-handler')
            img.style.cursor = ''
            img.style.transform = ''
            img.style.filter = ''
            img.style.transition = ''
          }
        })
      }
    }, 100)

    return () => {
      clearTimeout(timeout)
    }
  }, [post.htmlContent])

  // Hide TOC headers and code blocks since we have sidebar TOC
  useEffect(() => {
    const hideTocElements = () => {
      const contentElement = document.querySelector('.blog-post-content')
      if (!contentElement) return

      const tocCodeBlocks = contentElement.querySelectorAll(
        'pre code[class*="language-toc"], pre code[class*="toc"], .table-of-contents, .toc'
      )
      tocCodeBlocks.forEach(element => {
        ;(element as HTMLElement).style.display = 'none'
        if (
          element.tagName === 'CODE' &&
          element.parentElement?.tagName === 'PRE'
        ) {
          ;(element.parentElement as HTMLElement).style.display = 'none'
        }
      })

      const headings = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6')
      headings.forEach(heading => {
        const text = heading.textContent?.trim() || ''
        if (
          text === '목차' ||
          text === 'Table of contents' ||
          text === 'Table Of Contents'
        ) {
          ;(heading as HTMLElement).style.display = 'none'
          heading.setAttribute('data-toc-title', 'true')

          let nextElement = heading.nextElementSibling
          while (nextElement) {
            const isCodeBlock =
              nextElement.tagName === 'PRE' || nextElement.querySelector('code')
            const isEmpty = nextElement.textContent?.trim() === ''
            const isTocBlock =
              nextElement.classList?.contains('table-of-contents') ||
              nextElement.innerHTML?.includes('table-of-contents') ||
              nextElement.querySelector('code[class*="language-toc"]') ||
              nextElement.querySelector('code[class*="toc"]')

            if (isCodeBlock || isEmpty || isTocBlock) {
              ;(nextElement as HTMLElement).style.display = 'none'
              nextElement = nextElement.nextElementSibling
            } else {
              break
            }
          }
        }
      })
    }

    hideTocElements()

    const timeoutId = setTimeout(hideTocElements, 10)

    return () => clearTimeout(timeoutId)
  }, [post.htmlContent])

  const formattedDate = new Date(post.frontMatter.date).toLocaleDateString(
    'ko-KR',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  )

  const isTableOfContents = post.tableOfContents && post.tableOfContents !== ''

  const postUrl = `${siteConfig.siteUrl}/posts/${slug}`
  const postExcerpt = post.content.substring(0, 160).replace(/\n/g, ' ').trim()

  return (
    <>
      {/* Reading Progress Indicator */}
      <ReadingProgress target=".blog-post-content" />

      {/* Back Navigation */}
      <BackNavigation
        category={post.frontMatter.category}
        title={post.frontMatter.title}
      />

      <div className="blog-post-container" data-testid="post-content">
        <div>
          <article className="blog-post">
            {/* Post Header */}
            <div className="post-content-header">
              <h1 className="post-content-title">{post.frontMatter.title}</h1>

              {/* Post Meta Information */}
              <div className="post-content-meta" data-testid="post-metadata">
                <span className="post-content-date" data-testid="post-date">
                  {formattedDate}
                </span>

                {post.frontMatter.category && (
                  <>
                    <span className="post-content-sep" aria-hidden="true">
                      /
                    </span>
                    <span
                      className="post-content-category"
                      data-testid="post-category"
                    >
                      {post.frontMatter.category}
                    </span>
                  </>
                )}

                {isTableOfContents && !isMobile && (
                  <>
                    <span className="post-content-sep" aria-hidden="true">
                      /
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsInsideToc(prev => !prev)}
                      className={
                        isInsideToc
                          ? 'post-content-toc-btn post-content-toc-btn--active'
                          : 'post-content-toc-btn'
                      }
                    >
                      TOC {isInsideToc ? '숨기기' : '보기'}
                    </button>
                  </>
                )}
              </div>

              {/* Tags row */}
              {post.frontMatter.tags.length > 0 && (
                <div className="post-content-tags" data-testid="post-tags">
                  {post.frontMatter.tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/tags/${encodeURIComponent(tag)}`}
                      className="post-content-tag"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Inside TOC - collapsible (desktop only) */}
            {isTableOfContents && isInsideToc && !isMobile && (
              <div className="mt-6">
                <Toc isOutside={false} toc={post.tableOfContents} />
              </div>
            )}

            {/* Main Content */}
            <div className="post-content-body">
              <div
                className="blog-post-content prose prose-lg prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-img:rounded-lg prose-img:shadow-md max-w-none"
                data-testid="post-body"
                dangerouslySetInnerHTML={{ __html: post.htmlContent }}
              />
            </div>

            {/* Social Share Component */}
            <div className="mt-6">
              <SocialShare
                url={postUrl}
                title={post.frontMatter.title}
                excerpt={postExcerpt}
              />
            </div>
          </article>
        </div>

        <AdBanner slot={siteConfig.googleAdsenseSlot} className="ad" />
      </div>

      {/* Outside TOC - fixed position (desktop only) */}
      {desktopOnly(
        isTableOfContents && <Toc isOutside={true} toc={post.tableOfContents} />
      )}

      {/* Comments moved to bottom */}
      <div className="comments-bottom" data-testid="comments">
        <div className="mx-auto mb-8 mt-16 max-w-[728px] px-6">
          <Disqus
            url={postUrl}
            identifier={slug}
            title={post.frontMatter.title}
          />
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isImageModalOpen}
        onOpenChange={setIsImageModalOpen}
        images={images}
        currentIndex={currentImageIndex}
        onIndexChange={setCurrentImageIndex}
      />
    </>
  )
}
