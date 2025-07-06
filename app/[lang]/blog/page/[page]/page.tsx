import { notFound } from 'next/navigation'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { filterBlogsByLanguage, Language } from '@/lib/language-utils'
import { allBlogs } from 'contentlayer/generated'
import ListLayout from '@/layouts/ListLayoutWithTags'

export const dynamicParams = false

const POSTS_PER_PAGE = 5

export const generateStaticParams = async (): Promise<{ lang: string; page: string }[]> => {
  const params: { lang: string; page: string }[] = []

  for (const lang of ['ja', 'en']) {
    const filteredBlogs = filterBlogsByLanguage(lang as Language)
    const publishedBlogs = filteredBlogs.filter((post) => !post.draft)
    const totalPages = Math.ceil(publishedBlogs.length / POSTS_PER_PAGE)

    const langPages =
      totalPages > 0
        ? Array.from({ length: totalPages }, (_, i) => ({
            lang,
            page: (i + 1).toString(),
          }))
        : [{ lang, page: '1' }]

    params.push(...langPages)
  }

  return params
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; page: string }>
}) {
  const { lang, page } = await params
  const language = lang as Language
  const pageNumber = parseInt(page as string)

  // 有効な言語かチェック
  if (language !== 'ja' && language !== 'en') {
    return notFound()
  }

  // Return 404 for invalid page numbers
  if (pageNumber <= 0 || isNaN(pageNumber)) {
    return notFound()
  }

  // 言語に応じてフィルタリング
  const filteredBlogs = filterBlogsByLanguage(language)
  const publishedPosts = allCoreContent(sortPosts(filteredBlogs)).filter((post) => !post.draft)

  const totalPages = Math.ceil(publishedPosts.length / POSTS_PER_PAGE)

  // If there are no posts at all, only allow page 1
  if (publishedPosts.length === 0 && pageNumber !== 1) {
    return notFound()
  }

  // If there are posts but page number exceeds total pages, return 404
  if (totalPages > 0 && pageNumber > totalPages) {
    return notFound()
  }

  const initialDisplayPosts = publishedPosts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )

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
