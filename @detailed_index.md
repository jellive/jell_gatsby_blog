# Detailed Index - Function Documentation

This file contains the names of all the functions in the codebase along with their explanations and docstrings.

---

## 📝 Markdown Processing (`src/lib/markdown.ts`)

### `getAllMarkdownFiles(): Promise<string[]>`

**Description**: Get all markdown files from \_posts directory (and \_drafts in development)  
**Returns**: Array of file paths to all markdown files  
**Behavior**: Includes draft files only in development mode using NODE_ENV check

### `transformImagePaths(content: string, filePath: string): string`

**Description**: Transform image paths from relative to absolute paths  
**Parameters**:

- `content`: The markdown content containing image references
- `filePath`: The full path to the markdown file  
  **Returns**: Content with transformed image paths  
  **Behavior**: Converts `images/filename.ext` to `/images/category/year/month/day/filename.ext`

### `parseMarkdownFile(filePath: string): Promise<PostData>`

**Description**: Parse markdown file and extract frontmatter and content  
**Parameters**: `filePath` - Path to the markdown file to parse  
**Returns**: PostData object with parsed content and metadata  
**Features**:

- Processes markdown to HTML using unified/remark/rehype pipeline
- Generates table of contents using remark-toc
- Applies syntax highlighting with rehype-prism-plus
- Creates heading anchors with rehype-autolink-headings
- Extracts and cleans TOC from main content
- Generates post excerpt (160 characters)
- Handles URL encoding/decoding for Korean headings

### `getAllPosts(): Promise<PostData[]>`

**Description**: Get all posts with their metadata  
**Returns**: Array of all posts sorted by date (newest first)  
**Behavior**: Processes all markdown files and sorts by frontmatter date

### `getPostBySlug(slug: string): Promise<PostData | null>`

**Description**: Get post by slug  
**Parameters**: `slug` - The post slug to search for  
**Returns**: PostData if found, null otherwise  
**Behavior**: Searches through all posts to find matching slug

### `getAllCategories(): Promise<string[]>`

**Description**: Get all unique categories  
**Returns**: Sorted array of unique category names  
**Behavior**: Extracts categories from all posts and returns sorted unique list

### `getAllTags(): Promise<string[]>`

**Description**: Get all unique tags and categories (hybrid system)  
**Returns**: Sorted array combining all tags and categories  
**Behavior**: Merges post tags and categories into a single sorted list

### `getPostsByCategory(category: string): Promise<PostData[]>`

**Description**: Get posts by category  
**Parameters**: `category` - Category name to filter by  
**Returns**: Array of posts in the specified category

### `getPostsByTag(tag: string): Promise<PostData[]>`

**Description**: Get posts by tag or category (hybrid system)  
**Parameters**: `tag` - Tag or category name to filter by  
**Returns**: Array of posts that have the tag or belong to the category  
**Behavior**: Searches both tags array and category field

---

## 🎨 Utility Functions (`src/lib/utils.ts`)

### `cn(...inputs: ClassValue[]): string`

**Description**: Utility function to merge Tailwind CSS classes  
**Parameters**: `inputs` - Variable number of class values (strings, objects, arrays)  
**Returns**: Merged and deduplicated class string  
**Purpose**: Combines clsx for conditional classes and tailwind-merge for conflict resolution  
**Usage**: `cn('base-class', condition && 'conditional-class', 'override-class')`

---

## 🧩 React Components

### Header Component (`src/components/Header/index.tsx`)

#### `Header({ siteTitle }): React.FC<HeaderProps>`

**Description**: Main site header component with navigation and responsive behavior  
**Parameters**:

- `siteTitle`: Site title to display in header  
  **Features**:
- Auto-hiding header on scroll (disabled on homepage)
- Responsive profile image sizing
- Theme toggle integration
- Command palette trigger
- Mobile detection and responsive design
- Bio opacity control based on header visibility

#### `tagSpanVisibleToggle(isVisible: boolean): void`

**Description**: Tag hover effect handlers  
**Parameters**: `isVisible` - Whether to show or hide the tag span  
**Behavior**: Controls opacity and visibility of tag span element via DOM manipulation

---

### Home Page (`src/app/page.tsx`)

#### `Home(): Promise<JSX.Element>`

**Description**: Homepage component with responsive layout  
**Returns**: JSX element containing homepage layout  
**Features**:

