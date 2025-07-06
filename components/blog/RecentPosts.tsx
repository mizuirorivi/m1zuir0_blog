import Link from '@/components/ui/Link'
import Tag from '@/components/ui/Tag'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'
import { ArrowRight } from 'lucide-react'
import { convertPathToUrl } from '@/lib/language-utils'

const MAX_DISPLAY = 3

export default function RecentPosts({ posts }) {
  // Get the language from the first post (all posts should have the same language)
  const language = posts.length > 0 ? posts[0].lang : 'ja'
  return (
    <section className="bg-gray-50 py-16 dark:bg-gray-900/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-gray-100">
            最新の記事
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            最新の技術記事をチェックしよう
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags, category, difficulty, path } = post
            return (
              <article
                key={slug}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:scale-105 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="p-6">
                  {/* Category & Difficulty */}
                  <div className="mb-3 flex items-center gap-2">
                    {category && (
                      <span className="bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
                        {category}
                      </span>
                    )}
                    {difficulty && (
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          difficulty === 'beginner'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : difficulty === 'intermediate'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}
                      >
                        {difficulty}
                      </span>
                    )}
                  </div>

                  {/* Date */}
                  <time
                    dateTime={date}
                    className="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    {formatDate(date, siteMetadata.locale)}
                  </time>

                  {/* Title */}
                  <h3 className="group-hover:text-primary-600 dark:group-hover:text-primary-400 mt-2 text-xl font-semibold text-gray-900 transition-colors dark:text-gray-100">
                    <Link href={convertPathToUrl(path)} className="block">
                      {title}
                    </Link>
                  </h3>

                  {/* Summary */}
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {summary}
                  </p>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-1">
                    {tags?.slice(0, 3).map((tag) => <Tag key={tag} text={tag} />)}
                  </div>

                  {/* Read More */}
                  <Link
                    href={convertPathToUrl(path)}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mt-4 inline-flex items-center gap-1 text-sm font-medium transition-colors"
                  >
                    記事を読む
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>

        {posts.length > MAX_DISPLAY && (
          <div className="mt-12 text-center">
            <Link
              href={`/${language}/blog`}
              className="inline-flex items-center gap-2 rounded-full border border-solid border-gray-300 px-6 py-3 text-sm font-medium transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              すべての記事を見る
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
