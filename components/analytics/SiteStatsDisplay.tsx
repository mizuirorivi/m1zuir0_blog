'use client'

import { useState, useEffect } from 'react'
import { SiteMetricsTracker, SiteStats } from '@/lib/SiteMetricsTracker'

interface SiteStatsDisplayProps {
  showDetailed?: boolean
}

export default function SiteStatsDisplay({ showDetailed = false }: SiteStatsDisplayProps) {
  const [stats, setStats] = useState<SiteStats | null>(null)
  const [bloomStats, setBloomStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const tracker = new SiteMetricsTracker()

    const fetchStats = () => {
      try {
        const siteStats = tracker.getSiteStats()
        const bloomFilterStats = tracker.getBloomFilterStats()

        setStats(siteStats)
        setBloomStats(bloomFilterStats)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
        setIsLoading(false)
      }
    }

    fetchStats()

    // Update stats every 30 seconds
    const interval = setInterval(fetchStats, 30000)

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
        <div className="mb-4 h-4 rounded bg-gray-300 dark:bg-gray-600"></div>
        <div className="mb-2 h-4 rounded bg-gray-300 dark:bg-gray-600"></div>
        <div className="h-4 rounded bg-gray-300 dark:bg-gray-600"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="rounded-lg bg-gray-100 p-6 text-center dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-400">統計データを読み込めませんでした</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Basic Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard title="総訪問者数" value={stats.totalVisitors.toLocaleString()} icon="👥" />
        <StatCard title="ユニーク訪問者" value={stats.uniqueVisitors.toLocaleString()} icon="🆔" />
        <StatCard title="ページビュー" value={stats.totalPageViews.toLocaleString()} icon="📄" />
        <StatCard title="ブログ記事数" value={stats.blogPostCount.toLocaleString()} icon="✍️" />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="タグ数" value={stats.tagCount.toLocaleString()} icon="🏷️" />
        <StatCard
          title="リピート訪問者"
          value={stats.returningVisitors.toLocaleString()}
          icon="🔄"
        />
        <StatCard
          title="平均滞在時間"
          value={`${Math.round(stats.averageTimeOnSite / 1000)}秒`}
          icon="⏱️"
        />
      </div>

      {showDetailed && (
        <>
          {/* Popular Posts */}
          {stats.popularPosts.length > 0 && (
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-900">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                人気記事 📈
              </h3>
              <div className="space-y-2">
                {stats.popularPosts.slice(0, 5).map((post, index) => (
                  <div
                    key={post.slug}
                    className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 dark:bg-gray-800"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {index + 1}. {post.slug}
                    </span>
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                      {post.views} views
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Tags */}
          {stats.popularTags.length > 0 && (
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-900">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                人気タグ 🏷️
              </h3>
              <div className="flex flex-wrap gap-2">
                {stats.popularTags.slice(0, 10).map((tag) => (
                  <span
                    key={tag.name}
                    className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {tag.name} ({tag.count})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Search Queries */}
          {stats.searchQueries.length > 0 && (
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-900">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                検索クエリ 🔍
              </h3>
              <div className="space-y-2">
                {stats.searchQueries.slice(0, 5).map((query, index) => (
                  <div
                    key={query.query}
                    className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 dark:bg-gray-800"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">{query.query}</span>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                      {query.count} 回
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bloom Filter Stats */}
          {bloomStats && (
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-900">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                ブルームフィルター統計 🔬
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <BloomFilterStat title="訪問者フィルター" stats={bloomStats.visitors} />
                <BloomFilterStat title="ページビューフィルター" stats={bloomStats.pageViews} />
                <BloomFilterStat title="検索フィルター" stats={bloomStats.searches} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  )
}

function BloomFilterStat({ title, stats }: { title: string; stats: any }) {
  return (
    <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-800">
      <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">{title}</h4>
      <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
        <div>サイズ: {stats.size.toLocaleString()}</div>
        <div>設定ビット: {stats.setBits.toLocaleString()}</div>
        <div>使用率: {(stats.fillRatio * 100).toFixed(2)}%</div>
        <div>偽陽性率: {(stats.estimatedFalsePositiveRate * 100).toFixed(4)}%</div>
      </div>
    </div>
  )
}
