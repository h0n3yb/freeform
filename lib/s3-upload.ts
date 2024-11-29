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

export async function uploadToS3(base64Data: string): Promise<string> {
  try {
    const { mimeType, buffer } = parseBase64Image(base64Data);
    const extension = mimeType.split('/')[1];
    const key = `pieces/${Date.now()}.${extension}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      })
    );

    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload file');
  }
} 