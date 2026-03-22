/**
 * GAMPIT — DEV BYPASS SETTER
 *
 * GET /api/unlock?secret=<ADMIN_UNLOCK_SECRET>
 *
 * Security properties:
 *  - The secret is compared in constant-time to resist timing attacks.
 *  - The resulting cookie is HttpOnly (unforgeable from JS), Secure in prod,
 *    and SameSite=Lax.
 *  - No sensitive data is ever returned in the response body or headers.
 *  - A wrong secret returns a generic 401 with no clue about the correct value.
 *
 * To lock yourself out again:  GET /api/unlock?action=lock
 */

import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual, createHash } from "crypto";

const BYPASS_COOKIE = "__gampit_dev_bypass";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Constant-time string comparison.
 * Prevents timing-based secret enumeration.
 */
function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = createHash("sha256").update(a).digest();
    const bufB = createHash("sha256").update(b).digest();
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const secret = process.env.ADMIN_UNLOCK_SECRET;

  // If no secret is configured, this endpoint is disabled entirely.
  if (!secret || secret.trim() === "") {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 }
    );
  }

  const { searchParams } = req.nextUrl;

  // ── Lock action: clear the bypass cookie ──────────────────────────────────
  if (searchParams.get("action") === "lock") {
    const res = NextResponse.redirect(new URL("/", req.url));
    res.cookies.set(BYPASS_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // immediate expiry
      path: "/",
    });
    return res;
  }

  // ── Unlock action: validate secret and set cookie ─────────────────────────
  const providedSecret = searchParams.get("secret") ?? "";

  if (!safeCompare(providedSecret, secret.trim())) {
    // Generic error — do NOT hint about the secret format or value.
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Secret is valid — set the bypass cookie and redirect to the app root.
  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set(BYPASS_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return res;
}
