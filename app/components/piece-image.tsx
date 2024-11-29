"use client";

import { useS3Image } from "@/hooks/use-s3-image";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PieceImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function PieceImage({ src, alt, className }: PieceImageProps) {
  const { url: presignedUrl, isLoading, error } = useS3Image(src);

  if (error) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-muted text-muted-foreground text-sm",
        className
      )}>
        Failed to load image
      </div>
    );
  }

  if (isLoading || !presignedUrl) {
    return (
      <div className={cn(
        "bg-muted animate-pulse",
        className
      )} />
    );
  }

  return (
    <div className={cn("relative", className)}>
      <Image
        src={presignedUrl}
        alt={alt}
        fill
        className="object-cover rounded-md"
      />
    </div>
  );
}