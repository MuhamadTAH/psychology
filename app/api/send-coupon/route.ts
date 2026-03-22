/**
 * 🧠 FILE PURPOSE
 * Send coupon email endpoint.
 * Sends discount codes to users via email.
 * 
 * 🔒 SECURITY FEATURES:
 * - Rate limiting (Email endpoint - 3 req/min per IP)
 * - Schema-based input validation with email validation
 * - Secure API key handling
 * - OWASP-compliant security headers
 * - XSS prevention through sanitization
 */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { auth } from "@clerk/nextjs/server";
import {
  rateLimit,
  createRateLimitResponse,
  getRateLimitHeaders,
  parseAndValidateBody,
  SEND_COUPON_SCHEMA,
  sanitizeString,
  getApiKey,
  createApiKeyErrorResponse,
} from "@/lib/security";
import { SECURITY_HEADERS } from "@/lib/security/headers";

// 🔒 SECURITY: Type for validated request body
interface SendCouponRequest {
  email: string;
  couponCode: string;
  name?: string;
}

export async function POST(request: NextRequest) {
  try {
    // 🔒 SECURITY: Get user ID for rate limiting (if authenticated)
    let userId: string | null = null;
    try {
      const { userId: authUserId } = await auth();
      userId = authUserId;
    } catch {
      // Not authenticated - will use IP-based rate limiting only
    }

    // 🔒 SECURITY: Apply rate limiting (Email endpoints are very restrictive)
    const rateLimitResult = rateLimit(request.headers, userId, 'email', '/api/send-coupon');

    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(rateLimitResult);
    }

    // 🔒 SECURITY: Validate and sanitize input
    const parseResult = await parseAndValidateBody<SendCouponRequest>(
      request,
      SEND_COUPON_SCHEMA,
      { strictMode: true }
    );

    if (!parseResult.success) {
      return parseResult.response;
    }

    const { email, couponCode, name } = parseResult.data;

    // 🔒 SECURITY: Check if Resend API key is configured
    const resendApiKey = getApiKey('RESEND_API_KEY');
    if (!resendApiKey) {
      return createApiKeyErrorResponse('RESEND_API_KEY');
    }

    const resend = new Resend(resendApiKey);

    // 🔒 SECURITY: Sanitize user name before including in email
    const sanitizedName = name ? sanitizeString(name) : null;
    const greeting = sanitizedName ? `Hi ${sanitizedName},` : "Hi there,";

    // 🔒 SECURITY: Sanitize coupon code (already validated by schema, but double-check)
    const sanitizedCouponCode = couponCode.replace(/[<>"'&]/g, '');

    const result = await resend.emails.send({
      // Use a verified or default sender; replace with your domain once verified in Resend.
      from: "GAMPIT <onboarding@resend.dev>",
      to: email,
      subject: "Your GAMPIT discount code",
      text: [
        greeting,
        "",
        "Here is your discount code for GAMPIT:",
        `Code: ${sanitizedCouponCode}`,
        "",
        "Use this code at checkout on the paywall to apply your discount.",
        "",
        "If you did not request this code, you can ignore this email.",
        "",
        "— GAMPIT Team",
      ].join("\n"),
    });

    // 🔒 SECURITY: Include rate limit headers in response
    const rateLimitHeaders = getRateLimitHeaders(rateLimitResult);

    return NextResponse.json(
      {
        success: true,
        id: result.data?.id ?? null,
      },
      {
        headers: {
          ...SECURITY_HEADERS,
          ...rateLimitHeaders,
        },
      }
    );
  } catch (error: unknown) {
    // 🔒 SECURITY: Don't expose internal error details
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[SEND-COUPON] Failed to send coupon email:", errorMessage);

    return NextResponse.json(
      { error: "Failed to send coupon email" },
      {
        status: 500,
        headers: SECURITY_HEADERS,
      }
    );
  }
}

// ✅ Send coupon endpoint with security hardening:
// 1. Rate limiting (Email - 3 req/min per IP)
// 2. Schema-based input validation with email validation
// 3. XSS prevention through sanitization
// 4. Secure API key handling
// 5. OWASP-compliant security headers
