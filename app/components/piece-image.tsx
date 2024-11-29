"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface PieceImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function PieceImage({ src, alt, className }: PieceImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={cn("relative aspect-square", className)}>
      {isLoading && (
        <Skeleton className="absolute inset-0" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        className={cn(
          "object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}