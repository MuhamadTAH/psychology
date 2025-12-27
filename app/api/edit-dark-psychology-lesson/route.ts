// 🧠 FILE PURPOSE
// API endpoint to edit/update a Dark Psychology lesson.
// Finds the lesson by number and replaces it with updated data.

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    // Step 1: Get lesson identifier and updated data
    // ✅ FIX: Accept both lessonNumber and lessonId
    const { lessonNumber, lessonId, updatedLesson } = await request.json();

    if ((!lessonNumber && !lessonId) || !updatedLesson) {
      return NextResponse.json({ error: "Lesson number or ID and updated data required" }, { status: 400 });
    }
    // ✅ FIX: Validate lesson identifier hasn't changed
    if (lessonId) {
      if (updatedLesson.lessonId !== lessonId) {
        return NextResponse.json({ error: "Cannot change lesson ID" }, { status: 400 });
      }
    } else if (lessonNumber) {
      if (updatedLesson.number !== lessonNumber) {
        return NextResponse.json({ error: "Cannot change lesson number" }, { status: 400 });
      }
    }

    // Step 2: Read the current darkPsychologyLessons.ts file
    const filePath = path.join(process.cwd(), "lib", "darkPsychologyLessons.ts");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Database file not found" }, { status: 500 });
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    // Step 3: Extract everything before and after the lessons array
    const beforeArray = fileContent.substring(0, fileContent.indexOf("export const DARK_PSYCHOLOGY_LESSONS"));
    const arrayStartIndex = fileContent.indexOf("[", fileContent.indexOf("export const DARK_PSYCHOLOGY_LESSONS"));
    const arrayEndIndex = fileContent.lastIndexOf("];");

    const arrayContent = fileContent.substring(arrayStartIndex + 1, arrayEndIndex);

    // Step 4: Parse lessons from the array
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
            const lesson = eval('(' + lessonText + ')');
            lessons.push({ text: lessonText, data: lesson });
          } catch (e) {
            // Skip invalid lessons
          }
          currentLessonStart = -1;
        }
      }
      i++;
    }

    // Step 5: Find and replace the lesson
    // ✅ FIX: Find by lessonId first, then fall back to lessonNumber
    lessons.forEach((l, idx) => {
    });

    let lessonIndex = -1;
    if (lessonId) {
      lessonIndex = lessons.findIndex(l => {
        const match = String(l.data.lessonId) === String(lessonId);
        // 
        return match;
      });
    } else if (lessonNumber) {
      lessonIndex = lessons.findIndex(l => Number(l.data.number) === Number(lessonNumber));
    }

    if (lessonIndex === -1) {
      lessons.push({
        text: JSON.stringify(updatedLesson, null, 2),
        data: updatedLesson
      });
    } else {
      // Replace with updated lesson
      lessons[lessonIndex] = {
        text: JSON.stringify(updatedLesson, null, 2),
        data: updatedLesson
      };
    }

    // Step 6: Rebuild the array content
    let newArrayContent = "";
    lessons.forEach((lesson, index) => {
      if (index > 0) newArrayContent += ",";
      newArrayContent += "\n  // Lesson " + lesson.data.number + ": " + (lesson.data.title || lesson.data.lessonTitle);
      newArrayContent += "\n  " + lesson.text;
    });

    // Step 7: Write the new file content
    const newFileContent = beforeArray +
      "export const DARK_PSYCHOLOGY_LESSONS: DarkPsychologyLesson[] = [" +
      newArrayContent +
      "\n];\n";

    const lessonIdentifier = lessonId || lessonNumber;
    fs.writeFileSync(filePath, newFileContent, "utf-8");
    return NextResponse.json({
      success: true,
      message: `Lesson ${lessonIdentifier} updated successfully`
    });

  } catch (error) {
    return NextResponse.json({
      error: "Failed to edit lesson",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

// ✅ This API endpoint:
// - Receives lesson identifier (lessonId or lessonNumber) and updated lesson data
// - Finds the lesson in the file by lessonId first, then falls back to lessonNumber
// - Replaces it with new data
// - Saves the updated file
// - Supports both old (number-based) and new (ID-based) lesson identification
