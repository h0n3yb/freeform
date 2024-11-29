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
  return (
    <Card className="overflow-hidden">
      <Link href={`/student/pieces/${piece.id}`}>
        <CardHeader className="p-0">
          {piece.imageUrl && (
            <PieceImage
              src={piece.imageUrl}
              alt={piece.title}
              className="h-48 w-full"
            />
          )}
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg mb-2">{piece.title}</CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {piece.description}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          <StatusBadge status={piece.status} />
          <span className="text-sm text-muted-foreground">
            {new Date(piece.createdAt).toLocaleDateString()}
          </span>
        </CardFooter>
      </Link>
    </Card>
  );
}