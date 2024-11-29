// status-badge.tsx
"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type PieceStatus = "greenware" | "bisqued" | "glazed" | "completed";

interface StatusBadgeProps {
  status: PieceStatus;
}

const statusStyles = {
  greenware: "bg-green-100 text-green-800 hover:bg-green-100",
  bisqued: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  glazed: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  completed: "bg-purple-100 text-purple-800 hover:bg-purple-100"
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge 
      variant="secondary" 
      className={cn("capitalize", statusStyles[status])}
    >
      {status}
    </Badge>
  );
}