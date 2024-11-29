"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/app/components/status-badge";
import type { Piece } from "@/types/piece";

const columns = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "createdAt",
    header: "Submitted",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
];

interface PieceGridProps {
  pieces: Piece[];
}

export function PieceGrid({ pieces }: PieceGridProps) {
  return (
    <DataTable
      columns={columns}
      data={pieces}
      searchKey="title"
    />
  );
}