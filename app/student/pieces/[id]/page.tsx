"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/app/components/status-badge";
import { PieceImage } from "@/app/components/piece-image";

// Temporary mock data
const mockPiece = {
  id: "1",
  title: "Sample Piece",
  description: "Detailed description of the piece",
  status: "pending" as const,
  location: "Shelf A1",
  imageUrl: "https://images.unsplash.com/photo-1555212697-194d092e3b8f",
  createdAt: new Date(),
  updatedAt: new Date(),
  studentId: "student1",
};

export default function PieceDetailsPage() {
  const params = useParams();
  const pieceId = params.id as string;

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>{mockPiece.title}</CardTitle>
          <div className="flex items-center gap-4">
            <StatusBadge status={mockPiece.status} />
            <span className="text-sm text-muted-foreground">
              Location: {mockPiece.location}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {mockPiece.imageUrl && (
            <PieceImage
              src={mockPiece.imageUrl}
              alt={mockPiece.title}
              className="h-64 w-full mb-4"
            />
          )}
          <p className="text-muted-foreground">{mockPiece.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}