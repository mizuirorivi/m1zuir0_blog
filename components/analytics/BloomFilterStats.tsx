'use client'

import { useState, useEffect } from 'react'
import { SiteMetricsTracker } from '@/lib/SiteMetricsTracker'

interface NormalizedStats {
  visitors: number
  pageViews: number
  searches: number
  overall: number
}

export default function BloomFilterStats() {
  const [stats, setStats] = useState<NormalizedStats>({
    visitors: 0,
    pageViews: 0,
    searches: 0,
    overall: 0,
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateStats = () => {
      try {
        const tracker = new SiteMetricsTracker()
        const bloomStats = tracker.getBloomFilterStats()

        // Normalize fill ratios to 0-1 range
        const normalizedStats = {
          visitors: Math.min(bloomStats.visitors.fillRatio, 1),
          pageViews: Math.min(bloomStats.pageViews.fillRatio, 1),
          searches: Math.min(bloomStats.searches.fillRatio, 1),
          overall: Math.min(
            (bloomStats.visitors.fillRatio +
              bloomStats.pageViews.fillRatio +
              bloomStats.searches.fillRatio) /
              3,
            1
          ),
        }

        setStats(normalizedStats)
      } catch (error) {
        console.error('Failed to fetch bloom filter stats:', error)
      }
    }

    // Initial update
    updateStats()

    // Update every 10 seconds
    const interval = setInterval(updateStats, 10000)

    return () => clearInterval(interval)
  }, [])

  // Toggle visibility on click
  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  return (
    <div className="mt-2 text-center">
      {/* Compact indicator */}
      <button
        onClick={toggleVisibility}
        className="group inline-flex items-center space-x-2 rounded-md px-2 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        title="ブルームフィルター統計 (クリックで詳細表示)"
      >
        <span>🔬</span>
        <span>BF: {(stats.overall * 100).toFixed(6)}%</span>
        {isVisible ? <span>▼</span> : <span>▶</span>}
      </button>

      {/* Detailed stats (toggle) */}
      {isVisible && (
        <div className="mt-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
          <div className="mb-2 text-xs font-medium text-gray-700 dark:text-gray-300">
            ブルームフィルター効率 (0-1正規化)
          </div>

          <div className="space-y-2">
            {/* Visitors */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">訪問者:</span>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-20 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${stats.visitors * 100}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-gray-700 dark:text-gray-300">
                  {stats.visitors.toFixed(6)}
                </span>
              </div>
            </div>

            {/* Page Views */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">ページ:</span>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-20 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-green-500 transition-all duration-300"
                    style={{ width: `${stats.pageViews * 100}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-gray-700 dark:text-gray-300">
                  {stats.pageViews.toFixed(6)}
                </span>
              </div>
            </div>

            {/* Searches */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">検索:</span>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-20 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-purple-500 transition-all duration-300"
                    style={{ width: `${stats.searches * 100}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-gray-700 dark:text-gray-300">
                  {stats.searches.toFixed(6)}
                </span>
              </div>
            </div>

            {/* Overall */}
            <div className="border-t border-gray-200 pt-2 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">全体:</span>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-20 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-orange-500 transition-all duration-300"
                      style={{ width: `${stats.overall * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs font-medium text-gray-800 dark:text-gray-200">
                    {stats.overall.toFixed(6)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            値が高いほどフィルターがアクティブに使用されています
          </div>
        </div>
      )}
    </div>
  )
}
