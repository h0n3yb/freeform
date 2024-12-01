"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, Upload } from 'lucide-react';
import { uploadToS3 } from '@/lib/s3-upload';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadComponentProps {
  onCapture: (file: File, s3Url: string, metadata?: any) => void;
}

export function ImageUploadComponent({ onCapture }: ImageUploadComponentProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setIsUploading(true);

      // Create local preview first
      const reader = new FileReader();
      
      const previewPromise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const previewUrl = reader.result as string;
          setPreview(previewUrl);
          resolve(previewUrl);
        };
        reader.onerror = reject;
      });

      reader.readAsDataURL(file);
      await previewPromise;

      // Upload to S3
      const s3Url = await uploadToS3(file);

      // If feature flag set, call our analyze-image API endpoint
      if (process.env.ENABLE_AI_PIECE_IMAGE_ANALYSIS == 'true') {
        try {
          const response = await fetch('/api/analyze-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageUrl: s3Url }),
          });
  
          if (!response.ok) {
            throw new Error('Failed to analyze image');
          }
  
          const { metadata } = await response.json();
          console.log('Image analysis response:', metadata);  // Debug log
  
          // Pass both the URL and metadata to the parent
          onCapture(file, s3Url, metadata);
        } catch (analysisError) {
          console.error('Image analysis error:', analysisError);
          // Still continue with the upload even if analysis fails
          onCapture(file, s3Url);
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    setPreview(null);
  };

  const triggerFileInput = () => {
    const input = document.getElementById('image-upload') as HTMLInputElement;
    if (input) {
      input.click();
    }
  };

  return (
    <div className="relative space-y-4">
      {!preview ? (
        <div className="flex flex-col items-center gap-4">
          <Button 
            type="button" 
            onClick={triggerFileInput}
            className="w-full cursor-pointer"
            disabled={isUploading}
          >
            <ImagePlus className="mr-2 h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Take Photo'}
          </Button>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <p className="text-sm text-muted-foreground text-center">
            Uses your back camera for photos
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          </div>
          <Button 
            type="button" 
            onClick={clearImage} 
            variant="outline" 
            className="w-full"
            disabled={isUploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            Take Different Photo
          </Button>
        </div>
      )}
    </div>
  );
}