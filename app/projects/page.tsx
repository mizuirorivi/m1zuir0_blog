import { redirect } from 'next/navigation'

export default function ProjectsPage() {
  // 日本語版プロジェクトにリダイレクト
  redirect('/ja/projects')
}
