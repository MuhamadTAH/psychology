// 🧠 FILE PURPOSE
// This file handles automatic lesson migration and upgrades.
// Analyzes lessons for missing features and applies upgrades automatically.

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Step 1: Analyze a single lesson for needed upgrades
function analyzeLessonForUpgrades(lesson: any): string[] {
  const neededUpgrades: string[] = [];

  if (!lesson.lessonJSON && !lesson.content) {
    return ["INVALID_LESSON"];
  }

  const lessonData = lesson.lessonJSON || lesson.content;

  // Check 5: Section B format upgrade (contentScreens with screenType)
  if (lessonData.contentScreens && Array.isArray(lessonData.contentScreens)) {
    // This is a Section B format lesson - no upgrade needed
    return [];
  }

  // Check if lesson has exercises/questions
  if (!lessonData.exercises && !lessonData.questions) {
    neededUpgrades.push("NO_EXERCISES");
    return neededUpgrades;
  }

  const exercises = lessonData.exercises || lessonData.questions || [];

  // Check 6: Needs Section B format conversion
  // If lesson has exercises but no contentScreens structure, needs upgrade
  if (!lessonData.contentScreens) {
    neededUpgrades.push("NEEDS_SECTION_B_FORMAT");
  }

  for (const exercise of exercises) {
    // Check 1: Matching questions need new pairs format
    if (exercise.type === "matching" && exercise.pairs && Array.isArray(exercise.pairs)) {
      // Old format: [{term: "X", definition: "Y"}]
      // New format: {"X": "Y"}
      neededUpgrades.push("MATCHING_FORMAT_OLD");
    }

    // Check 2: Fill-in-blank questions need new answers format
    if ((exercise.type === "fill-in-blank" || exercise.type === "fill-in") &&
        !exercise.answers && exercise.correctAnswer) {
      neededUpgrades.push("FILL_IN_FORMAT_OLD");
    }

    // Check 3: Multiple choice with string array options
    if (exercise.type === "multiple-choice" &&
        exercise.options &&
        typeof exercise.options[0] === "string") {
      neededUpgrades.push("MULTIPLE_CHOICE_STRING_OPTIONS");
    }

    // Check 4: Questions with 'correct' field instead of 'correctAnswer'
    if ((exercise as any).correct && !exercise.correctAnswer) {
      neededUpgrades.push("CORRECT_FIELD_MIGRATION");
    }
  }

  return [...new Set(neededUpgrades)]; // Remove duplicates
}

// Step 2: Apply upgrades to a lesson
function applyLessonUpgrades(lessonData: any): any {
  if (!lessonData.exercises && !lessonData.questions) {
    return lessonData;
  }

  const exercises = lessonData.exercises || lessonData.questions || [];
  const upgradedExercises = exercises.map((exercise: any) => {
    const upgraded = { ...exercise };

    // Upgrade 1: Convert matching pairs from array to object
    if (exercise.type === "matching" && exercise.pairs && Array.isArray(exercise.pairs)) {
      const pairsObject: any = {};
      exercise.pairs.forEach((pair: any) => {
        if (pair.term && pair.definition) {
          pairsObject[pair.term] = pair.definition;
        }
      });
      upgraded.pairs = pairsObject;
    }

    // Upgrade 2: Convert fill-in-blank to new format
    if ((exercise.type === "fill-in-blank" || exercise.type === "fill-in") &&
        !exercise.answers && exercise.correctAnswer) {
      const correctAnswers = Array.isArray(exercise.correctAnswer)
        ? exercise.correctAnswer
        : [exercise.correctAnswer];
      upgraded.answers = correctAnswers;
    }

    // Upgrade 3: Convert string array options to object array
    if (exercise.type === "multiple-choice" &&
        exercise.options &&
        typeof exercise.options[0] === "string") {
      upgraded.options = exercise.options.map((opt: string, idx: number) => ({
        id: String.fromCharCode(97 + idx), // a, b, c, d...
        text: opt
      }));
    }

    // Upgrade 4: Convert 'correct' to 'correctAnswer'
    if ((exercise as any).correct && !exercise.correctAnswer) {
      upgraded.correctAnswer = (exercise as any).correct;
      delete upgraded.correct;
    }

    return upgraded;
  });

  // Upgrade 5: Convert to Section B format with contentScreens
  if (!lessonData.contentScreens) {
    const contentScreens = [];

    // Add a Learn screen with introduction
    contentScreens.push({
      screenId: `${lessonData.lessonNumber || 1}-S1`,
      screenType: "Learn",
      title: lessonData.title || "Lesson Introduction",
      content: [
        {
          type: "paragraph",
          text: lessonData.description || lessonData.introduction || "Welcome to this lesson. Let's learn something new!"
        }
      ]
    });

    // Add Exercises screen with all questions
    contentScreens.push({
      screenId: `${lessonData.lessonNumber || 1}-S2`,
      screenType: "Exercises",
      title: "Practice Exercises",
      exercises: upgradedExercises
    });

    return {
      ...lessonData,
      contentScreens,
      exercises: undefined, // Remove old exercises field
      questions: undefined, // Remove old questions field
    };
  }

  return {
    ...lessonData,
    exercises: upgradedExercises,
    questions: undefined, // Remove old 'questions' field
  };
}

