import { NextResponse } from "next/server";
import { ORGANIZER_COOKIE_NAME } from "@/app/lib/auth";

export async function POST() {
  const response = NextResponse.json(
    { success: true, message: "Logged out successfully" },
    { status: 200 }
  );

  // Clear the organizer cookie
  response.cookies.set({
    name: ORGANIZER_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0, // Expire immediately
    path: "/",
  });

  return response;
}
