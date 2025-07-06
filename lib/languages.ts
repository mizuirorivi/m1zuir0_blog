export interface LanguageConfig {
  code: string
  name: string
  flag: string
  nativeName: string
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  // 将来的に追加可能:
  // {
  //   code: 'zh',
  //   name: 'Chinese',
  //   nativeName: '中文',
  //   flag: '🇨🇳',
  // },
  // {
  //   code: 'ko',
  //   name: 'Korean',
  //   nativeName: '한국어',
  //   flag: '🇰🇷',
  // },
]

export function getLanguageByCode(code: string): LanguageConfig | undefined {
  return SUPPORTED_LANGUAGES.find((lang) => lang.code === code)
}

export function isValidLanguage(code: string): boolean {
  return SUPPORTED_LANGUAGES.some((lang) => lang.code === code)
}
