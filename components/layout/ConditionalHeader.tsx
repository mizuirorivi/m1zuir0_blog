'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/layout/Header'
import SectionContainer from '@/components/ui/SectionContainer'
import Footer from '@/components/layout/Footer'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  if (isHomePage) {
    // Home page - no header, full screen
    return <>{children}</>
  }

  // Other pages - with header and footer
  return (
    <SectionContainer>
      <div className="flex min-h-screen flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </SectionContainer>
  )
}
