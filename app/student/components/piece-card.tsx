"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { StatusBadge } from "@/app/components/status-badge";
import { PieceImage } from "@/app/components/piece-image";
import type { PieceWithRelations } from "@/types/piece";
import { cn } from "@/lib/utils";

interface PieceCardProps {
  piece: PieceWithRelations;
}

export function PieceCard({ piece }: PieceCardProps) {
  const mainImage = piece.images[0]?.url;

  return (
    <Card className="overflow-hidden transition-all duration-300 w-full flex flex-col">
      <div className="relative pt-[100%]">
        {mainImage && (
          <PieceImage
            src={mainImage}
            alt={piece.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex flex-col flex-1">
        <CardContent className="flex-1 p-4">
          <h3 className="font-semibold text-base mb-1">{piece.title}</h3>
          {piece.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {piece.description}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center p-4 pt-0">
          <StatusBadge status={piece.status} />
          <span className="text-sm text-muted-foreground">
            {new Date(piece.createdAt).toLocaleDateString()}
          </span>
        </CardFooter>
      </div>
    </Card>
  );
}