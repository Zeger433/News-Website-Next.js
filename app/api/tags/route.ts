import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import jwt from 'jsonwebtoken'

// GET - Fetch all tags
export async function GET() {
  try {
    const tags = await prisma.tag.findMany()
    return NextResponse.json(tags)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    )
  }
}

// POST - Create new tag
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }
    let payload;
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

    const body = await request.json()
    
    if (!body.name) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      )
    }
    
    const tag = await prisma.tag.create({
      data: {
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/\s/g, '-'),
        description: body.description
      }
    })
    
    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    )
  }
}