import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { verifyOrganizerJWT } from '@/app/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const payload = verifyOrganizerJWT(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all attendees with their event information
    const attendees = await prisma.attendee.findMany({
      include: {
        event: {
          select: {
            id: true,
            name: true,
            date: true,
            isCompleted: true,
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Group by email to get unique hackers
    const hackersMap = new Map();

    attendees.forEach(attendee => {
      const key = attendee.email.toLowerCase();
      
      if (!hackersMap.has(key)) {
        hackersMap.set(key, {
          id: attendee.id, // Use first occurrence ID as unique ID
          firstName: attendee.firstName,
          lastName: attendee.lastName,
          email: attendee.email,
          phone: attendee.phone,
          class: attendee.class,
          section: attendee.section,
          joinedAt: attendee.createdAt,
          events: [],
          totalEvents: 0,
          totalCheckIns: 0,
        });
      }

      const hacker = hackersMap.get(key);
      hacker.events.push({
        id: attendee.event.id,
        name: attendee.event.name,
        date: attendee.event.date,
        isCheckedIn: attendee.isCheckedIn,
        isCompleted: attendee.event.isCompleted,
      });
      hacker.totalEvents++;
      if (attendee.isCheckedIn) {
        hacker.totalCheckIns++;
      }
    });

    const hackers = Array.from(hackersMap.values());

    // Sort by total events attended (most active first)
    hackers.sort((a, b) => b.totalEvents - a.totalEvents);

    return NextResponse.json({ hackers });
  } catch (error) {
    console.error('Error fetching hackers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hackers' },
      { status: 500 }
    );
  }
}
