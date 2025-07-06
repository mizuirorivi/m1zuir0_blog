import { defineDocumentType, ComputedFields, makeSource } from 'contentlayer2/source-files'
import { writeFileSync } from 'fs'
import readingTime from 'reading-time'
import { slug } from 'github-slugger'
import path from 'path'
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic'
// Remark packages
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { remarkAlert } from 'remark-github-blockquote-alert'
import remarkBreaks from 'remark-breaks'
import {
  remarkExtractFrontmatter,
  remarkCodeTitles,
  remarkImgToJsx,
  extractTocHeadings,
} from 'pliny/mdx-plugins/index.js'
// Rehype packages
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeKatexNoTranslate from 'rehype-katex-notranslate'
import rehypeCitation from 'rehype-citation'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypePresetMinify from 'rehype-preset-minify'
import siteMetadata from './data/siteMetadata'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer.js'
import prettier from 'prettier'

const root = process.cwd()
const isProduction = process.env.NODE_ENV === 'production'

// heroicon mini link
const icon = fromHtmlIsomorphic(
  `
  <span class="content-header-link">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 linkicon">
  <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
  <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
  </svg>
  </span>
`,
  { fragment: true }
)

const computedFields: ComputedFields = {
  readingTime: { type: 'json', resolve: (doc) => readingTime(doc.body.raw) },
  slug: {
    type: 'string',
    resolve: (doc) => {
      // blog/ja/welcome.md → welcome
      // blog/en/welcome.md → welcome
      const pathParts = doc._raw.flattenedPath.split('/')
      return pathParts.slice(2).join('/') // 'blog/ja' を除去
    },
  },
  path: {
    type: 'string',
    resolve: (doc) => {
      // blog/ja/welcome → ja/blog/welcome (新しい言語ファーストルーティング)
      const pathParts = doc._raw.flattenedPath.split('/')
      const lang = pathParts[1] // 'ja' または 'en'
      const blogPath = pathParts.slice(2).join('/') // 残りのパス
      return `${lang}/blog/${blogPath}`
    },
  },
  filePath: {
    type: 'string',
    resolve: (doc) => doc._raw.sourceFilePath,
  },
  // フォルダパスから言語を自動検出
  lang: {
    type: 'string',
    resolve: (doc) => {
      const pathParts = doc._raw.flattenedPath.split('/')
      return pathParts[1] // blog/ja/welcome → ja
    },
  },
  toc: { type: 'json', resolve: (doc) => extractTocHeadings(doc.body.raw) },
}

/**
 * Count the occurrences of all tags across blog posts and write to language-specific json files
 */
async function createTagCount(allBlogs) {
  // 全体のタグ数（後方互換性のため保持）
  const tagCount: Record<string, number> = {}
  
  // 言語別のタグ数
  const tagCountJa: Record<string, number> = {}
  const tagCountEn: Record<string, number> = {}
  
  allBlogs.forEach((file) => {
    if (file.tags && file.draft !== true) {
      file.tags.forEach((tag) => {
        const formattedTag = slug(tag)
        
        // 全体のカウント
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1
        } else {
          tagCount[formattedTag] = 1
        }
        
        // 言語別のカウント
        if (file.lang === 'ja') {
          if (formattedTag in tagCountJa) {
            tagCountJa[formattedTag] += 1
          } else {
            tagCountJa[formattedTag] = 1
          }
        } else if (file.lang === 'en') {
          if (formattedTag in tagCountEn) {
            tagCountEn[formattedTag] += 1
          } else {
            tagCountEn[formattedTag] = 1
          }
        }
      })
    }
  })
  
  // ファイルを書き出し
  const formattedAll = await prettier.format(JSON.stringify(tagCount, null, 2), { parser: 'json' })
  const formattedJa = await prettier.format(JSON.stringify(tagCountJa, null, 2), { parser: 'json' })
  const formattedEn = await prettier.format(JSON.stringify(tagCountEn, null, 2), { parser: 'json' })
  
  writeFileSync('./app/tag-data.json', formattedAll)
  writeFileSync('./app/tag-data-ja.json', formattedJa)
  writeFileSync('./app/tag-data-en.json', formattedEn)
}

