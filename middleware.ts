/**
 * GAMPIT — WAITLIST LOCKDOWN MIDDLEWARE
 *
 * Security Model:
 *  - "/" is fully public (the Waitlist page).
 *  - EVERY other route is locked down.
 *  - Two admin bypass mechanisms:
 *      A) Secret cookie → set via GET /api/unlock?secret=<ADMIN_UNLOCK_SECRET>
 *      B) Admin email   → Clerk session email matches ADMIN_EMAIL env var.
 *  - Static assets, Next.js internals, and the unlock API are always allowed.
 */

import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const BYPASS_COOKIE = "__gampit_dev_bypass";

/** Exact pathnames that are always public. */
const PUBLIC_EXACT = new Set(["/", "/api/unlock", "/api/webhook"]);

/** Pathname prefixes that are always allowed (PWA assets, fonts, etc.). */
const PUBLIC_PREFIXES = [
  "/_next/",
  "/favicon",
  "/icons/",
  "/images/",
  "/fonts/",
  "/manifest",
  "/sw.js",
  "/workbox-",
];

function isPublic(pathname: string): boolean {
  if (PUBLIC_EXACT.has(pathname)) return true;
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // Always-public paths go straight through.
  if (isPublic(pathname)) return NextResponse.next();

  // ── Bypass A: HttpOnly cookie set by /api/unlock ──────────────────────────
  const bypassCookie = req.cookies.get(BYPASS_COOKIE);
  if (bypassCookie?.value === "1") return NextResponse.next();

  // ── Bypass B: Admin email via Clerk session ───────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (adminEmail) {
    try {
      const { sessionClaims } = await auth();
      const claims = sessionClaims as Record<string, unknown> | null;
      const userEmail =
        (claims?.email as string | undefined)?.trim().toLowerCase();
      if (userEmail && userEmail === adminEmail) return NextResponse.next();
    } catch {
      // Auth failure is non-fatal — fall through to redirect.
    }
  }

  // ── LOCKDOWN: redirect everyone else back to the Waitlist ─────────────────
  const dest = req.nextUrl.clone();
  dest.pathname = "/";
  dest.search = "";
  return NextResponse.redirect(dest);
});

export const config = {
  matcher: [
    // All routes except Next.js internals and static file extensions
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|eot|mp4|webm|ogg|mp3|wav)).*)",
    "/(api|trpc)(.*)",
  ],
};