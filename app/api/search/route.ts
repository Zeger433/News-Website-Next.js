import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    const [articles, authors, categories] = await Promise.all([
      prisma.article.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
            { excerpt: { contains: query, mode: 'insensitive' } }
          ],
          status: 'published'
        },
        include: {
          author: true,
          category: true
        },
        take: 10
      }),
      prisma.author.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { bio: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 5
      }),
      prisma.category.findMany({
        where: {
          name: { contains: query, mode: 'insensitive' }
        },
        take: 5
      })
    ])

    return NextResponse.json({
      articles,
      authors,
      categories
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    )
  }
}