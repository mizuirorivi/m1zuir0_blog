'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    const { id, name, label, value } = metric

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Web Vitals] ${name}:`, {
        id,
        name,
        label,
        value,
      })
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metric: name,
          value,
          id,
          label,
          timestamp: Date.now(),
        }),
      }).catch((error) => {
        console.warn('Failed to send web vitals:', error)
      })
    }
  })

  return null
}
