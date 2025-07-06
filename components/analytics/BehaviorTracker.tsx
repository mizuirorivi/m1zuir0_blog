'use client'

import { useEffect, useRef, useCallback } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { BehaviorTracker as BehaviorTrackerClass, BehaviorType } from '@/lib/BehaviorTracker'

/**
 * React component for tracking user behavior
 */
export default function BehaviorTracker() {
  const trackerRef = useRef<BehaviorTrackerClass | null>(null)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize tracker
  useEffect(() => {
    trackerRef.current = new BehaviorTrackerClass()

    // Cleanup on unmount
    return () => {
      trackerRef.current?.flush()
    }
  }, [])

  // Track page views
  useEffect(() => {
    if (trackerRef.current) {
      const url = window.location.href
      trackerRef.current.track({
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
    }
  }, [pathname, searchParams])

  // Track clicks
  const handleClick = useCallback((event: MouseEvent) => {
    if (!trackerRef.current) return

    const target = event.target as HTMLElement
    const element = target.tagName.toLowerCase()
    const elementId = target.id
    const elementClass = target.className
    const elementText = target.textContent?.slice(0, 50) || ''

    trackerRef.current.track({
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
  }, [])

  // Track scroll behavior
  const handleScroll = useCallback((event: Event) => {
    if (!trackerRef.current) return

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = window.innerHeight
    const scrollPercentage = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100)

    // Only track significant scroll events (every 25%)
    if (scrollPercentage % 25 === 0) {
      trackerRef.current.track({
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

  // Track hover events (throttled)
  const handleMouseOver = useCallback((event: MouseEvent) => {
    if (!trackerRef.current) return

    const target = event.target as HTMLElement
    const element = target.tagName.toLowerCase()

    // Only track hover on interactive elements
    if (['a', 'button', 'input', 'select', 'textarea'].includes(element)) {
      trackerRef.current.track({
        type: 'hover',
        element: target.id || target.className || element,
        url: window.location.href,
        metadata: {
          tagName: element,
          id: target.id,
          className: target.className,
        },
      })
    }
  }, [])

  // Track form submissions
  const handleSubmit = useCallback((event: SubmitEvent) => {
    if (!trackerRef.current) return

    const target = event.target as HTMLFormElement
    const formId = target.id
    const formClass = target.className
    const formAction = target.action

    trackerRef.current.track({
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

  // Track navigation events
  const handleBeforeUnload = useCallback((event: BeforeUnloadEvent) => {
    if (!trackerRef.current) return

    trackerRef.current.track({
      type: 'exit',
      url: window.location.href,
      metadata: {
        timeOnPage: Date.now() - performance.timing.navigationStart,
      },
    })

    // Force flush before leaving
    trackerRef.current.flush()
  }, [])

  // Set up event listeners
  useEffect(() => {
    // Throttle functions to prevent excessive tracking
    let scrollTimeout: NodeJS.Timeout | null = null
    let hoverTimeout: NodeJS.Timeout | null = null

    const throttledScroll = (event: Event) => {
      if (scrollTimeout) return
      scrollTimeout = setTimeout(() => {
        handleScroll(event)
        scrollTimeout = null
      }, 500)
    }

    const throttledHover = (event: MouseEvent) => {
      if (hoverTimeout) return
      hoverTimeout = setTimeout(() => {
        handleMouseOver(event)
        hoverTimeout = null
      }, 1000)
    }

    // Add event listeners
    document.addEventListener('click', handleClick)
    document.addEventListener('scroll', throttledScroll)
    document.addEventListener('mouseover', throttledHover)
    document.addEventListener('submit', handleSubmit)
    window.addEventListener('beforeunload', handleBeforeUnload)

    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('scroll', throttledScroll)
      document.removeEventListener('mouseover', throttledHover)
      document.removeEventListener('submit', handleSubmit)
      window.removeEventListener('beforeunload', handleBeforeUnload)

      if (scrollTimeout) clearTimeout(scrollTimeout)
      if (hoverTimeout) clearTimeout(hoverTimeout)
    }
  }, [handleClick, handleScroll, handleMouseOver, handleSubmit, handleBeforeUnload])

  // Periodically flush buffer
  useEffect(() => {
    const interval = setInterval(() => {
      trackerRef.current?.flush()
    }, 30000) // Flush every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // This component doesn't render anything visible
  return null
}

/**
 * Hook for manual behavior tracking
 */
export function useBehaviorTracker() {
  const trackerRef = useRef<BehaviorTrackerClass | null>(null)

  useEffect(() => {
    if (!trackerRef.current) {
      trackerRef.current = new BehaviorTrackerClass()
    }
  }, [])

  const track = useCallback(
    (type: BehaviorType, element?: string, metadata?: Record<string, any>) => {
      if (trackerRef.current) {
        trackerRef.current.track({
          type,
          element,
          url: window.location.href,
          metadata,
        })
      }
    },
    []
  )

  const getAnalytics = useCallback(() => {
    return trackerRef.current?.getAnalytics()
  }, [])

  const hasSeenBehavior = useCallback((type: BehaviorType, element?: string) => {
    if (!trackerRef.current) return false
    return trackerRef.current.hasSeenBehavior({
      type,
      element,
      url: window.location.href,
    })
  }, [])

  return {
    track,
    getAnalytics,
    hasSeenBehavior,
  }
}
