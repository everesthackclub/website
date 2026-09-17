import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "desc" },
      select: {
        id: true,
        name: true,
        date: true,
        isActive: true,
      },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Events fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
