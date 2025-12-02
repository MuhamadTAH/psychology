// 🧠 FILE PURPOSE
// This file handles Dark Psychology lessons stored in the database.
// Allows for easy migration and updates without file replacement.

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Step 1: Import all Dark Psychology lessons from the static file
// This will be a one-time import to seed the database
export const importDarkPsychologyLessons = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Note: This mutation should receive the lessons data from the client
    // Since we can't import from lib/ in Convex, the client will send the data
    return {
      success: true,
      message: "Import endpoint ready. Send lessons data from client.",
    };
  },
});

// Step 2: Store a Dark Psychology lesson in the database
export const storeDarkPsychLesson = mutation({
  args: {
    lessonData: v.any(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Check if lesson already exists
    const existingLesson = await ctx.db
      .query("lessons")
      .filter((q) =>
        q.and(
          q.eq(q.field("title"), args.lessonData.title),
          q.eq(q.field("lessonNumber"), args.lessonData.number)
        )
      )
      .first();

    if (existingLesson) {
      // Update existing lesson
      await ctx.db.patch(existingLesson._id, {
        lessonJSON: args.lessonData,
      });
      return { success: true, action: "updated", lessonId: existingLesson._id };
    } else {
      // Create new lesson
      // Use a system user for Dark Psychology lessons
      const systemUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", "system@darkpsychology"))
        .first();

      let userId;
      if (!systemUser) {
        // Create system user if it doesn't exist
        userId = await ctx.db.insert("users", {
          email: "system@darkpsychology",
          name: "Dark Psychology System",
          createdAt: Date.now(),
        });
      } else {
        userId = systemUser._id;
      }

      const newLessonId = await ctx.db.insert("lessons", {
        userId,
        lessonNumber: args.lessonData.number,
        title: args.lessonData.title,
        lessonJSON: args.lessonData,
        createdAt: Date.now(),
      });

      return { success: true, action: "created", lessonId: newLessonId };
    }
  },
});

// Step 3: Get all Dark Psychology lessons from database
export const getDarkPsychologyLessons = query({
  handler: async (ctx) => {
    // Get system user
    const systemUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", "system@darkpsychology"))
      .first();

    if (!systemUser) return [];

    // Get all lessons for system user
    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_userId", (q) => q.eq("userId", systemUser._id))
      .collect();

    return lessons.map((lesson) => ({
      _id: lesson._id,
      ...lesson.lessonJSON,
    }));
  },
});

// Step 4: Check if Dark Psychology lessons are in database
export const checkDarkPsychInDB = query({
  handler: async (ctx) => {
    const systemUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", "system@darkpsychology"))
      .first();

    if (!systemUser) {
      return { inDatabase: false, count: 0 };
    }

    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_userId", (q) => q.eq("userId", systemUser._id))
      .collect();

    return { inDatabase: lessons.length > 0, count: lessons.length };
  },
});

// ✅ In this file we achieved:
// Database storage for Dark Psychology lessons.
// One-time import from static file to database.
// Query and update capabilities like regular lessons.