function createSearchIndex(allBlogs) {
  if (
    siteMetadata?.search?.provider === 'kbar' &&
    siteMetadata.search.kbarConfig.searchDocumentsPath
  ) {
    // ドラフト記事を除外
    const publishedBlogs = allBlogs.filter(blog => blog.draft !== true)
    
    // 全体の検索インデックス（後方互換性のため保持）
    writeFileSync(
      `public/${path.basename(siteMetadata.search.kbarConfig.searchDocumentsPath)}`,
      JSON.stringify(allCoreContent(sortPosts(publishedBlogs)))
    )
    
    // 言語別の検索インデックス（ドラフト除外）
    const blogsByLang = {
      ja: publishedBlogs.filter(blog => blog.lang === 'ja'),
      en: publishedBlogs.filter(blog => blog.lang === 'en')
    }
    
    // 日本語の検索インデックス
    writeFileSync(
      'public/search-ja.json',
      JSON.stringify(allCoreContent(sortPosts(blogsByLang.ja)))
    )
    
    // 英語の検索インデックス
    writeFileSync(
      'public/search-en.json',
      JSON.stringify(allCoreContent(sortPosts(blogsByLang.en)))
    )
    
    console.log('Local search index generated...')
  }
}

export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: 'blog/{ja,en}/**/*.{md,mdx}',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    lastmod: { type: 'date' },
    draft: { type: 'boolean' },
    summary: { type: 'string' },
    images: { type: 'json' },
    authors: { type: 'list', of: { type: 'string' } },
    layout: { type: 'string' },
    bibliography: { type: 'string' },
    canonicalUrl: { type: 'string' },
    // 多言語対応
    translationKey: { type: 'string' }, // 翻訳記事をリンクするためのキー
    // RAG対応のメタデータフィールド
    category: { type: 'string' },
    keywords: { type: 'list', of: { type: 'string' }, default: [] },
    difficulty: { type: 'enum', options: ['beginner', 'intermediate', 'advanced'] },
    readingTime: { type: 'number' },
    relatedPosts: { type: 'list', of: { type: 'string' }, default: [] },
  },
  computedFields: {
    ...computedFields,
    structuredData: {
      type: 'json',
      resolve: (doc) => ({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: doc.title,
        datePublished: doc.date,
        dateModified: doc.lastmod || doc.date,
        description: doc.summary,
        image: doc.images ? doc.images[0] : siteMetadata.socialBanner,
        url: `${siteMetadata.siteUrl}/${doc._raw.flattenedPath}`,
      }),
    },
  },
}))

export const Authors = defineDocumentType(() => ({
  name: 'Authors',
  filePathPattern: 'authors/{ja,en}/**/*.{md,mdx}',
  contentType: 'mdx',
  fields: {
    name: { type: 'string', required: true },
    avatar: { type: 'string' },
    occupation: { type: 'string' },
    company: { type: 'string' },
    email: { type: 'string' },
    twitter: { type: 'string' },
    bluesky: { type: 'string' },
    linkedin: { type: 'string' },
    github: { type: 'string' },
    layout: { type: 'string' },
  },
  computedFields: {
    ...computedFields,
    // Authorsのslugは最後のファイル名のみ
    slug: {
      type: 'string',
      resolve: (doc) => {
        const pathParts = doc._raw.flattenedPath.split('/')
        return pathParts[pathParts.length - 1] // default
      },
    },
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Blog, Authors],
  disableImportAliasWarning: true,
  mdx: {
    cwd: process.cwd(),
    remarkPlugins: [
      remarkExtractFrontmatter,
      remarkGfm,
      remarkCodeTitles,
      remarkMath,
      remarkImgToJsx,
      remarkAlert,
      remarkBreaks,
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'prepend',
          headingProperties: {
            className: ['content-header'],
          },
          content: icon,
        },
      ],
      rehypeKatex,
      rehypeKatexNoTranslate,
      [rehypeCitation, { path: path.join(root, 'content') }],
      [rehypePrismPlus, { defaultLanguage: 'js', ignoreMissing: true }],
      rehypePresetMinify,
    ],
  },
  onSuccess: async (importData) => {
    const { allBlogs } = await importData()
    // Obsidianフォルダやテンプレートを除外
    const filteredBlogs = allBlogs.filter(blog => 
      !blog._raw.sourceFilePath.includes('.obsidian') && 
      !blog._raw.sourceFilePath.includes('content/templates')
    )
    createTagCount(filteredBlogs)
    createSearchIndex(filteredBlogs)
  },
})
