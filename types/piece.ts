import { Piece as PrismaBasePiece, Image, User } from "@prisma/client";

export type { PieceStatus } from "@prisma/client";

export type Piece = PrismaBasePiece;

export interface PieceWithRelations extends Omit<Piece, 'shelfLocation'> {
  student: Pick<User, 'name' | 'email'> | null;
  images: Image[];
  location: string | null;
}

export type PieceWithOptionalRelations = Omit<Piece, 'shelfLocation'> & {
  student?: Pick<User, 'name' | 'email'> | null;
  images?: Image[];
  location?: string | null;
};