import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { verifyOrganizerJWT } from '@/app/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = verifyOrganizerJWT(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        attendees: {
          orderBy: { createdAt: 'asc' }
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Calculate stats
    const totalRegistered = event.attendees.length;
    const totalCheckedIn = event.attendees.filter(a => a.isCheckedIn).length;
    const attendanceRate = totalRegistered > 0 
      ? Math.round((totalCheckedIn / totalRegistered) * 100)
      : 0;

    // Class breakdown
    const classCounts: Record<string, number> = {};
    event.attendees.forEach(a => {
      const key = `${a.class} ${a.section}`;
      classCounts[key] = (classCounts[key] || 0) + 1;
    });

    // Registration timeline (group by date)
    const registrationTimeline: Record<string, number> = {};
    event.attendees.forEach(a => {
      const date = new Date(a.createdAt).toLocaleDateString();
      registrationTimeline[date] = (registrationTimeline[date] || 0) + 1;
    });

    const stats = {
      totalRegistered,
      totalCheckedIn,
      attendanceRate,
      classCounts,
      registrationTimeline,
      firstRegistration: event.attendees[0]?.createdAt || null,
      lastRegistration: event.attendees[event.attendees.length - 1]?.createdAt || null,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching event stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
