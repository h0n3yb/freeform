import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Import bcrypt dynamically
    const { hash } = await import('bcrypt');
    const hashedPassword = await hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "STUDENT",
        name: email.split("@")[0], // Use part before @ as name
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return NextResponse.json(
      { 
        message: "Account created successfully",
        user
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    
    // Handle database unique constraint errors
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }
    
    // Handle other errors
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
} 