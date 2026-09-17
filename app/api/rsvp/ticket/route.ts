import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Ticket token is required" },
        { status: 400 }
      );
    }

    // Find attendee by ticket token
    const attendee = await prisma.attendee.findUnique({
      where: { ticketToken: token },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        class: true,
        section: true,
        ticketToken: true,
        isCheckedIn: true,
        checkedInAt: true,
        createdAt: true,
        event: {
          select: {
            id: true,
            name: true,
            date: true,
            time: true,
            location: true,
          },
        },
      },
    });

    if (!attendee) {
      return NextResponse.json(
        { error: "Invalid ticket token" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      attendee,
    });
  } catch (error) {
    console.error("Ticket fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
