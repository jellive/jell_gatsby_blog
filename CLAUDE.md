# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog built with Next.js 14, migrated from Gatsby. The site serves Korean and English content across multiple categories including development, cycling, chat/personal, gaming, and notices.

**Deployment**: [https://blog.jell.kr](https://blog.jell.kr) (deployed on Netlify with custom domain)

The blog uses modern React patterns with TypeScript, implements comprehensive E2E testing, and follows accessibility-first design principles.

## Design System Principles

**IMPORTANT**: This project follows the **Modern Tech Blog Design System** as defined in [`design-system.md`](./design-system.md). This design system serves as the primary reference for all design decisions and component implementations.

### Core Design Principles

- **Developer Experience First**: Prioritize code-first content, syntax highlighting, and technical documentation
- **Modern Typography**: SF Pro Display font stack with optimized scale system for readability
- **Accessible Color System**: #3b82f6 primary with comprehensive neutral palette and semantic colors
- **Component-Based Architecture**: Atomic design with TypeScript strict typing and accessibility built-in
- **Performance Optimized**: 4px base spacing system, CSS variables, and hardware-accelerated theme switching

### Implementation Guidelines

- **Always reference** `design-system.md` before implementing new components or features
- **Use the defined color tokens** rather than arbitrary color values
- **Follow the typography scale** for consistent text sizing across the blog
- **Implement responsive breakpoints** as specified (640px/768px/1024px/1280px)
- **Maintain accessibility standards** with proper ARIA labels and semantic markup

When making design decisions or implementing new features, consult the design system documentation first to ensure consistency with the established patterns and principles.

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

## Shadcn UI Integration Guide

This section provides comprehensive guidance for using Shadcn UI components and maintaining design consistency throughout the blog.

### Overview

The blog uses [Shadcn UI](https://ui.shadcn.com/) as the primary component library, providing modern, accessible, and customizable React components built on top of Radix UI primitives and styled with Tailwind CSS.

### Core Dependencies

```json
{
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0",
  "lucide-react": "^0.400.0",
  "@radix-ui/react-slot": "^1.0.2",
  "tailwindcss-animate": "^1.0.7"
}
```

### Configuration Files

#### `components.json`

Central configuration file for Shadcn UI component generation:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

#### Utility Function (`src/lib/utils.ts`)

Essential utility for combining Tailwind classes:

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Available Components

#### Core UI Components

- **Button** (`@/components/ui/button`) - Primary interactive element with variants
- **Card** (`@/components/ui/card`) - Content containers with header, content, footer
- **Badge** (`@/components/ui/badge`) - Labels and tags with category-specific styling

#### Migrated Components

- **ThemeToggle** - Dark/light/system mode toggle with custom animations
- **Header** - Navigation with Shadcn Button components
- **PostList** - Card-based blog post listing with responsive grid
- **BackNavigation** - Breadcrumb navigation with glass morphism effects

### Theme System Integration

#### CSS Variables

The theme system uses CSS custom properties for consistent color management:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... additional color tokens */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark mode overrides */
}
```

#### Tailwind Configuration

Extended configuration preserves Korean typography while adding Shadcn utilities:

```javascript
fontFamily: {
  'nanum-gothic': ['Nanum Gothic', 'sans-serif'],
  'noto-serif-kr': ['Noto Serif KR', 'serif'],
  'raleway': ['Raleway', 'sans-serif'],
},
keyframes: {
  "spin-slow": {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" },
  },
  "bounce-subtle": {
    "0%, 100%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-2px)" },
  },
}
```

### Component Usage Patterns

#### Button Component

```tsx
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Basic usage
<Button variant="default" size="sm">Click me</Button>

// With custom styling
<Button
  variant="ghost"
  size="icon"
  className={cn(
    "hover:scale-110 transition-all duration-200",
    "border border-border/30 rounded-md"
  )}
>
  <Icon />
