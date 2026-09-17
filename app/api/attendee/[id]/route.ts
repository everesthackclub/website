import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const attendee = await prisma.attendee.findUnique({
      where: { id },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            eventDate: true,
            time: true,
            location: true
          }
        }
      }
    });

    if (!attendee) {
      return NextResponse.json({ error: 'Attendee not found' }, { status: 404 });
    }

    return NextResponse.json({ attendee });
  } catch (error) {
    console.error('Get attendee error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendee' },
      { status: 500 }
    );
  }
}