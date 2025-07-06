import { notFound } from 'next/navigation'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { filterBlogsByLanguage, Language } from '@/lib/language-utils'
import { genPageMetadata } from 'app/seo'
import ListLayout from '@/layouts/ListLayoutWithTags'

const POSTS_PER_PAGE = 5

export const generateStaticParams = async () => {
  return [{ lang: 'ja' }, { lang: 'en' }]
}

export const generateMetadata = async ({ params }: { params: Promise<{ lang: string }> }) => {
  const { lang } = await params
  const title = lang === 'ja' ? 'ブログ' : 'Blog'
  return genPageMetadata({ title })
}

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const language = lang as Language

  // 有効な言語かチェック
  if (language !== 'ja' && language !== 'en') {
    return notFound()
  }

  // 言語に応じてフィルタリング
  const filteredBlogs = filterBlogsByLanguage(language)
  const publishedPosts = allCoreContent(sortPosts(filteredBlogs)).filter((post) => !post.draft)

  const pageNumber = 1
  const totalPages = Math.ceil(publishedPosts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = publishedPosts.slice(0, POSTS_PER_PAGE * pageNumber)

  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.max(1, totalPages),
  }

  const title = language === 'ja' ? 'すべての投稿' : 'All Posts'

  return (
    <ListLayout
      posts={publishedPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={title}
    />
  )
}
