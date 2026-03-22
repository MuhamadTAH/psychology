/**
 * 🧠 FILE PURPOSE
 * API route to save new Dark Psychology lessons to the file system.
 * Handles both simple and complex JSON formats, transforming them to standard structure.
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
  validateInput,
  ADD_LESSON_SCHEMA,
} from "@/lib/security";
import { SECURITY_HEADERS } from "@/lib/security/headers";

// Step 1: Transform complex lesson JSON to flat practice array
// Converts stages-based structure to simple practice questions
function transformLessonData(rawData: unknown) {
  // 🔒 SECURITY: Type check input
  if (typeof rawData !== 'object' || rawData === null) {
    throw new Error("Invalid lesson data format");
  }

  const data = rawData as Record<string, unknown>;

  // Check if this is the new comprehensive format (has sectionId and contentScreens)
  if (data.sectionId && data.contentScreens) {
    return processComprehensiveFormat(data);
  }

  // Check if this is the complex format (has lessons array with stages)
  if (data.lessons && Array.isArray(data.lessons)) {
    // Process each lesson in the lessons array
    return data.lessons.map((lesson: Record<string, unknown>) => {
      const practiceQuestions: unknown[] = [];

      // Extract all exercises from all stages
      if (lesson.stages && Array.isArray(lesson.stages)) {
        lesson.stages.forEach((stage: Record<string, unknown>) => {
          // Process exercises from Learn stage
          if (stage.exercises && Array.isArray(stage.exercises)) {
            stage.exercises.forEach((exercise: unknown) => {
              const converted = convertExerciseToQuestion(exercise);
              if (converted) practiceQuestions.push(converted);
            });
          }

          // Process scenarios from Apply stage
          if (stage.scenarios && Array.isArray(stage.scenarios)) {
            stage.scenarios.forEach((scenario: unknown) => {
              const converted = convertScenarioToQuestion(scenario);
              if (converted) practiceQuestions.push(converted);
            });
          }

          // Process activities from Challenge stage
          if (stage.activities && Array.isArray(stage.activities)) {
            stage.activities.forEach((activity: unknown) => {
              const converted = convertActivityToQuestion(activity);
              if (converted) practiceQuestions.push(converted);
            });
          }
        });
      }

      // Detect if this is a multi-part lesson based on stages
      const stages = lesson.stages || [];
      const totalParts = Array.isArray(stages) ? stages.length : 0;
      const hasParts = totalParts > 1;

      // If multi-part, organize questions by stage
      let parts: unknown[] | undefined;
      if (hasParts && Array.isArray(lesson.stages)) {
        parts = lesson.stages.map((stage: Record<string, unknown>, index: number) => {
          const partQuestions: unknown[] = [];

          // Collect all questions from this stage
          if (stage.exercises && Array.isArray(stage.exercises)) {
            stage.exercises.forEach((ex: unknown) => {
              const converted = convertExerciseToQuestion(ex);
              if (converted) partQuestions.push(converted);
            });
          }
          if (stage.scenarios && Array.isArray(stage.scenarios)) {
            stage.scenarios.forEach((sc: unknown) => {
              const converted = convertScenarioToQuestion(sc);
              if (converted) partQuestions.push(converted);
            });
          }
          if (stage.activities && Array.isArray(stage.activities)) {
            stage.activities.forEach((act: unknown) => {
              const converted = convertActivityToQuestion(act);
              if (converted) partQuestions.push(converted);
            });
          }

          return {
            partNumber: index + 1,
            partTitle: stage.type || `Part ${index + 1}`,
            questions: partQuestions
          };
        });
      }

      return {
        number: lesson.lessonNumber,
        title: lesson.title,
        practice: practiceQuestions,
        ...(hasParts && { parts, totalParts })
      };
    });
  }

  // If it's already in simple format, return as array
  if (data.number && data.title && data.practice) {
    return [data];
  }

  throw new Error("Invalid lesson format");
}

// Step 1.5: Process comprehensive format with contentScreens
// Extracts exercises from contentScreens and preserves all metadata
function processComprehensiveFormat(data: Record<string, unknown>): unknown[] {
  const questions: unknown[] = [];

  // Extract all exercises from contentScreens
  if (data.contentScreens && Array.isArray(data.contentScreens)) {
    data.contentScreens.forEach((screen: Record<string, unknown>) => {
      // Process exercises array in screen
      if (screen.exercises && Array.isArray(screen.exercises)) {
        screen.exercises.forEach((exercise: unknown) => {
          const converted = convertComprehensiveExercise(exercise);
          if (converted) questions.push(converted);
        });
      }
    });
  }

  // Step: Extract lesson number from lessonId (e.g., "A1-2" -> 2)
  let lessonNumber = 1;
  if (data.lessonId && typeof data.lessonId === 'string') {
    const match = data.lessonId.match(/-(\d+)$/);
    if (match) {
      lessonNumber = parseInt(match[1]);
    }
  } else if (typeof data.lessonPart === 'number') {
    lessonNumber = data.lessonPart;
  }

  return [{
    number: lessonNumber,
    title: data.lessonTitle || "Untitled Lesson",
    section: data.sectionId || "A",

    // Comprehensive metadata
    sectionId: data.sectionId,
    sectionTitle: data.sectionTitle,
    unitId: data.unitId,
    unitTitle: data.unitTitle,
    lessonId: data.lessonId,
    lessonTitle: data.lessonTitle,
    lessonType: data.lessonType,
    lessonPart: data.lessonPart,
    lessonPartTitle: data.lessonPartTitle,
    objective: data.objective,
    gamification: data.gamification,

    // Practice questions and original content
    practice: questions,
    contentScreens: data.contentScreens
  }];
}

// Step 1.5.5: Convert explanation to feedback format
// If exercise has 'explanation' but no 'feedback', create feedback object
function convertExplanationToFeedback(exercise: Record<string, unknown>): Record<string, unknown> {
  // If feedback already exists, use it
  if (exercise.feedback && typeof exercise.feedback === 'object') {
    return { feedback: exercise.feedback };
  }

  // If explanation exists, convert it to feedback format
  if (exercise.explanation && typeof exercise.explanation === 'string') {
    return {
      feedback: {
        correct: `Correct! ${exercise.explanation}`,
        incorrect: `Incorrect. ${exercise.explanation}`
      }
    };
  }

  // No feedback or explanation - return empty object
  return {};
}

// Step 1.6: Convert comprehensive format exercises
// Handles all new exercise types from contentScreens
function convertComprehensiveExercise(exercise: unknown): unknown {
  if (!exercise || typeof exercise !== 'object') return null;
  const ex = exercise as Record<string, unknown>;
  if (!ex.type) return null;

  // Convert explanation to feedback format
  const feedbackData = convertExplanationToFeedback(ex);

  switch (ex.type) {
    case "multiple-choice": {
      const options = Array.isArray(ex.options) ? ex.options : [];
      const mcOptions = options.map((opt: string, idx: number) => ({
        id: String.fromCharCode(65 + idx),
        text: opt
      }));

      let mcCorrectAnswer = "A";
      if (typeof ex.correct === 'string' && ex.correct.length === 1) {
        mcCorrectAnswer = ex.correct;
      } else {
        const correctIndex = options.indexOf(ex.correct);
        if (correctIndex >= 0) {
          mcCorrectAnswer = String.fromCharCode(65 + correctIndex);
        }
      }

      return {
        ...feedbackData,
        type: "multiple-choice",
        question: ex.question,
        options: mcOptions,
        correctAnswer: mcCorrectAnswer
      };
    }

    case "true-false": {
      // Handle both 'question' and 'statement' fields
      const tfQuestion = ex.question || ex.statement || "True or False?";

      return {
        ...feedbackData,
        type: "multiple-choice",
        question: tfQuestion,
        options: [
          { id: "A", text: "True" },
          { id: "B", text: "False" }
        ],
        correctAnswer: ex.correct === "True" ? "A" : "B"
      };
    }

    case "matching": {
      // Step: Handle matching pairs - keep as array format
      let pairs: unknown;

      // If pairs are provided directly (array format)
      if (ex.pairs && Array.isArray(ex.pairs)) {
        pairs = ex.pairs;
      }
      // Legacy format: build from correct/options arrays
      else if (Array.isArray(ex.correct) && Array.isArray(ex.options)) {
        const pairsObj: Record<string, string> = {};
        ex.options.forEach((key: string, index: number) => {
          if ((ex.correct as string[])[index]) {
            pairsObj[key] = (ex.correct as string[])[index];
          }
        });
        pairs = pairsObj;
      }
      // Legacy format: parse from string
      else if (typeof ex.correct === 'string') {
        pairs = parseMatchingPairs(ex.correct);
      }

      return {
        ...feedbackData,
        type: "matching",
        question: ex.question,
        pairs: pairs
      };
    }

    case "fill-in": {
      // Step 1: Handle 'correct', 'answer', or 'answers' fields
      // This supports both single-blank and multi-blank questions
      const correctValue = ex.correct || ex.answer || ex.answers;

      // Step 2: Preserve all answers for multi-blank questions
      // Convert single answer to array format for consistency
      const fillInCorrectAnswers = Array.isArray(correctValue)
        ? correctValue
        : [correctValue];

      // Step 3: Handle 'options' or 'wrongOptions' fields
      // Filter out correct answers from the options to get wrong options only
      const optionsValue = ex.options || ex.wrongOptions || [];

      const fillInWrongOptions = Array.isArray(optionsValue)
        ? (optionsValue as string[]).filter((o: string) =>
          Array.isArray(correctValue)
            ? !(correctValue as string[]).includes(o)
            : o !== correctValue
        )
        : [];

      // Step 4: Build the new format (fillInOptions + answers)
      // This supports the FillInBlankQuestion component's new format
      const allOptions = [...fillInCorrectAnswers, ...fillInWrongOptions];

      return {
        ...feedbackData,
        type: "fill-in-blank",
        sentence: ex.question || ex.sentence,
        fillInOptions: allOptions,  // All options (correct + wrong) for fill-in questions
        answers: fillInCorrectAnswers,  // Multiple correct answers
        // Legacy support - keep single correctAnswer for backward compatibility
        correctAnswer: fillInCorrectAnswers[0],
        wrongOptions: fillInWrongOptions
      };
    }

    case "scenario": {
      const options = Array.isArray(ex.options) ? ex.options : [];
      return {
        ...feedbackData,
        type: "multiple-choice",
        question: ex.scene ? `${ex.scene}\n\n${ex.question}` : ex.question,
        options: options.map((opt: string, idx: number) => ({
          id: String.fromCharCode(65 + idx),
          text: opt
        })),
        correctAnswer: String.fromCharCode(65 + (options.indexOf(ex.correct) || 0))
      };
    }

    case "reverse-scenario": {
      const options = Array.isArray(ex.options) ? ex.options : [];
      return {
        ...feedbackData,
        type: "multiple-choice",
        question: ex.scene ? `[Reverse Scenario]\n${ex.scene}\n\n${ex.question}` : ex.question,
        options: options.map((opt: string, idx: number) => ({
          id: String.fromCharCode(65 + idx),
          text: opt
        })),
        correctAnswer: String.fromCharCode(65 + (options.indexOf(ex.correct) || 0))
      };
    }

    case "ethical-dilemma": {
      const options = Array.isArray(ex.options) ? ex.options : [];
      return {
        ...feedbackData,
        type: "multiple-choice",
        question: ex.dilemma ? `[Ethical Dilemma]\n${ex.dilemma}\n\n${ex.question}` : ex.question,
        options: options.map((opt: string, idx: number) => ({
          id: String.fromCharCode(65 + idx),
          text: opt
        })),
        correctAnswer: String.fromCharCode(65 + (options.indexOf(ex.correct) || 0))
      };
    }

    case "micro-sim": {
      // Multi-step scenarios - for now, extract first step
      if (ex.steps && Array.isArray(ex.steps) && ex.steps.length > 0) {
        const firstStep = ex.steps[0] as Record<string, unknown>;
        const options = Array.isArray(firstStep.options) ? firstStep.options : [];
        return {
          ...feedbackData,
          type: "multiple-choice",
          question: `[Micro Simulation - Step 1]\n${firstStep.situation}\n\n${firstStep.question}`,
          options: options.map((opt: string, idx: number) => ({
            id: String.fromCharCode(65 + idx),
            text: opt
          })),
          correctAnswer: String.fromCharCode(65 + (options.indexOf(firstStep.correct) || 0))
        };
      }
      return null;
    }

    case "case-analysis": {
      const options = Array.isArray(ex.options) ? ex.options : [];
      return {
        ...feedbackData,
        type: "multiple-choice",
        question: ex.case ? `[Case Analysis]\n${ex.case}\n\n${ex.question}` : ex.question,
        options: options.map((opt: string, idx: number) => ({
          id: String.fromCharCode(65 + idx),
          text: opt
        })),
        correctAnswer: String.fromCharCode(65 + (options.indexOf(ex.correct) || 0))
      };
    }

    case "build-sentence":
      return {
        ...feedbackData,
        type: "sentence-building",
        question: ex.prompt || "Arrange the words to make a sentence",
        words: ex.words || [],
        correctSentence: ex.correct
      };

    case "boss-scenario": {
      const options = Array.isArray(ex.options) ? ex.options : [];
      return {
        ...feedbackData,
        type: "multiple-choice",
        question: `[Boss Challenge]\n${ex.scene}\n\n${ex.question}`,
        options: options.map((opt: string, idx: number) => ({
          id: String.fromCharCode(65 + idx),
          text: opt
        })),
        correctAnswer: String.fromCharCode(65 + (options.indexOf(ex.correct) || 0))
      };
    }

    default:
      return null;
  }
}

// Step 2: Convert different exercise types to standard question format
function convertExerciseToQuestion(exercise: unknown): unknown {
  if (!exercise || typeof exercise !== 'object') return null;
  const ex = exercise as Record<string, unknown>;
  if (!ex.type) return null;

  // Convert explanation to feedback format
  const feedbackData = convertExplanationToFeedback(ex);

  switch (ex.type) {
    case "matching": {
      // Handle both array format and string format
      let pairs: Record<string, string> = {};

      if (Array.isArray(ex.correct) && Array.isArray(ex.options)) {
        // New format: options array + correct array
        ex.options.forEach((key: string, index: number) => {
          if ((ex.correct as string[])[index]) {
            pairs[key] = (ex.correct as string[])[index];
          }
        });
      } else if (typeof ex.correct === 'string') {
        // Old format: semicolon-separated string
        pairs = parseMatchingPairs(ex.correct);
      }

      return {
        ...feedbackData,
        type: "matching",
        question: ex.question,
        pairs: pairs
      };
    }

    case "true-false": {
      // Handle both 'question' and 'statement' fields
      const tfQuestion = ex.question || ex.statement || "True or False?";

      return {
        ...feedbackData,
        type: "multiple-choice",
        question: tfQuestion,
        options: [
          { id: "A", text: "True" },
          { id: "B", text: "False" }
        ],
        correctAnswer: ex.correct === "True" ? "A" : "B"
      };
    }

    case "fill-in": {
      // Handle single answer or multiple answers
      const fillInAnswer = Array.isArray(ex.correct)
        ? (ex.correct as string[])[0] // For multi-blank, use first answer for now
        : ex.correct;

      const fillInWrongOptions = Array.isArray(ex.options)
        ? (ex.options as string[]).filter((o: string) =>
          Array.isArray(ex.correct) ? !(ex.correct as string[]).includes(o) : o !== ex.correct
        )
        : [];

      return {
        ...feedbackData,
        type: "fill-in-blank",
        sentence: ex.question,
        correctAnswer: fillInAnswer,
        wrongOptions: fillInWrongOptions
      };
    }

    case "multiple-choice": {
      const options = Array.isArray(ex.options) ? ex.options : [];
      const mcOptions = options.map((opt: string, idx: number) => ({
        id: String.fromCharCode(65 + idx),
        text: opt
      }));

      // Handle letter-based answer (A, B, C) or find correct option
      let mcCorrectAnswer = "A";
      if (typeof ex.correct === 'string' && ex.correct.length === 1 && ex.correct >= 'A' && ex.correct <= 'Z') {
        mcCorrectAnswer = ex.correct;
      } else {
        const correctIndex = options.indexOf(ex.correct);
        if (correctIndex >= 0) {
          mcCorrectAnswer = String.fromCharCode(65 + correctIndex);
        }
      }

      return {
        ...feedbackData,
        type: "multiple-choice",
        question: ex.question,
        options: mcOptions,
        correctAnswer: mcCorrectAnswer
      };
    }

    default:
      return null;
  }
}

// Step 3: Convert scenarios to questions
function convertScenarioToQuestion(scenario: unknown): unknown {
  if (!scenario || typeof scenario !== 'object') return null;
  const sc = scenario as Record<string, unknown>;

  // Convert explanation to feedback format
  const feedbackData = convertExplanationToFeedback(sc);

  if (sc.type === "conversation" || sc.type === "reverse-scenario") {
    // Skip conversation and reverse-scenario types for now
    return null;
  }

  const options = Array.isArray(sc.options) ? sc.options : [];
  return {
    ...feedbackData,
    type: "multiple-choice",
    question: sc.scene ? `${sc.scene}\n\n${sc.question}` : sc.question,
    options: options.map((opt: string, idx: number) => ({
      id: String.fromCharCode(65 + idx),
      text: opt
    })),
    correctAnswer: String.fromCharCode(65 + (options.indexOf(sc.correct) || 0))
  };
}

// Step 4: Convert activities to questions
function convertActivityToQuestion(activity: unknown): unknown {
  if (!activity || typeof activity !== 'object') return null;
  const act = activity as Record<string, unknown>;
  if (!act.type) return null;

  // Convert explanation to feedback format
  const feedbackData = convertExplanationToFeedback(act);

  switch (act.type) {
    case "build-sentence":
      return {
        ...feedbackData,
        type: "sentence-building",
        question: act.prompt,
        words: act.words || [],
        correctSentence: act.correct
      };

    case "boss-scenario": {
      const options = Array.isArray(act.options) ? act.options : [];
      return {
        ...feedbackData,
        type: "multiple-choice",
        question: `${act.scene}\n\n${act.question}`,
        options: options.map((opt: string, idx: number) => ({
          id: String.fromCharCode(65 + idx),
          text: opt
        })),
        correctAnswer: String.fromCharCode(65 + (options.indexOf(act.correct) || 0))
      };
    }

    case "rapid-fire":
      // Skip rapid-fire for now
      return null;

    default:
      return null;
  }
}

// Step 5: Parse matching pairs from string format
function parseMatchingPairs(correctString: string): Record<string, string> {
  const pairs: Record<string, string> = {};
  const items = correctString.split(";").map(s => s.trim());

  items.forEach(item => {
    const [key, value] = item.split(":").map(s => s.trim());
    if (key && value) {
      pairs[key] = value;
    }
  });

  return pairs;
}

// 🔒 SECURITY: Safe JSON parsing for lesson content (replaces eval())
function safeParseLessonContent(content: string): unknown | null {
  try {
    // Attempt to parse as JSON
    return JSON.parse(content);
  } catch {
    // If JSON parsing fails, try to extract JSON from potential JS object literal
    // This handles cases where lessons were written as JS objects
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

// ✅ Transformation functions ready - can handle both simple and complex JSON formats

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
    const rateLimitResult = rateLimit(request.headers, userId, 'admin', '/api/add-dark-psychology-lesson');

    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(rateLimitResult);
    }

    // Step 6: Parse the incoming lesson data and transform it
    let rawData: unknown;
    try {
      rawData = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    // 🔒 SECURITY: Validate input structure (non-strict mode for flexible lesson structure)
    const validationResult = validateInput(rawData, ADD_LESSON_SCHEMA, { strictMode: false });
    if (!validationResult.valid) {
      return NextResponse.json(
        { error: "Validation Error", details: validationResult.errors },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    const lessons = transformLessonData(rawData) as Array<Record<string, unknown>>;

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

    // Step 7: Read the current darkPsychologyLessons.ts file
    let fileContent: string;
    try {
      fileContent = fs.readFileSync(filePath, "utf-8");
    } catch {
      return NextResponse.json(
        { error: "Could not read lessons file" },
        { status: 500, headers: SECURITY_HEADERS }
      );
    }

    // Step 8: Extract the current lessons array
    const arrayMatch = fileContent.match(/export const DARK_PSYCHOLOGY_LESSONS: DarkPsychologyLesson\[\] = \[([\s\S]*?)\];/);

    if (!arrayMatch) {
      return NextResponse.json(
        { error: "Could not parse lessons file" },
        { status: 500, headers: SECURITY_HEADERS }
      );
    }

    let lessonsArrayContent = arrayMatch[1].trim();

    // Step 8.5: Parse existing lessons to check for lessonId matches
    // 🔒 SECURITY: Use safe JSON parsing instead of eval()
    const existingLessons: Array<{ text: string; data: Record<string, unknown> }> = [];

    // If there are existing lessons, parse them
    if (lessonsArrayContent && lessonsArrayContent.trim().length > 0) {
      // Remove comments and extract JSON objects
      const cleanContent = lessonsArrayContent
        .replace(/\/\/[^\n]*/g, '') // Remove single-line comments
        .trim();

      // Split by "},{" to get individual lessons (rough split)
      let currentDepth = 0;
      let currentLessonStart = -1;
      let i = 0;

      while (i < cleanContent.length) {
        if (cleanContent[i] === '{') {
          if (currentDepth === 0) currentLessonStart = i;
          currentDepth++;
        } else if (cleanContent[i] === '}') {
          currentDepth--;
          if (currentDepth === 0 && currentLessonStart !== -1) {
            const lessonText = cleanContent.substring(currentLessonStart, i + 1);
            // 🔒 SECURITY: Use safe JSON parsing instead of eval()
            const lesson = safeParseLessonContent(lessonText);
            if (lesson && typeof lesson === 'object') {
              existingLessons.push({ text: lessonText, data: lesson as Record<string, unknown> });
            }
            currentLessonStart = -1;
          }
        }
        i++;
      }
    }

    // Step 9: Process new lessons - merge parts or add new
    lessons.forEach((newLesson: Record<string, unknown>) => {
      // Check if this is a part of an existing lesson (based on lessonId)
      const existingLessonIndex = existingLessons.findIndex(
        l => l.data.lessonId && newLesson.lessonId && l.data.lessonId === newLesson.lessonId
      );

      if (existingLessonIndex !== -1) {
        // MERGE: This is a new part for an existing lesson
        const existingLesson = existingLessons[existingLessonIndex].data;

        // Initialize parts array if it doesn't exist
        if (!existingLesson.parts) {
          existingLesson.parts = [];
          existingLesson.totalParts = 0;
        }

        // Add the new part
        const partNumber = (newLesson.lessonPart as number) || ((existingLesson.parts as unknown[]).length + 1);
        (existingLesson.parts as unknown[]).push({
          partNumber: partNumber,
          partTitle: newLesson.lessonPartTitle || `Part ${partNumber}`,
          questions: newLesson.practice || []
        });

        // Update totalParts
        existingLesson.totalParts = (existingLesson.parts as unknown[]).length;

        // Merge practice questions
        existingLesson.practice = existingLesson.practice || [];
        if (newLesson.practice && Array.isArray(newLesson.practice)) {
          (existingLesson.practice as unknown[]).push(...newLesson.practice);
        }

        // Update the lesson in the array
        existingLessons[existingLessonIndex].data = existingLesson;
        existingLessons[existingLessonIndex].text = JSON.stringify(existingLesson, null, 2);

      } else {
        // NEW LESSON: Add as new entry
        // Use the lesson number already set in newLesson (extracted from lessonId in processComprehensiveFormat)

        // If this is part 1 of a multi-part lesson, initialize parts array
        if (newLesson.lessonPart === 1) {
          newLesson.parts = [{
            partNumber: 1,
            partTitle: newLesson.lessonPartTitle || "Part 1",
            questions: newLesson.practice || []
          }];
          newLesson.totalParts = 1;
        }

        existingLessons.push({
          text: JSON.stringify(newLesson, null, 2),
          data: newLesson
        });
      }
    });

    // Step 10: Rebuild lessonsArrayContent from updated lessons
    lessonsArrayContent = "";
    existingLessons.forEach((lesson, index) => {
      if (index > 0) lessonsArrayContent += ",";
      lessonsArrayContent += `\n  // Lesson ${lesson.data.number}: ${lesson.data.title || lesson.data.lessonTitle}`;
      lessonsArrayContent += "\n  " + lesson.text.split('\n').map((line, i) => i === 0 ? line : '  ' + line).join('\n');
    });

    // Step 10: Generate the new file content with comprehensive interface
    const newFileContent = `// 🧠 FILE PURPOSE
// This file contains Dark Psychology lessons that all users can access.
// Lessons are added via the admin panel and stored here globally.

export interface LessonPart {
  partNumber: number;
  partTitle: string;
  questions: any[];
}

export interface DarkPsychologyLesson {
  // Legacy fields (backward compatibility)
  number: number;
  title: string;
  section: string; // A, B, C, or D
  practice: any[];
  parts?: LessonPart[];
  totalParts?: number;

  // New comprehensive structure
  sectionId?: string; // "A", "B", "C", "D"
  sectionTitle?: string; // "The Foundations of the Dark Mind"
  unitId?: string; // "A1", "A2", "B1"
  unitTitle?: string; // "The Unseen Influence"
  lessonId?: string; // "A1-1", "A1-2"
  lessonTitle?: string;
  lessonType?: string; // "Normal", "Boss", "Story"
  lessonPart?: number; // Which part this lesson belongs to
  lessonPartTitle?: string; // "Practice and Application"
  objective?: string;

  gamification?: {
    progressRings?: Array<{ringId: string, status: string, label: string}>;
    pointsValue?: number;
    starsAvailable?: number;
    badgeOnCompletion?: string;
  };

  contentScreens?: any[]; // Full screen-based content
}

export const SECTIONS = {
  A: "The Foundations of the Dark Mind",
  B: "Psychological Tactics",
  C: "Defense Strategies",
  D: "Ethical Applications"
};

export const DARK_PSYCHOLOGY_LESSONS: DarkPsychologyLesson[] = [${lessonsArrayContent}
];
`;

    // Step 11: Write back to the file
    fs.writeFileSync(filePath, newFileContent, "utf-8");

    // 🔒 SECURITY: Include rate limit headers in response
    const rateLimitHeaders = getRateLimitHeaders(rateLimitResult);

    return NextResponse.json(
      {
        success: true,
        message: `${lessons.length} lesson(s) added successfully`,
        lessonTitles: lessons.map((l: Record<string, unknown>) => l.title || l.lessonTitle)
      },
      {
        headers: {
          ...SECURITY_HEADERS,
          ...rateLimitHeaders,
        },
      }
    );

  } catch (error) {
    console.error("[ADD-LESSON] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to add lesson",
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
