"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/app/components/status-badge";
import { PieceCard } from "@/app/student/components/piece-card";
import { StatusFilters } from "@/app/student/components/status-filters";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Piece } from "@/types/piece";
import { FilterStatus, ALL_STATUSES } from "@/types/status";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function StudentDashboard() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Handle session errors
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login");
    }
  }, [sessionStatus, router]);

  // Fetch pieces
  useEffect(() => {
    async function fetchPieces() {
      try {
        const response = await fetch('/api/pieces');
        if (!response.ok) {
          throw new Error('Failed to fetch pieces');
        }
        const data = await response.json();
        setPieces(data.map((piece: any) => ({
          ...piece,
          createdAt: new Date(piece.createdAt),
          updatedAt: new Date(piece.updatedAt),
        })));
      } catch (error) {
        console.error('Error fetching pieces:', error);
        toast({
          title: 'Error',
          description: 'Failed to load pieces. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (sessionStatus === 'authenticated') {
      fetchPieces();
    }
  }, [sessionStatus, toast]);

  const filteredPieces = pieces
    .filter((piece) => 
      filterStatus === "all" ? true : piece.status === filterStatus
    )
    .filter((piece) =>
      piece.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  const statusCounts = Object.fromEntries(
    ALL_STATUSES.map(status => [
      status,
      pieces.filter(p => p.status === status).length
    ])
  );

  if (sessionStatus === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-4">
        {/* Header Section */}
        <div className="flex flex-col gap-4 mb-6">
          <h1 className="text-2xl font-bold">My Pieces</h1>
          <Button asChild className="w-full">
            <Link href="/student/pieces/new">Create a New Piece</Link>
          </Button>
        </div>

        {pieces.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 rounded-full bg-muted">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No pieces yet</h3>
              <p className="text-sm text-muted-foreground text-center">
                Get started by creating your first piece
              </p>
              <Button asChild>
                <Link href="/student/pieces/new">Create a New Piece</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Status Summary */}
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div 
                  key={status} 
                  className="bg-card p-2 rounded-lg border text-center"
                >
                  <p className="text-2xl font-bold mb-1">{count}</p>
                  <p className="text-xs text-muted-foreground capitalize truncate px-1">
                    {status.toLowerCase().replace('_', ' ')}
                  </p>
                </div>
              ))}
            </div>

            {/* Filters and Search */}
            <div className="space-y-2">
              <Input
                type="search"
                placeholder="Search pieces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="flex flex-col gap-2">
                <StatusFilters
                  currentStatus={filterStatus}
                  onStatusChange={setFilterStatus}
                />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent align="end" className="min-w-[8rem]">
                    <SelectItem value="date">Sort by Date</SelectItem>
                    <SelectItem value="title">Sort by Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Pieces Grid */}
            <div className="grid grid-cols-1 gap-4">
              {filteredPieces.map((piece) => (
                <PieceCard key={piece.id} piece={piece} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}