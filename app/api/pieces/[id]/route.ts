import { NextResponse } from "next/server";
import { prisma } from '@/lib/db';
import { PrismaClient } from '@prisma/client';
import type { PieceWithRelations } from "@/types/piece";

interface RouteParams {
  params: { id: string };
}

type TransactionClient = PrismaClient;

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const piece = await prisma.piece.findUnique({
      where: { id: params.id },
      include: {
        student: {
          select: {
            name: true,
            email: true,
          },
        },
        images: true,
      },
    });

    if (!piece) {
      return NextResponse.json(
        { error: 'Piece not found' },
        { status: 404 }
      );
    }

    const pieceWithRelations: PieceWithRelations = {
      id: piece.id,
      title: piece.title,
      description: piece.description,
      status: piece.status,
      shelfLocation: piece.shelfLocation,
      glaze: piece.glaze,
      classType: piece.classType,
      technique: piece.technique,
      createdAt: piece.createdAt,
      updatedAt: piece.updatedAt,
      userId: piece.userId,
      student: piece.student,
      images: piece.images,
    };

    return NextResponse.json(pieceWithRelations);
  } catch (error) {
    console.error('Failed to fetch piece:', error);
    return NextResponse.json(
      { error: 'Failed to fetch piece' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const data = await request.json();
    // TODO: Implement actual piece update
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update piece" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    // TODO: Implement actual piece deletion
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete piece" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const updatedPiece = await prisma.piece.update({
      where: { id: params.id },
      data: {
        shelfLocation: body.location,
        status: body.status,
      },
      include: {
        student: {
          select: {
            name: true,
            email: true,
          },
        },
        images: true,
      },
    });

    const pieceWithRelations: PieceWithRelations = {
      id: updatedPiece.id,
      title: updatedPiece.title,
      description: updatedPiece.description,
      status: updatedPiece.status,
      shelfLocation: updatedPiece.shelfLocation,
      glaze: updatedPiece.glaze,
      classType: updatedPiece.classType,
      technique: updatedPiece.technique,
      createdAt: updatedPiece.createdAt,
      updatedAt: updatedPiece.updatedAt,
      userId: updatedPiece.userId,
      student: updatedPiece.student,
      images: updatedPiece.images,
    };

    return NextResponse.json(pieceWithRelations);
  } catch (error) {
    console.error('Failed to update piece:', error);
    return NextResponse.json(
      { error: 'Failed to update piece' },
      { status: 500 }
    );
  }
}