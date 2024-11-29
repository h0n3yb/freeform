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
    console.log('Received piece creation request with body:', body);
    const validatedData = createPieceSchema.parse(body);
    console.log('Validated data:', validatedData);

    // Create the piece with transaction to ensure both piece and image are created
    const piece = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      console.log('Creating new piece...');
      const newPiece = await tx.piece.create({
        data: {
          title: validatedData.name,
          description: validatedData.description,
          status: "GREENWARE",
          userId: user.id,
          glaze: validatedData.glaze,
        },
      });
      console.log('Created piece:', newPiece);

      if (validatedData.imageData) {
        console.log('Creating image with URL:', validatedData.imageData);
        const image = await tx.image.create({
          data: {
            url: validatedData.imageData,
            pieceId: newPiece.id,
          },
        });
        console.log('Created image:', image);
      } else {
        console.log('No image data provided in request');
      }

      const pieceWithImage = await tx.piece.findUnique({
        where: { id: newPiece.id },
        include: {
          images: true,
        },
      });
      console.log('Final piece with images:', pieceWithImage);

      return pieceWithImage;
    });

    return NextResponse.json(piece);
  } catch (error) {
    console.error("Error creating piece:", error);
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors);
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

    console.log('Fetching pieces for user:', user.id);
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
    
    console.log('Found pieces with images:', pieces.map(piece => ({
      id: piece.id,
      title: piece.title,
      imageCount: piece.images.length,
      imageUrls: piece.images.map(img => img.url)
    })));

    return NextResponse.json(pieces);
  } catch (error) {
    console.error("Error fetching pieces:", error);
    return NextResponse.json(
      { error: "Failed to fetch pieces" },
      { status: 500 }
    );
  }
}