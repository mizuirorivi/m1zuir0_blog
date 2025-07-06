import { redirect } from 'next/navigation'

export default function AboutPage() {
  // 日本語版Aboutにリダイレクト
  redirect('/ja/about')
}
