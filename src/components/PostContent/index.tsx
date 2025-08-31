'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import {
  faListUl,
  faCalendarAlt,
  faTag,
  faEye,
} from '@fortawesome/free-solid-svg-icons'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Disqus from '@/components/Comments/Disqus'
import { AdBanner } from '@/components/Analytics/GoogleAdSense'
import Toc from '@/components/Toc'
import BackNavigation from '@/components/BackNavigation'
import SocialShare from '@/components/SocialShare'
import ReadingProgress from '@/components/ReadingProgress'
import ImageModal from '@/components/ImageModal'
import { siteConfig } from '@/lib/config'
import type { PostData } from '@/lib/markdown'
import { cn } from '@/lib/utils'
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
    if (!post?.tableOfContents || yList.length === 0) return

    const handleScroll = () => {
      const index =
        yList.filter((v: number) => v < window.pageYOffset + 100).length - 1 // Add offset for better accuracy
      const aList = document.querySelectorAll(
        '.toc-container .toc-content a'
      ) as NodeListOf<HTMLAnchorElement>

      // Remove all active classes first
      Array.from(aList).forEach(link => {
        link.classList.remove('toc-active')
        link.style.opacity = ''
        link.style.fontWeight = ''
        link.style.color = ''
      })

      // Add active class to current heading
      if (index >= 0 && index < aList.length) {
        const activeLink = aList[index]
        if (activeLink) {
          activeLink.classList.add('toc-active')
        }
      }
    }

    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [yList])

  // Setup image click handlers for modal
  useEffect(() => {
    const timeout = setTimeout(() => {
      const contentElement = document.querySelector('.blog-post-content')
      if (!contentElement) return

      const imageElements = contentElement.querySelectorAll(
        'img'
      ) as NodeListOf<HTMLImageElement>
      if (imageElements.length === 0) return

      // Collect image data
      const imageData: ImageData[] = Array.from(imageElements).map(img => ({
        src: img.src,
        alt: img.alt || '',
        caption: img.title || img.getAttribute('data-caption') || '',
        width: img.naturalWidth || undefined,
        height: img.naturalHeight || undefined,
      }))

      setImages(imageData)

      // Add click handlers
      const handleImageClick = (index: number) => () => {
        setCurrentImageIndex(index)
        setIsImageModalOpen(true)
      }

      imageElements.forEach((img, index) => {
        // Style images for better UX
        img.style.cursor = 'zoom-in'
        img.style.transition = 'transform 0.2s ease, filter 0.2s ease'

        // Add hover effect
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

        // Store handlers for cleanup
        img.setAttribute('data-click-handler', 'true')
      })

      // Cleanup function
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
    }, 100) // Small delay to ensure content is rendered

    return () => {
      clearTimeout(timeout)
    }
  }, [post.htmlContent]) // Re-run when content changes

  // Hide TOC headers and code blocks since we have sidebar TOC - run immediately with no delay
  useEffect(() => {
    const hideTocElements = () => {
      const contentElement = document.querySelector('.blog-post-content')
      if (!contentElement) return

      // Immediately hide all TOC code blocks first
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

      // Find and hide TOC headers and their following elements
      const headings = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6')
      headings.forEach(heading => {
        const text = heading.textContent?.trim() || ''
        if (
          text === '목차' ||
          text === 'Table of contents' ||
          text === 'Table Of Contents'
        ) {
          // Immediately hide with inline style
          ;(heading as HTMLElement).style.display = 'none'
          heading.setAttribute('data-toc-title', 'true')

          // Also hide the next sibling element if it contains TOC content
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

    // Run immediately when component mounts
    hideTocElements()

    // Also run after a minimal delay to catch any dynamically added content
    const timeoutId = setTimeout(hideTocElements, 10)

    return () => clearTimeout(timeoutId)
  }, [post.htmlContent])

  // Format date like original Gatsby format
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
            <Card
              className={cn(
                'border-border/50 bg-card/50 backdrop-blur-sm',
                'transition-all duration-300 hover:border-border'
              )}
            >
              <CardHeader className="pb-4">
                <h1 className="text-2xl font-bold leading-tight text-foreground md:text-3xl">
                  {post.frontMatter.title}
                </h1>

                {/* Post Meta Information */}
                <div
                  className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground"
                  data-testid="post-metadata"
                >
                  <div
                    className="flex items-center gap-2"
                    data-testid="post-date"
                  >
                    <Fa icon={faCalendarAlt} className="text-xs" />
                    <span>{formattedDate}</span>
                  </div>

                  {post.frontMatter.category && (
                    <>
                      <Separator orientation="vertical" className="h-4" />
                      <div
                        className="flex items-center gap-2"
                        data-testid="post-category"
                      >
                        <Fa icon={faTag} className="text-xs" />
                        <span>{post.frontMatter.category}</span>
                      </div>
                    </>
                  )}

                  {post.frontMatter.tags.length > 0 && (
                    <>
                      <Separator orientation="vertical" className="h-4" />
                      <div className="flex items-center gap-2">
                        <Fa icon={faTag} className="text-xs" />
                        <div
                          className="flex flex-wrap gap-1"
                          data-testid="post-tags"
                        >
                          {post.frontMatter.tags.map(tag => (
                            <Link
                              key={tag}
                              href={`/tags/${encodeURIComponent(tag)}`}
                            >
                              <Badge
                                variant="outline"
                                className={cn(
                                  'hover:bg-primary hover:text-primary-foreground',
                                  'cursor-pointer text-xs transition-colors duration-200'
                                )}
                              >
                                #{tag}
                              </Badge>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {isTableOfContents && !isMobile && (
                    <>
                      <Separator orientation="vertical" className="h-4" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsInsideToc(prev => !prev)}
                        className={cn(
                          'h-8 gap-2 text-xs',
                          isInsideToc && 'bg-primary text-primary-foreground'
                        )}
                      >
                        <Fa icon={faListUl} className="text-xs" />
                        TOC {isInsideToc ? '숨기' : '보기'}
                      </Button>
                    </>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Inside TOC - collapsible (desktop only) */}
            {isTableOfContents && isInsideToc && !isMobile && (
              <div className="mt-6">
                <Toc isOutside={false} toc={post.tableOfContents} />
              </div>
            )}

            {/* Main Content */}
            <Card
              className={cn(
                'border-border/50 bg-card/30 mt-6 backdrop-blur-sm',
                'transition-all duration-300 hover:border-border'
              )}
            >
              <CardContent className="pt-6">
                <div
                  className={cn(
                    'blog-post-content prose prose-lg max-w-none',
                    'prose-headings:text-foreground prose-p:text-foreground',
                    'prose-strong:text-foreground prose-code:text-foreground',
                    'prose-a:text-primary hover:prose-a:text-primary/80',
                    'prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground',
                    'prose-img:rounded-lg prose-img:shadow-md'
                  )}
                  data-testid="post-body"
                  dangerouslySetInnerHTML={{ __html: post.htmlContent }}
                />
              </CardContent>
            </Card>

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
