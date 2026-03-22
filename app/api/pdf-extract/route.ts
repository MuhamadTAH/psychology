/**
 * 🧠 FILE PURPOSE
 * PDF extraction endpoint - uploads PDF and extracts text using Python script.
 * 
 * 🔒 SECURITY FEATURES:
 * - Rate limiting (Upload endpoint - 5 req/min per IP)
 * - File type validation (PDF only)
 * - File size limits
 * - Path traversal prevention (safe temp file handling)
 * - Secure filename generation (UUID)
 * - OWASP-compliant security headers
 * 
 * ⚠️ SECURITY NOTE: This endpoint executes a Python script.
 * The script path is hardcoded to prevent command injection.
 */

import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@clerk/nextjs/server";
import {
  rateLimit,
  createRateLimitResponse,
  getRateLimitHeaders,
} from "@/lib/security";
import { SECURITY_HEADERS } from "@/lib/security/headers";

// 🔒 SECURITY: Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// 🔒 SECURITY: Allowed MIME types
const ALLOWED_MIME_TYPES = ['application/pdf'];

// 🔒 SECURITY: Allowed file extensions
const ALLOWED_EXTENSIONS = ['.pdf'];

export async function POST(req: NextRequest) {
  let tempFilePath: string | null = null;

  try {
    // 🔒 SECURITY: Get user ID for rate limiting (if authenticated)
    let userId: string | null = null;
    try {
      const { userId: authUserId } = await auth();
      userId = authUserId;
    } catch {
      // Not authenticated - will use IP-based rate limiting only
    }

    // 🔒 SECURITY: Apply rate limiting (Upload endpoints are very restrictive)
    const rateLimitResult = rateLimit(req.headers, userId, 'upload', '/api/pdf-extract');

    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(rateLimitResult);
    }

    // Parse form data
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json(
        { status: "error", error: "Invalid form data" },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    const file = formData.get("pdf") as File | null;

    if (!file) {
      return NextResponse.json(
        { status: "error", error: "No file uploaded" },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    // 🔒 SECURITY: Validate file type by MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { status: "error", error: "Invalid file type. Only PDF files are allowed." },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    // 🔒 SECURITY: Validate file extension
    const fileExtension = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return NextResponse.json(
        { status: "error", error: "Invalid file extension. Only .pdf files are allowed." },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    // 🔒 SECURITY: Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { status: "error", error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.` },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    // 🔒 SECURITY: Read file and validate content
    let buffer: Buffer;
    try {
      buffer = Buffer.from(await file.arrayBuffer());
    } catch {
      return NextResponse.json(
        { status: "error", error: "Failed to read file" },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    // 🔒 SECURITY: Validate PDF magic bytes (PDF files start with %PDF-)
    const pdfMagicBytes = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2D]); // %PDF-
    if (buffer.length < 5 || !buffer.subarray(0, 5).equals(pdfMagicBytes)) {
      return NextResponse.json(
        { status: "error", error: "Invalid PDF file format" },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    // 🔒 SECURITY: Use safe path construction (prevent path traversal)
    const tempDir = path.join(process.cwd(), "temp");

    // Verify temp directory is within project
    if (!tempDir.startsWith(process.cwd())) {
      return NextResponse.json(
        { status: "error", error: "Invalid temp directory" },
        { status: 500, headers: SECURITY_HEADERS }
      );
    }

    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // 🔒 SECURITY: Use UUID for filename to prevent path injection
    const safeFilename = `${uuidv4()}.pdf`;
    tempFilePath = path.join(tempDir, safeFilename);

    // Verify the final path is within temp directory
    if (!tempFilePath.startsWith(tempDir)) {
      return NextResponse.json(
        { status: "error", error: "Invalid file path" },
        { status: 500, headers: SECURITY_HEADERS }
      );
    }

    // Write file to temp directory
    fs.writeFileSync(tempFilePath, buffer);

    try {
      const result = await runPythonExtractor(tempFilePath);

      // 🔒 SECURITY: Cleanup temp file immediately after use
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }

      // 🔒 SECURITY: Include rate limit headers in response
      const rateLimitHeaders = getRateLimitHeaders(rateLimitResult);

      return NextResponse.json(result, {
        headers: {
          ...SECURITY_HEADERS,
          ...rateLimitHeaders,
        },
      });
    } catch (error: unknown) {
      // 🔒 SECURITY: Cleanup temp file on error
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }

      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("[PDF-EXTRACT] Error:", errorMessage);

      return NextResponse.json(
        {
          status: "error",
          error: process.env.NODE_ENV === 'development' ? errorMessage : "Failed to extract PDF content"
        },
        { status: 500, headers: SECURITY_HEADERS }
      );
    }
  } catch (error: unknown) {
    // 🔒 SECURITY: Cleanup temp file on any error
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch {
        // Ignore cleanup errors
      }
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[PDF-EXTRACT] Unexpected error:", errorMessage);

    return NextResponse.json(
      {
        status: "error",
        error: process.env.NODE_ENV === 'development' ? errorMessage : "An error occurred"
      },
      { status: 500, headers: SECURITY_HEADERS }
    );
  }
}

/**
 * 🔒 SECURITY: Run Python extractor with hardcoded script path
 * The script path is hardcoded to prevent command injection attacks.
 * Only the file path is passed as an argument.
 */
function runPythonExtractor(filePath: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    // 🔒 SECURITY: Hardcode script path - never accept from user input
    const scriptPath = path.join(process.cwd(), "scripts", "pdf_extractor.py");

    // Verify script exists
    if (!fs.existsSync(scriptPath)) {
      reject(new Error("PDF extractor script not found"));
      return;
    }

    // Verify script is within project directory
    if (!scriptPath.startsWith(process.cwd())) {
      reject(new Error("Invalid script path"));
      return;
    }

    // 🔒 SECURITY: Only pass the file path as argument
    // The file path is already validated and uses a UUID filename
    const py = spawn("python", [scriptPath, filePath]);

    let data = "";
    let error = "";

    py.stdout.on("data", (chunk) => (data += chunk.toString()));
    py.stderr.on("data", (chunk) => (error += chunk.toString()));

    // 🔒 SECURITY: Set timeout to prevent long-running processes
    const timeout = setTimeout(() => {
      py.kill('SIGTERM');
      reject(new Error("PDF extraction timed out"));
    }, 60000); // 60 second timeout

    py.on("close", (code) => {
      clearTimeout(timeout);

      if (code === 0) {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error("Failed to parse Python output"));
        }
      } else {
        // 🔒 SECURITY: Don't expose full error in production
        const safeError = process.env.NODE_ENV === 'development'
          ? error || "Python script failed"
          : "PDF extraction failed";
        reject(new Error(safeError));
      }
    });

    py.on("error", (err) => {
      clearTimeout(timeout);
      reject(new Error(`Failed to start Python: ${err.message}`));
    });
  });
}

// ✅ This API endpoint with security hardening:
// - Rate limiting (5 uploads per minute per IP)
// - File type validation (MIME type, extension, magic bytes)
// - File size limits (10MB max)
// - UUID-based safe filenames
// - Path traversal prevention
// - Hardcoded script path (no command injection)
// - Process timeout (60s)
// - Proper temp file cleanup
// - OWASP-compliant security headers
