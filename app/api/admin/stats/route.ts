import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }
    let payload
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: string; email: string; role: string }
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      )
    }
    if (payload.role !== 'admin' && payload.role !== 'superadmin') {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      )
    }

    const [
      totalArticles,
      publishedArticles,
      draftArticles,
      totalAuthors,
      totalCategories,
      totalComments,
      totalViews
    ] = await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { status: 'published' } }),
      prisma.article.count({ where: { status: 'draft' } }),
      prisma.author.count(),
      prisma.category.count(),
      prisma.comment.count(),
      prisma.article.aggregate({
        _sum: {
          views: true
        }
      })
    ])

    return NextResponse.json({
      stats: {
        totalArticles,
        publishedArticles,
        draftArticles,
        totalAuthors,
        totalCategories,
        totalComments,
        totalViews: totalViews._sum.views || 0
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}