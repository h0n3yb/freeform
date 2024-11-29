"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/app/components/status-badge";
import { PieceImage } from "@/app/components/piece-image";
import type { PieceWithRelations } from "@/types/piece";

export default function PieceDetailPage() {
  const params = useParams();
  const [piece, setPiece] = useState<PieceWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPiece() {
      try {
        const response = await fetch(`/api/pieces/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch piece');
        const data = await response.json();
        setPiece(data);
      } catch (error) {
        console.error('Error fetching piece:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPiece();
  }, [params.id]);

  if (isLoading) return <div>Loading...</div>;
  if (!piece) return <div>Piece not found</div>;

  const mainImage = piece.images[0]?.url;

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>{piece.title}</CardTitle>
          <div className="flex items-center gap-4">
            <StatusBadge status={piece.status} />
            <span className="text-sm text-muted-foreground">
              Created {new Date(piece.createdAt).toLocaleDateString()}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {mainImage && (
            <PieceImage
              src={mainImage}
              alt={piece.title}
              className="h-64 w-full"
            />
          )}
          <p className="text-muted-foreground mt-4">{piece.description}</p>
          {piece.location && (
            <p className="text-sm text-muted-foreground mt-2">
              Location: {piece.location}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}