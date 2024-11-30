"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { PieceWithRelations } from "@/types/piece";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { StatusFilters } from "./components/status-filters";
import { PieceCard } from "./components/piece-card";
import { PieceStatus } from "@/types/piece";

export default function StudentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pieces, setPieces] = useState<PieceWithRelations[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<PieceStatus | "all">("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPieces() {
      try {
        const response = await fetch('/api/pieces');
        if (!response.ok) throw new Error('Failed to fetch pieces');
        const data = await response.json();
        setPieces(data);
      } catch (error) {
        console.error('Error fetching pieces:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (session?.user) {
      fetchPieces();
    }
  }, [session?.user]);

  if (status === "loading" || isLoading) {
    return <div>Loading...</div>;
  }

  if (!session?.user) {
    router.push('/login');
    return null;
  }

  const filteredPieces = selectedStatus === "all"
    ? pieces
    : pieces.filter(piece => piece.status === selectedStatus);

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">My Pieces</h1>
      </div>
    
      <div className="space-y-4">
        <StatusFilters
          currentStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />
    
        {filteredPieces.length === 0 ? (
          <div className="text-center py-8 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">No pieces found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredPieces.map((piece) => (
              <PieceCard key={piece.id} piece={piece} />
            ))}
          </div>
        )}
      </div>
    </div>
    );
}