import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import jwt from 'jsonwebtoken'

// POST - Send contact message
export async function POST(request: Request) {
  try {
    const { name, email, phone, message } = await request.json()
    
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message are required' },
        { status: 400 }
      )
    }
    
    const contact = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || '',
        message,
        status: 'new'
      }
    })
    
    return NextResponse.json(
      { success: true, message: 'Message sent successfully!', data: contact },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

// GET - Fetch all contact messages (for admin panel)
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

    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(messages)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}