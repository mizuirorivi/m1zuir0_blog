import type { NextWebVitalsMetric } from 'next/app'

export function reportWebVitals(metric: NextWebVitalsMetric) {
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
    // Example: Send to your analytics provider
    // gtag('event', name, {
    //   event_category: label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
    //   value: Math.round(name === 'CLS' ? value * 1000 : value),
    //   event_label: id,
    //   non_interaction: true,
    // })

    // Alternative: Send to your own analytics endpoint
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
}
