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

    const { isFormOpen } = await request.json();
    const { id } = await params;

    const event = await prisma.event.update({
      where: { id },
      data: { isFormOpen },
    });

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Error updating form status:', error);
    return NextResponse.json(
      { error: 'Failed to update form status' },
      { status: 500 }
    );
  }
}
