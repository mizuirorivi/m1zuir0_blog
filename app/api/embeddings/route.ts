import { NextRequest, NextResponse } from 'next/server'
import { allBlogs } from 'contentlayer/generated'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// 将来のRAG対応のためのEmbedding生成API
// TODO: OpenAI API統合、ベクトルストレージ（Supabase/Faiss）への保存

export async function GET(request: NextRequest) {
  try {
    // 現在は基本的なコンテンツ情報のみ返す
    const blogData = allBlogs.map((blog) => ({
      slug: blog.slug,
      title: blog.title,
      summary: blog.summary,
      content: blog.body.raw,
      category: blog.category,
      keywords: blog.keywords,
      difficulty: blog.difficulty,
      tags: blog.tags,
      date: blog.date,
    }))

    return NextResponse.json({
      success: true,
      count: blogData.length,
      data: blogData,
      message: 'RAG embedding generation endpoint - ready for implementation',
    })
  } catch (error) {
    console.error('Embedding API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process content for embeddings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content, metadata } = await request.json()

    // TODO: OpenAI Embeddings API呼び出し
    // const embedding = await openai.embeddings.create({
    //   model: "text-embedding-3-small",
    //   input: content,
    // })

    // TODO: ベクトルストレージへの保存
    // await saveEmbedding(embedding.data[0].embedding, metadata)

    return NextResponse.json({
      success: true,
      message: 'Embedding generation will be implemented here',
      receivedData: { content: content?.substring(0, 100) + '...', metadata },
    })
  } catch (error) {
    console.error('Embedding generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate embedding' },
      { status: 500 }
    )
  }
}
