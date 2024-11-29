"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, Upload } from 'lucide-react';
import { uploadToS3 } from '@/lib/s3-upload';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadComponentProps {
  onCapture: (file: File, previewUrl: string) => void;
}

export function ImageUploadComponent({ onCapture }: ImageUploadComponentProps) {
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should be less than 10MB');
      return;
    }

    try {
      setIsUploading(true);

      // Create local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        setPreview(previewUrl);
      };
      reader.readAsDataURL(file);

      // Upload to S3
      const s3Url = await uploadToS3(file);
      onCapture(file, s3Url);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
      setError('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    setPreview(null);
    setError(null);
  };

  const triggerFileInput = () => {
    const input = document.getElementById('image-upload') as HTMLInputElement;
    if (input) {
      input.click();
    }
  };

  return (
    <div className="relative">
      {error && (
        <div className="text-red-500 text-sm mb-2">
          {error}
        </div>
      )}
      
      {!preview ? (
        <div className="flex flex-col items-center gap-4">
          <Button 
            type="button" 
            onClick={triggerFileInput}
            className="w-full cursor-pointer"
            disabled={isUploading}
          >
            <ImagePlus className="mr-2 h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Select Image'}
          </Button>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <p className="text-sm text-muted-foreground text-center">
            Take a photo or select from your gallery
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
            Choose Different Image
          </Button>
        </div>
      )}
    </div>
  );
}