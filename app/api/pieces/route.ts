import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { uploadToS3 } from "@/lib/s3-upload";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient, Prisma } from "@prisma/client";

// Mark route as dynamic
export const dynamic = 'force-dynamic';

const createPieceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  imageData: z.string().optional(),
  glaze: z.string().min(1, "Glaze preference is required"),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const validatedData = createPieceSchema.parse(body);

    let imageUrl: string | undefined;

    if (validatedData.imageData) {
      try {
        imageUrl = await uploadToS3(validatedData.imageData);
      } catch (error) {
        console.error("Error uploading image:", error);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }
    }

    // Create the piece with transaction to ensure both piece and image are created
    const piece = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const newPiece = await tx.piece.create({
        data: {
          title: validatedData.name,
          description: validatedData.description,
          status: "GREENWARE",
          userId: user.id,
          glaze: validatedData.glaze,
        },
      });

      if (imageUrl) {
        await tx.image.create({
          data: {
            url: imageUrl,
            pieceId: newPiece.id,
          },
        });
      }

      return tx.piece.findUnique({
        where: { id: newPiece.id },
        include: {
          images: true,
        },
      });
    });

    return NextResponse.json(piece);
  } catch (error) {
    console.error("Error creating piece:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create piece" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const pieces = await prisma.piece.findMany({
      where: {
        userId: user.id,
      },
      include: {
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(pieces);
  } catch (error) {
    console.error("Error fetching pieces:", error);
    return NextResponse.json(
      { error: "Failed to fetch pieces" },
      { status: 500 }
    );
  }
}