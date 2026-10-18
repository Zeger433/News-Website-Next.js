import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

// GET - Fetch single author
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params; // ← MUST AWAIT

    const author = await prisma.author.findUnique({
      where: { id: parseInt(id) },
      include: {
        articles: true,
      },
    });

    if (!author) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    return NextResponse.json(author);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch author" },
      { status: 500 },
    );
  }
}

// PUT - Update author
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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

    const existingAuthor = await prisma.author.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingAuthor) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {
      name: body.name,
      bio: body.bio,
      avatar: body.avatar,
    };

    if (body.email !== undefined) {
      updateData.email = body.email.toLowerCase();
    }

    if (body.password) {
      const bcrypt = (await import("bcryptjs")).default;
      updateData.password = await bcrypt.hash(body.password, 10);
    }

    const author = await prisma.author.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json(author);
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      {
        error: "Failed to update author",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

// DELETE - Delete author
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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

    await prisma.author.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: "Author deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete author" },
      { status: 500 },
    );
  }
}
