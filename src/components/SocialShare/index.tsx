'use client'

import React, { useState } from 'react'
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  RedditShareButton,
  PocketShareButton,
  EmailShareButton,
} from 'react-share'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import {
  faShare,
  faEnvelope,
  faLink,
  faCheck,
  faExpand,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons'
import {
  faFacebook,
  faTwitter,
  faLinkedin,
  faReddit,
} from '@fortawesome/free-brands-svg-icons'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import ShareModal from '@/components/ShareModal'
import { cn } from '@/lib/utils'

interface SocialShareProps {
  url: string
  title: string
  excerpt?: string
}

export default function SocialShare({
  url,
  title,
  excerpt = '',
}: SocialShareProps) {
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const shareTitle = title
  const shareUrl = url
  const shareQuote = excerpt || title

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  const shareButtons = [
    {
      name: 'Email',
      icon: faEnvelope,
      component: EmailShareButton,
      props: {
        url: shareUrl,
        subject: shareTitle,
        body: `${shareTitle}\n\n${shareUrl}`,
      },
      className: 'hover:bg-gray-500/10 hover:text-gray-700',
    },
    {
      name: 'Facebook',
      icon: faFacebook,
      component: FacebookShareButton,
      props: {
        url: shareUrl,
        hashtag: '#blog',
      },
      className: 'hover:bg-blue-600/10 hover:text-blue-700',
    },
    {
      name: 'Twitter',
      icon: faTwitter,
      component: TwitterShareButton,
      props: {
        url: shareUrl,
        title: shareTitle,
      },
      className: 'hover:bg-sky-500/10 hover:text-sky-600',
    },
    {
      name: 'LinkedIn',
      icon: faLinkedin,
      component: LinkedinShareButton,
      props: {
        url: shareUrl,
        title: shareTitle,
        summary: excerpt,
      },
      className: 'hover:bg-blue-500/10 hover:text-blue-600',
    },
    {
      name: 'Reddit',
      icon: faReddit,
      component: RedditShareButton,
      props: {
        url: shareUrl,
        title: shareTitle,
      },
      className: 'hover:bg-orange-500/10 hover:text-orange-600',
    },
    {
      name: 'Pocket',
      icon: faLink,
      component: PocketShareButton,
      props: {
        url: shareUrl,
        title: shareTitle,
      },
      className: 'hover:bg-red-500/10 hover:text-red-600',
    },
  ]

  return (
    <Card
      className={cn(
        'social-share-card',
        'border-border/50 bg-card/50 backdrop-blur-sm',
        'transition-all duration-300 hover:border-border'
      )}
      data-testid="social-share"
    >
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Fa icon={faShare} className="text-lg text-primary" />
          <h4 className="text-lg font-semibold text-foreground">
            Share this post
          </h4>
          <div className="ml-auto flex items-center gap-2">
            {/* <Button
              variant="outline"
              size="sm"
              onClick={() => setIsShareModalOpen(true)}
              className="h-8 gap-2 text-xs"
              title="모달에서 공유하기"
            >
              <Fa icon={faExpand} className="text-xs" />
              모달로 공유
            </Button> */}
            <Badge variant="secondary" className="text-xs">
              Social
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* URL Copy Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Fa icon={faLink} className="text-xs" />
            <span className="font-medium">Copy link</span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={cn(
                'bg-secondary/50 flex-1 rounded-md px-3 py-2 text-sm',
                'border-border/30 truncate border text-muted-foreground'
              )}
            >
              {shareUrl}
            </div>
            <Button
              variant={copiedUrl ? 'default' : 'outline'}
              size="sm"
              onClick={copyToClipboard}
              className={cn(
                'min-w-[80px] transition-all duration-200',
                copiedUrl && 'bg-green-500 text-white hover:bg-green-600'
              )}
            >
              {copiedUrl ? (
                <>
                  <Fa icon={faCheck} className="mr-1 text-xs" />
                  Copied!
                </>
              ) : (
                'Copy'
              )}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Social Share Buttons */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Fa icon={faShare} className="text-xs" />
            <span className="font-medium">Share on social media</span>
          </div>

          <div className="grid grid-cols-3 gap-2 max-md:grid-cols-2">
            {shareButtons.map(
              ({ name, icon, component: ShareComponent, props, className }) => (
                <ShareComponent
                  key={name}
                  {...props}
                  aria-label={`${name}으로 공유하기`}
                  className="w-full"
                  data-testid={`share-${name.toLowerCase()}`}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      'h-10 w-full justify-start gap-2',
                      'border-border/50 hover:border-border',
                      'transition-all duration-200 hover:scale-105',
                      className
                    )}
                  >
                    <Fa icon={icon} className="text-sm" />
                    <span className="truncate text-sm font-medium">{name}</span>
                  </Button>
                </ShareComponent>
              )
            )}
          </div>
        </div>

        {/* Share Info */}
        <div
          className={cn(
            'bg-secondary/30 border-border/30 rounded-md border p-3',
            'text-xs text-muted-foreground'
          )}
        >
          <div className="mb-1 font-medium">{shareTitle}</div>
          {excerpt && <div className="line-clamp-2 opacity-80">{excerpt}</div>}
        </div>
      </CardContent>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onOpenChange={setIsShareModalOpen}
        url={shareUrl}
        title={shareTitle}
        excerpt={excerpt}
      />
    </Card>
  )
}
