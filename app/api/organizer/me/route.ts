import { NextRequest, NextResponse } from "next/server";
import { verifyOrganizerJWT } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Verify JWT from cookie
    const payload = verifyOrganizerJWT(request);

    if (!payload) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Fetch organizer details
    const organizer = await prisma.organizer.findUnique({
      where: { id: payload.organizerId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!organizer) {
      return NextResponse.json(
        { error: "Organizer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      organizer,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
