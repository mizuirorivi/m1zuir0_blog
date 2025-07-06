import { redirect } from 'next/navigation'

export default function TagsPage() {
  // 日本語版タグにリダイレクト
  redirect('/ja/tags')
}
