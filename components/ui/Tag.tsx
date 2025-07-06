'use client'

import Link from 'next/link'
import { slug } from 'github-slugger'
import { useLanguage } from '@/lib/LanguageContext'
interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  const { language } = useLanguage()

  return (
    <Link
      href={`/${language}/tags/${slug(text)}`}
      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 mr-3 text-sm font-medium uppercase"
      style={{ fontFamily: 'var(--font-dunkin-sans-bold)' }}
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
