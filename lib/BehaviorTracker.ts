import { BloomFilter } from './BloomFilter'

/**
 * User behavior types for tracking
 */
export type BehaviorType =
  | 'page_view'
  | 'click'
  | 'scroll'
  | 'hover'
  | 'form_submit'
  | 'search'
  | 'download'
  | 'share'
  | 'navigation'
  | 'exit'

/**
 * User behavior event structure
 */
export interface BehaviorEvent {
  type: BehaviorType
  element?: string
  url: string
  timestamp: number
  sessionId: string
  userId?: string
  metadata?: Record<string, unknown>
}

/**
 * Behavior pattern for bloom filter storage
 */
export interface BehaviorPattern {
  id: string
  pattern: string
  frequency: number
  lastSeen: number
}

/**
 * BehaviorTracker class for managing user behavior analysis
 */
export class BehaviorTracker {
  private bloomFilter: BloomFilter
  private sessionId: string
  private userId?: string
  private patterns: Map<string, BehaviorPattern> = new Map()
  private eventBuffer: BehaviorEvent[] = []
  private readonly maxBufferSize = 100

  constructor(expectedPatterns: number = 10000) {
    this.bloomFilter = new BloomFilter(expectedPatterns, 0.01)
    this.sessionId = this.generateSessionId()
    this.loadFromStorage()
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Set user ID for tracking
   */
  setUserId(userId: string): void {
    this.userId = userId
  }

  /**
   * Track a user behavior event
   */
  track(event: Omit<BehaviorEvent, 'timestamp' | 'sessionId'>): void {
    const behaviorEvent: BehaviorEvent = {
      ...event,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
    }

    // Add to buffer
    this.eventBuffer.push(behaviorEvent)

    // Generate pattern string
    const pattern = this.generatePattern(behaviorEvent)

    // Add to bloom filter
    this.bloomFilter.add(pattern)

    // Update pattern frequency
    this.updatePatternFrequency(pattern)

    // Process buffer if full
    if (this.eventBuffer.length >= this.maxBufferSize) {
      this.processBuffer()
    }
  }

  /**
   * Generate a pattern string from behavior event
   */
  private generatePattern(event: BehaviorEvent): string {
    const components = [
      event.type,
      event.element || 'unknown',
      new URL(event.url).pathname,
      this.getTimeSlot(event.timestamp),
    ]

    if (event.metadata) {
      components.push(JSON.stringify(event.metadata))
    }

    return components.join('|')
  }

  /**
   * Get time slot for temporal patterns (hour of day)
   */
  private getTimeSlot(timestamp: number): string {
    const hour = new Date(timestamp).getHours()
    return `hour:${hour}`
  }

  /**
   * Update pattern frequency
   */
  private updatePatternFrequency(pattern: string): void {
    const existing = this.patterns.get(pattern)
    if (existing) {
      existing.frequency += 1
      existing.lastSeen = Date.now()
    } else {
      this.patterns.set(pattern, {
        id: pattern,
        pattern,
        frequency: 1,
        lastSeen: Date.now(),
      })
    }
  }

  /**
   * Check if a behavior pattern has been seen before
   */
  hasSeenPattern(pattern: string): boolean {
    return this.bloomFilter.mightContain(pattern)
  }

  /**
   * Check if a behavior event pattern has been seen before
   */
  hasSeenBehavior(event: Omit<BehaviorEvent, 'timestamp' | 'sessionId'>): boolean {
    const pattern = this.generatePattern({
      ...event,
      timestamp: Date.now(),
      sessionId: this.sessionId,
    })
    return this.hasSeenPattern(pattern)
  }

  /**
   * Get behavior analytics
   */
  getAnalytics(): {
    totalPatterns: number
    uniquePatterns: number
    commonPatterns: BehaviorPattern[]
    bloomStats: {
      size: number
      hashFunctions: number
      setBits: number
      fillRatio: number
      estimatedFalsePositiveRate: number
    }
    sessionInfo: {
      sessionId: string
      userId?: string
      eventsCount: number
    }
  } {
    const sortedPatterns = Array.from(this.patterns.values()).sort(
      (a, b) => b.frequency - a.frequency
    )

    return {
      totalPatterns: this.patterns.size,
      uniquePatterns: this.patterns.size,
      commonPatterns: sortedPatterns.slice(0, 10),
      bloomStats: this.bloomFilter.getStats(),
      sessionInfo: {
        sessionId: this.sessionId,
        userId: this.userId,
        eventsCount: this.eventBuffer.length,
      },
    }
  }

  /**
   * Process the event buffer
   */
  private processBuffer(): void {
    // In a real implementation, this would send data to analytics service
    console.log(`Processing ${this.eventBuffer.length} behavior events`)

    // Clear buffer
    this.eventBuffer = []

    // Save to storage
    this.saveToStorage()
  }

  /**
   * Save bloom filter and patterns to localStorage
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined') return

    try {
      const data = {
        bloomFilter: this.bloomFilter.export(),
        patterns: Array.from(this.patterns.entries()),
        sessionId: this.sessionId,
        userId: this.userId,
        timestamp: Date.now(),
      }

      localStorage.setItem('behavior-tracker', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save behavior data:', error)
    }
  }

  /**
   * Load bloom filter and patterns from localStorage
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return

    try {
      const data = localStorage.getItem('behavior-tracker')
      if (data) {
        const parsed = JSON.parse(data)

        // Load bloom filter
        this.bloomFilter.import(parsed.bloomFilter)

        // Load patterns
        this.patterns = new Map(parsed.patterns)

        // Load session info if recent (within 24 hours)
        const dayInMs = 24 * 60 * 60 * 1000
        if (Date.now() - parsed.timestamp < dayInMs) {
          this.sessionId = parsed.sessionId
          this.userId = parsed.userId
        }
      }
    } catch (error) {
      console.error('Failed to load behavior data:', error)
    }
  }

  /**
   * Clear all tracking data
   */
  clear(): void {
    this.bloomFilter.clear()
    this.patterns.clear()
    this.eventBuffer = []
    this.sessionId = this.generateSessionId()
    this.userId = undefined

    if (typeof window !== 'undefined') {
      localStorage.removeItem('behavior-tracker')
    }
  }

  /**
   * Get event buffer for debugging
   */
  getEventBuffer(): BehaviorEvent[] {
    return [...this.eventBuffer]
  }

  /**
   * Force process buffer
   */
  flush(): void {
    this.processBuffer()
  }
}
