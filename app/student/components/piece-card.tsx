"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { StatusBadge } from "@/app/components/status-badge";
import { PieceImage } from "@/app/components/piece-image";
import type { PieceWithRelations } from "@/types/piece";

interface PieceCardProps {
  piece: PieceWithRelations;
}

export function PieceCard({ piece }: PieceCardProps) {
  console.log('PieceCard received piece:', {
    id: piece.id,
    title: piece.title,
    images: piece.images,
    firstImageUrl: piece.images[0]?.url
  });

  const mainImage = piece.images[0]?.url;
  console.log('Main image URL:', mainImage);

  return (
    <Card className="h-full flex flex-col">
      <div className="relative pt-[100%]">
        {mainImage && (
          <PieceImage
            src={mainImage}
            alt={piece.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>
      <CardContent className="flex-1 p-4">
        <h3 className="font-semibold text-base mb-1">{piece.title}</h3>
        {piece.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {piece.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <StatusBadge status={piece.status} />
        <span className="text-sm text-muted-foreground">
          {new Date(piece.createdAt).toLocaleDateString()}
        </span>
      </CardFooter>
    </Card>
  );
}