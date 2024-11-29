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
        images: {
          select: {
            id: true,
            url: true,
            createdAt: true,
            pieceId: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!piece) {
      return NextResponse.json(
        { error: 'Piece not found' },
        { status: 404 }
      );
    }

    // Transform the response to match our expected format
    const { shelfLocation, user, ...rest } = piece;
    const transformedPiece: PieceWithRelations = {
      ...rest,
      student: user,
      images: piece.images,
      location: shelfLocation,
    };

    return NextResponse.json(transformedPiece);
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

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const currentPiece = await prisma.piece.findUnique({
      where: { id: params.id },
      select: { status: true, userId: true },
    });

    if (!currentPiece) {
      return NextResponse.json(
        { error: 'Piece not found' },
        { status: 404 }
      );
    }

    // Update the piece
    const piece = await prisma.piece.update({
      where: { id: params.id },
      data: {
        shelfLocation: body.location, // Map location to shelfLocation
        status: body.status,
      },
      include: {
        images: {
          select: {
            id: true,
            url: true,
            createdAt: true,
            pieceId: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Transform the response to match our expected format
    const { shelfLocation, user, ...rest } = piece;
    const transformedPiece: PieceWithRelations = {
      ...rest,
      student: user,
      images: piece.images,
      location: shelfLocation,
    };

    return NextResponse.json(transformedPiece);
  } catch (error) {
    console.error('Failed to update piece:', error);
    return NextResponse.json(
      { error: 'Failed to update piece' },
      { status: 500 }
    );
  }
}