import { Piece as PrismaBasePiece, Image, User, PieceStatus, ClassType, Technique } from "@prisma/client";

export type { PieceStatus, ClassType, Technique } from "@prisma/client";

// Base Piece type that matches Prisma schema
export type Piece = {
  id: string;
  title: string;
  description: string | null;
  status: PieceStatus;
  shelfLocation: string | null;
  glaze: string | null;
  classType: ClassType;
  technique: Technique;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

// Extended type with relations
export interface PieceWithRelations {
  id: string;
  title: string;
  description: string | null;
  status: PieceStatus;
  shelfLocation: string | null;
  glaze: string | null;
  classType: ClassType;    // Note: Using the enum from Prisma
  technique: Technique;    // Note: Using the enum from Prisma
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  student: {
    name: string | null;
    email: string | null;
  };
  images: {
    id: string;
    url: string;
    pieceId: string;
    createdAt: Date;
  }[];
}

// Optional relations version
export type PieceWithOptionalRelations = Piece & {
  student?: Pick<User, 'name' | 'email'> | null;
  images?: Image[];
};