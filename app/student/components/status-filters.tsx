// status-filters.tsx
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FilterStatus, ALL_FILTER_STATUSES } from "@/types/status";

interface StatusFiltersProps {
  currentStatus: FilterStatus;
  onStatusChange: (status: FilterStatus) => void;
}

export function StatusFilters({ currentStatus, onStatusChange }: StatusFiltersProps) {
  return (
    <div className="flex gap-2">
      {ALL_FILTER_STATUSES.map((status) => (
        <Button
          key={status}
          variant={currentStatus === status ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusChange(status)}
          className={cn(
            "capitalize",
            currentStatus === status && "pointer-events-none"
          )}
        >
          {status.toLowerCase().replace('_', ' ')}
        </Button>
      ))}
    </div>
  );
}