'use client'

import React, { useState } from 'react'
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  RedditShareButton,
  PocketShareButton,
  EmailShareButton
} from 'react-share'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { 
  faShare,
  faEnvelope,
  faLink,
  faCheck,
  faCopy,
  faTimes,
  faGlobe,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons'
import { 
  faFacebook,
  faTwitter,
  faLinkedin,
  faReddit,
  faWhatsapp,
  faTelegram
} from '@fortawesome/free-brands-svg-icons'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface ShareModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  url: string
  title: string
  excerpt?: string
}

export default function ShareModal({ 
  isOpen, 
  onOpenChange, 
  url, 
  title, 
  excerpt = '' 
}: ShareModalProps) {
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [copiedTitle, setCopiedTitle] = useState(false)

  const shareTitle = title
  const shareUrl = url
  const shareQuote = excerpt || title

  const copyToClipboard = async (text: string, type: 'url' | 'title') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'url') {
        setCopiedUrl(true)
        setTimeout(() => setCopiedUrl(false), 2000)
      } else {
        setCopiedTitle(true)
        setTimeout(() => setCopiedTitle(false), 2000)
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
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
        body: `${shareTitle}\n\n${shareUrl}`
      },
      color: "text-gray-600",
      bgColor: "hover:bg-gray-500/10"
    },
    {
      name: 'Facebook',
      icon: faFacebook,
      component: FacebookShareButton,
      props: {
        url: shareUrl,
        hashtag: "#blog"
      },
      color: "text-blue-600",
      bgColor: "hover:bg-blue-600/10"
    },
    {
      name: 'Twitter',
      icon: faTwitter,
      component: TwitterShareButton,
      props: {
        url: shareUrl,
        title: shareTitle
      },
      color: "text-sky-500",
      bgColor: "hover:bg-sky-500/10"
    },
    {
      name: 'LinkedIn',
      icon: faLinkedin,
      component: LinkedinShareButton,
      props: {
        url: shareUrl,
        title: shareTitle,
        summary: excerpt
      },
      color: "text-blue-700",
      bgColor: "hover:bg-blue-700/10"
    },
    {
      name: 'Reddit',
      icon: faReddit,
      component: RedditShareButton,
      props: {
        url: shareUrl,
        title: shareTitle
      },
      color: "text-orange-500",
      bgColor: "hover:bg-orange-500/10"
    },
    {
      name: 'Pocket',
      icon: faLink,
      component: PocketShareButton,
      props: {
        url: shareUrl,
        title: shareTitle
      },
      color: "text-red-500",
      bgColor: "hover:bg-red-500/10"
    }
  ]

  const nativeShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareQuote,
          url: shareUrl
        })
      } catch (error) {
        console.log('Native share cancelled or failed:', error)
      }
    }
  }

  const isNativeShareSupported = typeof navigator !== 'undefined' && 'share' in navigator

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-w-md w-full p-0",
        "border-border/50 bg-background/95 backdrop-blur-md"
      )}>
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Fa icon={faShare} className="text-primary text-lg" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                공유하기
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                이 포스트를 친구들과 공유해보세요
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Post Preview */}
          <div className={cn(
            "p-4 rounded-lg bg-secondary/30 border border-border/30",
            "space-y-3"
          )}>
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded bg-primary/10">
                <Fa icon={faGlobe} className="text-primary text-xs" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-foreground text-sm line-clamp-2">
                    {shareTitle}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(shareTitle, 'title')}
                    className="w-6 h-6 shrink-0"
                    title="제목 복사"
                  >
                    <Fa 
                      icon={copiedTitle ? faCheck : faCopy} 
                      className={cn(
                        "text-xs",
                        copiedTitle ? "text-green-500" : "text-muted-foreground"
                      )} 
                    />
                  </Button>
                </div>
                
                {excerpt && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {excerpt}
                  </p>
                )}
                
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs bg-background/50 px-2 py-1 rounded border text-muted-foreground truncate">
                    {shareUrl}
                  </code>
                  <Button
                    variant={copiedUrl ? "default" : "outline"}
                    size="sm"
                    onClick={() => copyToClipboard(shareUrl, 'url')}
                    className={cn(
                      "min-w-[60px] h-7 text-xs",
                      copiedUrl && "bg-green-500 hover:bg-green-600 text-white"
                    )}
                  >
                    {copiedUrl ? (
                      <>
                        <Fa icon={faCheck} className="mr-1 text-[10px]" />
                        복사됨
                      </>
                    ) : (
                      <>
                        <Fa icon={faCopy} className="mr-1 text-[10px]" />
                        복사
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Native Share (if supported) */}
          {isNativeShareSupported && (
            <>
              <Button
                onClick={nativeShare}
                className="w-full gap-3 h-12"
                size="lg"
              >
                <Fa icon={faShare} className="text-base" />
                <div className="text-left">
                  <div className="font-semibold">기기 공유 메뉴</div>
                  <div className="text-xs opacity-80">시스템 공유 옵션 사용</div>
                </div>
                <Fa icon={faExternalLinkAlt} className="text-xs ml-auto" />
              </Button>
              
              <div className="flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">또는</span>
                <Separator className="flex-1" />
              </div>
            </>
          )}

          {/* Social Share Buttons */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Fa icon={faShare} className="text-xs text-primary" />
              소셜 미디어
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              {shareButtons.map(({ name, icon, component: ShareComponent, props, color, bgColor }) => (
                <ShareComponent
                  key={name}
                  {...props}
                  aria-label={`${name}으로 공유하기`}
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-12 justify-start gap-3",
                      "border-border/50 hover:border-border",
                      "transition-all duration-200 hover:scale-105",
                      bgColor
                    )}
                  >
                    <Fa icon={icon} className={cn("text-base", color)} />
                    <span className="font-medium text-sm">{name}</span>
                  </Button>
                </ShareComponent>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className={cn(
            "p-3 rounded-lg bg-blue-500/5 border border-blue-500/20",
            "text-xs text-muted-foreground"
          )}>
            <div className="flex items-start gap-2">
              <Fa icon={faShare} className="text-blue-500 text-xs mt-0.5" />
              <div>
                <div className="font-medium text-blue-700 dark:text-blue-400 mb-1">
                  공유 팁
                </div>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• 링크를 복사하여 어디든 붙여넣기 가능</li>
                  <li>• 소셜 미디어별 최적화된 형태로 공유</li>
                  <li>• 모바일에서는 기기 공유 메뉴 활용</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}