'use client'

import Link from '@/components/ui/Link'
import Image from 'next/image'
import { ArrowRight, BookOpen, Tag, FolderOpen, User } from 'lucide-react'

export default function HeroSection() {
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-8">
        {/* Logo/Brand Section */}
        <div className="flex flex-col items-center gap-4">
          <Image
            className="dark:invert"
            src="/static/images/logo.png"
            alt="Blog Logo"
            width={180}
            height={38}
            priority
          />
          <h1 className="from-primary-500 to-primary-600 bg-gradient-to-r bg-clip-text text-center text-4xl font-bold text-transparent sm:text-6xl">
            Tech Blog
          </h1>
          <p className="max-w-2xl text-center text-lg text-gray-600 dark:text-gray-400">
            技術記事やプロジェクトを共有するブログサイト。最新のWeb技術とRAG対応の検索機能を搭載。
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Blog Card */}
          <Link href="/ja/blog">
            <div className="group hover:border-primary-500 relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="rounded-full bg-blue-100 p-3 transition-colors group-hover:bg-blue-200 dark:bg-blue-900/30 dark:group-hover:bg-blue-800/50">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="group-hover:text-primary-600 dark:group-hover:text-primary-400 font-semibold text-gray-900 dark:text-gray-100">
                    Blog
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">技術記事を読む</p>
                </div>
                <ArrowRight className="group-hover:text-primary-500 h-4 w-4 text-gray-400 transition-colors" />
              </div>
            </div>
          </Link>

          {/* Tags Card */}
          <Link href="/ja/tags">
            <div className="group hover:border-primary-500 relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="rounded-full bg-green-100 p-3 transition-colors group-hover:bg-green-200 dark:bg-green-900/30 dark:group-hover:bg-green-800/50">
                  <Tag className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="group-hover:text-primary-600 dark:group-hover:text-primary-400 font-semibold text-gray-900 dark:text-gray-100">
                    Tags
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">タグで検索</p>
                </div>
                <ArrowRight className="group-hover:text-primary-500 h-4 w-4 text-gray-400 transition-colors" />
              </div>
            </div>
          </Link>

          {/* Projects Card */}
          <Link href="/ja/projects">
            <div className="group hover:border-primary-500 relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="rounded-full bg-purple-100 p-3 transition-colors group-hover:bg-purple-200 dark:bg-purple-900/30 dark:group-hover:bg-purple-800/50">
                  <FolderOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="group-hover:text-primary-600 dark:group-hover:text-primary-400 font-semibold text-gray-900 dark:text-gray-100">
                    Projects
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">プロジェクト一覧</p>
                </div>
                <ArrowRight className="group-hover:text-primary-500 h-4 w-4 text-gray-400 transition-colors" />
              </div>
            </div>
          </Link>

          {/* About Card */}
          <Link href="/ja/about">
            <div className="group hover:border-primary-500 relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="rounded-full bg-orange-100 p-3 transition-colors group-hover:bg-orange-200 dark:bg-orange-900/30 dark:group-hover:bg-orange-800/50">
                  <User className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="group-hover:text-primary-600 dark:group-hover:text-primary-400 font-semibold text-gray-900 dark:text-gray-100">
                    About Me
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">プロフィール</p>
                </div>
                <ArrowRight className="group-hover:text-primary-500 h-4 w-4 text-gray-400 transition-colors" />
              </div>
            </div>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/ja/blog"
            className="bg-primary-600 hover:bg-primary-700 flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent px-4 text-sm font-medium text-white shadow-lg transition-colors hover:shadow-xl sm:h-12 sm:w-auto sm:px-5 sm:text-base"
          >
            <BookOpen className="h-4 w-4" />
            ブログを読む
          </Link>
          <Link
            href="/ja/about"
            className="flex h-10 w-full items-center justify-center rounded-full border border-solid border-gray-300 px-4 text-sm font-medium transition-colors hover:bg-gray-50 sm:h-12 sm:w-auto sm:px-5 sm:text-base dark:border-gray-600 dark:hover:bg-gray-800"
          >
            About Me
          </Link>
        </div>
      </main>
    </div>
  )
}
