// 🧠 FILE PURPOSE
// API endpoint to fetch fresh Dark Psychology lessons from file system.
// This bypasses Next.js module caching to get the latest edited data.

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // Step 1: Read the darkPsychologyLessons.ts file
    const filePath = path.join(process.cwd(), "lib", "darkPsychologyLessons.ts");
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Step 2: Extract the lessons array
    const arrayStartIndex = fileContent.indexOf("[", fileContent.indexOf("export const DARK_PSYCHOLOGY_LESSONS"));
    const arrayEndIndex = fileContent.lastIndexOf("];");

    if (arrayStartIndex === -1 || arrayEndIndex === -1) {
      return NextResponse.json({ error: "Could not parse lessons file" }, { status: 500 });
    }

    const arrayContent = fileContent.substring(arrayStartIndex + 1, arrayEndIndex);

    // Step 3: Parse lessons from the array using JSON.parse
    // Split by lesson comments to identify individual lessons
    const lessons: any[] = [];

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
            } catch (e) {

              );
            }
            currentStart = -1;
          }
        }
      }
    }

    // Step 4: Return the fresh lessons
    return NextResponse.json({ lessons });

  } catch (error) {

    return NextResponse.json({
      error: "Failed to fetch lessons",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

// ✅ This API endpoint:
// - Reads the darkPsychologyLessons.ts file directly from file system
// - Parses the lessons array
// - Returns fresh data, bypassing Next.js module cache
