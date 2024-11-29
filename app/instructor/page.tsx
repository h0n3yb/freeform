"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PieceCard } from "./components/piece-card";
import { BatchUpdate } from "./components/batch-update";
import { LocationPicker } from "./components/location-picker";

const mockPieces = [
  {
    id: 1,
    title: "Blue Vase",
    status: "greenware" as const,
    imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61",
    description: "Hand-built vase with wave patterns",
    location: "A2",
    studentName: "Alice Smith",
    createdAt: "2024-03-20"
  },
  {
    id: 2,
    title: "Coffee Mug",
    status: "bisqued" as const,
    imageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d",
    description: "Wheel-thrown mug with handle",
    location: "B1",
    studentName: "Bob Johnson",
    createdAt: "2024-03-15"
  }
];

export default function InstructorDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPieces, setSelectedPieces] = useState<string[]>([]);

  const filteredPieces = mockPieces.filter(piece => {
    const matchesSearch = piece.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         piece.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === "all" || piece.location.startsWith(locationFilter.split("-")[1]?.toUpperCase() || "");
    const matchesStatus = statusFilter === "all" || piece.status === statusFilter;
    return matchesSearch && matchesLocation && matchesStatus;
  });

  const handleSelectAll = (checked: boolean) => {
    setSelectedPieces(checked ? filteredPieces.map(p => p.id.toString()) : []);
  };

  const handleSelectPiece = (pieceId: string, checked: boolean) => {
    setSelectedPieces(prev => 
      checked 
        ? [...prev, pieceId]
        : prev.filter(id => id !== pieceId)
    );
  };

  const handleBatchUpdateComplete = () => {
    setSelectedPieces([]);
    // TODO: Refresh pieces data
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Pieces", value: mockPieces.length },
          { label: "Needs Bisque", value: mockPieces.filter(p => p.status === "greenware").length },
          { label: "Needs Glaze", value: mockPieces.filter(p => p.status === "bisqued").length },
          { label: "Completed", value: mockPieces.filter(p => p.status === "completed").length }
        ].map((stat) => (
          <Card key={stat.label} className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search by piece name or student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="shelf-a">Shelf A</SelectItem>
            <SelectItem value="shelf-b">Shelf B</SelectItem>
            <SelectItem value="shelf-c">Shelf C</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="greenware">Greenware</SelectItem>
            <SelectItem value="bisqued">Bisqued</SelectItem>
            <SelectItem value="glazed">Glazed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">Export Data</Button>
      </div>

      {/* Batch Operations */}
      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all"
            checked={selectedPieces.length === filteredPieces.length}
            onCheckedChange={handleSelectAll}
          />
          <label 
            htmlFor="select-all" 
            className="text-sm font-medium leading-none"
          >
            Select All
          </label>
        </div>
        <BatchUpdate 
          selectedPieces={selectedPieces}
          onUpdateComplete={handleBatchUpdateComplete}
        />
      </div>

      {/* Pieces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPieces.map((piece) => (
          <div key={piece.id} className="relative">
            <div className="absolute top-2 left-2 z-10">
              <Checkbox
                checked={selectedPieces.includes(piece.id.toString())}
                onCheckedChange={(checked) => 
                  handleSelectPiece(piece.id.toString(), checked as boolean)
                }
              />
            </div>
            <PieceCard piece={piece} />
          </div>
        ))}
      </div>
    </div>
  );
}