import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, class: className, section, eventId } = body;

    // Validate all required fields
    if (!firstName || !lastName || !email || !phone || !className || !section || !eventId) {
      return NextResponse.json(
        {
          error: "All fields are required",
          missing: {
            firstName: !firstName,
            lastName: !lastName,
            email: !email,
            phone: !phone,
            class: !className,
            section: !section,
            eventId: !eventId,
          },
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check for duplicate email for this event
    const existingAttendee = await prisma.attendee.findUnique({
      where: { 
        email_eventId: {
          email: normalizedEmail,
          eventId: eventId,
        }
      },
    });

    if (existingAttendee) {
      return NextResponse.json(
        {
          error: "Email already registered",
          message: "This email has already been used to RSVP for this event. Check your ticket in the dashboard.",
        },
        { status: 409 }
      );
    }

    // Create the attendee record
    const attendee = await prisma.attendee.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        class: className.trim(),
        section: section.trim(),
        eventId: eventId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        ticketToken: attendee.ticketToken,
        firstName: attendee.firstName,
        lastName: attendee.lastName,
        message: "RSVP successful! Your ticket has been generated.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("RSVP error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
