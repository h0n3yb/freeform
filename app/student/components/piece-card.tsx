"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/app/components/status-badge";
import { PieceImage } from "@/app/components/piece-image";
import type { Piece } from "@/types/piece";

interface PieceCardProps {
  piece: Piece;
}

export function PieceCard({ piece }: PieceCardProps) {
  const mainImage = piece.images?.[0]?.url;

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <Link href={`/student/pieces/${piece.id}`} className="flex flex-col flex-1">
        <CardHeader className="p-0">
          {mainImage ? (
            <PieceImage
              src={mainImage}
              alt={piece.title}
              className="h-32 sm:h-48 w-full object-cover"
            />
          ) : (
            <div className="h-32 sm:h-48 w-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-sm">No image</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-3 sm:p-4 flex-1">
          <CardTitle className="text-base sm:text-lg mb-1 sm:mb-2 line-clamp-1">
            {piece.title}
          </CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
            {piece.description || "No description"}
          </p>
        </CardContent>
        <CardFooter className="p-3 sm:p-4 pt-0 flex justify-between items-center">
          <StatusBadge status={piece.status} className="text-xs sm:text-sm" />
          <span className="text-xs sm:text-sm text-muted-foreground">
            {new Date(piece.createdAt).toLocaleDateString()}
          </span>
        </CardFooter>
      </Link>
    </Card>
  );
}