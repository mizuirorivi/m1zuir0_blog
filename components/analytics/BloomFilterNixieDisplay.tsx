'use client'

import { useState, useEffect } from 'react'
import { SiteMetricsTracker } from '@/lib/SiteMetricsTracker'
import { NixieTubeDisplay } from '@/components/worldLine/worldLine'

export default function BloomFilterNixieDisplay() {
  const [overallRatio, setOverallRatio] = useState(0)

  useEffect(() => {
    const updateRatio = () => {
      try {
        const tracker = new SiteMetricsTracker()
        const bloomStats = tracker.getBloomFilterStats()

        // Calculate overall ratio (0-1)
        const overall = Math.min(
          (bloomStats.visitors.fillRatio +
            bloomStats.pageViews.fillRatio +
            bloomStats.searches.fillRatio) /
            3,
          1
        )

        setOverallRatio(overall)
      } catch (error) {
        console.error('Failed to fetch bloom filter stats:', error)
      }
    }

    // Initial update
    updateRatio()

    // Update every 5 seconds
    const interval = setInterval(updateRatio, 5000)

    return () => clearInterval(interval)
  }, [])

  // Format the ratio to 6 decimal places
  const formattedRatio = overallRatio.toFixed(6)

  return (
    <div className="mt-4 text-center">
      <NixieTubeDisplay value={formattedRatio} maxDigits={8} />
    </div>
  )
}
