import type { Piece } from "@/types/piece";

export function canEditPiece(piece: Piece, userId: string): boolean {
  return piece.studentId === userId && piece.status === "pending";
}

export function getStatusColor(status: Piece["status"]): string {
  const colors = {
    pending: "yellow",
    approved: "green",
    rejected: "red",
  };
  return colors[status];
}