- Fetches all posts using getAllPosts()
- Renders structured data for SEO
- Desktop layout: Side-by-side bio and content
- Mobile layout: Stacked bio and content
- Responsive breakpoints and spacing

---

## 🔧 Configuration (`src/lib/config.ts`)

### `siteConfig`

**Description**: Site configuration object with metadata and settings  
**Type**: Readonly configuration object  
**Contains**:

- Site metadata (title, description, author, URL)
- Profile and bio information
- Social media links
- Feature toggles (ToC, social share, comments)
- Analytics IDs (Google Analytics, AdSense)
- Environment variable overrides

---

## 🎯 API Routes

### Posts API (`src/app/api/posts/route.ts`)

#### `GET(): Promise<NextResponse>`

**Description**: API endpoint to get all posts  
**Returns**: JSON response with posts array  
**Headers**: Includes caching headers for performance  
**Behavior**: Fetches all posts and returns as JSON

### Manifest API (`src/app/api/manifest.json/route.ts`)

#### `GET(): Promise<NextResponse>`

**Description**: PWA manifest generation endpoint  
**Returns**: JSON response with PWA manifest  
**Features**: Dynamic manifest generation with site config data

### Sitemap API (`src/app/sitemap.xml/route.ts`)

#### `GET(): Promise<NextResponse>`

**Description**: XML sitemap generation endpoint  
**Returns**: XML response with sitemap  
**Features**:

- Includes all posts and static pages
- SEO-optimized lastmod dates
- Proper XML formatting

### RSS Feed API (`src/app/rss/route.ts`)

#### `GET(): Promise<NextResponse>`

**Description**: RSS feed generation endpoint  
**Returns**: XML response with RSS feed  
**Features**:

- RSS 2.0 compliant feed
- Includes post metadata and excerpts
- Proper content encoding

### Robots.txt API (`src/app/robots.txt/route.ts`)

#### `GET(): Promise<NextResponse>`

**Description**: Robots.txt generation endpoint  
**Returns**: Text response with robots directives  
**Features**: SEO-friendly crawler instructions

---

## 🔍 Search Functionality

### Search Page (`src/app/search/page.tsx`)

#### `SearchPage(): Promise<JSX.Element>`

**Description**: Search page component  
**Features**:

- Client-side search functionality
- Real-time search results
- Responsive design

### Interactive Search (`src/components/SearchInteractive/index.tsx`)

#### `SearchInteractive({ posts }): React.FC`

**Description**: Client-side search component  
**Parameters**: `posts` - Array of posts to search through  
**Features**:

- Fuzzy search through post titles and content
- Real-time filtering
- Keyboard navigation
- Search highlighting

---

## 📱 Theme System

### Theme Toggle (`src/components/ThemeToggle/index.tsx`)

#### `ThemeToggle(): React.FC`

**Description**: Theme switching component  
**Features**:

- Light/Dark/System theme modes
- Smooth transitions
- Persistent theme preference
- System preference detection

#### `useTheme(): ThemeHook`

**Description**: Custom hook for theme management  
**Returns**: Theme state and setter functions  
**Features**: localStorage persistence and system theme detection

---

## 🏗️ Layout Components

### Bio Component (`src/components/Bio/index.tsx`)

#### `Bio(): React.FC`

**Description**: Author bio component  
**Features**:

- Profile image display
- Social media links
- Contact information
- Responsive design

### Post List (`src/components/PostList/index.tsx`)

#### `PostList({ posts }): React.FC`

**Description**: Blog post listing component  
**Parameters**: `posts` - Array of posts to display  
**Features**:

- Card-based layout
- Post metadata display
- Tag visualization
- Responsive grid

### Table of Contents (`src/components/Toc/index.tsx`)

#### `Toc({ tableOfContents }): React.FC`

**Description**: Table of contents component  
**Parameters**: `tableOfContents` - HTML string of TOC  
**Features**:

- Sticky positioning
- Smooth scrolling
- Active section highlighting
- Responsive visibility

---

## 📊 Analytics & SEO

### Structured Data (`src/components/StructuredData/index.tsx`)

#### `StructuredData({ type, post }): React.FC`

**Description**: JSON-LD structured data component  
**Parameters**:

- `type` - Type of structured data (blog, article)
- `post` - Optional post data for article schema  
  **Features**: SEO-optimized structured data for search engines

