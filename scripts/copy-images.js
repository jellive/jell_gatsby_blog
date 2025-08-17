import fs from 'fs'
import path from 'path'
import { glob } from 'glob'

/**
 * Copy images from _posts to public/images for static export
 * This script processes all images in _posts directories and copies them 
 * to public/images with the hierarchical structure
 */

function copyImages() {
  console.log('📸 Starting image copy process...')
  
  const postsDir = path.join(process.cwd(), '_posts')
  const draftsDir = path.join(process.cwd(), '_drafts')
  const publicImagesDir = path.join(process.cwd(), 'public', 'images')
  
  // Ensure public/images directory exists
  if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true })
  }
  
  // Process both _posts and _drafts (for development)
  const directories = [postsDir]
  if (process.env.NODE_ENV === 'development' && fs.existsSync(draftsDir)) {
    directories.push(draftsDir)
  }
  
  let totalCopied = 0
  
  directories.forEach(baseDir => {
    if (!fs.existsSync(baseDir)) {
      console.log(`⚠️ Directory not found: ${baseDir}`)
      return
    }
    
    // Find all images directories
    const imagesDirs = glob.sync('**/images', { cwd: baseDir })
    
    imagesDirs.forEach(imagesDir => {
      const sourcePath = path.join(baseDir, imagesDir)
      const pathParts = imagesDir.split(path.sep)
      
      // Expected structure: category/year/month/day/images
      if (pathParts.length >= 5 && pathParts[4] === 'images') {
        const category = pathParts[0]
        const year = pathParts[1]
        const month = pathParts[2]
        const day = pathParts[3]
        
        const destPath = path.join(publicImagesDir, category, year, month, day, 'images')
        
        // Create destination directory
        if (!fs.existsSync(destPath)) {
          fs.mkdirSync(destPath, { recursive: true })
        }
        
        // Copy all image files
        const imageFiles = fs.readdirSync(sourcePath)
        imageFiles.forEach(imageFile => {
          const sourceFilePath = path.join(sourcePath, imageFile)
          const destFilePath = path.join(destPath, imageFile)
          
          // Check if it's a file (not a directory) and copy
          if (fs.statSync(sourceFilePath).isFile()) {
            fs.copyFileSync(sourceFilePath, destFilePath)
            totalCopied++
            console.log(`✅ Copied: ${category}/${year}/${month}/${day}/images/${imageFile}`)
          }
        })
      }
    })
  })
  
  console.log(`🎉 Image copy completed! Total files copied: ${totalCopied}`)
}

// Run the script
copyImages()