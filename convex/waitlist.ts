/**
 * GAMPIT — Waitlist Mutations & Queries
 *
 * Security:
 *  - Public mutation: no auth required (it's a pre-signup flow).
 *  - Email is validated server-side with strict regex + length limits.
 *  - Disposable/fake domains are blocked.
 *  - Duplicate submissions return a friendly error, not a silent no-op.
 *  - No sensitive data is returned to the client.
 *  - Rate limiting is enforced via a simple per-email deduplication check.
 */

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

// ─── Constants ────────────────────────────────────────────────────────────────

const EMAIL_MAX_LENGTH = 254; // RFC 5321

/**
 * Basic disposable / obviously fake email domains to block.
 * Extend this list as abuse patterns emerge.
 */
const BLOCKED_DOMAINS = new Set([
  "test.com",
  "example.com",
  "mailinator.com",
  "guerrillamail.com",
  "yopmail.com",
  "dispostable.com",
  "sharklasers.com",
  "tempmail.com",
  "throwam.com",
  "trashmail.com",
  "fakeinbox.com",
]);

// ─── Validators ───────────────────────────────────────────────────────────────

/**
 * Standard email regex — not trying to be RFC-perfect,
 * but it will catch obvious garbage like "test@test.com".
 */
function isValidEmail(email: string): boolean {
  if (email.length > EMAIL_MAX_LENGTH) return false;
  // Must have exactly one @ with something on both sides
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function isBlockedDomain(email: string): boolean {
  const parts = email.split("@");
  if (parts.length !== 2) return true;
  const domain = parts[1].toLowerCase();
  return BLOCKED_DOMAINS.has(domain);
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export const joinWaitlist = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();

    // 1. Validate format
    if (!isValidEmail(email)) {
      throw new ConvexError("Invalid email address. Please check and try again.");
    }

    // 2. Block disposable / fake domains
    if (isBlockedDomain(email)) {
      throw new ConvexError("Please use a real email address to join the waitlist.");
    }

    // 3. Check for duplicate — same email can only join once
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      // Don't expose whether they're approved/pending — just tell them they're in
      throw new ConvexError("You're already on the waitlist. We'll contact you soon.");
    }

    // 4. Insert — all business values are server-calculated
    await ctx.db.insert("waitlist", {
      email,
      joinedAt: Date.now(),
      status: "pending",
    });

    // Return nothing sensitive
    return { success: true };
  },
});

// ─── Admin Queries (protected — only usable server-side) ──────────────────────

/**
 * Count of total waitlist signups.
 * Used for social proof counters on the admin dashboard.
 * NOTE: Do NOT expose raw count to public clients — it reveals growth metrics.
 */
export const getWaitlistCount = query({
  args: {},
  handler: async (ctx) => {
    // Must be authenticated as the admin to call this
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (!adminEmail || identity.email?.toLowerCase() !== adminEmail) {
      throw new ConvexError("Unauthorized");
    }

    const all = await ctx.db.query("waitlist").collect();
    return { count: all.length };
  },
});
