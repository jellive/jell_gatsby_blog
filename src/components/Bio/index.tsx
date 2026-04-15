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
    },
    {
      url: linkedin,
      icon: faLinkedin,
      label: 'LinkedIn 프로필',
    },
    {
      url: facebook,
      icon: faFacebook,
      label: 'Facebook 프로필',
    },
    {
      url: instagram,
      icon: faInstagram,
      label: 'Instagram 프로필',
    },
  ].filter(link => link.url && link.url.trim() !== '')

  const showConnectSection = socialLinks.length > 0

  return (
    <div
      className={cn(
        'bio-card',
        'surface-card rounded-2xl p-6',
        'transition-shadow duration-200 hover:shadow-md'
      )}
    >
      {/* Name - prominent */}
      {name && (
        <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">
          {name}
        </h2>
      )}

      {/* Comment */}
      {comment && (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {comment}
        </p>
      )}

      {/* Personal Information - simple list */}
      <div className="mt-5 space-y-0">
        {company && (
          <div className="border-border/30 flex items-center gap-3 border-b py-2.5">
            <Fa
              icon={faAddressCard}
              className="w-4 text-xs text-muted-foreground"
            />
            <span className="text-sm text-foreground">{company}</span>
          </div>
        )}

        {location && (
          <div className="border-border/30 flex items-center gap-3 border-b py-2.5">
            <Fa
              icon={faMapMarkerAlt}
              className="w-4 text-xs text-muted-foreground"
            />
            <span className="text-sm text-foreground">{location}</span>
          </div>
        )}

        {email && (
          <div className="border-border/30 flex items-center gap-3 border-b py-2.5">
            <Fa icon={faAt} className="w-4 text-xs text-muted-foreground" />
            <a
              href={`mailto:${email}`}
              className="truncate text-sm text-foreground transition-colors duration-200 hover:text-primary"
            >
              {email}
            </a>
          </div>
        )}

        {website && (
          <div className="flex items-center gap-3 py-2.5">
            <Fa icon={faLink} className="w-4 text-xs text-muted-foreground" />
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-sm text-foreground transition-colors duration-200 hover:text-primary"
            >
              {website}
            </a>
          </div>
        )}
      </div>

      {/* Social Media Links */}
      {showConnectSection && (
        <div className="mt-5 flex items-center gap-1">
          {/* RSS Feed */}
          <a
            href={`${siteUrl}/rss`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="RSS 피드 구독"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
          >
            <Fa icon={faRss} className="text-sm" />
          </a>

          {/* Dynamic Social Links */}
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
            >
              <Fa icon={link.icon} className="text-sm" />
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default Bio