</Button>

// Available variants: default, destructive, outline, secondary, ghost, link
// Available sizes: default, sm, lg, icon
```

#### Card Component

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
;<Card className="group transition-all duration-300 hover:shadow-lg">
  <CardHeader className="pb-3">
    <CardTitle className="text-xl font-semibold">Title Here</CardTitle>
  </CardHeader>
  <CardContent className="pt-0">
    <p className="text-muted-foreground">Content here</p>
  </CardContent>
</Card>
```

#### Badge Component

```tsx
import { Badge } from '@/components/ui/badge'

// Category-specific styling
const getBadgeVariant = (tag: string) => {
  if (tag.includes('development')) return 'default'
  if (tag.includes('bicycle')) return 'secondary'
  if (tag.includes('game')) return 'outline'
  return 'secondary'
}

;<Badge variant={getBadgeVariant(tag)} className="text-xs hover:scale-105">
  #{tag}
</Badge>
```

### Development Best Practices

#### Component Creation Workflow

1. **Use Shadcn CLI**: `npx shadcn-ui@latest add [component-name]`
2. **Customize in place**: Modify generated components in `src/components/ui/`
3. **Apply design tokens**: Use CSS variables and theme-aware classes
4. **Maintain accessibility**: Preserve Radix UI accessibility features
5. **Test responsive behavior**: Verify across all screen sizes

#### Styling Guidelines

```tsx
// ✅ Good: Use cn() utility for class composition
<div className={cn(
  "base-styles",
  "responsive:styles",
  "interaction:states",
  condition && "conditional-styles"
)}>

// ✅ Good: Use semantic color tokens
<div className="bg-card text-card-foreground border-border">

// ✅ Good: Maintain responsive patterns
<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">

// ❌ Avoid: Direct color values
<div className="bg-white text-black border-gray-200">

// ❌ Avoid: Complex inline conditionals
<div className={`complex ${condition ? 'one thing' : 'another'} more`}>
```

#### Animation and Interaction

```tsx
// Custom animations defined in tailwind.config.js
<Button className="animate-spin-slow"> // 10s rotation
<div className="animate-bounce-subtle">  // Subtle bounce effect

// Hover and transition patterns
<Card className={cn(
  "transition-all duration-300",
  "hover:shadow-lg hover:-translate-y-1",
  "hover:border-border"
)}>
```

### Migration Patterns

#### From Legacy CSS to Shadcn

```tsx
// Before: Legacy CSS classes
<button className="back-button custom-styles">

// After: Shadcn Button with equivalent styling
<Button
  variant="ghost"
  size="sm"
  className={cn(
    "gap-2 text-muted-foreground hover:text-foreground",
    "transition-all duration-200 hover:bg-accent/50"
  )}
>
```

#### Component Wrapper Pattern

```tsx
// For complex components, create wrapper that preserves original API
interface PostListProps {
  posts: Post[]
}

const PostList = ({ posts }: PostListProps) => {
  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
      {posts.map((post) => (
        <Card key={post.slug} className="group">
          {/* Shadcn components with legacy logic */}
        </Card>
      ))}
    </div>
  )
}
```

### Performance Considerations

#### Bundle Optimization

- **Tree Shaking**: Only import used components
- **CSS Variables**: Runtime theme switching without CSS-in-JS overhead
- **Tailwind Purging**: Unused classes automatically removed
- **Component Composition**: Prefer composition over large monolithic components

#### Responsive Performance

```tsx
// ✅ Efficient: CSS-only responsive behavior
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// ✅ Efficient: Use transform for hover effects
<Card className="hover:-translate-y-1 transition-transform">

// ❌ Avoid: JavaScript-based responsive logic where CSS can handle
```

### Accessibility Standards

#### WCAG Compliance

- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Reader Support**: Proper ARIA labels and semantic markup
- **Color Contrast**: Meets WCAG AA standards (4.5:1 ratio)
- **Focus Management**: Visible focus indicators and logical tab order

