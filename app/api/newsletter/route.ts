import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  return NextResponse.json({ message: 'Newsletter API endpoint' })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Newsletter subscription:', body)
    return NextResponse.json({ success: true, message: 'Subscription successful' })
  } catch (error) {
    console.error('Newsletter error:', error)
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}
