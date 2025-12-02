// 🧠 FILE PURPOSE
// API route to save new Dark Psychology lessons to the file system.
// Handles both simple and complex JSON formats, transforming them to standard structure.

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Step 1: Transform complex lesson JSON to flat practice array
// Converts stages-based structure to simple practice questions
function transformLessonData(rawData: any) {
  // Check if this is the new comprehensive format (has sectionId and contentScreens)
  if (rawData.sectionId && rawData.contentScreens) {
    return processComprehensiveFormat(rawData);
  }

  // Check if this is the complex format (has lessons array with stages)
  if (rawData.lessons && Array.isArray(rawData.lessons)) {
    // Process each lesson in the lessons array
    return rawData.lessons.map((lesson: any) => {
      const practiceQuestions: any[] = [];

      // Extract all exercises from all stages
      if (lesson.stages && Array.isArray(lesson.stages)) {
        lesson.stages.forEach((stage: any) => {
          // Process exercises from Learn stage
          if (stage.exercises && Array.isArray(stage.exercises)) {
            stage.exercises.forEach((exercise: any) => {
              const converted = convertExerciseToQuestion(exercise);
              if (converted) practiceQuestions.push(converted);
            });
          }

          // Process scenarios from Apply stage
          if (stage.scenarios && Array.isArray(stage.scenarios)) {
            stage.scenarios.forEach((scenario: any) => {
              const converted = convertScenarioToQuestion(scenario);
              if (converted) practiceQuestions.push(converted);
            });
          }

          // Process activities from Challenge stage
          if (stage.activities && Array.isArray(stage.activities)) {
            stage.activities.forEach((activity: any) => {
              const converted = convertActivityToQuestion(activity);
              if (converted) practiceQuestions.push(converted);
            });
          }
        });
      }

      // Detect if this is a multi-part lesson based on stages
      const stages = lesson.stages || [];
      const totalParts = stages.length;
      const hasParts = totalParts > 1;

      // If multi-part, organize questions by stage
      let parts: any[] | undefined;
      if (hasParts) {
        parts = stages.map((stage: any, index: number) => {
          const partQuestions: any[] = [];

          // Collect all questions from this stage
          if (stage.exercises) {
            stage.exercises.forEach((ex: any) => {
              const converted = convertExerciseToQuestion(ex);
              if (converted) partQuestions.push(converted);
            });
          }
          if (stage.scenarios) {
            stage.scenarios.forEach((sc: any) => {
              const converted = convertScenarioToQuestion(sc);
              if (converted) partQuestions.push(converted);
            });
          }
          if (stage.activities) {
            stage.activities.forEach((act: any) => {
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
  if (rawData.number && rawData.title && rawData.practice) {
    return [rawData];
  }

  throw new Error("Invalid lesson format");
}

// Step 1.5: Process comprehensive format with contentScreens
// Extracts exercises from contentScreens and preserves all metadata
function processComprehensiveFormat(data: any): any[] {
  const questions: any[] = [];

  // Extract all exercises from contentScreens
  if (data.contentScreens && Array.isArray(data.contentScreens)) {
    data.contentScreens.forEach((screen: any) => {
      // Process exercises array in screen
      if (screen.exercises && Array.isArray(screen.exercises)) {
        screen.exercises.forEach((exercise: any) => {
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
  } else if (data.lessonPart) {
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
function convertExplanationToFeedback(exercise: any): any {
  // If feedback already exists, use it
  if (exercise.feedback && typeof exercise.feedback === 'object') {
    return { feedback: exercise.feedback };
  }

  // If explanation exists, convert it to feedback format
  if (exercise.explanation) {
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
function convertComprehensiveExercise(exercise: any): any {
  if (!exercise || !exercise.type) return null;

  // Convert explanation to feedback format
  const feedbackData = convertExplanationToFeedback(exercise);

  switch (exercise.type) {
    case "multiple-choice":
      const mcOptions = exercise.options?.map((opt: string, idx: number) => ({
        id: String.fromCharCode(65 + idx),
        text: opt
      })) || [];

      let mcCorrectAnswer = "A";
      if (typeof exercise.correct === 'string' && exercise.correct.length === 1) {
        mcCorrectAnswer = exercise.correct;
      } else {
        const correctIndex = exercise.options?.indexOf(exercise.correct);
        if (correctIndex >= 0) {
          mcCorrectAnswer = String.fromCharCode(65 + correctIndex);
        }
      }

      return {
        ...feedbackData,
        type: "multiple-choice",
        question: exercise.question,
        options: mcOptions,
        correctAnswer: mcCorrectAnswer
      };

    case "true-false":
      // Handle both 'question' and 'statement' fields
      const tfQuestion = exercise.question || exercise.statement || "True or False?";

      return {
        ...feedbackData,
        type: "multiple-choice",
        question: tfQuestion,
        options: [
          { id: "A", text: "True" },
          { id: "B", text: "False" }
        ],
        correctAnswer: exercise.correct === "True" ? "A" : "B"
      };

    case "matching":
      // Step: Handle matching pairs - keep as array format
      let pairs: any;

      // If pairs are provided directly (array format)
      if (exercise.pairs && Array.isArray(exercise.pairs)) {
        pairs = exercise.pairs;
      }
      // Legacy format: build from correct/options arrays
      else if (Array.isArray(exercise.correct) && Array.isArray(exercise.options)) {
        pairs = {};
        exercise.options.forEach((key: string, index: number) => {
          if (exercise.correct[index]) {
            pairs[key] = exercise.correct[index];
          }
        });
      }
      // Legacy format: parse from string
      else if (typeof exercise.correct === 'string') {
        pairs = parseMatchingPairs(exercise.correct);
      }

      return {
        ...feedbackData,
        type: "matching",
        question: exercise.question,
        pairs: pairs
      };

    case "fill-in":
      // Step 1: Handle 'correct', 'answer', or 'answers' fields
      // This supports both single-blank and multi-blank questions
      const correctValue = exercise.correct || exercise.answer || exercise.answers;
      console.log('🔍 [FILL-IN DEBUG] Raw exercise:', JSON.stringify(exercise, null, 2));
      console.log('🔍 [FILL-IN DEBUG] correctValue:', correctValue);

      // Step 2: Preserve all answers for multi-blank questions
      // Convert single answer to array format for consistency
      const fillInCorrectAnswers = Array.isArray(correctValue)
        ? correctValue
        : [correctValue];
      console.log('🔍 [FILL-IN DEBUG] fillInCorrectAnswers:', fillInCorrectAnswers);

      // Step 3: Handle 'options' or 'wrongOptions' fields
      // Filter out correct answers from the options to get wrong options only
      const optionsValue = exercise.options || exercise.wrongOptions || [];
      console.log('🔍 [FILL-IN DEBUG] optionsValue:', optionsValue);

      const fillInWrongOptions = Array.isArray(optionsValue)
        ? optionsValue.filter((o: string) =>
            Array.isArray(correctValue)
              ? !correctValue.includes(o)
              : o !== correctValue
          )
        : [];
      console.log('🔍 [FILL-IN DEBUG] fillInWrongOptions:', fillInWrongOptions);

      // Step 4: Build the new format (fillInOptions + answers)
      // This supports the FillInBlankQuestion component's new format
      const allOptions = [...fillInCorrectAnswers, ...fillInWrongOptions];
      console.log('🔍 [FILL-IN DEBUG] allOptions:', allOptions);

      const result = {
        ...feedbackData,
        type: "fill-in-blank",
        sentence: exercise.question || exercise.sentence,
        fillInOptions: allOptions,  // All options (correct + wrong) for fill-in questions
        answers: fillInCorrectAnswers,  // Multiple correct answers
        // Legacy support - keep single correctAnswer for backward compatibility
        correctAnswer: fillInCorrectAnswers[0],
        wrongOptions: fillInWrongOptions
      };

      console.log('🔍 [FILL-IN DEBUG] Final converted exercise:', JSON.stringify(result, null, 2));
      return result;

      // ✅ In this section we achieved:
      // Support for multi-blank fill-in questions with multiple correct answers.
      // The component receives all options and all answers, not just the first one.

    case "scenario":
      return {
        ...feedbackData,
        type: "multiple-choice",
        question: exercise.scene ? `${exercise.scene}\n\n${exercise.question}` : exercise.question,
        options: exercise.options?.map((opt: string, idx: number) => ({
          id: String.fromCharCode(65 + idx),
          text: opt
        })) || [],
        correctAnswer: String.fromCharCode(65 + (exercise.options?.indexOf(exercise.correct) || 0))
      };

    case "reverse-scenario":
      return {
        ...feedbackData,
        type: "multiple-choice",
        question: exercise.scene ? `[Reverse Scenario]\n${exercise.scene}\n\n${exercise.question}` : exercise.question,
        options: exercise.options?.map((opt: string, idx: number) => ({
          id: String.fromCharCode(65 + idx),
          text: opt
        })) || [],
        correctAnswer: String.fromCharCode(65 + (exercise.options?.indexOf(exercise.correct) || 0))
      };

    case "ethical-dilemma":
      return {
        ...feedbackData,
        type: "multiple-choice",
        question: exercise.dilemma ? `[Ethical Dilemma]\n${exercise.dilemma}\n\n${exercise.question}` : exercise.question,
        options: exercise.options?.map((opt: string, idx: number) => ({
          id: String.fromCharCode(65 + idx),
          text: opt
        })) || [],
        correctAnswer: String.fromCharCode(65 + (exercise.options?.indexOf(exercise.correct) || 0))
      };

    case "micro-sim":
      // Multi-step scenarios - for now, extract first step
      if (exercise.steps && Array.isArray(exercise.steps) && exercise.steps.length > 0) {
        const firstStep = exercise.steps[0];
        return {
          ...feedbackData,
          type: "multiple-choice",
          question: `[Micro Simulation - Step 1]\n${firstStep.situation}\n\n${firstStep.question}`,
          options: firstStep.options?.map((opt: string, idx: number) => ({
            id: String.fromCharCode(65 + idx),
            text: opt
          })) || [],
          correctAnswer: String.fromCharCode(65 + (firstStep.options?.indexOf(firstStep.correct) || 0))
        };
      }
      return null;

    case "case-analysis":
      return {
        ...feedbackData,
        type: "multiple-choice",
        question: exercise.case ? `[Case Analysis]\n${exercise.case}\n\n${exercise.question}` : exercise.question,
        options: exercise.options?.map((opt: string, idx: number) => ({
          id: String.fromCharCode(65 + idx),
          text: opt
        })) || [],
        correctAnswer: String.fromCharCode(65 + (exercise.options?.indexOf(exercise.correct) || 0))
      };

    case "build-sentence":
      return {
        ...feedbackData,
        type: "sentence-building",
        question: exercise.prompt || "Arrange the words to make a sentence",
        words: exercise.words || [],
        correctSentence: exercise.correct
      };

    case "boss-scenario":
      return {
        ...feedbackData,
        type: "multiple-choice",
        question: `[Boss Challenge]\n${exercise.scene}\n\n${exercise.question}`,
        options: exercise.options?.map((opt: string, idx: number) => ({
          id: String.fromCharCode(65 + idx),
          text: opt
        })) || [],
        correctAnswer: String.fromCharCode(65 + (exercise.options?.indexOf(exercise.correct) || 0))
      };

    default:
      return null;
  }
}

// Step 2: Convert different exercise types to standard question format
function convertExerciseToQuestion(exercise: any): any {
  if (!exercise || !exercise.type) return null;

  // Convert explanation to feedback format
  const feedbackData = convertExplanationToFeedback(exercise);

  switch (exercise.type) {
    case "matching":
      // Handle both array format and string format
      let pairs: { [key: string]: string } = {};

      if (Array.isArray(exercise.correct) && Array.isArray(exercise.options)) {
        // New format: options array + correct array
        exercise.options.forEach((key: string, index: number) => {
          if (exercise.correct[index]) {
            pairs[key] = exercise.correct[index];
          }
        });
      } else if (typeof exercise.correct === 'string') {
        // Old format: semicolon-separated string
        pairs = parseMatchingPairs(exercise.correct);
      }

      return {
        ...feedbackData,
        type: "matching",
        question: exercise.question,
        pairs: pairs
      };

    case "true-false":
      // Handle both 'question' and 'statement' fields
      const tfQuestion = exercise.question || exercise.statement || "True or False?";

      return {
        ...feedbackData,
        type: "multiple-choice",
        question: tfQuestion,
        options: [
          { id: "A", text: "True" },
          { id: "B", text: "False" }
        ],
        correctAnswer: exercise.correct === "True" ? "A" : "B"
      };

    case "fill-in":
      // Handle single answer or multiple answers
      const fillInAnswer = Array.isArray(exercise.correct)
        ? exercise.correct[0] // For multi-blank, use first answer for now
        : exercise.correct;

      const fillInWrongOptions = Array.isArray(exercise.options)
        ? exercise.options.filter((o: string) => !exercise.correct.includes(o))
        : [];

      return {
        ...feedbackData,
        type: "fill-in-blank",
        sentence: exercise.question,
        correctAnswer: fillInAnswer,
        wrongOptions: fillInWrongOptions
      };

    case "multiple-choice":
      const mcOptions = exercise.options?.map((opt: string, idx: number) => ({
        id: String.fromCharCode(65 + idx),
        text: opt
      })) || [];

      // Handle letter-based answer (A, B, C) or find correct option
      let mcCorrectAnswer = "A";
      if (typeof exercise.correct === 'string' && exercise.correct.length === 1 && exercise.correct >= 'A' && exercise.correct <= 'Z') {
        mcCorrectAnswer = exercise.correct;
      } else {
        const correctIndex = exercise.options?.indexOf(exercise.correct);
        if (correctIndex >= 0) {
          mcCorrectAnswer = String.fromCharCode(65 + correctIndex);
        }
      }

      return {
        ...feedbackData,
        type: "multiple-choice",
        question: exercise.question,
        options: mcOptions,
        correctAnswer: mcCorrectAnswer
      };

    default:
      return null;
  }
}

// Step 3: Convert scenarios to questions
function convertScenarioToQuestion(scenario: any): any {
  if (!scenario) return null;

  // Convert explanation to feedback format
  const feedbackData = convertExplanationToFeedback(scenario);

  if (scenario.type === "conversation" || scenario.type === "reverse-scenario") {
    // Skip conversation and reverse-scenario types for now
    return null;
  }

  return {
    ...feedbackData,
    type: "multiple-choice",
    question: scenario.scene ? `${scenario.scene}\n\n${scenario.question}` : scenario.question,
    options: scenario.options?.map((opt: string, idx: number) => ({
      id: String.fromCharCode(65 + idx),
      text: opt
    })) || [],
    correctAnswer: String.fromCharCode(65 + (scenario.options?.indexOf(scenario.correct) || 0))
  };
}

// Step 4: Convert activities to questions
function convertActivityToQuestion(activity: any): any {
  if (!activity || !activity.type) return null;

  // Convert explanation to feedback format
  const feedbackData = convertExplanationToFeedback(activity);

  switch (activity.type) {
    case "build-sentence":
      return {
        ...feedbackData,
        type: "sentence-building",
        question: activity.prompt,
        words: activity.words || [],
        correctSentence: activity.correct
      };

    case "boss-scenario":
      return {
        ...feedbackData,
        type: "multiple-choice",
        question: `${activity.scene}\n\n${activity.question}`,
        options: activity.options?.map((opt: string, idx: number) => ({
          id: String.fromCharCode(65 + idx),
          text: opt
        })) || [],
        correctAnswer: String.fromCharCode(65 + (activity.options?.indexOf(activity.correct) || 0))
      };

    case "rapid-fire":
      // Skip rapid-fire for now
      return null;

    default:
      return null;
  }
}

// Step 5: Parse matching pairs from string format
function parseMatchingPairs(correctString: string): { [key: string]: string } {
  const pairs: { [key: string]: string } = {};
  const items = correctString.split(";").map(s => s.trim());

  items.forEach(item => {
    const [key, value] = item.split(":").map(s => s.trim());
    if (key && value) {
      pairs[key] = value;
    }
  });

  return pairs;
}

// ✅ Transformation functions ready - can handle both simple and complex JSON formats

export async function POST(request: Request) {
  try {
    // Step 6: Parse the incoming lesson data and transform it
    const rawData = await request.json();
    const lessons = transformLessonData(rawData);

    // Step 7: Read the current darkPsychologyLessons.ts file
    const filePath = path.join(process.cwd(), "lib", "darkPsychologyLessons.ts");
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Step 8: Extract the current lessons array
    const arrayMatch = fileContent.match(/export const DARK_PSYCHOLOGY_LESSONS: DarkPsychologyLesson\[\] = \[([\s\S]*?)\];/);

    if (!arrayMatch) {
      return NextResponse.json({ error: "Could not parse lessons file" }, { status: 500 });
    }

    let lessonsArrayContent = arrayMatch[1].trim();

    // Step 8.5: Parse existing lessons to check for lessonId matches
    const existingLessons: any[] = [];

    // If there are existing lessons, parse them
    if (lessonsArrayContent && lessonsArrayContent.trim().length > 0) {
      // Remove comments and extract JSON objects
      const cleanContent = lessonsArrayContent
        .replace(/\/\/[^\n]*/g, '') // Remove single-line comments
        .trim();

      // Split by "},\n" to get individual lessons (rough split)
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
            try {
              const lesson = JSON.parse(lessonText);
              existingLessons.push({ text: lessonText, data: lesson });
              console.log('✅ Parsed existing lesson:', lesson.number, lesson.lessonId);
            } catch (e) {
              console.error('❌ Failed to parse lesson:', e);
            }
            currentLessonStart = -1;
          }
        }
        i++;
      }
    }

    // Step 8.6: Find the highest lesson number
    const existingNumbers = existingLessons.map(l => l.data.number || 0);
    const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;

    // Step 9: Process new lessons - merge parts or add new
    lessons.forEach((newLesson: any) => {
      console.log('🔍 [ADD LESSON] Processing new lesson:', {
        number: newLesson.number,
        lessonId: newLesson.lessonId,
        unitId: newLesson.unitId,
        lessonPart: newLesson.lessonPart,
        lessonTitle: newLesson.lessonTitle
      });

      // Check if this is a part of an existing lesson (based on lessonId)
      const existingLessonIndex = existingLessons.findIndex(
        l => l.data.lessonId && newLesson.lessonId && l.data.lessonId === newLesson.lessonId
      );

      console.log('🔍 [ADD LESSON] Existing lesson index:', existingLessonIndex);
      console.log('🔍 [ADD LESSON] All existing lessons:', existingLessons.map(l => ({
        id: l.data.lessonId,
        unitId: l.data.unitId,
        number: l.data.number,
        title: l.data.title || l.data.lessonTitle
      })));
      console.log('🔍 [ADD LESSON] Looking for lessonId:', newLesson.lessonId);
      console.log('🔍 [ADD LESSON] Found match?', existingLessonIndex !== -1 ? 'YES' : 'NO');

      if (existingLessonIndex !== -1) {
        console.log('✅ MERGING: Found existing lesson with lessonId:', newLesson.lessonId);
        // MERGE: This is a new part for an existing lesson
        const existingLesson = existingLessons[existingLessonIndex].data;

        // Initialize parts array if it doesn't exist
        if (!existingLesson.parts) {
          existingLesson.parts = [];
          existingLesson.totalParts = 0;
        }

        // Add the new part
        const partNumber = newLesson.lessonPart || (existingLesson.parts.length + 1);
        existingLesson.parts.push({
          partNumber: partNumber,
          partTitle: newLesson.lessonPartTitle || `Part ${partNumber}`,
          questions: newLesson.practice || []
        });

        // Update totalParts
        existingLesson.totalParts = existingLesson.parts.length;

        // Merge practice questions
        existingLesson.practice = existingLesson.practice || [];
        if (newLesson.practice) {
          existingLesson.practice.push(...newLesson.practice);
        }

        // Update the lesson in the array
        existingLessons[existingLessonIndex].data = existingLesson;
        existingLessons[existingLessonIndex].text = JSON.stringify(existingLesson, null, 2);

      } else {
        console.log('➕ NEW LESSON: No existing lesson found, creating new');
        // NEW LESSON: Add as new entry
        // Use the lesson number already set in newLesson (extracted from lessonId in processComprehensiveFormat)
        // Don't recalculate it to avoid incorrect numbering
        // newLesson.number is already set correctly from line 138

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

    return NextResponse.json({
      success: true,
      message: `${lessons.length} lesson(s) added successfully`,
      lessonTitles: lessons.map((l: any) => l.title)
    });

  } catch (error) {
    console.error("Error adding lesson:", error);
    return NextResponse.json({
      error: "Failed to add lesson",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

// ✅ This API endpoint:
// - Receives lesson JSON from admin page (simple or complex format)
// - Transforms complex stage-based lessons to flat practice arrays
// - Reads darkPsychologyLessons.ts file
// - Appends the new lesson(s) to the array
// - Saves the updated file
