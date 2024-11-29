import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success even if user doesn't exist for security
      return NextResponse.json(
        { message: "If an account exists, you will receive a password reset email" },
        { status: 200 }
      );
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    // Store reset token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // TODO: Send email with reset link
    // For now, we'll just return success
    // In production, you would integrate with an email service like SendGrid or AWS SES

    return NextResponse.json(
      { message: "If an account exists, you will receive a password reset email" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
} 