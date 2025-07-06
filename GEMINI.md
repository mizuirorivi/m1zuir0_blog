# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development Server
- `yarn dev` - Start development server with proper environment setup (uses cross-env)
- `yarn start` - Alternative development command

### Building and Production
- `yarn build` - Build for production and run post-build scripts
- `yarn serve` - Start production server

### Code Quality and Analysis
- `yarn lint` - Run ESLint with auto-fix on app, components, lib, layouts, and scripts directories
- `yarn analyze` - Build with bundle analyzer enabled (set ANALYZE=true)

### Development Environment
- For Windows users, run `$env:PWD = $(Get-Location).Path` before yarn commands
- Uses Yarn 3.6.1 with workspaces

### Post Creation
- `yarn create-post` - This script is defined in `package.json` to run `scripts/create-post.js`, but the script file itself is missing.

### Static Export (for GitHub Pages/S3/Firebase)
- `EXPORT=1 UNOPTIMIZED=1 yarn build` - Build for static hosting
- `EXPORT=1 UNOPTIMIZED=1 BASE_PATH=/myblog yarn build` - Build with base path

## Architecture Overview

This is a Next.js 15.2.4 blog built with the App Router and TypeScript, using Contentlayer2 for content management.

## Website Routes and Navigation Units
The site features several main routes:

/ – Homepage

/blog – Blog listing and post pages

/tags – Tag index and tag-specific listings

/projects – Project showcase

/about – Author and site information

Homepage ( / ) Structure
The homepage uses an immersive WebGL scene inspired by microorganisms and geometric abstraction. Within this scene, several key concepts are defined:

Unit: Each visual element combining microorganism-like animation and geometric design is referred to as a unit.

NavUnit: A special kind of unit located near a central hexagon. These are interactive elements that serve as navigational links to other site routes. Formally, navUnit ⊆ unit.

Central Hexagon: Clicking the hexagon in the center triggers an animation where a jellyfish descends. During this animation:

All other units disappear.

New navigation options are revealed through the jellyfish's animation.

This design creates a dynamic, exploratory user experience on the homepage and ties directly into the site's aesthetic and navigation structure.


### Content Management
- **Contentlayer2**: Manages MDX content with type safety via `contentlayer.config.ts` using `contentlayer2`.
- **Content Location**: Blog posts in `content/blog/`, authors in `content/authors/`
- **Content Processing**: Automatically processes frontmatter, generates reading time, table of contents, and search indices
- **Post Structure**: Supports nested routing (e.g., `content/blog/nested-route/post.md`)
- **RAG-Ready**: Enhanced metadata schema with category, keywords, difficulty, and relatedPosts fields

### Key Directories
- `app/` - Next.js App Router pages and API routes
- `components/` - Reusable React components  
- `layouts/` - Post and page layout templates (PostLayout, PostSimple, PostBanner, ListLayout, ListLayoutWithTags, AuthorLayout)
- `content/` - MDX content files (blog posts, authors)
- `data/` - Configuration files (site metadata, projects, navigation)
- `public/static/` - Static assets (images, favicons)
- `css/` - Global styles and Prism syntax highlighting

### Core Features
- **MDX Processing**: Full MDX support with custom components via `components/MDXComponents.tsx`. Utilizes `pliny` for MDX plugins like `remarkExtractFrontmatter` and `remarkCodeTitles`.
- **Search**: Kbar command palette or Algolia integration
- **Analytics**: Multiple providers supported (Umami, Plausible, Google Analytics, etc.)
- **Comments**: Giscus, Utterances, or Disqus integration
- **Newsletter**: API support for multiple providers (Mailchimp, Buttondown, etc.)
- **SEO**: Automatic sitemap, RSS feed, and structured data generation

### Configuration Files
- `data/siteMetadata.js` - Primary site configuration
- `data/headerNavLinks.ts` - Navigation menu items
- `data/projectsData.ts` - Projects page content
- `next.config.js` - Next.js configuration with security headers
- `contentlayer.config.ts` - Content processing configuration (updated for content/ directory and RAG metadata)

