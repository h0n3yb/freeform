import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

function parseBase64Image(base64String: string): { mimeType: string; buffer: Buffer } {
  // Split on first occurrence of comma
  const [header, base64Data] = base64String.split(',', 2);
  if (!header || !base64Data) {
    throw new Error('Invalid base64 image format');
  }

  // Extract mime type from header (data:image/jpeg;base64)
  const mimeType = header.split(':')[1]?.split(';')[0];
  if (!mimeType) {
    throw new Error('Invalid image mime type');
  }

  return {
    mimeType,
    buffer: Buffer.from(base64Data, 'base64')
  };
}

export async function uploadToS3(file: File): Promise<string> {
  try {
    // Convert file to base64
    const base64Promise = new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const base64Data = await base64Promise;

    // Send to server for upload
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
        base64Data: base64Data,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const { fileUrl } = await response.json();
    return fileUrl;
  } catch (error) {
    throw new Error('Failed to upload image');
  }
} 