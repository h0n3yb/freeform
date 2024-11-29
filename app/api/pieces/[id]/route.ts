import { NextResponse } from "next/server";
import { prisma } from '@/lib/db';
import { PrismaClient } from '@prisma/client';

interface RouteParams {
  params: { id: string };
}

type TransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
>;

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const piece = await prisma.piece.findUnique({
      where: { id: params.id },
      include: {
        images: {
          select: {
            id: true,
            url: true,
            type: true,
          },
        },
        student: {
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

    return NextResponse.json(piece);
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
      select: { status: true, studentId: true },
    });

    if (!currentPiece) {
      return NextResponse.json(
        { error: 'Piece not found' },
        { status: 404 }
      );
    }

    // Create notification if status is changing
    const shouldNotify = body.status && body.status !== currentPiece.status;
    let notificationType: 'PIECE_COMPLETED' | 'STATUS_CHANGED' | null = null;

    if (shouldNotify) {
      if (body.status === 'COMPLETED') {
        notificationType = 'PIECE_COMPLETED';
      } else {
        notificationType = 'STATUS_CHANGED';
      }
    }

    const piece = await prisma.$transaction(async (tx: TransactionClient) => {
      // Update the piece
      const updatedPiece = await tx.piece.update({
        where: { id: params.id },
        data: {
          shelfLocation: body.shelfLocation,
          status: body.status,
          notes: body.notes,
        },
        include: {
          images: {
            select: {
              id: true,
              url: true,
              type: true,
            },
          },
          student: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      // Create notification if needed
      if (shouldNotify && notificationType) {
        await tx.notification.create({
          data: {
            type: notificationType,
            userId: currentPiece.studentId,
            pieceId: params.id,
          },
        });
      }

      return updatedPiece;
    });

    return NextResponse.json(piece);
  } catch (error) {
    console.error('Failed to update piece:', error);
    return NextResponse.json(
      { error: 'Failed to update piece' },
      { status: 500 }
    );
  }
}