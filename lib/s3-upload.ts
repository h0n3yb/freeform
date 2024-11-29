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
    console.log('Starting S3 upload for file:', file.name);
    // Get presigned URL
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get upload URL');
    }

    const { presignedUrl, fileUrl } = await response.json();
    console.log('Received presigned URL:', presignedUrl);
    console.log('File will be accessible at:', fileUrl);

    // Upload file using presigned URL
    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload file');
    }

    console.log('File successfully uploaded to S3');
    return fileUrl;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload file');
  }
} 