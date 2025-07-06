import { BloomFilter } from './BloomFilter'

/**
 * Site metrics that can be tracked
 */
export type MetricType =
  | 'visitor_count'
  | 'page_view_count'
  | 'blog_post_count'
  | 'tag_count'
  | 'unique_visitor'
  | 'returning_visitor'
  | 'search_query'
  | 'popular_post'
  | 'popular_tag'
  | 'user_session'
  | 'bounce_rate'
  | 'time_on_site'

/**
 * Metric entry structure
 */
export interface MetricEntry {
  type: MetricType
  value: string | number
  timestamp: number
  metadata?: Record<string, any>
}

/**
 * Site statistics structure
 */
export interface SiteStats {
  totalVisitors: number
  uniqueVisitors: number
  returningVisitors: number
  totalPageViews: number
  blogPostCount: number
  tagCount: number
  popularPosts: { slug: string; views: number }[]
  popularTags: { name: string; count: number }[]
  searchQueries: { query: string; count: number }[]
  averageTimeOnSite: number
  bounceRate: number
}

/**
 * Site metrics tracker using bloom filters for efficient storage
 */
export class SiteMetricsTracker {
  private visitorBloomFilter: BloomFilter
  private pageViewBloomFilter: BloomFilter
  private searchBloomFilter: BloomFilter
  private metricsMap: Map<string, number> = new Map()
  private sessionStorage: Map<string, any> = new Map()

  constructor() {
    // Different bloom filters for different types of data
    this.visitorBloomFilter = new BloomFilter(50000, 0.01) // For unique visitors
    this.pageViewBloomFilter = new BloomFilter(100000, 0.01) // For page views
    this.searchBloomFilter = new BloomFilter(10000, 0.01) // For search queries

    this.loadFromStorage()
  }

  /**
   * Track a visitor (unique identification)
   */
  trackVisitor(visitorId: string, isReturning: boolean = false): void {
    const visitorKey = `visitor:${visitorId}`
    const dateKey = `visitor:${visitorId}:${this.getDateKey()}`

    // Check if visitor seen before
    const isNewVisitor = !this.visitorBloomFilter.mightContain(visitorKey)

    if (isNewVisitor) {
      this.visitorBloomFilter.add(visitorKey)
      this.incrementMetric('unique_visitors')
    }

    // Track daily visitors
    if (!this.visitorBloomFilter.mightContain(dateKey)) {
      this.visitorBloomFilter.add(dateKey)
      this.incrementMetric('daily_visitors')
    }

    if (isReturning) {
      this.incrementMetric('returning_visitors')
    }

    this.incrementMetric('total_visitors')
  }

  /**
   * Track page view
   */
  trackPageView(url: string, visitorId: string): void {
    const pageViewKey = `pageview:${url}:${visitorId}:${this.getDateKey()}`

    // Add to bloom filter
    this.pageViewBloomFilter.add(pageViewKey)

    // Track specific page metrics
    this.incrementMetric('total_page_views')
    this.incrementMetric(`page_views:${url}`)

    // Track popular posts
    if (url.includes('/blog/')) {
      const postSlug = this.extractPostSlug(url)
      if (postSlug) {
        this.incrementMetric(`post_views:${postSlug}`)
      }
    }
  }

  /**
   * Track blog post count
   */
  trackBlogPost(postSlug: string): void {
    const postKey = `blog_post:${postSlug}`

    if (!this.pageViewBloomFilter.mightContain(postKey)) {
      this.pageViewBloomFilter.add(postKey)
      this.incrementMetric('blog_post_count')
    }
  }

  /**
   * Track tag usage
   */
  trackTag(tagName: string): void {
    const tagKey = `tag:${tagName}`

    if (!this.pageViewBloomFilter.mightContain(tagKey)) {
      this.pageViewBloomFilter.add(tagKey)
      this.incrementMetric('tag_count')
    }

    this.incrementMetric(`tag_usage:${tagName}`)
  }

  /**
   * Track search query
   */
  trackSearchQuery(query: string, visitorId: string): void {
    const searchKey = `search:${query}:${visitorId}:${this.getDateKey()}`

    // Add to bloom filter
    this.searchBloomFilter.add(searchKey)

    // Track search metrics
    this.incrementMetric('total_searches')
    this.incrementMetric(`search_query:${query}`)
  }

  /**
   * Track user session
   */
  trackUserSession(sessionId: string, duration: number): void {
    const sessionKey = `session:${sessionId}`

    this.sessionStorage.set(sessionKey, {
      duration,
      timestamp: Date.now(),
    })

    // Update average time on site
    this.updateAverageTimeOnSite(duration)
  }

  /**
   * Track bounce rate
   */
  trackBounce(sessionId: string, isBounce: boolean): void {
    const bounceKey = `bounce:${sessionId}`

    if (isBounce) {
      this.incrementMetric('bounce_sessions')
    }

    this.incrementMetric('total_sessions')
  }

  /**
   * Check if visitor has been seen before
   */
  hasSeenVisitor(visitorId: string): boolean {
    return this.visitorBloomFilter.mightContain(`visitor:${visitorId}`)
  }

  /**
   * Check if page view has been recorded
   */
  hasSeenPageView(url: string, visitorId: string): boolean {
    const pageViewKey = `pageview:${url}:${visitorId}:${this.getDateKey()}`
    return this.pageViewBloomFilter.mightContain(pageViewKey)
  }

