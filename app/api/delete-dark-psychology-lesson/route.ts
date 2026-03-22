/**
 * 🧠 FILE PURPOSE
 * API endpoint to delete a Dark Psychology lesson by lesson number or ID.
 * Reads the file, removes the lesson, and saves the updated array.
 * 
 * 🔒 SECURITY FEATURES:
 * - Rate limiting (Admin endpoint - 20 req/min per IP)
 * - Schema-based input validation
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
  parseAndValidateBody,
  DELETE_LESSON_SCHEMA,
} from "@/lib/security";
import { SECURITY_HEADERS } from "@/lib/security/headers";

// 🔒 SECURITY: Type for validated request body
interface DeleteLessonRequest {
  lessonNumber?: number;
  lessonId?: string;
}

// 🔒 SECURITY: Safe JSON parsing for lesson content (replaces eval())
function safeParseLessonContent(content: string): unknown | null {
  try {
    // Attempt to parse as JSON
    return JSON.parse(content);
  } catch {
    // If JSON parsing fails, try to extract JSON from potential JS object literal
    try {
      // Remove common JS patterns that aren't valid JSON
      const cleaned = content
        // Handle trailing commas
        .replace(/,(\s*[}\]])/g, '$1')
        // Handle unquoted keys (simple cases)
        .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');

      return JSON.parse(cleaned);
    } catch {
      return null;
    }
  }
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

    // 🔒 SECURITY: Apply rate limiting (Admin endpoints)
    const rateLimitResult = rateLimit(request.headers, userId, 'admin', '/api/delete-dark-psychology-lesson');

    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(rateLimitResult);
    }

    // Step 1: Get and validate lesson identifier from request
    const parseResult = await parseAndValidateBody<DeleteLessonRequest>(
      request,
      DELETE_LESSON_SCHEMA,
      { strictMode: true }
    );

    if (!parseResult.success) {
      return parseResult.response;
    }

    const { lessonNumber, lessonId } = parseResult.data;

    // 🔒 SECURITY: Ensure at least one identifier is provided
    if (!lessonNumber && !lessonId) {
      return NextResponse.json(
        { error: "Lesson number or ID is required" },
        { status: 400, headers: SECURITY_HEADERS }
      );
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

    // Step 2: Read the current darkPsychologyLessons.ts file
    let fileContent: string;
    try {
      fileContent = fs.readFileSync(filePath, "utf-8");
    } catch {
      return NextResponse.json(
        { error: "Could not read lessons file" },
        { status: 500, headers: SECURITY_HEADERS }
      );
    }

    // Step 3: Extract everything before and after the lessons array
    const beforeArray = fileContent.substring(0, fileContent.indexOf("export const DARK_PSYCHOLOGY_LESSONS"));
    const arrayStartIndex = fileContent.indexOf("[", fileContent.indexOf("export const DARK_PSYCHOLOGY_LESSONS"));
    const arrayEndIndex = fileContent.lastIndexOf("];");

    if (arrayStartIndex === -1 || arrayEndIndex === -1) {
      return NextResponse.json(
        { error: "Could not parse lessons file" },
        { status: 500, headers: SECURITY_HEADERS }
      );
    }

    const arrayContent = fileContent.substring(arrayStartIndex + 1, arrayEndIndex);

    // Step 4: Parse lessons from the array
    // 🔒 SECURITY: Use safe JSON parsing instead of eval()
    const lessons: Array<{ text: string; data: Record<string, unknown> }> = [];
    let currentDepth = 0;
    let currentLessonStart = -1;
    let i = 0;

    while (i < arrayContent.length) {
      if (arrayContent[i] === '{') {
        if (currentDepth === 0) {
          currentLessonStart = i;
        }
        currentDepth++;
      } else if (arrayContent[i] === '}') {
        currentDepth--;
        if (currentDepth === 0 && currentLessonStart !== -1) {
          const lessonText = arrayContent.substring(currentLessonStart, i + 1);
          // 🔒 SECURITY: Use safe JSON parsing instead of eval()
          const lesson = safeParseLessonContent(lessonText);
          if (lesson && typeof lesson === 'object') {
            lessons.push({ text: lessonText, data: lesson as Record<string, unknown> });
          }
          currentLessonStart = -1;
        }
      }
      i++;
    }

    // Step 5: Filter out the lesson to delete
    // 🔒 SECURITY: Filter by lessonId first, then fall back to lessonNumber
    let filteredLessons: typeof lessons;
    if (lessonId) {
      filteredLessons = lessons.filter(l => l.data.lessonId !== lessonId);
    } else {
      filteredLessons = lessons.filter(l => l.data.number !== lessonNumber);
    }

    if (filteredLessons.length === lessons.length) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404, headers: SECURITY_HEADERS }
      );
    }

    // Step 6: Rebuild the array content
    let newArrayContent = "";
    filteredLessons.forEach((lesson, index) => {
      if (index > 0) newArrayContent += ",";
      newArrayContent += "\n  " + lesson.text;
    });

    // Step 7: Write the new file content
    const newFileContent = beforeArray +
      "export const DARK_PSYCHOLOGY_LESSONS: DarkPsychologyLesson[] = [" +
      newArrayContent +
      "\n];\n";

    fs.writeFileSync(filePath, newFileContent, "utf-8");

    const lessonIdentifier = lessonId || lessonNumber;

    // 🔒 SECURITY: Include rate limit headers in response
    const rateLimitHeaders = getRateLimitHeaders(rateLimitResult);

    return NextResponse.json(
      {
        success: true,
        message: `Lesson ${lessonIdentifier} deleted successfully`
      },
      {
        headers: {
          ...SECURITY_HEADERS,
          ...rateLimitHeaders,
        },
      }
    );

  } catch (error) {
    console.error("[DELETE-LESSON] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to delete lesson",
        details: process.env.NODE_ENV === 'development' && error instanceof Error
          ? error.message
          : "Unknown error"
      },
      { status: 500, headers: SECURITY_HEADERS }
    );
  }
}

// ✅ This API endpoint with security hardening:
// - Rate limiting (20 req/min for admin endpoints)
// - Schema-based input validation
// - No eval() - uses safe JSON parsing
// - Path traversal prevention
// - OWASP-compliant security headers