#### Implementation Examples

```tsx
// Proper ARIA labels and semantics
<Button
  aria-label="뒤로 가기"
  title="뒤로 가기"
  onClick={handleBack}
>
  <Fa icon={faAngleLeft} />
  <span>Back</span>
</Button>

// Navigation landmarks
<nav role="navigation" aria-label="Breadcrumb">
  <Button variant="link" asChild>
    <Link href="/">Home</Link>
  </Button>
</nav>
```

### Customization Guidelines

#### Extending Components

```tsx
// Create variant extensions
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      intent: {
        primary: "primary-styles",
        secondary: "secondary-styles",
        // Add custom variants
        blog: "blog-specific-styles"
      }
    }
  }
)

// Usage
<Button variant="blog">Blog Action</Button>
```

#### Theme Customization

```css
/* Add custom CSS variables for blog-specific colors */
:root {
  --blog-accent: 200 100% 50%;
  --blog-secondary: 150 50% 60%;
}

/* Use in components */
.blog-component {
  background-color: hsl(var(--blog-accent));
}
```

### Quality Assurance

#### Testing Checklist

- [ ] All components render without TypeScript errors
- [ ] Responsive behavior verified across screen sizes
- [ ] Dark/light theme switching works correctly
- [ ] Accessibility standards met (keyboard navigation, screen readers)
- [ ] Performance impact acceptable (bundle size, runtime)
- [ ] Korean typography preserved and functional
- [ ] Legacy component functionality maintained

#### Common Issues and Solutions

1. **TypeScript Errors**

   - Issue: `asChild` prop not supported on all components
   - Solution: Wrap with component instead of using `asChild`

2. **CSS Conflicts**

   - Issue: Legacy CSS overriding Shadcn styles
   - Solution: Use higher specificity or remove conflicting styles

3. **Theme Variables**
   - Issue: CSS variables not updating in dark mode
   - Solution: Verify `:root` and `.dark` definitions in globals.css

### Development Commands

```bash
# Add new Shadcn component
npx shadcn-ui@latest add [component-name]

# Update existing components
npx shadcn-ui@latest add [component-name] --overwrite

# Check component status
npx shadcn-ui@latest list

# Build and verify
npm run build
npm run type-check
```

## Blog Writing Guide

This section provides comprehensive guidance for creating and managing blog posts in this Gatsby-based blog system.

### Directory Structure & File Organization

#### Published Posts (`_posts/`)

- **Location**: `/Users/jellpd/jell_gatsby_blog/_posts/`
- **Structure**: `category/YYYY/MM/DD/post-filename.md`
- **Visibility**: Appears in production and development builds
- **Example**: `_posts/dev/blog/2024/08/06/Gatsby를 v4에서 v5로 업그레이드 할 때.md`

#### Draft Posts (`_drafts/`)

- **Location**: `/Users/jellpd/jell_gatsby_blog/_drafts/`
- **Structure**: **REQUIRED** - Must follow same structure as posts: `category/YYYY/MM/DD/post-filename.md`
- **Visibility**: Only visible in development mode (`npm run develop`)
- **Example**: `_drafts/dev/blog/2025/08/14/gatsby-to-nextjs-migration-experience.md`
- **Important**: No longer supports flat structure - all drafts must use date-based organization

#### Image Management

- **Location**: `images/` subfolder within the same directory as the markdown file
- **Reference Format**: `![Alt text](images/filename.ext)` in markdown
- **Processing**: Build system automatically transforms relative paths to absolute paths
- **Example Structure**:

  ```text
  _posts/bicycle/2018/08/24/
  ├── 제주도_1일차.md
  └── images/
      ├── 20180813_181529.png
      ├── 20180813_191041.png
      └── 1일차_map.png
  ```

### Content Categories & Organization

#### Main Categories

