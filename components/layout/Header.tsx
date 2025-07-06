'use client'

import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import LogoImage from '@/data/logo.webp'
import Link from '../ui/Link'
import MobileNav from './MobileNav'
import ThemeSwitch from '../ui/ThemeSwitch'
import SearchButton from '../ui/SearchButton'
import LanguageSwitcher from '../i18n/LanguageSwitcher'
import Image from 'next/image'
import { useLanguage } from '@/lib/LanguageContext'

const Header = () => {
  const { language } = useLanguage()

  let headerClass =
    'flex items-center w-full backdrop-blur-md justify-between py-4 px-4 sm:px-6 lg:px-8'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  return (
    <header
      className={headerClass}
      style={{
        backgroundColor: 'var(--component-bg)',
        borderBottom: '1px solid var(--component-border)',
      }}
    >
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between">
          <div className="mr-3">
            <Image src={LogoImage} alt="Logo" width={64} height={64} className="h-8 w-8" />
          </div>
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="hidden h-6 text-2xl font-semibold sm:block">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
        <div className="no-scrollbar hidden max-w-40 items-center gap-x-4 overflow-x-auto sm:flex md:max-w-72 lg:max-w-96">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => {
              // 言語対応のhrefを生成
              const languageAwareHref = link.href === '/' ? '/' : `/${language}${link.href}`
              return (
                <Link
                  key={link.title}
                  href={languageAwareHref}
                  className="hover:text-primary-500 dark:hover:text-primary-400 rounded-lg px-3 py-2 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {link.title}
                </Link>
              )
            })}
        </div>
        <SearchButton />
        <LanguageSwitcher />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
