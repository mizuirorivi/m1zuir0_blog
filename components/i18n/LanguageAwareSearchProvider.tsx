'use client'

import { useEffect, useState } from 'react'
import { SearchProvider, SearchConfig } from 'pliny/search'
import { useLanguage } from '@/lib/LanguageContext'
import siteMetadata from '@/data/siteMetadata'

interface LanguageAwareSearchProviderProps {
  children: React.ReactNode
}

export default function LanguageAwareSearchProvider({
  children,
}: LanguageAwareSearchProviderProps) {
  const { language } = useLanguage()
  const [searchConfig, setSearchConfig] = useState(siteMetadata.search as SearchConfig)
  const [key, setKey] = useState(0) // Force re-mount when language changes

  useEffect(() => {
    // Update search configuration based on current language
    if (siteMetadata.search && siteMetadata.search.provider === 'kbar') {
      const kbarSearch = siteMetadata.search as {
        provider: 'kbar'
        kbarConfig: { searchDocumentsPath: string }
      }
      const languageSpecificConfig: SearchConfig = {
        provider: 'kbar',
        kbarConfig: {
          ...kbarSearch.kbarConfig,
          searchDocumentsPath: `${process.env.BASE_PATH || ''}/search-${language}.json`,
        },
      }

      setSearchConfig(languageSpecificConfig)
      // Force re-mount of SearchProvider to reload search data
      setKey((prev) => prev + 1)
    }
  }, [language])

  if (!searchConfig) {
    return <>{children}</>
  }

  return (
    <SearchProvider key={key} searchConfig={searchConfig}>
      {children}
    </SearchProvider>
  )
}
