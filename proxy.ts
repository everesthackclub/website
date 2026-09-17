import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyOrganizerJWT } from "@/app/lib/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /organizer routes (except /organizer/login)
  if (pathname.startsWith("/organizer") && pathname !== "/organizer/login") {
    const payload = verifyOrganizerJWT(request);

    if (!payload) {
      // Not authenticated - redirect to login
      const loginUrl = new URL("/organizer/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Authenticated - allow access
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Also export as default for compatibility
export default proxy;

export const config = {
  matcher: [
    "/organizer/:path*",
  ],
};