- **bicycle**: Cycling and sports-related content
- **chat**: Personal thoughts, casual posts, life updates
- **dev**: Development and technical content
- **game**: Gaming-related posts
- **notice**: Site announcements and important updates

#### Development Subcategories

- **algorithm**: Coding challenges, algorithms, problem-solving
- **blog**: Blog platform and website development
- **docker**: Containerization and Docker tutorials
- **ios**: iOS development, Swift, mobile app development
- **js**: JavaScript, TypeScript, web development
- **linux**: Linux system administration, Ubuntu guides
- **network**: Networking, infrastructure, server management

### Frontmatter Requirements

#### Published Posts (Required Fields)

```yaml
---
category: 'CategoryName' # Capitalized category name
date: 'YYYY-MM-DD' # or 'YYYY-MM-DDTHH:MM:SSZ' for specific time
title: 'Post Title Here' # Post title (can include Korean characters)
tags: ['tag1', 'tag2', 'tag3'] # Array of relevant tags
---
```

#### Published Posts (Optional Fields)

```yaml
---
featuredImage: 'images/filename.png' # Featured image for the post (only if image file exists)
keywords: ['keyword1', 'keyword2'] # SEO keywords (defaults to site + author)
---
```

#### Featured Image 사용 정책

**기본 원칙**: featuredImage는 사용자가 명시적으로 제공하지 않는 한 생성하지 않음

- **사용 조건**: 사용자가 구체적인 이미지 파일을 제공했거나 직접 요청한 경우에만 사용
- **기본 동작**: featuredImage 없이도 블로그 포스트가 정상 작동하므로 생략이 기본값
- **오류 방지**: 존재하지 않는 이미지 참조로 인한 빌드 오류 방지
- **SEO 고려**: featuredImage가 없어도 OpenGraph 이미지는 사이트 기본 이미지 사용

#### Draft Posts (Minimal Requirements)

```yaml
---
title: 'Draft Post Title'
date: 'YYYY-MM-DD' # Can use any date, even future dates
---
```

#### Category Mapping Examples

- Directory `bicycle` → Category `'Bicycle'`
- Directory `chat` → Category `'Chat'`
- Directory `dev/blog` → Category `'Blog'`
- Directory `dev/docker` → Category `'Docker'`
- Directory `dev/ios` → Category `'iOS'` or related
- Directory `dev/js` → Category `'Javascript'` or `'TypeScript'`

### File Naming Conventions

#### Option 1: Date Prefix Pattern

- Format: `YYYY_MM_DD_PostTitle.md`
- Example: `2018_08_06_Zwift.md`
- Best for: Regular updates, time-series content

#### Option 2: Descriptive Title Pattern

- Format: `Descriptive_Post_Title.md`
- Example: `제주도_1일차.md`, `바테잎_교체.md`
- Best for: Topic-focused content, tutorials, guides

#### Drafts Naming

- Can use either pattern or simplified naming
- Example: `draft-post-example.md`, `ios.md`

### Content Writing Guidelines

#### Image References

```markdown
![Image description](images/filename.png)
```

- Images automatically processed to: `/images/category/year/month/day/filename.png`
- Supports common formats: `.png`, `.jpg`, `.jpeg`, `.gif`
- Use descriptive alt text for accessibility

#### Code Blocks

````markdown
```language
code here
```
````

- Supports syntax highlighting via rehype-prism-plus
- Supports languages: javascript, typescript, bash, yaml, etc.

#### Table of Contents

```markdown
`toc`
```

- Automatically generates TOC from headings (h2, h3)
- Processed by remark-toc plugin
- Appears as interactive TOC in post

#### Internal Links

```markdown
[Link text](/posts/category-year-month-day-filename)
```

- Use generated slug format for internal links
- Slugs follow pattern: `category-year-month-day-filename`

### Writing Guidelines & Best Practices

#### Current Date Verification

