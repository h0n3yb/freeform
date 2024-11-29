import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendEmail, generatePickupEmail } from '@/lib/email';

const batchUpdateSchema = z.object({
  pieceIds: z.array(z.string()),
  updates: z.object({
    status: z.enum(['in-progress', 'glazing', 'firing', 'complete', 'picked-up']).optional(),
    shelfLocation: z.string().optional(),
    notes: z.string().optional(),
  }),
  sendNotification: z.boolean().optional(),
});

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const validatedData = batchUpdateSchema.parse(body);
    
    // TODO: Update pieces in database
    const updatedPieces = validatedData.pieceIds.map(id => ({
      id,
      ...validatedData.updates,
    }));

    // Send notifications if pieces are complete
    if (validatedData.sendNotification && validatedData.updates.status === 'complete') {
      // TODO: Get actual student emails from database
      const notifications = updatedPieces.map(piece => ({
        studentEmail: 'student@example.com',
        studentName: 'Student Name',
        pieceName: 'Piece Name',
      }));

      await Promise.all(
        notifications.map(async ({ studentEmail, studentName, pieceName }) => {
          const { subject, html } = generatePickupEmail(studentName, pieceName);
          await sendEmail({
            to: studentEmail,
            subject,
            html,
          });
        })
      );
    }

    return NextResponse.json({
      success: true,
      updatedPieces,
    });
  } catch (error) {
    console.error('Failed to update pieces:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update pieces' },
      { status: 400 }
    );
  }
} 