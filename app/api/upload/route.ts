import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

function parseBase64Image(base64String: string): { mimeType: string; buffer: Buffer } {
  const [header, base64Data] = base64String.split(',', 2);
  if (!header || !base64Data) {
    throw new Error('Invalid image format');
  }

  const mimeType = header.split(':')[1]?.split(';')[0];
  if (!mimeType) {
    throw new Error('Invalid image format');
  }

  return {
    mimeType,
    buffer: Buffer.from(base64Data, 'base64')
  };
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { filename, contentType, base64Data } = body;
    
    if (!filename || !contentType || !base64Data) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const { buffer } = parseBase64Image(base64Data);
    const key = `pieces/${Date.now()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(command);

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return NextResponse.json({ fileUrl });
  } catch (error) {
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
} 