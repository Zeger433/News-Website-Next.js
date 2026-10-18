import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

// ✅ FIXED: GET - Fetch single article
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }, // ← params is now Promise
) {
  try {
    const { id } = await params; // ← MUST AWAIT
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: true,
        category: true,
        tags: true,
      },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // ← params is now Promise
) {
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

    const { id } = await params; // ← MUST AWAIT
    const body = await request.json();

    const existingArticle = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;
    if (body.authorId !== undefined)
      updateData.authorId = parseInt(body.authorId);
    if (body.categoryId !== undefined)
      updateData.categoryId = parseInt(body.categoryId);
    updateData.updatedAt = new Date();

    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      {
        error: "Failed to update article",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

// ✅ FIXED: DELETE - Delete article
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // ← params is now Promise
) {
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

    const { id } = await params; // ← MUST AWAIT

    await prisma.article.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: "Article deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 },
    );
  }
}
