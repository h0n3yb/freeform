import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function generateUploadUrl(key: string) {
  try {
    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Conditions: [
        ["content-length-range", 0, 10485760], // up to 10MB
        ["starts-with", "$Content-Type", "image/"],
      ],
      Expires: 600, // 10 minutes
    });

    return { url, fields };
  } catch (error) {
    console.error("Error generating upload URL:", error);
    throw new Error("Failed to generate upload URL");
  }
}

export async function uploadToS3(file: File): Promise<string> {
  const key = `pieces/${Date.now()}-${file.name}`;
  const { url, fields } = await generateUploadUrl(key);

  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  formData.append("file", file);

  const upload = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!upload.ok) {
    throw new Error("Failed to upload file");
  }

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

export function generateImageKey(userId: string, pieceId: string, filename: string) {
  const extension = filename.split('.').pop();
  return `pieces/${userId}/${pieceId}/${Date.now()}.${extension}`;
} 