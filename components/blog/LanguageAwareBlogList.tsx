'use client'

import { useLanguage } from '@/lib/LanguageContext'
import { filterBlogsByLanguage } from '@/lib/language-utils'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import ListLayout from '@/layouts/ListLayoutWithTags'

const POSTS_PER_PAGE = 5

interface LanguageAwareBlogListProps {
  initialPage?: number
}

export default function LanguageAwareBlogList({ initialPage = 1 }: LanguageAwareBlogListProps) {
  const { language } = useLanguage()

  // 言語に応じてフィルタリング
  const filteredBlogs = filterBlogsByLanguage(language)
  const publishedPosts = allCoreContent(sortPosts(filteredBlogs)).filter((post) => !post.draft)

  const pageNumber = initialPage
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
