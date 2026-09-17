import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { verifyOrganizerJWT } from '@/app/lib/auth';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

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
            date: true,
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

// PATCH - Approve attendee (update isApproved status)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify organizer authentication
    const payload = verifyOrganizerJWT(request);
    if (!payload) {
      return NextResponse.json(
        { error: 'Not authenticated. Please log in.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { isApproved } = body;

    if (typeof isApproved !== 'boolean') {
      return NextResponse.json(
        { error: 'isApproved must be a boolean' },
        { status: 400 }
      );
    }

    // Check if attendee exists
    const existingAttendee = await prisma.attendee.findUnique({
      where: { id }
    });

    if (!existingAttendee) {
      return NextResponse.json({ error: 'Attendee not found' }, { status: 404 });
    }

    // Update attendee approval status
    const updatedAttendee = await prisma.attendee.update({
      where: { id },
      data: { isApproved }
    });

    return NextResponse.json({
      success: true,
      message: `Attendee ${isApproved ? 'approved' : 'unapproved'} successfully`,
      attendee: updatedAttendee
    });
  } catch (error) {
    console.error('Update attendee error:', error);
    return NextResponse.json(
      { error: 'Failed to update attendee' },
      { status: 500 }
    );
  }
}

// DELETE - Remove attendee from event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify organizer authentication
    const payload = verifyOrganizerJWT(request);
    if (!payload) {
      return NextResponse.json(
        { error: 'Not authenticated. Please log in.' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if attendee exists
    const existingAttendee = await prisma.attendee.findUnique({
      where: { id }
    });

    if (!existingAttendee) {
      return NextResponse.json({ error: 'Attendee not found' }, { status: 404 });
    }

    // Delete the attendee
    await prisma.attendee.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Attendee deleted successfully'
    });
  } catch (error) {
    console.error('Delete attendee error:', error);
    return NextResponse.json(
      { error: 'Failed to delete attendee' },
      { status: 500 }
    );
  }
}