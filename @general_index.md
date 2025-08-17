# General Index - Codebase File Structure

This file contains a list of all the files in the codebase along with a simple description of what each file does.

## Project Overview

This is a personal blog that has been migrated from Gatsby to Next.js. The project contains both the current Next.js implementation and a backup of the original Gatsby implementation.

---

## 📁 Root Configuration Files

| File | Description |
|------|-------------|
| `package.json` | Next.js project dependencies and scripts configuration |
| `package-lock.json` | NPM dependency lock file for Next.js project |
| `next.config.js` | Next.js configuration for static export and deployment |
| `tailwind.config.js` | Tailwind CSS configuration with custom design tokens |
| `postcss.config.js` | PostCSS configuration for Tailwind CSS processing |
| `tsconfig.json` | TypeScript compiler configuration |
| `tsconfig.tsbuildinfo` | TypeScript incremental compilation cache |
| `netlify.toml` | Netlify deployment configuration and headers |
| `components.json` | Shadcn UI component library configuration |
| `CLAUDE.md` | Claude Code AI assistant project documentation and guidelines |
| `design-system.md` | Modern Tech Blog Design System documentation |
| `README.md` | Project documentation and setup instructions |
| `LICENSE` | MIT license file |
| `Dockerfile` | Docker container configuration |

---

## 🔧 Type Definitions

| File | Description |
|------|-------------|
| `@types/react-adsense.d.ts` | TypeScript definitions for React AdSense component |
| `next-env.d.ts` | Next.js TypeScript environment declarations |

---

## 📝 Content Structure

### Blog Posts (`_posts/`)
Organized by category and date structure: `category/YYYY/MM/DD/post-name.md`

#### Categories:
- **`bicycle/`** - Cycling and sports-related content
- **`chat/`** - Personal thoughts, casual posts, life updates  
- **`dev/`** - Development and technical content
  - `algorithm/` - Coding challenges and problem-solving
  - `blog/` - Blog platform development
  - `docker/` - Containerization tutorials
  - `ios/` - iOS development and Swift
  - `js/` - JavaScript and TypeScript content
  - `linux/` - Linux system administration
  - `network/` - Networking and infrastructure
- **`game/`** - Gaming-related posts
- **`notice/`** - Site announcements and updates

### Draft Posts (`_drafts/`)
Work-in-progress posts following same structure as published posts

---

## ⚛️ Next.js Application Structure (`src/`)

### App Router (`src/app/`)

| File/Directory | Description |
|----------------|-------------|
| `layout.tsx` | Root layout component with theme provider and global styles |
| `page.tsx` | Homepage with bio sidebar and post list layout |
| `globals.css` | Global CSS styles with Tailwind base and custom properties |

#### Pages
| Route | File | Description |
|-------|------|-------------|
| `/posts/[slug]` | `posts/[slug]/page.tsx` | Individual blog post page with dynamic routing |
| `/search` | `search/page.tsx` | Search functionality page |
| `/tags` | `tags/page.tsx` | All tags listing page |
| `/tags/[tag]` | `tags/[tag]/page.tsx` | Tag-specific posts page |
| `/tags/[tag]` | `tags/[tag]/not-found.tsx` | 404 page for invalid tags |

#### API Routes (`src/app/api/`)
| Route | File | Description |
|-------|------|-------------|
| `/api/posts` | `posts/route.ts` | Blog posts API endpoint |
| `/api/manifest.json` | `manifest.json/route.ts` | PWA manifest API |
| `/browserconfig.xml` | `browserconfig.xml/route.ts` | IE tile configuration |
| `/robots.txt` | `robots.txt/route.ts` | Search engine robots file |
| `/sitemap.xml` | `sitemap.xml/route.ts` | XML sitemap generation |
| `/rss` | `rss/route.ts` | RSS feed generation |

### React Components (`src/components/`)

#### Core Components
| Component | Description |
|-----------|-------------|
| `Header/` | Site header with navigation and theme toggle |
| `Bio/` | Author bio component with profile and social links |
| `PostList/` | Blog post listing with card-based layout |
| `Toc/` | Table of contents component for blog posts |
| `ThemeToggle/` | Dark/light/system theme switcher |
| `BackNavigation/` | Breadcrumb navigation component |

#### Content Components
| Component | Description |
|-----------|-------------|
| `PostContent/` | Markdown content renderer with syntax highlighting |
| `ReadingProgress/` | Reading progress indicator |
| `SocialShare/` | Social media sharing buttons |
| `Comments/Disqus.tsx` | Disqus comment integration |
| `ImageModal/` | Image modal viewer |
| `ShareModal/` | Social sharing modal |

#### Interactive Components
| Component | Description |
|-----------|-------------|
| `SearchInteractive/` | Client-side search functionality |
| `SearchPage/` | Search page wrapper |
| `TagsInteractive/` | Interactive tags component |
| `CommandPalette/` | Keyboard shortcut command palette |
| `ScrollToTop/` | Scroll to top button |

#### Analytics & SEO
| Component | Description |
|-----------|-------------|
| `Analytics/GoogleAnalytics.tsx` | Google Analytics integration |
| `Analytics/GoogleAdSense.tsx` | Google AdSense integration |
| `StructuredData/` | JSON-LD structured data for SEO |

