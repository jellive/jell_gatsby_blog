'use client'

import React from 'react'
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
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

interface SocialShareProps {
  url: string
  title: string
  excerpt?: string
}

export default function SocialShare({ url, title, excerpt = '' }: SocialShareProps) {
  const shareTitle = title
  const shareUrl = url
  const shareQuote = excerpt || title

  return (
    <div className="social-share">
      <h4 className="social-share-title">Share this post</h4>
      <ul className="social-share-list">
        <li className="social-share-item email">
          <EmailShareButton
            url={shareUrl}
            subject={shareTitle}
            body={`${shareTitle}\n\n${shareUrl}`}
            aria-label="이메일로 공유하기"
          >
            <EmailIcon size={24} round />
          </EmailShareButton>
        </li>
        
        <li className="social-share-item facebook">
          <FacebookShareButton
            url={shareUrl}
            hashtag="#blog"
            aria-label="Facebook으로 공유하기"
          >
            <FacebookIcon size={24} round />
          </FacebookShareButton>
        </li>
        
        <li className="social-share-item twitter">
          <TwitterShareButton
            url={shareUrl}
            title={shareTitle}
            aria-label="Twitter로 공유하기"
          >
            <TwitterIcon size={24} round />
          </TwitterShareButton>
        </li>
        
        <li className="social-share-item linkedin">
          <LinkedinShareButton
            url={shareUrl}
            title={shareTitle}
            summary={excerpt}
            aria-label="LinkedIn으로 공유하기"
          >
            <LinkedinIcon size={24} round />
          </LinkedinShareButton>
        </li>
        
        <li className="social-share-item reddit">
          <RedditShareButton
            url={shareUrl}
            title={shareTitle}
            aria-label="Reddit으로 공유하기"
          >
            <RedditIcon size={24} round />
          </RedditShareButton>
        </li>
        
        <li className="social-share-item pocket">
          <PocketShareButton
            url={shareUrl}
            title={shareTitle}
            aria-label="Pocket으로 공유하기"
          >
            <PocketIcon size={24} round />
          </PocketShareButton>
        </li>
      </ul>
    </div>
  )
}