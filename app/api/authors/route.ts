import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// GET - Fetch all authors
export async function GET() {
  try {
    const authors = await prisma.author.findMany();
    return NextResponse.json(authors);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch authors" },
      { status: 500 }
    );
  }
}

// POST - Create new author
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

    if (!body.name) {
      return NextResponse.json(
        { error: "Author name is required" },
        { status: 400 }
      );
    }

    if (!body.email) {
      return NextResponse.json(
        { error: "Author email is required" },
        { status: 400 }
      );
    }

    if (!body.password) {
      return NextResponse.json(
        { error: "Author password is required" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const author = await prisma.author.create({
      data: {
        name: body.name,
        email: body.email.toLowerCase(),
        password: hashedPassword,
        role: body.role || "author",
        bio: body.bio || "",
        avatar: body.avatar || "",
      },
    });

    return NextResponse.json(author, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create author" },
      { status: 500 }
    );
  }
}