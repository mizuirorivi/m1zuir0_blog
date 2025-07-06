import Link from '@/components/ui/Link'
import Tag from '@/components/ui/Tag'
import { slug } from 'github-slugger'
import { genPageMetadata } from 'app/seo'
import { filterBlogsByLanguage, Language } from '@/lib/language-utils'
import { notFound } from 'next/navigation'

export const generateStaticParams = async (): Promise<{ lang: string }[]> => {
  return [{ lang: 'ja' }, { lang: 'en' }]
}

export const generateMetadata = async ({ params }: { params: Promise<{ lang: string }> }) => {
  const { lang } = await params
  const title = lang === 'ja' ? 'タグ' : 'Tags'
  return genPageMetadata({ title, description: lang === 'ja' ? 'ブログのタグ一覧' : 'Blog tags' })
}

export default async function TagsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const language = lang as Language

  // 有効な言語かチェック
  if (language !== 'ja' && language !== 'en') {
    return notFound()
  }

  // 言語別にフィルタリングしたブログからタグを生成
  const filteredBlogs = filterBlogsByLanguage(language)
  const tagCount: Record<string, number> = {}

  filteredBlogs.forEach((post) => {
    if (post.tags && !post.draft) {
      post.tags.forEach((tag) => {
        const formattedTag = slug(tag)
        tagCount[formattedTag] = (tagCount[formattedTag] || 0) + 1
      })
    }
  })

  const tagKeys = Object.keys(tagCount)
  const sortedTags = tagKeys.sort((a, b) => tagCount[b] - tagCount[a])

  const title = language === 'ja' ? 'タグ' : 'Tags'

  return (
    <>
      <div className="flex flex-col items-start justify-start divide-y divide-gray-200 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0 dark:divide-gray-700">
        <div className="space-x-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14 dark:text-gray-100">
            {title}
          </h1>
        </div>
        <div className="flex max-w-lg flex-wrap">
          {tagKeys.length === 0 && (
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'ja' ? 'タグが見つかりません。' : 'No tags found.'}
            </p>
          )}
          {sortedTags.map((t) => {
            return (
              <div key={t} className="mt-2 mr-5 mb-2">
                <Tag text={t} />
                <Link
                  href={`/${language}/tags/${t}`}
                  className="-ml-2 text-sm font-semibold text-gray-600 uppercase dark:text-gray-300"
                  aria-label={`View posts tagged ${t}`}
                >
                  {` (${tagCount[t]})`}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