**CRITICAL**: Always verify the current date before creating any post or draft.

```bash
# Check current date before writing
date +"%Y-%m-%d"
```

- **Use this exact format** for the `date` field in frontmatter
- **Update filenames** to match current date in directory structure
- **Example**: If today is 2025-08-14, use `_drafts/dev/blog/2025/08/14/your-post-title.md`

#### Directory Structure Compliance

**All content must follow strict date-based organization:**

1. **Posts**: `_posts/category/YYYY/MM/DD/title.md`
2. **Drafts**: `_drafts/category/YYYY/MM/DD/title.md` (same structure as posts)
3. **Images**: `images/` folder within the same directory as the markdown file

**No exceptions**: Flat structure or alternative organization is no longer supported.

#### Migration from Old Structure

If you find existing files in flat structure:

```bash
# Example: Move from flat to date-based structure
# Old: _drafts/my-post.md
# New: _drafts/dev/blog/2025/08/14/my-post.md

# 1. Check current date
date +"%Y-%m-%d"

# 2. Create proper directory structure
mkdir -p _drafts/category/YYYY/MM/DD

# 3. Move and rename file
mv _drafts/old-file.md _drafts/category/YYYY/MM/DD/new-file.md

# 4. Update frontmatter date field to match
```

### Development Workflow

#### Creating a Draft Post

1. **Check current date**: `date +"%Y-%m-%d"`
2. **Create proper directory structure**: `mkdir -p _drafts/category/YYYY/MM/DD`
3. **Create file with correct naming**: `_drafts/category/YYYY/MM/DD/post-title.md`
4. **Add complete frontmatter** (same as published posts):

   ```yaml
   ---
   title: 'Your Post Title'
   date: '2025-08-14' # Use current date from step 1
   category: 'Category'
   tags: ['tag1', 'tag2']
   ---
   ```

5. Write content with placeholder images if needed
6. Test in development mode: `npm run develop`

#### Publishing a Draft

1. **Verify structure**: Ensure draft already follows `_drafts/category/YYYY/MM/DD/title.md` format
2. **Move file**: Copy from `_drafts/category/YYYY/MM/DD/` to `_posts/category/YYYY/MM/DD/`
3. **Remove draft**: Delete original file from `_drafts/`
4. **Verify frontmatter**: Ensure all required fields are present:
   - `title`, `date`, `category`, `tags`
   - Add `featuredImage` if applicable
5. **Check images**: Ensure images are in correct `images/` subfolder
6. Test with `npm run develop`
7. Deploy with `npm run deploy`

#### Content Validation Checklist

- [ ] Frontmatter includes all required fields
- [ ] Category matches directory structure convention
- [ ] Date format is correct (`YYYY-MM-DD` or ISO format)
- [ ] Images are in local `images/` folder
- [ ] Image references use correct relative paths
- [ ] Tags are relevant and properly formatted
- [ ] Content is properly formatted with headings
- [ ] Language tone follows formal Korean (존댓말) guidelines

#### 글쓰기 톤앤매너 (Writing Tone & Manner)

**Language Requirements**: All blog posts must be written in formal/polite Korean language (존댓말).

**Formal Language Guidelines**:

- **Sentence Endings**: Use formal endings consistently:

  - `-습니다/-ㅂ니다` (formal declarative)
  - `-셨습니다/-으셨습니다` (formal past honorific)
  - `-겠습니다` (formal future/intention)
  - `-입니다` (formal copula)

- **Verb Forms**: Use formal verb conjugations:

  - `했습니다` not `했어요` or `했다`
  - `보겠습니다` not `볼게요` or `보겠어`
  - `드립니다` not `드려요` (when giving/offering)

