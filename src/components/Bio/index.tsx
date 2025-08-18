import React from 'react'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import {
  faUserCircle,
  faAt,
  faMapMarkerAlt,
  faLink,
  faAddressCard,
  faRss,
} from '@fortawesome/free-solid-svg-icons'
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faGithub,
} from '@fortawesome/free-brands-svg-icons'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { siteConfig } from '@/lib/config'
import { cn } from '@/lib/utils'

const Bio = () => {
  const {
    comment,
    name,
    company,
    location,
    email,
    website,
    linkedin,
    facebook,
    instagram,
    github,
    siteUrl,
  } = siteConfig

  // Count available social media links
  const socialLinks = [
    {
      url: github,
      icon: faGithub,
      label: 'GitHub 프로필',
      color: 'hover:bg-gray-500/10 hover:text-gray-700',
    },
    {
      url: linkedin,
      icon: faLinkedin,
      label: 'LinkedIn 프로필',
      color: 'hover:bg-blue-500/10 hover:text-blue-600',
    },
    {
      url: facebook,
      icon: faFacebook,
      label: 'Facebook 프로필',
      color: 'hover:bg-blue-600/10 hover:text-blue-700',
    },
    {
      url: instagram,
      icon: faInstagram,
      label: 'Instagram 프로필',
      color: 'hover:bg-pink-500/10 hover:text-pink-600',
    },
  ].filter(link => link.url && link.url.trim() !== '')

  const showConnectSection = socialLinks.length > 0

  return (
    <Card
      className={cn(
        'bio-card transition-all duration-300',
        'border-border/50 bg-card/50 backdrop-blur-sm',
        'hover:border-border hover:bg-card'
      )}
    >
      {comment && (
        <CardHeader className="pb-4">
          <p
            className={cn(
              'text-sm leading-relaxed text-muted-foreground',
              'font-medium italic'
            )}
          >
            {comment}
          </p>
        </CardHeader>
      )}

      <CardContent className="space-y-3">
        {/* Personal Information */}
        <div className="space-y-2">
          {name && (
            <div
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2',
                'bg-secondary/50 hover:bg-secondary/80 transition-colors'
              )}
            >
              <Fa icon={faUserCircle} className="text-sm text-primary" />
              <span className="text-sm font-medium text-foreground">
                {name}
              </span>
            </div>
          )}

          {company && (
            <div
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2',
                'bg-secondary/50 hover:bg-secondary/80 transition-colors'
              )}
            >
              <Fa icon={faAddressCard} className="text-sm text-primary" />
              <span className="text-sm font-medium text-foreground">
                {company}
              </span>
            </div>
          )}

          {location && (
            <div
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2',
                'bg-secondary/50 hover:bg-secondary/80 transition-colors'
              )}
            >
              <Fa icon={faMapMarkerAlt} className="text-sm text-primary" />
              <span className="text-sm font-medium text-foreground">
                {location}
              </span>
            </div>
          )}
        </div>

        {/* Contact Information */}
        {(email || website) && (
          <>
            <Separator className="my-4" />
            <div className="space-y-2">
              {email && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className={cn(
                    'h-auto justify-start gap-3 px-3 py-2',
                    'hover:bg-secondary/80 w-full'
                  )}
                >
                  <a href={`mailto:${email}`} className="text-left">
                    <Fa icon={faAt} className="text-sm text-primary" />
                    <span className="truncate text-sm">{email}</span>
                  </a>
                </Button>
              )}

              {website && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className={cn(
                    'h-auto justify-start gap-3 px-3 py-2',
                    'hover:bg-secondary/80 w-full'
                  )}
                >
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-left"
                  >
                    <Fa icon={faLink} className="text-sm text-primary" />
                    <span className="truncate text-sm">{website}</span>
                  </a>
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>

      {/* Social Media Links */}
      {showConnectSection && (
        <CardFooter className="pt-4">
          <div className="flex w-full items-center gap-2">
            {/* RSS Feed - Always show */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className={cn(
                'h-8 w-8 hover:bg-orange-500/10 hover:text-orange-600',
                'transition-all duration-200 hover:scale-110'
              )}
            >
              <a
                href={`${siteUrl}/rss`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="RSS 피드 구독"
              >
                <Fa icon={faRss} className="text-sm" />
              </a>
            </Button>

            {/* Dynamic Social Links */}
            {socialLinks.map((link, index) => (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                asChild
                className={cn(
                  'h-8 w-8',
                  link.color,
                  'transition-all duration-200 hover:scale-110'
                )}
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                >
                  <Fa icon={link.icon} className="text-sm" />
                </a>
              </Button>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

export default Bio
