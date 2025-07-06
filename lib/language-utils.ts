import { allBlogs, allAuthors, Blog, Authors } from 'contentlayer/generated'

const isProduction = process.env.NODE_ENV === 'production'

export type Language = 'ja' | 'en'

export function filterBlogsByLanguage(language: Language) {
  return allBlogs.filter((blog) => blog.lang === language && !blog.draft)
}

export function filterAuthorsByLanguage(language: Language) {
  return allAuthors.filter((author) => author.lang === language)
}

export function getAuthorBySlugAndLanguage(slug: string, language: Language): Authors | undefined {
  const authors = filterAuthorsByLanguage(language)
  return authors.find((author) => author.slug === slug)
}

export function getTranslatedPost(post: Blog, targetLanguage: Language) {
  if (!post.translationKey) return null

  return allBlogs.find(
    (blog) => blog.translationKey === post.translationKey && blog.lang === targetLanguage
  )
}

export function hasTranslation(post: Blog, targetLanguage: Language): boolean {
  return !!getTranslatedPost(post, targetLanguage)
}

/**
 * Converts contentlayer path to the correct URL format
 * @param path - contentlayer path like "blog/ja/welcome"
 * @returns URL path like "/ja/blog/welcome"
 */
export function convertPathToUrl(path: string): string {
  // Handle both "blog/ja/welcome" and "blog/en/welcome" formats
  const pathParts = path.split('/')
  if (pathParts.length >= 3 && pathParts[0] === 'blog') {
    const lang = pathParts[1] // 'ja' or 'en'
    const slug = pathParts.slice(2).join('/') // 'welcome' or 'nested/post'
    return `/${lang}/blog/${slug}`
  }

  // Fallback for unexpected formats
  return `/${path}`
}
