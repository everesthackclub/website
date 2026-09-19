import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { verifyOrganizerJWT } from '@/app/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = verifyOrganizerJWT(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { isCompleted } = await request.json();
    const { id } = await params;

    const event = await prisma.event.update({
      where: { id },
      data: { isCompleted },
    });

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Error updating event completion status:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}
