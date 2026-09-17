import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export interface OrganizerJWTPayload {
  organizerId: string;
  role: "ORGANIZER";
  iat?: number;
  exp?: number;
}

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = "organizer_token";
const TOKEN_EXPIRY = "8h";

/** Sign a JWT for an organizer and return it as a string. */
export function signOrganizerJWT(organizerId: string): string {
  return jwt.sign(
    { organizerId, role: "ORGANIZER" } satisfies Omit<OrganizerJWTPayload, "iat" | "exp">,
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

/**
 * Verify the organizer JWT from the request cookie.
 * Returns the payload if valid, or null if missing/invalid/expired.
 */
export function verifyOrganizerJWT(
  request: NextRequest | Request
): OrganizerJWTPayload | null {
  try {
    const cookieHeader = request.headers.get("cookie") ?? "";
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
    if (!match) return null;

    const token = decodeURIComponent(match[1]);
    const payload = jwt.verify(token, JWT_SECRET) as OrganizerJWTPayload;

    if (payload.role !== "ORGANIZER") return null;
    return payload;
  } catch {
    return null;
  }
}

/** The cookie name used for the organizer JWT. */
export { COOKIE_NAME as ORGANIZER_COOKIE_NAME };