- **Examples**:

  ```markdown
  ✅ Good (Formal):
  오늘은 Next.js 마이그레이션에 대해 알아보겠습니다.
  이 방법을 사용하면 더 나은 성능을 얻을 수 있습니다.

  ❌ Avoid (Informal):
  오늘은 Next.js 마이그레이션에 대해 알아볼게요.
  이 방법을 사용하면 더 나은 성능을 얻을 수 있어요.
  ```

- **Reader Address**: Maintain respectful tone when addressing readers:

  - Use `여러분` (everyone) when addressing readers collectively
  - Avoid overly casual expressions like `그냥`, `막`, `대충`
  - Use `참고하시기 바랍니다` instead of `참고해주세요`

- **Technical Writing**: Maintain formality even in technical explanations:
  - `설치하겠습니다` not `설치할게요`
  - `확인하시기 바랍니다` not `확인해보세요`
  - `진행하겠습니다` not `진행할게요`

**Consistency Check**: Before publishing, review entire post to ensure consistent use of formal language throughout.

### Advanced Features

#### Series Posts

- Use consistent filename patterns ending with numbers
- Example: `제주도_1일차.md`, `제주도_2일차.md`, `제주도_3일차.md`
- System automatically detects and groups series posts

#### Featured Images

- Add `featuredImage: 'images/filename.ext'` to frontmatter
- Used for social media previews and post thumbnails
- Should be high-quality and representative of content

#### SEO Optimization

- Use descriptive titles that include key topics
- Add relevant tags for discoverability
- Include `keywords` array for additional SEO terms
- Ensure images have descriptive alt text

### Troubleshooting

#### Common Issues

1. **Images not displaying**: Check that images are in `images/` subfolder and referenced correctly
2. **Post not appearing**: Verify frontmatter syntax and required fields
3. **Build errors**: Check for YAML syntax errors in frontmatter
4. **Wrong category**: Ensure `category` field matches expected capitalization

#### Development vs Production

- Drafts only appear in development (`npm run develop`)
- All `_posts/` content appears in both development and production
- Use drafts for work-in-progress content

## Markdown 작성 가이드라인

**목적**: GitHub PR 및 Netlify CI/CD에서 Markdown 린트 오류 방지

### 필수 준수사항

#### 1. 줄 길이 제한 (MD013)
- **최대 100자**: 한 줄당 100자를 넘지 않도록 작성
- **긴 URL 예외**: URL이 긴 경우 `[텍스트](URL)` 형식 사용
- **자동 줄바꿈**: 에디터에서 80-100자에서 자동 줄바꿈 설정 권장

```markdown
✅ 좋은 예시:
이것은 100자 이내의 적절한 길이로 작성된 문장입니다. 
길어질 경우 자연스럽게 줄바꿈하여 가독성을 높입니다.

❌ 피해야 할 패턴:
이것은 100자를 초과하는 매우 긴 문장으로 마크다운 린트 오류를 발생시키는 예시입니다. 이런 식으로 작성하면 CI/CD에서 실패합니다.
```

#### 2. 헤딩 구조 (MD025)
- **H1 금지**: 블로그 포스트에서 `#` (H1) 사용 금지
- **H2부터 시작**: `##` (H2)부터 사용, 제목은 frontmatter의 `title`에서 관리
- **구두점 제거**: 헤딩 끝에 `.`, `!`, `?`, `:` 등 구두점 사용 금지

```markdown
✅ 좋은 예시:
## 설치 방법
### 필수 조건
#### 환경 설정

❌ 피해야 할 패턴:
# 설치 방법  (H1 사용 금지)
## 설치 방법!  (느낌표 사용 금지)
### 환경 설정:  (콜론 사용 금지)
```

#### 3. 코드 블록 (MD040)
- **언어 태그 필수**: 모든 코드 블록에 언어 태그 명시
- **지원 언어**: `bash`, `javascript`, `typescript`, `json`, `yaml`, `markdown`, `text`

````markdown
✅ 좋은 예시:
```bash
npm install
npm run build
```

```typescript
interface Post {
  title: string
  date: string
}
```

