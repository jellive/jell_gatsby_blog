# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog built with Gatsby v5, transitioning from Next.js back to Gatsby. The site serves Korean and English content across multiple categories including development, cycling, chat/personal, gaming, and notices. The blog is deployed on Netlify and uses a customized version of the "Borderless" theme.

## Development Commands

### Core Development
- `npm run develop` - Start development server
- `npm run start` - Alias for develop  
- `npm run build` - Build production site
- `npm run serve` - Serve built site locally
- `npm run clean` - Clean Gatsby cache and public folder

### Code Quality
- `npm run lint` - Run TSLint on TypeScript files
- `npm run type-check` - Run TypeScript compiler without emitting files
- `npm run tsc` - Run TypeScript compiler
- `npm run format` - Format code with Prettier

### Deployment
- `npm run deploy` - Clean, build, and deploy to GitHub Pages
- Build process: `rm -rf .cache/ && rm -rf public/ && gatsby build && gh-pages -b master -d public`

### Testing
- Tests not yet implemented (placeholder command exists)

## Architecture

### Content Structure
- **Blog Posts**: Located in `_posts/` with category-based folder structure
  - `bicycle/` - Cycling content
  - `chat/` - Personal/casual posts
  - `dev/` - Development content (algorithm, blog, docker, ios, js, linux, network)
  - `game/` - Gaming content
  - `notice/` - Site announcements
- **Draft Posts**: Located in `_drafts/` (included only in development)

### Core Configuration
- `config.js` - Main site configuration (title, author, social links, analytics)
- `gatsby-config.js` - Gatsby plugins and build configuration
- `gatsby-node.js` - Build-time page generation and content processing

### Source Architecture
- **Components**: Reusable React components in `src/components/`
  - `Layout/` - Main layout wrapper with header and navigation
  - `Header/` - Site header
  - `PostList/` - Blog post listing
  - `Bio/` - Author bio component
  - `Toc/` - Table of contents (inside and outside variants)
  - `seo.tsx` - SEO meta component
- **Templates**: Page templates in `src/templates/`
  - `Post.tsx` - Individual blog post template
- **Pages**: Static pages in `src/pages/`
  - `index.tsx` - Homepage
  - `search.tsx` - Search functionality
  - `tags.tsx` - Tag listing page
  - `404.tsx` - Error page
- **State Management**: Redux store in `src/state/` for simple path/size state
- **Utilities**: Typography configuration and SCSS variables in `src/utils/`

### Key Features
- **Markdown Processing**: Full remark ecosystem with syntax highlighting, math (KaTeX), emojis, and auto-linking
- **Commenting**: Disqus integration
- **Analytics**: Google Analytics integration
- **Advertising**: Google AdSense integration
- **Social Sharing**: Facebook, Twitter, LinkedIn, Reddit, Pocket, Email
- **Table of Contents**: Automatic TOC generation for posts
- **Series Support**: Post series with navigation
- **Image Processing**: Gatsby's responsive image processing
- **SEO**: Automated sitemap, RSS feed, robots.txt
- **PWA**: Manifest and offline support

### Build System
- **TypeScript**: Full TypeScript support with strict configuration
- **SCSS**: Sass preprocessing for styles
- **Linting**: TSLint with Prettier integration
- **Package Management**: Yarn with Yarn 4.4.0 (`packageManager: "yarn@4.4.0"`)

### Content Processing Pipeline
- Markdown files processed through `gatsby-transformer-remark`
- Automatic slug generation from file paths
- Series detection based on filename patterns
- Tag normalization and keyword extraction
- Date processing with timezone handling
- Frontmatter validation and defaults

### Deployment
- **Platform**: Netlify
- **Build**: Node.js 20 with esbuild bundler
- **Branch**: Deploys from `master` branch
- **Process**: Automatic builds on push, manual deploys via `npm run deploy`

## Development Notes

### File Organization
- Blog posts use date-based folder structure: `category/YYYY/MM/DD/post-name.md`
- Images stored alongside posts in `images/` subfolders
- Static assets in `static/` directory

### Content Guidelines
- Posts require frontmatter: `title`, `date`, `tags`
- Optional frontmatter: `keywords` (defaults to site title and author)
- Images referenced relatively from post directory
- Series posts use filename pattern ending with numbers

### Styling
- Component-scoped SCSS files alongside TypeScript files
- Global variables in `src/utils/variables.scss`
- Typography configuration in `src/utils/typography.ts`
- FontAwesome icons integrated throughout

### State Management
- Minimal Redux store for path and size state
- Wrapped at root level via `wrap-with-provider.tsx`
- Used primarily for component state coordination