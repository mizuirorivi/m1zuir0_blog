import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { filterBlogsByLanguage, Language } from '@/lib/language-utils'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string; lang: string }>
}): Promise<Metadata> {
  const { tag, lang } = await params
  const title = lang === 'ja' ? `${tag} - タグ` : `${tag} - Tag`
  return {
    title,
    description: `${siteMetadata.title} ${tag} ${lang === 'ja' ? 'タグ付き記事' : 'tagged posts'}`,
    openGraph: {
      title,
      description: `${siteMetadata.title} ${tag} ${lang === 'ja' ? 'タグ付き記事' : 'tagged posts'}`,
      url: `${siteMetadata.siteUrl}/${lang}/tags/${tag}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: `${siteMetadata.title} ${tag} ${lang === 'ja' ? 'タグ付き記事' : 'tagged posts'}`,
    },
  }
}

export const generateStaticParams = async (): Promise<{ tag: string; lang: string }[]> => {
  const params: { tag: string; lang: string }[] = []

  for (const lang of ['ja', 'en']) {
    const filteredBlogs = filterBlogsByLanguage(lang as Language)
    const tagCounts: Record<string, number> = {}

    filteredBlogs.forEach((post) => {
      if (post.tags && !post.draft) {
        post.tags.forEach((tag) => {
          const formattedTag = slug(tag)
          tagCounts[formattedTag] = (tagCounts[formattedTag] || 0) + 1
        })
      }
    })

    const langParams = Object.keys(tagCounts).map((tag) => ({
      tag,
      lang,
    }))

    params.push(...langParams)
  }

  return params
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string; lang: string }>
}) {
  const { tag, lang } = await params
  const language = lang as Language

  // 有効な言語かチェック
  if (language !== 'ja' && language !== 'en') {
    return notFound()
  }

  // 言語別にフィルタリング
  const filteredBlogs = filterBlogsByLanguage(language)

  // Decoding tag from URL
  const decodedTag = decodeURI(tag)

  // Filter posts by tag
  const filteredPosts = allCoreContent(
    sortPosts(
      filteredBlogs.filter(
        (post) => post.tags && post.tags.map((t) => slug(t)).includes(decodedTag)
      )
    )
  )

  // If tag does not exist, return 404
  if (filteredPosts.length === 0) {
    return notFound()
  }

  const title = language === 'ja' ? `${decodedTag} タグの記事` : `Posts tagged "${decodedTag}"`

  return (
    <ListLayout
      posts={filteredPosts}
      title={title}
      initialDisplayPosts={filteredPosts}
      pagination={{
        currentPage: 1,
        totalPages: 1,
      }}
    />
  )
}
