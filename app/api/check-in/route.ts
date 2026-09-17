import { NextRequest, NextResponse } from "next/server";
import { verifyOrganizerJWT } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Verify organizer authentication
    const payload = verifyOrganizerJWT(request);

    if (!payload) {
      return NextResponse.json(
        { error: "Not authenticated. Please log in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { ticketToken, eventId } = body;

    if (!ticketToken) {
      return NextResponse.json(
        { error: "Ticket token is required" },
        { status: 400 }
      );
    }

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    // Find attendee by ticket token and event
    const attendee = await prisma.attendee.findFirst({
      where: { 
        ticketToken,
        eventId 
      },
    });

    if (!attendee) {
      return NextResponse.json(
        { error: "Invalid ticket. Attendee not found." },
        { status: 404 }
      );
    }

    // Check if already checked in
    if (attendee.isCheckedIn) {
      return NextResponse.json(
        {
          error: "Already checked in",
          message: `${attendee.firstName} ${attendee.lastName} was already checked in at ${new Date(
            attendee.checkedInAt!
          ).toLocaleString()}.`,
          attendee: {
            firstName: attendee.firstName,
            lastName: attendee.lastName,
            email: attendee.email,
            class: attendee.class,
            section: attendee.section,
            checkedInAt: attendee.checkedInAt,
          },
        },
        { status: 409 }
      );
    }

    // Check in the attendee
    const updatedAttendee = await prisma.attendee.update({
      where: { id: attendee.id },
      data: {
        isCheckedIn: true,
        checkedInAt: new Date(),
        checkedInBy: payload.organizerId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Check-in successful!",
        attendee: {
          id: updatedAttendee.id,
          firstName: updatedAttendee.firstName,
          lastName: updatedAttendee.lastName,
          email: updatedAttendee.email,
          phone: updatedAttendee.phone,
          class: updatedAttendee.class,
          section: updatedAttendee.section,
          checkedInAt: updatedAttendee.checkedInAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