#### UI Components (`src/components/ui/`)
Shadcn UI component library implementations:

| Component | Description |
|-----------|-------------|
| `button.tsx` | Button component with variants |
| `card.tsx` | Card container components |
| `badge.tsx` | Badge/tag components |
| `dialog.tsx` | Modal dialog components |
| `command.tsx` | Command palette components |
| `input.tsx` | Form input components |
| `progress.tsx` | Progress bar components |
| `separator.tsx` | Visual separator components |
| `tabs.tsx` | Tab navigation components |
| `toggle.tsx` | Toggle switch components |
| `tooltip.tsx` | Tooltip components |
| `article-header.tsx` | Blog article header |
| `blog-card.tsx` | Blog post card component |
| `blog-layout.tsx` | Blog layout wrapper |
| `series-navigation.tsx` | Series post navigation |
| `index.ts` | Component exports barrel file |

### Library Code (`src/lib/`)

| File | Description |
|------|-------------|
| `markdown.ts` | Markdown processing and blog post parsing |
| `config.ts` | Site configuration and metadata |
| `design-tokens.ts` | Design system tokens and variables |
| `theme-config.ts` | Theme configuration for dark/light modes |
| `utils.ts` | Utility functions including Tailwind class merging |

---

## 📱 Static Assets

### Public Directory (`public/`)
| Directory/File | Description |
|----------------|-------------|
| `icons/` | PWA icons in various sizes (48x48 to 512x512) |
| `images/` | Blog post images organized by category and date |
| `manifest.json` | PWA manifest file |
| `robots.txt` | Search engine crawler instructions |

---

## 🔄 Build Output (`out/`)
Generated static files from Next.js build process:
- Static HTML pages for all routes
- Optimized CSS and JavaScript bundles
- API route outputs
- Static assets and images

---

## 💾 Gatsby Backup (`gatsby_backup/`)

Original Gatsby v5 implementation backup:

### Configuration
| File | Description |
|------|-------------|
| `gatsby-config.js` | Gatsby plugins and site configuration |
| `gatsby-node.js` | Build-time page generation and GraphQL schema |
| `gatsby-browser.js` | Browser-side Gatsby APIs |
| `gatsby-ssr.js` | Server-side rendering configuration |
| `config.js` | Site metadata and configuration |
| `package.json` | Gatsby project dependencies |

### Source Structure (`gatsby_backup/src/`)
| Directory | Description |
|-----------|-------------|
| `components/` | React components (Bio, Header, Layout, PostList, Toc, SEO) |
| `pages/` | Gatsby pages (index, 404, search, tags) |
| `templates/` | Page templates (Post template) |
| `state/` | Redux store configuration |
| `utils/` | Typography configuration and SCSS variables |
| `images/` | Static images (profile, icons) |

### Styling
| File | Description |
|------|-------------|
| `src/components/*/*.scss` | Component-specific SCSS styles |
| `src/utils/variables.scss` | SCSS variables and mixins |
| `src/utils/typography.ts` | Typography.js configuration |

---

## 🎨 Styling System

### CSS Architecture
- **Tailwind CSS**: Utility-first CSS framework
- **CSS Custom Properties**: Theme-aware design tokens
- **Shadcn UI**: Component library built on Radix UI
- **Responsive Design**: Mobile-first approach with defined breakpoints

### Theme System
- **Dark/Light Mode**: CSS variables-based theme switching
- **Design Tokens**: Centralized color, spacing, and typography scales
- **Accessibility**: WCAG compliant color contrasts and interactions

---

## 🚀 Deployment Configuration

### Netlify
- **Build Command**: `npm run build`
- **Publish Directory**: `out/`
- **Environment**: Node.js 20 with static export optimization
- **Headers**: Security headers, caching, and content-type configurations

### Development
- **Local Development**: `npm run dev` (port 9000)
- **Build**: `npm run build` (static export)
- **Type Checking**: `npm run type-check`
- **Linting**: `npm run lint`

---

## 📊 Project Statistics

- **Total Components**: 25+ React components
- **Blog Posts**: 50+ published posts across 5 categories
- **Languages**: TypeScript, JavaScript, CSS, Markdown
- **Frameworks**: Next.js 14.x, React 18.x, Tailwind CSS
- **Deployment**: Netlify with static generation
- **Performance**: Optimized for Core Web Vitals and accessibility

---

## 🔍 Key Features

1. **Static Site Generation**: Fast loading with pre-rendered pages
2. **Dark/Light Theme**: Automatic theme switching with system preference
3. **Search Functionality**: Client-side search across all posts
4. **Table of Contents**: Auto-generated TOC for long posts
5. **Social Sharing**: Built-in sharing for multiple platforms
6. **SEO Optimization**: Structured data, sitemaps, and meta tags
7. **PWA Support**: Manifest and offline capabilities
8. **Comments**: Disqus integration for community engagement
9. **Analytics**: Google Analytics and AdSense integration
10. **Responsive Design**: Mobile-first responsive layout