import { NextRequest, NextResponse } from 'next/server'
import { allBlogs } from 'contentlayer/generated'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// RAG対応検索API - 将来的にベクトル検索を実装
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const lang = searchParams.get('lang') || 'ja' // デフォルトは日本語

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    // 言語別フィルタリングを追加
    const filteredBlogs = allBlogs.filter((blog) => {
      const searchText = `${blog.title} ${blog.summary} ${blog.body.raw}`.toLowerCase()
      const matchesQuery = searchText.includes(query.toLowerCase())
      const matchesCategory = !category || blog.category === category
      const matchesDifficulty = !difficulty || blog.difficulty === difficulty
      const matchesLanguage = blog.lang === lang

      return matchesQuery && matchesCategory && matchesDifficulty && matchesLanguage && !blog.draft
    })

    // 関連度でソート（基本的な実装）
    const results = filteredBlogs.map((blog) => ({
      slug: blog.slug,
      title: blog.title,
      summary: blog.summary,
      category: blog.category,
      difficulty: blog.difficulty,
      tags: blog.tags,
      date: blog.date,
      path: blog.path,
    }))

    return NextResponse.json({
      success: true,
      query,
      count: results.length,
      results,
      filters: { category, difficulty },
      message: 'Basic text search - RAG vector search will be implemented',
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ success: false, error: 'Search failed' }, { status: 500 })
  }
}

// 将来のRAG検索用POST endpoint
export async function POST(request: NextRequest) {
  try {
    const { query, options } = await request.json()

    // TODO: RAG実装
    // 1. クエリをembeddingに変換
    // 2. ベクトル類似度検索
    // 3. 関連コンテンツを取得
    // 4. LLMで回答生成

    return NextResponse.json({
      success: true,
      query,
      message: 'RAG-based search will be implemented here',
      plannedFeatures: [
        'Vector similarity search',
        'Context-aware responses',
        'Multi-modal search support',
        'Semantic understanding',
      ],
    })
  } catch (error) {
    console.error('RAG search error:', error)
    return NextResponse.json({ success: false, error: 'RAG search failed' }, { status: 500 })
  }
}
