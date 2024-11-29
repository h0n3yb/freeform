import { useState, useEffect } from 'react';

export function useS3Image(s3Url: string | null) {
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!s3Url) {
      setIsLoading(false);
      return;
    }

    // Extract the key from the S3 URL
    const key = s3Url.split('.amazonaws.com/')[1];
    if (!key) {
      setError('Invalid S3 URL');
      setIsLoading(false);
      return;
    }
    
    async function getPresignedUrl() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/s3-url?key=${encodeURIComponent(key)}`);
        if (!response.ok) {
          throw new Error('Failed to get presigned URL');
        }
        const data = await response.json();
        if (data.url) {
          setPresignedUrl(data.url);
        } else {
          throw new Error('No URL returned');
        }
      } catch (error) {
        console.error('Failed to get presigned URL:', error);
        setError(error instanceof Error ? error.message : 'Failed to load image');
      } finally {
        setIsLoading(false);
      }
    }

    getPresignedUrl();

    // Refresh URL before it expires (every 50 minutes)
    const interval = setInterval(getPresignedUrl, 50 * 60 * 1000);

    return () => clearInterval(interval);
  }, [s3Url]);

  return { url: presignedUrl, isLoading, error };
} 