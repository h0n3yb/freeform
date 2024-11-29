import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PieceStatus } from "@prisma/client";

export interface StatusBadgeProps {
  status: PieceStatus;
  className?: string;
}

const statusConfig = {
  [PieceStatus.GREENWARE]: {
    label: "Greenware",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  [PieceStatus.BISQUED]: {
    label: "Bisqued",
    className: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  },
  [PieceStatus.GLAZED]: {
    label: "Glazed",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  },
  [PieceStatus.COMPLETED]: {
    label: "Completed",
    className: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  },
  [PieceStatus.PICKED_UP]: {
    label: "Picked Up",
    className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  },
} satisfies Record<PieceStatus, { label: string; className: string }>;

type StatusConfigKey = keyof typeof statusConfig;

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status as StatusConfigKey];
  return (
    <Badge
      variant="secondary"
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}