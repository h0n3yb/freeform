"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/app/student/components/status-badge";
import { PieceImage } from "@/app/components/piece-image";

interface PieceCardProps {
  piece: {
    id: number;
    title: string;
    status: "greenware" | "bisqued" | "glazed" | "completed";
    imageUrl: string;
    description: string;
    location: string;
    studentName: string;
    createdAt: string;
  };
}

export function PieceCard({ piece }: PieceCardProps) {
  return (
    <Card className="overflow-hidden">
      <Link href={`/instructor/pieces/${piece.id}`}>
        <CardHeader className="p-0">
          <PieceImage
            src={piece.imageUrl}
            alt={piece.title}
            className="h-48 w-full"
          />
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold">{piece.title}</h3>
            <StatusBadge status={piece.status} />
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {piece.description}
          </p>
          <div className="text-sm text-muted-foreground">
            <p>Location: {piece.location}</p>
            <p>Student: {piece.studentName}</p>
            <p>Submitted: {new Date(piece.createdAt).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}