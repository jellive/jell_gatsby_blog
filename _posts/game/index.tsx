import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, Chip } from '@mui/material'

interface PostData {
  title: string
  date: string
  path: string
  tags: string[]
  category: string
  excerpt: string
  slug: string
  featuredImage?: {
    url: string
  }
}

interface IndexPageProps {
  posts: PostData[]
}

export default function GameIndex({ posts }: IndexPageProps) {
  return (
    <>
      <h1 style={{ textAlign: 'center' }}>Be the jell.</h1>
      <h3 style={{ textAlign: 'center', color: '#777' }}>이것저것 해보는 블로그입니다.</h3>
      <Card>
        <CardContent>
          {posts.map((post) => (
            <div key={post.title} style={{ padding: 15 }}>
              <Card>
                <CardContent>
                  <h3 style={{ marginBottom: 10 }}>
                    <Link href={post.slug}>
                      [{post.category}] {post.title} <span style={{ color: '#bbb' }}>- {post.date}</span>
                    </Link>
                  </h3>
                  <br />
                  {post.featuredImage && (
                    <Image src={post.featuredImage.url} alt={post.title} width={630} height={360} layout="responsive" />
                  )}
                  <p
                    style={{ fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}
                    dangerouslySetInnerHTML={{ __html: post.excerpt }}
                  />
                  <p style={{ fontSize: 12 }}>
                    Tag:{' '}
                    {post.tags.map((tag) => (
                      <Chip key={tag} label={tag} style={{ fontSize: 12 }} />
                    ))}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  )
}
