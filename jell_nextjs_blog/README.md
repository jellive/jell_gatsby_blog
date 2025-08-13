# Jell의 세상 사는 이야기 - Next.js Blog

Modern blog built with Next.js 14, migrated from Gatsby v5.

## 🚀 Features

- **Static Site Generation (SSG)** with Next.js 14 App Router
- **Markdown Content Processing** with gray-matter and remark
- **Dynamic Routing** for posts and tags
- **Search Functionality** with client-side filtering
- **SEO Optimized** with comprehensive metadata, sitemap, RSS feed
- **Analytics Integration** with Google Analytics 4
- **Monetization Ready** with Google AdSense integration
- **Comments System** with Disqus integration
- **Responsive Design** with Tailwind CSS
- **PWA Support** with manifest.json
- **Performance Optimized** for fast loading

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Content**: Markdown with gray-matter + remark
- **Icons**: FontAwesome
- **Analytics**: Google Analytics 4
- **Comments**: Disqus
- **Deployment**: Netlify

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── posts/[slug]/      # Dynamic post routes
│   ├── tags/              # Tag listing and filtering
│   ├── search/            # Search functionality
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Analytics/         # GA4 and AdSense
│   ├── Comments/          # Disqus integration
│   ├── Bio/              # Author bio
│   └── Header/           # Navigation
├── lib/                  # Utility functions
│   ├── config.ts         # Site configuration
│   └── markdown.ts       # Markdown processing
└── ...
_posts/                   # Markdown content
├── dev/                  # Development posts
├── chat/                 # Chat/personal posts
├── game/                 # Gaming posts
└── ...
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd jell_nextjs_blog
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Content Management

### Adding New Posts

1. Create a new Markdown file in `_posts/` following the directory structure:
```
_posts/{category}/{year}/{month}/{day}/{post-title}.md
```

2. Add frontmatter:
```yaml
---
category: "Development"
date: "2024-01-01"
title: "My New Post"
tags: ["React", "Next.js", "Web Development"]
---

Your content here...
```

### Configuration

Edit `src/lib/config.ts` to update:
- Site metadata (title, description, author)
- Social links
- Analytics IDs
- AdSense configuration
- Disqus shortname

## 🔧 Build and Deployment

### Build for Production

```bash
npm run build
```

This generates static files in the `out/` directory.

### Netlify Deployment

The project is configured for Netlify deployment:

1. Connect your repository to Netlify
2. Build settings are automatically configured via `netlify.toml`
3. Set environment variables if needed:
   - `NODE_ENV=production`
   - Any custom environment variables

### Manual Deployment

You can deploy the `out/` directory to any static hosting service:
- Netlify
- Vercel  
- GitHub Pages
- AWS S3
- Any CDN or web server

## 🔍 SEO Features

- **Sitemap**: Auto-generated at `/sitemap.xml`
- **RSS Feed**: Available at `/rss`
- **Robots.txt**: Search engine instructions at `/robots.txt`
- **Open Graph**: Social media sharing metadata
- **Twitter Cards**: Twitter-specific metadata
- **Structured Data**: JSON-LD for search engines
- **PWA Manifest**: `/manifest.json` for app-like experience

## 📊 Analytics & Monetization

### Google Analytics 4
- Tracks page views, user engagement
- Configured in `src/components/Analytics/GoogleAnalytics.tsx`

### Google AdSense
- Automatic ad placement
- Configured in `src/components/Analytics/GoogleAdSense.tsx`

### Disqus Comments
- Integrated on all blog posts
- Configured in `src/components/Comments/Disqus.tsx`

## ⚡ Performance

The blog is optimized for performance:
- Static site generation
- Image optimization
- CSS and JS minification
- Automatic code splitting
- Cached static assets
- Compressed responses
- SEO-friendly URLs

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server (local)
- `npm run lint` - Run ESLint

### Migration from Gatsby

This project was migrated from Gatsby v5 to Next.js 14:
- All markdown content preserved
- SEO features maintained
- Component structure modernized
- Performance improved
- Dependencies updated and secured

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## 📞 Support

For questions or issues, please open an issue on GitHub or contact [jellive7@gmail.com](mailto:jellive7@gmail.com).