❌ 피해야 할 패턴:
```
npm install  // 언어 태그 없음
```
````

#### 4. URL 형식 (MD034)
- **링크 형식 사용**: Bare URL 금지, 반드시 `[텍스트](URL)` 형식 사용
- **의미있는 텍스트**: 링크 텍스트는 목적을 명확히 표현

```markdown
✅ 좋은 예시:
[Netlify 공식 문서](https://docs.netlify.com)
[GitHub 이슈 #123](https://github.com/user/repo/issues/123)

❌ 피해야 할 패턴:
https://docs.netlify.com  // Bare URL 사용 금지
```

#### 5. 공백 및 줄바꿈 (MD009, MD047, MD031, MD032)
- **줄 끝 공백 제거**: 줄 끝에 불필요한 공백 제거
- **파일 끝 개행**: 모든 파일 끝에 개행문자 1개 추가
- **코드 블록 여백**: 코드 블록 앞뒤로 빈 줄 추가
- **목록 여백**: 목록 앞뒤로 빈 줄 추가

### 개발 환경 설정

#### VS Code 설정
```json
{
  "editor.rulers": [100],
  "editor.wordWrap": "wordWrapColumn",
  "editor.wordWrapColumn": 100,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true
}
```

#### 자동 검증
```bash
# 로컬에서 린트 검사
npm run lint:md

# 자동 수정 가능한 오류 수정
npm run format

# 빌드 전 필수 검증
npm run type-check && npm run lint:md
```

### CI/CD 통과 조건

#### Pull Request 요구사항
1. **Markdown 린트**: 0개 오류 (필수)
2. **TypeScript**: 타입 오류 없음
3. **빌드 성공**: Next.js 빌드 완료
4. **테스트 통과**: E2E 테스트 통과

#### 일반적인 실패 원인
- 긴 줄 (100자 초과)
- 헤딩의 구두점
- 코드 블록 언어 태그 누락
- Bare URL 사용
- 파일 끝 개행문자 누락

### 예외 사항

#### 허용되는 긴 줄
- **이미지 경로**: `![설명](images/very-long-filename.png)`
- **참조 링크**: `[링크 텍스트][ref]` 형태로 분리
- **코드 내 URL**: 코드 블록 내부의 URL

#### 레거시 파일 처리
- 기존 파일 수정 시 점진적 개선
- 새로운 파일은 모든 규칙 준수 필수
- 마이그레이션은 단계적으로 진행

이 가이드라인을 준수하면 GitHub PR과 Netlify 배포에서 린트 오류 없이 성공적으로 통과할 수 있습니다.

## Git Guidelines & Commit Messages

### Commit Message Policy

**IMPORTANT**: When making commits to this repository, do not include references to Claude Code or AI assistance in commit messages.

#### Commit Message Format

```text
📝 Add new blog post about TypeScript safety
🔧 Fix responsive design issues in header component
🚀 Improve performance of image loading
♻️ Refactor component structure for better maintainability
```

#### Prohibited Commit Message Patterns

```text
❌ Add feature (generated with Claude Code)
❌ 🤖 Generated with Claude Code
❌ AI-assisted implementation of...
❌ Claude-generated component for...
❌ Co-Authored-By: Claude <noreply@anthropic.com>
```

#### Preferred Commit Message Style

- **Focus on the change**: Describe what was changed, not how it was created
- **Use conventional prefixes**: 📝 (docs), 🔧 (fix), 🚀 (feat), ♻️ (refactor), 🎨 (style)
- **Be concise and descriptive**: Clear explanation of the modification
- **Use present tense**: "Add feature" not "Added feature"

#### File Management

**Claude Code Generated Files**: The following files are automatically excluded from git tracking:

- `@detailed_index.md`
- `@general_index.md`
- `docs/` (temporary documentation)
- `test-results/`
- `playwright-report/`

These files should never be committed to the repository.
