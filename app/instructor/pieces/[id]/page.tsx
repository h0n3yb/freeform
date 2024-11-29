"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/app/components/status-badge";
import { PieceImage } from "@/app/components/piece-image";
import { LocationPicker } from "@/app/components/location-picker";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Piece, Prisma } from "@/lib/db";

type PieceWithRelations = Prisma.PieceGetPayload<{
  include: {
    images: {
      select: {
        id: true;
        url: true;
        type: true;
      };
    };
    student: {
      select: {
        name: true;
        email: true;
      };
    };
  };
}>;

export default function PiecePage() {
  const params = useParams();
  const pieceId = params.id as string;
  const [piece, setPiece] = useState<PieceWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function loadPiece() {
      try {
        const response = await fetch(`/api/pieces/${pieceId}`);
        if (!response.ok) throw new Error('Failed to load piece');
        const data = await response.json();
        setPiece(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load piece details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadPiece();
  }, [pieceId, toast]);

  const handleLocationUpdate = async (newLocation: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/pieces/${pieceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shelfLocation: newLocation }),
      });

      if (!response.ok) throw new Error('Failed to update location');

      const updatedPiece = await response.json();
      setPiece(updatedPiece);
      
      toast({
        title: 'Success',
        description: 'Piece location updated',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update piece location',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!piece) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Piece not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>{piece.name}</CardTitle>
          <div className="flex items-center gap-4">
            <StatusBadge status={piece.status} />
            <span className="text-sm text-muted-foreground">
              By {piece.student.name || piece.student.email}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {piece.images.length > 0 && (
            <PieceImage
              src={piece.images[0].url}
              alt={piece.name}
              className="h-64 w-full"
            />
          )}
          {piece.description && (
            <p className="text-muted-foreground">{piece.description}</p>
          )}
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Class Type</label>
              <p className="text-muted-foreground">{piece.classType}</p>
            </div>
            {piece.glaze && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Glaze</label>
                <p className="text-muted-foreground">{piece.glaze}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <LocationPicker
              currentLocation={piece.shelfLocation || ''}
              onLocationChange={handleLocationUpdate}
              disabled={isUpdating}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}