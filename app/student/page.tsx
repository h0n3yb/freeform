"use client";

import { useState } from "react";
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

export default function StudentDashboard() {
  const [status, setStatus] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");

  // TODO: Replace with actual API call
  const pieces: Piece[] = [];

  const filteredPieces = pieces
    .filter((piece) => 
      status === "all" ? true : piece.status === status
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

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Pieces</h1>
      </div>

      {pieces.length === 0 ? (
        <div className="text-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 rounded-full bg-muted">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No pieces yet</h3>
            <p className="text-muted-foreground">
              Get started by creating your first piece
            </p>
            <Button asChild>
              <Link href="/student/pieces/new">Create a New Piece</Link>
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Status Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="bg-card p-4 rounded-lg border">
                <p className="text-muted-foreground capitalize">{status.toLowerCase().replace('_', ' ')}</p>
                <p className="text-2xl font-bold">{count}</p>
              </div>
            ))}
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search pieces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <StatusFilters
              currentStatus={status}
              onStatusChange={setStatus}
            />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="title">Sort by Title</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pieces Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPieces.map((piece) => (
              <PieceCard key={piece.id} piece={piece} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}