### Styling
- **Tailwind CSS 4.0.5**: Primary styling framework
- **Theme Support**: Light/dark mode via `next-themes`
- **Typography**: `@tailwindcss/typography` for content styling
- **Prism**: Code syntax highlighting via `css/prism.css`

### Development Workflow
- Uses Yarn with workspaces
- Husky + lint-staged for pre-commit hooks
- ESLint + Prettier for code formatting
- TypeScript with path aliases configured

### Content Schema
Blog posts support:
- `title` (required), `date` (required)
- `tags`, `authors`, `summary`, `images`
- `draft`, `lastmod`, `canonicalUrl`
- `layout` (PostLayout, PostSimple, or PostBanner)
- `bibliography` for citations
- **RAG-Enhanced Fields**:
  - `category` - Main category classification
  - `keywords` - Array of searchable keywords
  - `difficulty` - 'beginner', 'intermediate', or 'advanced'
  - `relatedPosts` - Array of related post slugs

### Build Process
1. Contentlayer2 processes MDX files during build
2. Generates tag counts in `app/tag-data.json`
3. Creates search index if Kbar is enabled
4. Post-build script (`scripts/postbuild.mjs`) runs RSS feed generation via `scripts/rss.mjs`

### Testing and Validation
- No test framework currently configured - manual testing required
- Lint with `yarn lint` before committing changes
- Use `yarn analyze` to review bundle size and performance

## RAG Integration (Future Implementation)

### API Endpoints
- `/api/embeddings` - Embedding generation for blog content (ready for OpenAI integration)
- `/api/search` - Enhanced search with basic text search (upgradeable to vector search)

### Planned Features
- OpenAI Embeddings API integration for content vectorization
- Vector database (Supabase/Faiss) for similarity search
- Natural language query processing
- Context-aware content recommendations
- Semantic search capabilities

### Implementation Notes
- Content structure optimized for GitHub-based management
- Enhanced metadata schema ready for RAG processing
- API routes prepared for vector search integration
- Build process compatible with embedding generation workflows

## 3D/WebGL Components Architecture

### Three.js Integration
- **React Three Fiber**: Declarative Three.js rendering via `@react-three/fiber`
- **Drei Components**: Enhanced Three.js components from `@react-three/drei`
- **Homepage WebGL Scene**: Interactive 3D microorganism visualization as the main landing page

### Key 3D Components
- `app/Main.tsx` - Main WebGL canvas wrapper with full-screen layout
- `components/Home/WebGLNavigation.tsx` - Interactive navigation elements with orbital animation
- `components/Home/MicroorganismScene.tsx` - Background scientific microorganism animations
- `components/Home/OrganismMesh.tsx` - Individual 3D organism mesh components

### WebGL Architecture Patterns
- **Full-Screen Canvas**: Homepage bypasses standard layout containers for immersive experience
- **Animation Phases**: Components use staged animations (expansion → loading → orbital rotation)
- **Shared State**: Navigation items use consistent data structure with position, angle, and variation properties
- **Performance Optimizations**: Custom webpack config handles Three.js web workers and font loading

### Important Development Notes
- **Layout Override**: Homepage uses absolute positioning to escape SectionContainer constraints
- **Text Rendering**: Uses `troika-three-text` with custom webpack configuration for font handling
- **Animation State Management**: Complex microorganisms use multiple useState hooks for animation phases
- **Responsive Design**: 3D scenes are designed for desktop-first but maintain mobile compatibility

## Content Structure and Migration Notes

### Content Directory Migration
- Content has been migrated from `data/` to `content/` directory structure
- Blog posts: `content/blog/` (previously `data/blog/`)
- Authors: `content/authors/` (previously `data/authors/`)
- Contentlayer configuration updated to use new paths

### Webpack Configuration
- Custom webpack rules for SVG processing via `@svgr/webpack`
- Font loading configuration for `troika-three-text` web workers
- Fallback configuration for client-side builds (fs: false)

### Missing Components
- **Create Post Script**: The `yarn create-post` command references a missing `scripts/create-post.js` file.
- **Test Framework**: No testing framework (Jest, Vitest, etc.) currently configured
- **Tailwind Config**: No tailwind.config.ts/js file found - configuration likely embedded in package.json
