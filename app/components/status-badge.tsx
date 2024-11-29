import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PieceStatus } from "@/lib/db";

interface StatusBadgeProps {
  status: PieceStatus;
  className?: string;
}

const statusConfig: Record<PieceStatus, { label: string; className: string }> = {
  GREENWARE: {
    label: "Greenware",
    className: "bg-slate-100 text-slate-700 hover:bg-slate-100/80",
  },
  BISQUED: {
    label: "Bisqued",
    className: "bg-orange-100 text-orange-700 hover:bg-orange-100/80",
  },
  GLAZED: {
    label: "Glazed",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-100/80",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-green-100 text-green-700 hover:bg-green-100/80",
  },
  PICKED_UP: {
    label: "Picked Up",
    className: "bg-purple-100 text-purple-700 hover:bg-purple-100/80",
  },
};

const defaultConfig = {
  label: "Unknown",
  className: "bg-gray-100 text-gray-700 hover:bg-gray-100/80",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || defaultConfig;
  
  return (
    <Badge
      variant="secondary"
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}