'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

type Language = 'ja' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ja')
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // URLから言語を検出 (/ja/blog or /en/blog)
    const pathLang = pathname.split('/')[1] // /ja or /en
    if (pathLang === 'ja' || pathLang === 'en') {
      setLanguage(pathLang)
    } else {
      // ローカルストレージから言語設定を読み込み
      const savedLanguage = localStorage.getItem('language') as Language
      if (savedLanguage && (savedLanguage === 'ja' || savedLanguage === 'en')) {
        setLanguage(savedLanguage)
      }
    }
  }, [pathname])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)

    // URLが/[lang]/の形式の場合は言語部分を置き換え
    const pathParts = pathname.split('/')
    if (pathParts[1] === 'ja' || pathParts[1] === 'en') {
      pathParts[1] = lang
      router.push(pathParts.join('/'))
    } else {
      // ルートまたは他のページの場合は言語版にリダイレクト
      router.push(`/${lang}${pathname}`)
    }
  }

  const toggleLanguage = () => {
    const newLang = language === 'ja' ? 'en' : 'ja'
    handleSetLanguage(newLang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
