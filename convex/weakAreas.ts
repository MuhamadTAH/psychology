// 🧠 FILE PURPOSE
// This file provides queries for analyzing user mistakes and weak areas.
// Helps users review questions they got wrong most frequently.

import { v } from "convex/values";
import { query } from "./_generated/server";

const requireIdentity = async (ctx: any) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");
  return identity;
};

// Step 1: Get all mistakes from user's progress
export const getUserMistakes = query({
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) throw new Error("User not found");

    // Get all progress records with mistakes
    const allProgress = await ctx.db
      .query("progress")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    // Step 2: Flatten all mistakes into a single array with metadata
    const allMistakes: any[] = [];

    for (const progress of allProgress) {
      if (progress.mistakes && progress.mistakes.length > 0) {
        for (const mistake of progress.mistakes) {
          allMistakes.push({
            ...mistake,
            lessonNumber: progress.lessonNumber,
            lessonId: progress.lessonId,
            darkPsychLessonId: progress.darkPsychLessonId,
          });
        }
      }
    }

    return allMistakes;
  },
});

// Step 3: Get mistake statistics (most common wrong answers)
export const getMistakeStats = query({
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) throw new Error("User not found");

    // Get all progress records
    const allProgress = await ctx.db
      .query("progress")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    // Count mistakes by question
    const mistakeCounts: { [key: string]: { count: number; data: any } } = {};
    let totalMistakes = 0;

    for (const progress of allProgress) {
      if (progress.mistakes && progress.mistakes.length > 0) {
        for (const mistake of progress.mistakes) {
          totalMistakes++;
          const key = mistake.question || "Unknown";

          if (!mistakeCounts[key]) {
            mistakeCounts[key] = { count: 0, data: mistake };
          }
          mistakeCounts[key].count++;
        }
      }
    }

    // Step 4: Sort by frequency and return top mistakes
    const sortedMistakes = Object.entries(mistakeCounts)
      .map(([question, data]) => ({
        question,
        count: data.count,
        userAnswer: data.data.userAnswer,
        correctAnswer: data.data.correctAnswer,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 most common mistakes

    return {
      totalMistakes,
      mostCommonMistakes: sortedMistakes,
    };
  },
});

// ✅ In this file we achieved:
// Queries to retrieve and analyze user mistakes from all completed lessons.
// Statistics showing most frequently missed questions for targeted review.