// Step 3: Get all lessons that need migration
export const getLessonsNeedingMigration = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    // Get all lessons
    const allLessons = await ctx.db.query("lessons").collect();

    const lessonsNeedingMigration = allLessons
      .map((lesson) => {
        const upgrades = analyzeLessonForUpgrades(lesson);
        return {
          _id: lesson._id,
          title: lesson.title,
          lessonNumber: lesson.lessonNumber,
          userId: lesson.userId,
          neededUpgrades: upgrades,
          needsMigration: upgrades.length > 0 && !upgrades.includes("INVALID_LESSON"),
        };
      })
      .filter((lesson) => lesson.needsMigration);

    return lessonsNeedingMigration;
  },
});

// Step 4: Get migration statistics
export const getMigrationStats = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const allLessons = await ctx.db.query("lessons").collect();

    let totalLessons = 0;
    let needsMigration = 0;
    let upgradeTypeCounts: { [key: string]: number } = {};

    allLessons.forEach((lesson) => {
      totalLessons++;
      const upgrades = analyzeLessonForUpgrades(lesson);

      if (upgrades.length > 0 && !upgrades.includes("INVALID_LESSON")) {
        needsMigration++;
        upgrades.forEach((upgrade) => {
          upgradeTypeCounts[upgrade] = (upgradeTypeCounts[upgrade] || 0) + 1;
        });
      }
    });

    return {
      totalLessons,
      needsMigration,
      alreadyMigrated: totalLessons - needsMigration,
      upgradeTypeCounts,
    };
  },
});

// Step 5: Migrate a single lesson
export const migrateSingleLesson = mutation({
  args: {
    lessonId: v.id("lessons"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const lesson = await ctx.db.get(args.lessonId);
    if (!lesson) throw new Error("Lesson not found");

    const lessonData = lesson.lessonJSON || lesson.content;
    const upgradedData = applyLessonUpgrades(lessonData);

    // Update the lesson with upgraded data
    await ctx.db.patch(args.lessonId, {
      lessonJSON: upgradedData,
      content: undefined, // Remove old 'content' field
    });

    return {
      success: true,
      lessonId: args.lessonId,
      title: lesson.title,
    };
  },
});

// Step 6: Migrate all lessons (batch migration)
export const migrateAllLessons = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const allLessons = await ctx.db.query("lessons").collect();

    let migratedCount = 0;
    let skippedCount = 0;
    const errors: string[] = [];

    for (const lesson of allLessons) {
      try {
        const upgrades = analyzeLessonForUpgrades(lesson);

        if (upgrades.length > 0 && !upgrades.includes("INVALID_LESSON")) {
          const lessonData = lesson.lessonJSON || lesson.content;
          const upgradedData = applyLessonUpgrades(lessonData);

          await ctx.db.patch(lesson._id, {
            lessonJSON: upgradedData,
            content: undefined,
          });

          migratedCount++;
        } else {
          skippedCount++;
        }
      } catch (error: any) {
        errors.push(`Lesson ${lesson.title}: ${error.message}`);
      }
    }

    return {
      success: true,
      migratedCount,
      skippedCount,
      totalLessons: allLessons.length,
      errors,
    };
  },
});

// ✅ In this file we achieved:
// Automatic detection of lessons needing upgrades.
// Intelligent migration of old formats to new formats.
// Batch processing with error handling and progress tracking.
