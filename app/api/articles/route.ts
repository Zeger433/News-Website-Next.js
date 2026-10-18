import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

// GET - Fetch all articles
export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      include: {
        author: true,
        category: true,
        tags: true,
      },
      orderBy: {
        date: "desc",
      },
    });
    return NextResponse.json(articles);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 },
    );
  }
}

// POST - Create new article
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: string; email: string; role: string };
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    if (payload.role !== 'admin' && payload.role !== 'superadmin') {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    console.log("Received body:", body); // ← Add this to debug

    // Check required fields
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!body.slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const article = await prisma.article.create({
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content || "",
        excerpt: body.excerpt || "",
        imageUrl: body.imageUrl || "",
        authorId: body.authorId ? parseInt(body.authorId) : null,
        categoryId: body.categoryId ? parseInt(body.categoryId) : null,
        status: body.status || "draft",
        isFeatured: body.isFeatured || false,
        date: new Date(),
      },
      include: {
        author: true,
        category: true,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      {
        error: "Failed to create article",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
