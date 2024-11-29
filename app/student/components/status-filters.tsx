// status-filters.tsx
"use client";

import { Button } from "@/components/ui/button";
import { PieceStatus } from "@prisma/client";

const STATUSES = [
  PieceStatus.GREENWARE,
  PieceStatus.BISQUED,
  PieceStatus.GLAZED,
  PieceStatus.COMPLETED,
] as const;

export interface StatusFiltersProps {
  currentStatus: PieceStatus | "all";
  onStatusChange: (status: PieceStatus | "all") => void;
}

export function StatusFilters({
  currentStatus,
  onStatusChange,
}: StatusFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={currentStatus === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange("all")}
      >
        All
      </Button>
      {STATUSES.map((status) => (
        <Button
          key={status}
          variant={currentStatus === status ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusChange(status)}
        >
          {status.toLowerCase()}
        </Button>
      ))}
    </div>
  );
}