import 'css/prism.css'
import 'katex/dist/katex.css'

import PageTitle from '@/components/ui/PageTitle'
import { components } from '@/components/blog/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { sortPosts, coreContent, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs, allAuthors } from 'contentlayer/generated'
import type { Authors, Blog } from 'contentlayer/generated'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'
import { filterBlogsByLanguage, getAuthorBySlugAndLanguage, Language } from '@/lib/language-utils'

const defaultLayout = 'PostLayout'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[]; lang: string }>
}): Promise<Metadata | undefined> {
  const { lang } = await params
  const language = lang as Language
  if (language !== 'ja' && language !== 'en') {
    return
  }

  const { slug: slugArray } = await params
  const slug = decodeURI(slugArray.join('/'))
  const filteredBlogs = filterBlogsByLanguage(language)
  const post = filteredBlogs.find((p) => p.slug === slug)
  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults =
      getAuthorBySlugAndLanguage(author, language) || allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })

  if (!post) {
    return
  }

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = authorDetails.map((author) => author.name)
  let imageList = [siteMetadata.socialBanner]
  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img.includes('http') ? img : siteMetadata.siteUrl + img,
    }
  })

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: language === 'ja' ? 'ja_JP' : 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
      images: ogImages,
      authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: imageList,
    },
  }
}

export const generateStaticParams = async (): Promise<{ slug: string[]; lang: string }[]> => {
  const params: { slug: string[]; lang: string }[] = []

  for (const lang of ['ja', 'en']) {
    const filteredBlogs = filterBlogsByLanguage(lang as Language)
    const langParams = filteredBlogs.map((p) => ({ slug: p.slug.split('/'), lang }))
    params.push(...langParams)
  }

  return params
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[]; lang: string }>
}) {
  const { lang, slug: slugArray } = await params
  const language = lang as Language

  // 有効な言語かチェック
  if (language !== 'ja' && language !== 'en') {
    return notFound()
  }

  const slug = decodeURI(slugArray.join('/'))

  // 言語でフィルタリングしてから記事を探す
  const filteredBlogs = filterBlogsByLanguage(language)
  const sortedCoreContents = allCoreContent(sortPosts(filteredBlogs))
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug)

  if (postIndex === -1) {
    return notFound()
  }

  const prev = sortedCoreContents[postIndex + 1]
  const next = sortedCoreContents[postIndex - 1]
  const post = filteredBlogs.find((p) => p.slug === slug) as Blog
  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults =
      getAuthorBySlugAndLanguage(author, language) || allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })
  const mainContent = coreContent(post)
  const jsonLd = post.structuredData
  jsonLd['author'] = authorDetails.map((author) => {
    return {
      '@type': 'Person',
      name: author.name,
    }
  })

  const Layout = layouts[post.layout || defaultLayout]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </Layout>
    </>
  )
}