  /**
   * Check if search query has been seen
   */
  hasSeenSearchQuery(query: string, visitorId: string): boolean {
    const searchKey = `search:${query}:${visitorId}:${this.getDateKey()}`
    return this.searchBloomFilter.mightContain(searchKey)
  }

  /**
   * Get comprehensive site statistics
   */
  getSiteStats(): SiteStats {
    const popularPosts = this.getTopItems('post_views:', 10)
    const popularTags = this.getTopItems('tag_usage:', 10)
    const searchQueries = this.getTopItems('search_query:', 10)

    return {
      totalVisitors: this.getMetric('total_visitors'),
      uniqueVisitors: this.getMetric('unique_visitors'),
      returningVisitors: this.getMetric('returning_visitors'),
      totalPageViews: this.getMetric('total_page_views'),
      blogPostCount: this.getMetric('blog_post_count'),
      tagCount: this.getMetric('tag_count'),
      popularPosts: popularPosts.map((item) => ({
        slug: item.key.replace('post_views:', ''),
        views: item.value,
      })),
      popularTags: popularTags.map((item) => ({
        name: item.key.replace('tag_usage:', ''),
        count: item.value,
      })),
      searchQueries: searchQueries.map((item) => ({
        query: item.key.replace('search_query:', ''),
        count: item.value,
      })),
      averageTimeOnSite: this.getMetric('average_time_on_site'),
      bounceRate: this.calculateBounceRate(),
    }
  }

  /**
   * Get bloom filter statistics
   */
  getBloomFilterStats(): {
    visitors: any
    pageViews: any
    searches: any
  } {
    return {
      visitors: this.visitorBloomFilter.getStats(),
      pageViews: this.pageViewBloomFilter.getStats(),
      searches: this.searchBloomFilter.getStats(),
    }
  }

  /**
   * Private helper methods
   */
  private getDateKey(): string {
    return new Date().toISOString().split('T')[0]
  }

  private extractPostSlug(url: string): string | null {
    const match = url.match(/\/blog\/([^\/]+)/)
    return match ? match[1] : null
  }

  private incrementMetric(key: string): void {
    const current = this.metricsMap.get(key) || 0
    this.metricsMap.set(key, current + 1)
  }

  private getMetric(key: string): number {
    return this.metricsMap.get(key) || 0
  }

  private updateAverageTimeOnSite(duration: number): void {
    const currentAvg = this.getMetric('average_time_on_site')
    const currentCount = this.getMetric('session_count')

    const newAvg = (currentAvg * currentCount + duration) / (currentCount + 1)
    this.metricsMap.set('average_time_on_site', newAvg)
    this.incrementMetric('session_count')
  }

  private calculateBounceRate(): number {
    const bounceSessions = this.getMetric('bounce_sessions')
    const totalSessions = this.getMetric('total_sessions')

    return totalSessions > 0 ? (bounceSessions / totalSessions) * 100 : 0
  }

  private getTopItems(prefix: string, limit: number): { key: string; value: number }[] {
    const items: { key: string; value: number }[] = []

    for (const [key, value] of this.metricsMap.entries()) {
      if (key.startsWith(prefix)) {
        items.push({ key, value })
      }
    }

    return items.sort((a, b) => b.value - a.value).slice(0, limit)
  }

  /**
   * Storage methods
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined') return

    try {
      const data = {
        visitorBloomFilter: this.visitorBloomFilter.export(),
        pageViewBloomFilter: this.pageViewBloomFilter.export(),
        searchBloomFilter: this.searchBloomFilter.export(),
        metricsMap: Array.from(this.metricsMap.entries()),
        sessionStorage: Array.from(this.sessionStorage.entries()),
        timestamp: Date.now(),
      }

      localStorage.setItem('site-metrics', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save site metrics:', error)
    }
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return

    try {
      const data = localStorage.getItem('site-metrics')
      if (data) {
        const parsed = JSON.parse(data)

        // Load bloom filters
        this.visitorBloomFilter.import(parsed.visitorBloomFilter)
        this.pageViewBloomFilter.import(parsed.pageViewBloomFilter)
        this.searchBloomFilter.import(parsed.searchBloomFilter)

        // Load metrics
        this.metricsMap = new Map(parsed.metricsMap)
        this.sessionStorage = new Map(parsed.sessionStorage)
      }
    } catch (error) {
      console.error('Failed to load site metrics:', error)
    }
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.visitorBloomFilter.clear()
    this.pageViewBloomFilter.clear()
    this.searchBloomFilter.clear()
    this.metricsMap.clear()
    this.sessionStorage.clear()

    if (typeof window !== 'undefined') {
      localStorage.removeItem('site-metrics')
    }
  }

  /**
   * Export metrics for analytics
   */
  exportMetrics(): any {
    return {
      stats: this.getSiteStats(),
      bloomFilters: this.getBloomFilterStats(),
      rawMetrics: Object.fromEntries(this.metricsMap.entries()),
    }
  }

  /**
   * Auto-save periodically
   */
  startAutoSave(intervalMs: number = 30000): void {
    setInterval(() => {
      this.saveToStorage()
    }, intervalMs)
  }
}
