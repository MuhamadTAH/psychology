/**
 * 🧠 FILE PURPOSE
 * API endpoint to fetch fresh Dark Psychology lessons from file system.
 * This bypasses Next.js module caching to get the latest edited data.
 * 
 * 🔒 SECURITY FEATURES:
 * - Rate limiting (Standard endpoint - 30 req/min per IP)
 * - Path traversal prevention (safe file operations)
 * - No eval() or dynamic code execution
 * - OWASP-compliant security headers
 */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { auth } from "@clerk/nextjs/server";
import {
  rateLimit,
  createRateLimitResponse,
  getRateLimitHeaders,
} from "@/lib/security";
import { SECURITY_HEADERS } from "@/lib/security/headers";

export async function GET(request: NextRequest) {
  try {
    // 🔒 SECURITY: Get user ID for rate limiting (if authenticated)
    let userId: string | null = null;
    try {
      const { userId: authUserId } = await auth();
      userId = authUserId;
    } catch {
      // Not authenticated - will use IP-based rate limiting only
    }

    // 🔒 SECURITY: Apply rate limiting
    const rateLimitResult = rateLimit(request.headers, userId, 'standard', '/api/get-dark-psychology-lessons');

    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(rateLimitResult);
    }

    // 🔒 SECURITY: Use safe path construction (prevent path traversal)
    const libDir = path.join(process.cwd(), "lib");
    const filePath = path.join(libDir, "darkPsychologyLessons.ts");

    // Verify the path is within expected directory
    if (!filePath.startsWith(libDir)) {
      return NextResponse.json(
        { error: "Invalid file path" },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    // Step 1: Read the darkPsychologyLessons.ts file
    let fileContent: string;
    try {
      fileContent = fs.readFileSync(filePath, "utf-8");
    } catch {
      return NextResponse.json(
        { error: "Could not read lessons file" },
        { status: 500, headers: SECURITY_HEADERS }
      );
    }

    // Step 2: Extract the lessons array
    const arrayStartIndex = fileContent.indexOf("[", fileContent.indexOf("export const DARK_PSYCHOLOGY_LESSONS"));
    const arrayEndIndex = fileContent.lastIndexOf("];");

    if (arrayStartIndex === -1 || arrayEndIndex === -1) {
      return NextResponse.json(
        { error: "Could not parse lessons file" },
        { status: 500, headers: SECURITY_HEADERS }
      );
    }

    const arrayContent = fileContent.substring(arrayStartIndex + 1, arrayEndIndex);

    // Step 3: Parse lessons from the array using JSON.parse
    // 🔒 SECURITY: Use safe JSON parsing, no eval()
    const lessons: unknown[] = [];

    // Find all lesson objects by looking for top-level object boundaries
    let depth = 0;
    let currentStart = -1;
    let inString = false;
    let escapeNext = false;

    for (let i = 0; i < arrayContent.length; i++) {
      const char = arrayContent[i];

      // Handle string boundaries
      if (char === '"' && !escapeNext) {
        inString = !inString;
      }

      // Handle escape sequences
      if (char === '\\' && !escapeNext) {
        escapeNext = true;
        continue;
      } else {
        escapeNext = false;
      }

      // Track depth only outside strings
      if (!inString) {
        if (char === '{') {
          if (depth === 0) {
            currentStart = i;
          }
          depth++;
        } else if (char === '}') {
          depth--;
          if (depth === 0 && currentStart !== -1) {
            const lessonStr = arrayContent.substring(currentStart, i + 1);
            try {
              const lesson = JSON.parse(lessonStr);
              lessons.push(lesson);
            } catch {
              // Error parsing lesson - skip it
            }
            currentStart = -1;
          }
        }
      }
    }

    // 🔒 SECURITY: Include rate limit headers in response
    const rateLimitHeaders = getRateLimitHeaders(rateLimitResult);

    // Step 4: Return the fresh lessons
    return NextResponse.json(
      { lessons },
      {
        headers: {
          ...SECURITY_HEADERS,
          ...rateLimitHeaders,
        },
      }
    );

  } catch (error) {
    console.error("[GET-LESSONS] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch lessons",
        details: process.env.NODE_ENV === 'development' && error instanceof Error
          ? error.message
          : "Unknown error"
      },
      { status: 500, headers: SECURITY_HEADERS }
    );
  }
}

// ✅ This API endpoint with security hardening:
// - Rate limiting (30 req/min per IP)
// - No eval() - uses safe JSON parsing
// - Path traversal prevention
// - OWASP-compliant security headers
