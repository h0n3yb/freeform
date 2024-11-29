export type PieceStatus = "GREENWARE" | "BISQUED" | "GLAZED" | "COMPLETED" | "PICKED_UP";

export interface Piece {
  id: string;
  title: string;
  description: string;
  status: PieceStatus;
  location: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  studentId: string;
}