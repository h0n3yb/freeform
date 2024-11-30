// app/student/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import type { PieceWithRelations } from "@/types/piece";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { StatusFilters } from "./components/status-filters";
import { PieceCard } from "./components/piece-card";
import { PieceStatus } from "@/types/piece";
import { useSidebar } from "@/app/contexts/sidebar-context";

export default function StudentPage() {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
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
    <div>
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">My Pieces</h1>
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>
    
      <div className="px-4 space-y-4">
        <StatusFilters
          currentStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />
    
        {filteredPieces.length === 0 ? (
          <div className="text-center py-8 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">No pieces found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-start">
            {filteredPieces.map((piece) => (
              <PieceCard 
                key={piece.id} 
                piece={piece}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}