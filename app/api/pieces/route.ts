import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { uploadToS3 } from "@/lib/upload";

// Mark route as dynamic
export const dynamic = 'force-dynamic';

// TODO: Add authentication to get real user ID
const MOCK_USER_ID = "student1@example.com";

const createPieceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  classType: z.string().min(1, "Class type is required"),
  glaze: z.string().min(1, "Glaze preference is required"),
  imageData: z.string().optional(), // Base64 image data
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = createPieceSchema.parse(body);

    let imageUrl: string | undefined;

    if (validatedData.imageData) {
      // Convert base64 to File object
      const base64Data = validatedData.imageData.split(",")[1];
      const mimeType = validatedData.imageData.split(";")[0].split(":")[1];
      const buffer = Buffer.from(base64Data, "base64");
      const tempFileName = `piece-${Date.now()}.${mimeType.split("/")[1]}`;
      
      // Create a File object from the buffer
      const file = new File([buffer], tempFileName, { type: mimeType });
      
      // Upload to S3
      imageUrl = await uploadToS3(file);
    }

    const piece = await prisma.piece.create({
      data: {
        name: validatedData.name,
        classType: validatedData.classType as any, // TODO: Add proper validation
        glaze: validatedData.glaze,
        status: "GREENWARE",
        studentId: MOCK_USER_ID,
        ...(imageUrl && {
          images: {
            create: {
              url: imageUrl,
              type: "PROGRESS",
            },
          },
        }),
      },
      include: {
        images: true,
      },
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
    // TODO: Add authentication to get real user ID
    const pieces = await prisma.piece.findMany({
      where: {
        studentId: MOCK_USER_ID,
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