import React from 'react'
import { siteConfig } from '@/lib/config'

const Bio = () => {
  const { comment, name, company, location, email, github, siteUrl } =
    siteConfig

  return (
    <aside className="bio">
      {/* Name */}
      {name && <div className="bio-name">{name}</div>}

      {/* Comment/Bio */}
      {comment && <p className="bio-comment">{comment}</p>}

      {/* Info lines */}
      <div className="bio-info">
        {company && <span className="bio-info-item">{company}</span>}
        {location && <span className="bio-info-item">{location}</span>}
        {email && (
          <a
            href={`mailto:${email}`}
            className="bio-info-link"
            aria-label={`${email}로 이메일 보내기`}
          >
            {email}
          </a>
        )}
      </div>

      {/* Social links - text based */}
      <div className="bio-links">
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="bio-link"
            aria-label="GitHub 프로필"
          >
            GitHub
          </a>
        )}
        <a
          href={`${siteUrl}/rss`}
          target="_blank"
          rel="noopener noreferrer"
          className="bio-link"
          aria-label="RSS 피드 구독"
        >
          RSS
        </a>
      </div>
    </aside>
  )
}

export default Bio
