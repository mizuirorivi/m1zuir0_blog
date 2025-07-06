import { redirect } from 'next/navigation'

export default function BlogPage() {
  // 日本語版ブログにリダイレクト
  redirect('/ja/blog')
}
