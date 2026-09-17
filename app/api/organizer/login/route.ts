import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";
import { signOrganizerJWT, ORGANIZER_COOKIE_NAME } from "@/app/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find organizer by email
    const organizer = await prisma.organizer.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!organizer) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, organizer.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = signOrganizerJWT(organizer.id);

    // Create response with cookie
    const response = NextResponse.json(
      {
        success: true,
        organizer: {
          id: organizer.id,
          email: organizer.email,
          name: organizer.name,
        },
      },
      { status: 200 }
    );

    // Set HttpOnly cookie
    response.cookies.set({
      name: ORGANIZER_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
