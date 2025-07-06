interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'go-minidump',
    description: `go-minidump は、Go で記述された Windows 専用のコマンドラインユーティリティで、実行中のプロセスのメモリダンプを作成します。このツールは、lsass.exe (ローカル セキュリティ機関サブシステム サービス) をデフォルトのターゲットプロセスとして、プロセスメモリ全体をダンプするように設計されています。 主な使用事例は、フォレンジック分析、デバッグ、セキュリティ調査などです`,
    imgSrc: '/static/images/google.png',
    href: 'https://github.com/mizuirorivi/go-minidump',
  },
]

export default projectsData
