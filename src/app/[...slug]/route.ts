import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { headers } from 'next/headers'

export const runtime = 'nodejs'

/**
 * Dynamic image serving for blog post images
 * Handles URLs like: /bicycle/2018/08/24/images/filename.png
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const resolvedParams = await params
    const slug = resolvedParams.slug

    // Check if this is an image request (ends with images/filename.ext)
    if (slug.length >= 2 && slug[slug.length - 2] === 'images') {
      const imageName = slug[slug.length - 1]
      const pathParts = slug.slice(0, -2) // Remove 'images' and filename

      // Reconstruct the image path
      const imagePath = path.join(
        process.cwd(),
        '_posts',
        ...pathParts,
        'images',
        imageName
      )

      // Check if file exists
      if (!fs.existsSync(imagePath)) {
        return new NextResponse('Image not found', { status: 404 })
      }

      // Read the file
      const imageBuffer = fs.readFileSync(imagePath)
      
      // Determine content type based on file extension
      const ext = path.extname(imageName).toLowerCase()
      let contentType = 'application/octet-stream'
      
      switch (ext) {
        case '.png':
          contentType = 'image/png'
          break
        case '.jpg':
        case '.jpeg':
          contentType = 'image/jpeg'
          break
        case '.gif':
          contentType = 'image/gif'
          break
        case '.webp':
          contentType = 'image/webp'
          break
        case '.svg':
          contentType = 'image/svg+xml'
          break
      }

      // Return the image with appropriate headers
      return new NextResponse(imageBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Content-Length': imageBuffer.length.toString(),
        },
      })
    }

    // If not an image request, return 404
    return new NextResponse('Not Found', { status: 404 })
  } catch (error) {
    console.error('Error serving image:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}