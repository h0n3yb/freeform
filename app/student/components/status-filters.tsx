import { PieceStatus } from "@/types/piece";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StatusFiltersProps {
  currentStatus: PieceStatus | "all";
  onStatusChange: (status: PieceStatus | "all") => void;
}

export function StatusFilters({ 
  currentStatus, 
  onStatusChange,
}: StatusFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Button
        variant={currentStatus === "all" ? "secondary" : "ghost"}
        onClick={() => onStatusChange("all")}
        className="rounded-full"
      >
        All
      </Button>
      <Button
        variant={currentStatus === "GREENWARE" ? "secondary" : "ghost"}
        onClick={() => onStatusChange("GREENWARE")}
        className="rounded-full"
      >
        greenware
      </Button>
      <Button
        variant={currentStatus === "BISQUED" ? "secondary" : "ghost"}
        onClick={() => onStatusChange("BISQUED")}
        className="rounded-full"
      >
        bisqued
      </Button>
      <Button
        variant={currentStatus === "GLAZED" ? "secondary" : "ghost"}
        onClick={() => onStatusChange("GLAZED")}
        className="rounded-full"
      >
        glazed
      </Button>
      <Button
        variant={currentStatus === "COMPLETED" ? "secondary" : "ghost"}
        onClick={() => onStatusChange("COMPLETED")}
        className="rounded-full"
      >
        completed
      </Button>
    </div>
  );
}