### Google Analytics (`src/components/Analytics/GoogleAnalytics.tsx`)

#### `GoogleAnalytics(): React.FC`

**Description**: Google Analytics integration component  
**Features**: GA4 tracking with Next.js App Router compatibility

### Google AdSense (`src/components/Analytics/GoogleAdSense.tsx`)

#### `GoogleAdSense(): React.FC`

**Description**: Google AdSense integration component  
**Features**: Responsive ad placement and loading

---

## 🚀 Performance & Optimization

### Reading Progress (`src/components/ReadingProgress/index.tsx`)

#### `ReadingProgress(): React.FC`

**Description**: Reading progress indicator  
**Features**:

- Scroll-based progress calculation
- Smooth progress bar animation
- Non-intrusive design

### Scroll to Top (`src/components/ScrollToTop/index.tsx`)

#### `ScrollToTop(): React.FC`

**Description**: Scroll to top button  
**Features**:

- Visibility based on scroll position
- Smooth scrolling animation
- Responsive positioning

---

## 🔐 Type Definitions

### Post Interfaces (`src/lib/markdown.ts`)

#### `PostFrontMatter`

**Properties**:

- `category: string` - Post category
- `date: string` - Publication date
- `title: string` - Post title
- `tags: string[]` - Array of tags

#### `PostData`

**Properties**:

- `slug: string` - URL-friendly post identifier
- `frontMatter: PostFrontMatter` - Post metadata
- `content: string` - Raw markdown content
- `htmlContent: string` - Processed HTML content
- `excerpt: string` - Post excerpt (160 chars)
- `path: string` - File system path
- `tableOfContents: string` - Generated TOC HTML
- `isDraft: boolean` - Draft status flag

---

## 🎨 UI Components (`src/components/ui/`)

### Button (`src/components/ui/button.tsx`)

#### `Button({ variant, size, ...props }): React.FC`

**Description**: Reusable button component with variants  
**Variants**: default, destructive, outline, secondary, ghost, link  
**Sizes**: default, sm, lg, icon  
**Features**: Full accessibility support and consistent styling

### Card (`src/components/ui/card.tsx`)

#### `Card({ children, ...props }): React.FC`

**Description**: Card container component  
**Subcomponents**: CardHeader, CardTitle, CardDescription, CardContent, CardFooter  
**Features**: Flexible card layout system

### Badge (`src/components/ui/badge.tsx`)

#### `Badge({ variant, children }): React.FC`

**Description**: Badge/tag display component  
**Variants**: default, secondary, destructive, outline  
**Features**: Category-specific styling and hover effects

---

## 🔄 State Management

### Command Palette Provider (`src/components/CommandPalette/CommandPaletteProvider.tsx`)

#### `CommandPaletteProvider({ children }): React.FC`

**Description**: Context provider for command palette state  
**Features**: Global keyboard shortcuts and command execution

#### `useCommandPalette(): CommandPaletteHook`

**Description**: Hook for command palette functionality  
**Returns**: Palette state and control functions  
**Features**: Keyboard shortcut handling and search functionality

---

## 📝 Content Processing Pipeline

The markdown processing pipeline follows this flow:

1. **File Discovery**: `getAllMarkdownFiles()` finds all markdown files
2. **Content Parsing**: `parseMarkdownFile()` processes each file
3. **Image Transformation**: `transformImagePaths()` converts relative paths
4. **Markdown Processing**: unified/remark/rehype pipeline processes content
5. **TOC Generation**: `remarkToc` creates table of contents
6. **HTML Generation**: Content converted to HTML with syntax highlighting
7. **Metadata Extraction**: Frontmatter parsed and validated
8. **Caching**: Processed content cached for performance

This architecture ensures optimal performance while maintaining flexibility for content creation and management.

---

## 🛠️ Development Tools

### Build Process

- **Static Generation**: All pages pre-rendered at build time
- **Image Optimization**: Automatic image processing and optimization
- **Code Splitting**: Automatic code splitting for optimal loading
- **Bundle Analysis**: Performance monitoring and optimization

### Development Features

- **Hot Reload**: Instant updates during development
- **TypeScript**: Full type safety and IntelliSense
- **Linting**: ESLint and Prettier for code quality
- **Testing**: Jest and Testing Library setup
