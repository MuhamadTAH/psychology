// 🧠 FILE PURPOSE
// API endpoint to delete a Dark Psychology lesson by lesson number.
// Reads the file, removes the lesson, and saves the updated array.

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    // Step 1: Get lesson identifier from request
    // ✅ FIX: Accept both lessonNumber and lessonId
    const { lessonNumber, lessonId } = await request.json();

    if (!lessonNumber && !lessonId) {
      return NextResponse.json({ error: "Lesson number or ID is required" }, { status: 400 });
    }

    // Step 2: Read the current darkPsychologyLessons.ts file
    const filePath = path.join(process.cwd(), "lib", "darkPsychologyLessons.ts");
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Step 3: Extract everything before and after the lessons array
    const beforeArray = fileContent.substring(0, fileContent.indexOf("export const DARK_PSYCHOLOGY_LESSONS"));
    const arrayStartIndex = fileContent.indexOf("[", fileContent.indexOf("export const DARK_PSYCHOLOGY_LESSONS"));
    const arrayEndIndex = fileContent.lastIndexOf("];");

    const arrayContent = fileContent.substring(arrayStartIndex + 1, arrayEndIndex);

    // Step 4: Parse lessons from the array (naive JSON parsing)
    // Find all lesson objects by their boundaries
    const lessons: any[] = [];
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
          try {
            // Replace unquoted keys with quoted keys for valid JSON
            const jsonText = lessonText
              .replace(/(\w+):/g, '"$1":')
              .replace(/"(\d+)":/g, '$1:'); // Keep numbers as keys if needed
            const lesson = eval('(' + lessonText + ')');
            lessons.push({ text: lessonText, data: lesson, start: currentLessonStart, end: i + 1 });
          } catch (e) {
            // Skip invalid lessons
          }
          currentLessonStart = -1;
        }
      }
      i++;
    }

    // Step 5: Filter out the lesson to delete
    // ✅ FIX: Filter by lessonId first, then fall back to lessonNumber
    let filteredLessons;
    if (lessonId) {

      filteredLessons = lessons.filter(l => l.data.lessonId !== lessonId);

    } else {

      filteredLessons = lessons.filter(l => l.data.number !== lessonNumber);

    }

    if (filteredLessons.length === lessons.length) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
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

    return NextResponse.json({
      success: true,
      message: `Lesson ${lessonIdentifier} deleted successfully`
    });

  } catch (error) {

    return NextResponse.json({
      error: "Failed to delete lesson",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

// ✅ This API endpoint:
// - Receives lesson identifier (lessonId or lessonNumber)
// - Reads darkPsychologyLessons.ts
// - Removes the lesson with matching identifier (lessonId takes priority)
// - Saves the updated file
// - Supports both old (number-based) and new (ID-based) lesson identification
