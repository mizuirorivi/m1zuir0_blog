'use client'

import { useEffect, useRef, useCallback } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { BehaviorTracker as BehaviorTrackerClass } from '@/lib/BehaviorTracker'
import { SiteMetricsTracker } from '@/lib/SiteMetricsTracker'

/**
 * Enhanced behavior tracker that combines user behavior and site metrics
 */
export default function EnhancedBehaviorTracker() {
  const behaviorTrackerRef = useRef<BehaviorTrackerClass | null>(null)
  const metricsTrackerRef = useRef<SiteMetricsTracker | null>(null)
  const sessionRef = useRef<{
    id: string
    startTime: number
    pageViews: number
    lastActivity: number
  } | null>(null)

  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Generate visitor ID
  const getVisitorId = useCallback(() => {
    let visitorId = localStorage.getItem('visitor-id')
    if (!visitorId) {
      visitorId = `visitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('visitor-id', visitorId)
    }
    return visitorId
  }, [])

  // Initialize trackers
  useEffect(() => {
    behaviorTrackerRef.current = new BehaviorTrackerClass()
    metricsTrackerRef.current = new SiteMetricsTracker()

    // Initialize session
    sessionRef.current = {
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      startTime: Date.now(),
      pageViews: 0,
      lastActivity: Date.now(),
    }

    // Track visitor
    const visitorId = getVisitorId()
    const isReturning = metricsTrackerRef.current.hasSeenVisitor(visitorId)
    metricsTrackerRef.current.trackVisitor(visitorId, isReturning)

    // Log initial state
    console.group('🚀 ブルームフィルター初期化')
    console.log('👤 訪問者ID:', visitorId)
    console.log('🔄 リピート訪問者:', isReturning)
    console.log('📅 セッション開始:', new Date().toLocaleString())
    console.groupEnd()

    // Start auto-save
    metricsTrackerRef.current.startAutoSave()

    // Cleanup on unmount
    return () => {
      behaviorTrackerRef.current?.flush()

      // Track session end
      if (sessionRef.current && metricsTrackerRef.current) {
        const sessionDuration = Date.now() - sessionRef.current.startTime
        const isBounce = sessionRef.current.pageViews <= 1 && sessionDuration < 30000

        metricsTrackerRef.current.trackUserSession(sessionRef.current.id, sessionDuration)
        metricsTrackerRef.current.trackBounce(sessionRef.current.id, isBounce)
      }
    }
  }, [getVisitorId])

  // Track page views and extract content metrics
  useEffect(() => {
    if (behaviorTrackerRef.current && metricsTrackerRef.current && sessionRef.current) {
      const url = window.location.href
      const visitorId = getVisitorId()

      // Track page view in both systems
      behaviorTrackerRef.current.track({
        type: 'page_view',
        url,
        metadata: {
          pathname,
          searchParams: searchParams.toString(),
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
        },
      })

      metricsTrackerRef.current.trackPageView(url, visitorId)
      sessionRef.current.pageViews++
      sessionRef.current.lastActivity = Date.now()

      // Log page view
      console.log('📄 ページビュー:', {
        url: pathname,
        isNewPage: !metricsTrackerRef.current.hasSeenPageView(url, visitorId),
        totalPageViews: sessionRef.current.pageViews,
      })

      // Extract and track content metrics
      trackContentMetrics()
    }
  }, [pathname, searchParams, getVisitorId])

  // Track content-specific metrics
  const trackContentMetrics = useCallback(() => {
    if (!metricsTrackerRef.current) return

    // Track blog posts
    if (pathname.includes('/blog/') && !pathname.endsWith('/blog')) {
      const postSlug = pathname.split('/blog/')[1]?.split('/')[0]
      if (postSlug) {
        metricsTrackerRef.current.trackBlogPost(postSlug)
      }
    }

    // Track tags from page content
    const tagElements = document.querySelectorAll('[data-tag]')
    tagElements.forEach((element) => {
      const tagName = element.getAttribute('data-tag')
      if (tagName) {
        metricsTrackerRef.current.trackTag(tagName)
      }
    })

    // Auto-detect tags from page content
    const tagLinks = document.querySelectorAll('a[href*="/tags/"]')
    tagLinks.forEach((link) => {
      const href = link.getAttribute('href')
      const tagMatch = href?.match(/\/tags\/([^/?]+)/)
      if (tagMatch) {
        metricsTrackerRef.current.trackTag(tagMatch[1])
      }
    })
  }, [pathname])

  // Track search queries
  const handleSearch = useCallback(
    (event: Event) => {
      const target = event.target as HTMLInputElement
      if (target.type === 'search' || target.placeholder?.toLowerCase().includes('search')) {
        const query = target.value.trim()
        if (query.length > 2 && metricsTrackerRef.current) {
          const visitorId = getVisitorId()
          const hasSeenQuery = metricsTrackerRef.current.hasSeenSearchQuery(query, visitorId)
          metricsTrackerRef.current.trackSearchQuery(query, visitorId)

          // Log search
          console.log('🔍 検索クエリ:', {
            query,
            isNewQuery: !hasSeenQuery,
            visitorId,
          })

          // Also track in behavior tracker
          behaviorTrackerRef.current?.track({
            type: 'search',
            element: 'search-input',
            url: window.location.href,
            metadata: { query },
          })
        }
      }
    },
    [getVisitorId]
  )

  // Enhanced click tracking
  const handleClick = useCallback((event: MouseEvent) => {
    if (!behaviorTrackerRef.current || !sessionRef.current) return

    const target = event.target as HTMLElement
    const element = target.tagName.toLowerCase()
    const elementId = target.id
    const elementClass = target.className
    const elementText = target.textContent?.slice(0, 50) || ''

    // Track in behavior tracker
    behaviorTrackerRef.current.track({
      type: 'click',
      element: elementId || elementClass || element,
      url: window.location.href,
      metadata: {
        tagName: element,
        id: elementId,
        className: elementClass,
        text: elementText,
        x: event.clientX,
        y: event.clientY,
      },
    })

    // Update session activity
    sessionRef.current.lastActivity = Date.now()

    // Track special click events
    if (target.closest('a[href*="/blog/"]')) {
      // Blog post click
      const href = target.closest('a')?.href
      if (href) {
        const postSlug = href.split('/blog/')[1]?.split('/')[0]
        if (postSlug && metricsTrackerRef.current) {
          metricsTrackerRef.current.trackBlogPost(postSlug)
        }
      }
    }

    if (target.closest('a[href*="/tags/"]')) {
      // Tag click
      const href = target.closest('a')?.href
      if (href) {
        const tagMatch = href.match(/\/tags\/([^/?]+)/)
        if (tagMatch && metricsTrackerRef.current) {
          metricsTrackerRef.current.trackTag(tagMatch[1])
        }
      }
    }
  }, [])

  // Enhanced scroll tracking
  const handleScroll = useCallback(() => {
    if (!behaviorTrackerRef.current || !sessionRef.current) return

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = window.innerHeight
    const scrollPercentage = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100)

    // Update session activity
    sessionRef.current.lastActivity = Date.now()

    // Track significant scroll events
    if (scrollPercentage % 25 === 0) {
      behaviorTrackerRef.current.track({
        type: 'scroll',
        url: window.location.href,
        metadata: {
          scrollTop,
          scrollHeight,
          clientHeight,
          scrollPercentage,
        },
      })
    }
  }, [])

  // Track form submissions
  const handleSubmit = useCallback((event: SubmitEvent) => {
    if (!behaviorTrackerRef.current) return

    const target = event.target as HTMLFormElement
    const formId = target.id
    const formClass = target.className
    const formAction = target.action

    behaviorTrackerRef.current.track({
      type: 'form_submit',
      element: formId || formClass || 'form',
      url: window.location.href,
      metadata: {
        formId,
        formClass,
        formAction,
        method: target.method,
      },
    })
  }, [])

  // Track page exit
  const handleBeforeUnload = useCallback(() => {
    if (!behaviorTrackerRef.current || !metricsTrackerRef.current || !sessionRef.current) return

    const timeOnPage = Date.now() - sessionRef.current.lastActivity

    behaviorTrackerRef.current.track({
      type: 'exit',
      url: window.location.href,
      metadata: {
        timeOnPage,
        totalSessionTime: Date.now() - sessionRef.current.startTime,
      },
    })

    // Force flush
    behaviorTrackerRef.current.flush()

    // Track session metrics
    const sessionDuration = Date.now() - sessionRef.current.startTime
    const isBounce = sessionRef.current.pageViews <= 1 && sessionDuration < 30000

    metricsTrackerRef.current.trackUserSession(sessionRef.current.id, sessionDuration)
    metricsTrackerRef.current.trackBounce(sessionRef.current.id, isBounce)
  }, [])

  // Set up event listeners
  useEffect(() => {
    // Throttle functions
    let scrollTimeout: NodeJS.Timeout | null = null

    const throttledScroll = () => {
      if (scrollTimeout) return
      scrollTimeout = setTimeout(() => {
        handleScroll()
        scrollTimeout = null
      }, 500)
    }

    // Add event listeners
    document.addEventListener('click', handleClick)
    document.addEventListener('scroll', throttledScroll)
    document.addEventListener('input', handleSearch)
    document.addEventListener('submit', handleSubmit)
    window.addEventListener('beforeunload', handleBeforeUnload)

    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('scroll', throttledScroll)
      document.removeEventListener('input', handleSearch)
      document.removeEventListener('submit', handleSubmit)
      window.removeEventListener('beforeunload', handleBeforeUnload)

      if (scrollTimeout) clearTimeout(scrollTimeout)
    }
  }, [handleClick, handleScroll, handleSearch, handleSubmit, handleBeforeUnload])

  // Periodically flush buffers and log bloom filter stats
  useEffect(() => {
    const interval = setInterval(() => {
      behaviorTrackerRef.current?.flush()

      // Log bloom filter statistics
      if (behaviorTrackerRef.current && metricsTrackerRef.current) {
        const behaviorAnalytics = behaviorTrackerRef.current.getAnalytics()
        const siteStats = metricsTrackerRef.current.getSiteStats()
        const bloomStats = metricsTrackerRef.current.getBloomFilterStats()

        console.group('🔬 ブルームフィルター統計')
        console.log('📊 サイト統計:', siteStats)
        console.log('🎯 行動分析:', behaviorAnalytics)
        console.log('💾 ブルームフィルター詳細:', bloomStats)
        console.log('📈 人気コンテンツ:', {
          popularPosts: siteStats.popularPosts.slice(0, 5),
          popularTags: siteStats.popularTags.slice(0, 5),
          searchQueries: siteStats.searchQueries.slice(0, 5),
        })
        console.log('🔍 フィルター効率:', {
          visitors: `${bloomStats.visitors.setBits.toLocaleString()}/${bloomStats.visitors.size.toLocaleString()} bits (${(bloomStats.visitors.fillRatio * 100).toFixed(2)}%)`,
          pageViews: `${bloomStats.pageViews.setBits.toLocaleString()}/${bloomStats.pageViews.size.toLocaleString()} bits (${(bloomStats.pageViews.fillRatio * 100).toFixed(2)}%)`,
          searches: `${bloomStats.searches.setBits.toLocaleString()}/${bloomStats.searches.size.toLocaleString()} bits (${(bloomStats.searches.fillRatio * 100).toFixed(2)}%)`,
        })
        console.groupEnd()
      }
    }, 30000) // Log every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Track inactivity
  useEffect(() => {
    const inactivityInterval = setInterval(() => {
      if (sessionRef.current) {
        const inactiveTime = Date.now() - sessionRef.current.lastActivity

        // If inactive for more than 30 minutes, end session
        if (inactiveTime > 30 * 60 * 1000) {
          handleBeforeUnload()
        }
      }
    }, 60000) // Check every minute

    return () => clearInterval(inactivityInterval)
  }, [handleBeforeUnload])

  return null
}
