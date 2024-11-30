"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/app/components/status-badge";
import { PieceImage } from "@/app/components/piece-image";
import { LocationPicker } from "@/app/components/location-picker";
import { useToast } from "@/hooks/use-toast";
import type { PieceWithRelations } from "@/types/piece";

interface PieceDetailsPageProps {
  params: { id: string };
}

export default function PieceDetailsPage({ params }: PieceDetailsPageProps) {
  const { toast } = useToast();
  const [piece, setPiece] = useState<PieceWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function fetchPiece() {
      try {
        const response = await fetch(`/api/pieces/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch piece');
        const data = await response.json();
        setPiece(data);
      } catch (error) {
        console.error('Error fetching piece:', error);
        toast({
          title: 'Error',
          description: 'Failed to load piece details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchPiece();
  }, [params.id, toast]);

  const handleLocationChange = async (newLocation: string) => {
    if (!piece) return;
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/pieces/${piece.id}`, {
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

  if (isLoading) return <div>Loading...</div>;
  if (!piece) return <div>Piece not found</div>;

  const mainImage = piece.images?.[0]?.url;

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>{piece.title}</CardTitle>
          <div className="flex items-center gap-4">
            <StatusBadge status={piece.status} />
            <span className="text-sm text-muted-foreground">
              By {piece.student?.name || piece.student?.email || 'Unknown'}
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
          <div className="mt-6">
            <LocationPicker
              currentLocation={piece.shelfLocation}
              onLocationChange={handleLocationChange}
              disabled={isUpdating}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}