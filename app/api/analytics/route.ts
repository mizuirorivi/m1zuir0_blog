import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  return NextResponse.json({ message: 'Analytics API endpoint' })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { metric, value, id, label, timestamp } = body

    // Log to console for now (you can replace with your analytics service)
    console.log('Web Vitals Analytics:', {
      metric,
      value,
      id,
      label,
      timestamp,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    })

    // Here you would typically send to your analytics service:
    // - Google Analytics
    // - Plausible
    // - Umami
    // - Your own database

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to log analytics' }, { status: 500 })
  }
}
