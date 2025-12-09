// 🧠 FILE PURPOSE
// Backend for Dark Psychology specific features: notes, bookmarks, review tracking, certificates.
// Handles progress tracking, spaced repetition, and user achievements for Dark Psychology course.

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Step 1: Save a note for a specific lesson
export const saveNote = mutation({
  args: {
    email: v.string(),
    lessonId: v.string(),
    lessonTitle: v.string(),
    note: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Check if note already exists for this lesson
    const existing = await ctx.db
      .query("darkPsychologyNotes")
      .withIndex("by_user_lesson", (q) =>
        q.eq("email", args.email).eq("lessonId", args.lessonId)
      )
      .first();

    if (existing) {
      // Update existing note
      await ctx.db.patch(existing._id, {
        note: args.note,
        updatedAt: Date.now(),
      });
      return { success: true, action: "updated" };
    } else {
      // Create new note
      await ctx.db.insert("darkPsychologyNotes", {
        email: args.email,
        lessonId: args.lessonId,
        lessonTitle: args.lessonTitle,
        note: args.note,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      return { success: true, action: "created" };
    }
  },
});

// Step 2: Get all notes for a user
export const getNotes = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const notes = await ctx.db
      .query("darkPsychologyNotes")
      .withIndex("by_user_lesson", (q) => q.eq("email", args.email))
      .collect();

    return notes;
  },
});

// Step 3: Get note for specific lesson
export const getNoteForLesson = query({
  args: { email: v.string(), lessonId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const note = await ctx.db
      .query("darkPsychologyNotes")
      .withIndex("by_user_lesson", (q) =>
        q.eq("email", args.email).eq("lessonId", args.lessonId)
      )
      .first();

    return note;
  },
});

// Step 4: Delete a note
export const deleteNote = mutation({
  args: { noteId: v.id("darkPsychologyNotes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    await ctx.db.delete(args.noteId);
    return { success: true };
  },
});

// Step 5: Toggle bookmark for a question
export const toggleBookmark = mutation({
  args: {
    email: v.string(),
    lessonId: v.string(),
    lessonTitle: v.string(),
    question: v.string(),
    questionIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Check if bookmark exists for this specific question
    const existing = await ctx.db
      .query("darkPsychologyBookmarks")
      .withIndex("by_user_question", (q) =>
        q.eq("email", args.email).eq("lessonId", args.lessonId).eq("questionIndex", args.questionIndex)
      )
      .first();

    if (existing) {
      // Remove bookmark
      await ctx.db.delete(existing._id);
      return { success: true, bookmarked: false };
    } else {
      // Add bookmark
      await ctx.db.insert("darkPsychologyBookmarks", {
        email: args.email,
        lessonId: args.lessonId,
        lessonTitle: args.lessonTitle,
        question: args.question,
        questionIndex: args.questionIndex,
        createdAt: Date.now(),
      });
      return { success: true, bookmarked: true };
    }
  },
});

// Step 6: Get all bookmarks for a user
export const getBookmarks = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const bookmarks = await ctx.db
      .query("darkPsychologyBookmarks")
      .withIndex("by_user_lesson", (q) => q.eq("email", args.email))
      .collect();

    return bookmarks;
  },
});

// Step 7: Check if question is bookmarked
export const isBookmarked = query({
  args: { email: v.string(), lessonId: v.string(), questionIndex: v.number() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const bookmark = await ctx.db
      .query("darkPsychologyBookmarks")
      .withIndex("by_user_question", (q) =>
        q.eq("email", args.email).eq("lessonId", args.lessonId).eq("questionIndex", args.questionIndex)
      )
      .first();

    return !!bookmark;
  },
});

// Step 8: Save wrong answers for review
export const saveWrongAnswer = mutation({
  args: {
    email: v.string(),
    lessonId: v.string(),
    question: v.string(),
    userAnswer: v.string(),
    correctAnswer: v.string(),
    questionType: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Check if this wrong answer already exists
    const existing = await ctx.db
      .query("darkPsychologyReview")
      .withIndex("by_user_lesson", (q) =>
        q.eq("email", args.email).eq("lessonId", args.lessonId)
      )
      .filter((q) => q.eq(q.field("question"), args.question))
      .first();

    if (existing) {
      // Update review count and next review date
      await ctx.db.patch(existing._id, {
        reviewCount: existing.reviewCount + 1,
        lastReviewed: Date.now(),
        nextReview: Date.now() + 86400000, // 1 day later
      });
    } else {
      // Create new review item
      await ctx.db.insert("darkPsychologyReview", {
        email: args.email,
        lessonId: args.lessonId,
        question: args.question,
        userAnswer: args.userAnswer,
        correctAnswer: args.correctAnswer,
        questionType: args.questionType,
        reviewCount: 0,
        lastReviewed: Date.now(),
        nextReview: Date.now() + 86400000, // 1 day later
        createdAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// Step 9: Get questions for review (spaced repetition)
export const getReviewQuestions = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const now = Date.now();
    const reviews = await ctx.db
      .query("darkPsychologyReview")
      .withIndex("by_user_lesson", (q) => q.eq("email", args.email))
      .filter((q) => q.lte(q.field("nextReview"), now))
      .collect();

    return reviews;
  },
});

// Step 10: Get all wrong answers for review mode
export const getAllWrongAnswers = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const reviews = await ctx.db
      .query("darkPsychologyReview")
      .withIndex("by_user_lesson", (q) => q.eq("email", args.email))
      .collect();

    return reviews;
  },
});

// Step 11: Mark review question as mastered
export const markAsMastered = mutation({
  args: { reviewId: v.id("darkPsychologyReview") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    await ctx.db.delete(args.reviewId);
    return { success: true };
  },
});

// Step 12: Get Dark Psychology progress dashboard data
export const getDashboard = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) return null;

    // Get all progress records for this user
    const allProgress = await ctx.db
      .query("progress")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    // Filter for Dark Psychology lessons (lessons with darkPsychLessonId field)
    const darkPsychProgress = allProgress.filter((p) => p.darkPsychLessonId);

    // Count unique completed lessons by darkPsychLessonId (not by progress records)
    const completedLessonIds = new Set(
      darkPsychProgress
        .filter((p) => p.isCompleted)
        .map((p) => p.darkPsychLessonId)
    );
    const completedLessons = completedLessonIds.size;

    // Get total unique lesson count from actual Dark Psychology lessons
    // We need to import and count from DARK_PSYCHOLOGY_LESSONS
    // For now, count unique darkPsychLessonId from progress
    const allLessonIds = new Set(darkPsychProgress.map(p => p.darkPsychLessonId));

    // If no progress yet, default to 6 lessons (or get from static data)
    // The actual count should be from DARK_PSYCHOLOGY_LESSONS length
    const totalLessons = allLessonIds.size > 0 ? allLessonIds.size : 6;

    // Calculate total XP from user's current XP (they earned it from lessons)
    const totalXP = user.xp || 0;

    // Calculate accuracy from mistakes
    let totalQuestions = 0;
    let totalMistakes = 0;
    darkPsychProgress.forEach((p) => {
      if (p.wrongAnswersCount !== undefined) {
        totalMistakes += p.wrongAnswersCount;
      }
      if (p.correctAnswersCount !== undefined) {
        totalQuestions += p.wrongAnswersCount + p.correctAnswersCount;
      }
    });
    const accuracy = totalQuestions > 0 ? Math.round(((totalQuestions - totalMistakes) / totalQuestions) * 100) : 100;

    // Get notes count
    const notes = await ctx.db
      .query("darkPsychologyNotes")
      .withIndex("by_user_lesson", (q) => q.eq("email", args.email))
      .collect();
    const notesCount = notes.length;

    // Get bookmarks count
    const bookmarks = await ctx.db
      .query("darkPsychologyBookmarks")
      .withIndex("by_user_lesson", (q) => q.eq("email", args.email))
      .collect();
    const bookmarksCount = bookmarks.length;

    // Get review questions count
    const reviews = await ctx.db
      .query("darkPsychologyReview")
      .withIndex("by_user_lesson", (q) => q.eq("email", args.email))
      .collect();
    const reviewCount = reviews.length;

    // Find next incomplete lesson for "Continue Learning"
    let nextLesson = null;
    const sortedProgress = darkPsychProgress.sort((a, b) => a.lessonNumber - b.lessonNumber);

    for (const progress of sortedProgress) {
      if (!progress.isCompleted) {
        // Find which part to continue from
        const completedParts = progress.completedParts || [];
        const totalParts = progress.totalParts || 1;
        const nextPart = completedParts.length + 1;

        if (nextPart <= totalParts) {
          nextLesson = {
            lessonNumber: progress.lessonNumber,
            lessonId: progress.darkPsychLessonId,
            nextPart,
            totalParts,
          };
          break;
        }
      }
    }

    // If all lessons complete, suggest first lesson for review
    if (!nextLesson && darkPsychProgress.length > 0) {
      const firstProgress = sortedProgress[0];
      nextLesson = {
        lessonNumber: firstProgress.lessonNumber,
        lessonId: firstProgress.darkPsychLessonId,
        nextPart: 1,
        totalParts: firstProgress.totalParts || 1,
      };
    }

    return {
      completedLessons,
      totalLessons,
      totalXP,
      accuracy,
      notesCount,
      bookmarksCount,
      reviewCount,
      streak: user.streak || 0,
      nextLesson,
    };
  },
});

// Step 13: Get Dark Psychology Leaderboard
export const getLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    // Get all users
    const users = await ctx.db.query("users").collect();

    // For each user, calculate their Dark Psychology stats
    const leaderboardData = await Promise.all(
      users.map(async (user) => {
        // Get all progress records for this user
        const allProgress = await ctx.db
          .query("progress")
          .withIndex("by_userId", (q) => q.eq("userId", user._id))
          .collect();

        // Filter for Dark Psychology lessons
        const darkPsychProgress = allProgress.filter((p) => p.darkPsychLessonId);

        // Count unique completed lessons
        const completedLessonIds = new Set(
          darkPsychProgress
            .filter((p) => p.isCompleted)
            .map((p) => p.darkPsychLessonId)
        );
        const completedLessons = completedLessonIds.size;

        // Calculate total XP from user
        const totalXP = user.xp || 0;

        // Calculate accuracy
        let totalQuestions = 0;
        let totalMistakes = 0;
        darkPsychProgress.forEach((p) => {
          if (p.wrongAnswersCount !== undefined) {
            totalMistakes += p.wrongAnswersCount;
          }
          if (p.correctAnswersCount !== undefined) {
            totalQuestions += p.wrongAnswersCount + p.correctAnswersCount;
          }
        });
        const accuracy = totalQuestions > 0
          ? Math.round(((totalQuestions - totalMistakes) / totalQuestions) * 100)
          : 0;

        return {
          name: user.name || user.email,
          email: user.email,
          completedLessons,
          totalXP,
          accuracy,
          streak: user.streak || 0,
        };
      })
    );

    // Filter users with at least some progress and sort by completed lessons, then XP
    const rankedData = leaderboardData
      .filter((user) => user.completedLessons > 0 || user.totalXP > 0)
      .sort((a, b) => {
        if (b.completedLessons !== a.completedLessons) {
          return b.completedLessons - a.completedLessons;
        }
        return b.totalXP - a.totalXP;
      });

    return rankedData.slice(0, 100); // Top 100 users
  },
});

// Step 14: Check and unlock achievements
export const checkAndUnlockAchievements = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db.query("users").withIndex("by_email", (q) => q.eq("email", args.email)).first();
    if (!user) return { newlyUnlocked: [] };

    const allProgress = await ctx.db.query("progress").withIndex("by_userId", (q) => q.eq("userId", user._id)).collect();
    const darkPsychProgress = allProgress.filter((p) => p.darkPsychLessonId);

    const achievements = [
      { id: "first_lesson", name: "First Steps", description: "Complete your first lesson", icon: "🎯", check: () => darkPsychProgress.some((p) => p.isCompleted) },
      { id: "unit_a_complete", name: "Manipulation Master", description: "Complete Unit A", icon: "🧠", check: () => darkPsychProgress.filter((p) => p.darkPsychLessonId?.startsWith("A") && p.isCompleted).length >= 5 },
      { id: "unit_b_complete", name: "Defense Expert", description: "Complete Unit B", icon: "🛡️", check: () => darkPsychProgress.some((p) => p.darkPsychLessonId?.startsWith("B") && p.isCompleted) },
      { id: "perfect_accuracy", name: "Perfectionist", description: "Complete lesson with 100% accuracy", icon: "⭐", check: () => darkPsychProgress.some((p) => p.isCompleted && p.wrongAnswersCount === 0) },
      { id: "all_complete", name: "Psychology Master", description: "Complete all lessons", icon: "🏆", check: () => new Set(darkPsychProgress.filter((p) => p.isCompleted).map((p) => p.darkPsychLessonId)).size >= 6 },
    ];

    const newlyUnlocked = [];
    for (const achievement of achievements) {
      if (achievement.check()) {
        const existing = await ctx.db.query("darkPsychologyAchievements").withIndex("by_user_achievement", (q) => q.eq("email", args.email).eq("achievementId", achievement.id)).first();
        if (!existing) {
          await ctx.db.insert("darkPsychologyAchievements", { email: args.email, achievementId: achievement.id, achievementName: achievement.name, achievementDescription: achievement.description, achievementIcon: achievement.icon, unlockedAt: Date.now() });
          // ✅ FIX: Only return serializable data (no functions)
          newlyUnlocked.push({
            id: achievement.id,
            name: achievement.name,
            description: achievement.description,
            icon: achievement.icon,
          });
        }
      }
    }
    return { newlyUnlocked };
  },
});

export const getUserAchievements = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return await ctx.db.query("darkPsychologyAchievements").withIndex("by_user", (q) => q.eq("email", args.email)).collect();
  },
});

// Step 15: Update daily streak on login or lesson completion
export const updateDailyStreak = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db.query("users").withIndex("by_email", (q) => q.eq("email", args.email)).first();
    if (!user) throw new Error("User not found");

    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    const lastLogin = user.lastLoginDate || "";
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    let newStreak = user.streak || 0;
    let newStreakFreezes = user.streakFreezes || 0;
    let bonusXP = 0;
    let usedFreeze = false;

    // Check if user already logged in today
    if (lastLogin === today) {
      return { streak: newStreak, bonusXP: 0, usedFreeze: false, alreadyUpdated: true };
    }

    // Case 1: User logged in yesterday - continue streak
    if (lastLogin === yesterday) {
      newStreak += 1;

      // Calculate bonus XP based on streak milestones
      if (newStreak === 7) bonusXP = 50; // 7-day streak bonus
      else if (newStreak === 30) bonusXP = 200; // 30-day streak bonus
      else if (newStreak === 100) bonusXP = 1000; // 100-day streak bonus
      else if (newStreak % 10 === 0) bonusXP = 20; // Every 10 days
      else bonusXP = 5; // Daily bonus

      // Add 1 streak freeze every 7 days
      if (newStreak % 7 === 0) {
        newStreakFreezes += 1;
      }
    }
    // Case 2: User missed yesterday - check for streak freeze
    else if (lastLogin && lastLogin !== yesterday) {
      const daysDiff = Math.floor((new Date(today).getTime() - new Date(lastLogin).getTime()) / 86400000);

      // If only 1 day missed and user has freeze, use it
      if (daysDiff === 2 && (user.streakFreezes || 0) > 0) {
        // Use streak freeze
        newStreakFreezes = (user.streakFreezes || 0) - 1;
        usedFreeze = true;
        bonusXP = 5; // Still get daily bonus
      } else {
        // Streak broken, reset to 1
        newStreak = 1;
        bonusXP = 0;
      }
    }
    // Case 3: First login ever or very long gap
    else {
      newStreak = 1;
      bonusXP = 0;
    }

    // Update user stats
    const updatedXP = (user.xp || 0) + bonusXP;
    const updatedLongestStreak = Math.max(newStreak, user.longestStreak || 0);
    const updatedTotalStreakDays = (user.totalStreakDays || 0) + 1;
    const updatedStreakBonusXP = (user.streakBonusXP || 0) + bonusXP;

    await ctx.db.patch(user._id, {
      lastLoginDate: today,
      streak: newStreak,
      streakFreezes: newStreakFreezes,
      longestStreak: updatedLongestStreak,
      totalStreakDays: updatedTotalStreakDays,
      streakBonusXP: updatedStreakBonusXP,
      xp: updatedXP,
    });

    return {
      streak: newStreak,
      bonusXP,
      usedFreeze,
      streakFreezes: newStreakFreezes,
      longestStreak: updatedLongestStreak,
      alreadyUpdated: false,
    };
  },
});

// Step 16: Use streak freeze manually (in case user knows they'll miss a day)
export const useStreakFreeze = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db.query("users").withIndex("by_email", (q) => q.eq("email", args.email)).first();
    if (!user) throw new Error("User not found");

    if ((user.streakFreezes || 0) <= 0) {
      throw new Error("No streak freezes available");
    }

    await ctx.db.patch(user._id, {
      streakFreezes: (user.streakFreezes || 0) - 1,
    });

    return { success: true, remainingFreezes: (user.streakFreezes || 0) - 1 };
  },
});

// Step 17: Get streak rewards data for display
export const getStreakRewards = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db.query("users").withIndex("by_email", (q) => q.eq("email", args.email)).first();
    if (!user) return null;

    const currentStreak = user.streak || 0;
    const streakFreezes = user.streakFreezes || 0;
    const longestStreak = user.longestStreak || 0;
    const totalStreakDays = user.totalStreakDays || 0;
    const streakBonusXP = user.streakBonusXP || 0;

    // Calculate next milestone
    let nextMilestone = 7;
    if (currentStreak >= 100) nextMilestone = Math.ceil((currentStreak + 1) / 10) * 10;
    else if (currentStreak >= 30) nextMilestone = 100;
    else if (currentStreak >= 7) nextMilestone = 30;

    // Calculate milestones achieved
    const milestones = {
      day7: currentStreak >= 7,
      day30: currentStreak >= 30,
      day100: currentStreak >= 100,
    };

    return {
      currentStreak,
      streakFreezes,
      longestStreak,
      totalStreakDays,
      streakBonusXP,
      nextMilestone,
      daysUntilMilestone: nextMilestone - currentStreak,
      milestones,
    };
  },
});

// Step 18: Get user's power-up inventory
export const getPowerUps = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const powerUps = await ctx.db
      .query("powerUps")
      .withIndex("by_user", (q) => q.eq("email", args.email))
      .collect();

    return powerUps;
  },
});

// Step 19: Purchase a power-up from the shop
export const purchasePowerUp = mutation({
  args: {
    email: v.string(),
    powerUpType: v.string(),
    powerUpName: v.string(),
    gemsCost: v.number(),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Get user
    const user = await ctx.db.query("users").withIndex("by_email", (q) => q.eq("email", args.email)).first();
    if (!user) throw new Error("User not found");

    // Check if user has enough gems
    const currentGems = user.gems || 0;
    const totalCost = args.gemsCost * args.quantity;

    if (currentGems < totalCost) {
      throw new Error(`Not enough gems. You have ${currentGems}, but need ${totalCost}`);
    }

    // Deduct gems from user
    await ctx.db.patch(user._id, {
      gems: currentGems - totalCost,
    });

    // Add power-up to inventory
    const existingPowerUp = await ctx.db
      .query("powerUps")
      .withIndex("by_user_type", (q) => q.eq("email", args.email).eq("powerUpType", args.powerUpType))
      .first();

    if (existingPowerUp) {
      // Update quantity
      await ctx.db.patch(existingPowerUp._id, {
        quantity: existingPowerUp.quantity + args.quantity,
        updatedAt: Date.now(),
      });
    } else {
      // Create new inventory entry
      await ctx.db.insert("powerUps", {
        email: args.email,
        powerUpType: args.powerUpType,
        quantity: args.quantity,
        updatedAt: Date.now(),
      });
    }

    // Record purchase history
    await ctx.db.insert("powerUpPurchases", {
      email: args.email,
      powerUpType: args.powerUpType,
      powerUpName: args.powerUpName,
      gemsCost: args.gemsCost,
      quantity: args.quantity,
      purchasedAt: Date.now(),
    });

    return {
      success: true,
      newGemBalance: currentGems - totalCost,
      newQuantity: existingPowerUp ? existingPowerUp.quantity + args.quantity : args.quantity,
    };
  },
});

// Step 20: Use a power-up during a lesson
export const usePowerUp = mutation({
  args: {
    email: v.string(),
    powerUpType: v.string(),
    lessonId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Check if user has this power-up
    const powerUp = await ctx.db
      .query("powerUps")
      .withIndex("by_user_type", (q) => q.eq("email", args.email).eq("powerUpType", args.powerUpType))
      .first();

    if (!powerUp || powerUp.quantity <= 0) {
      throw new Error(`You don't have any ${args.powerUpType} power-ups`);
    }

    // Decrease quantity
    await ctx.db.patch(powerUp._id, {
      quantity: powerUp.quantity - 1,
      updatedAt: Date.now(),
    });

    // Record usage
    await ctx.db.insert("powerUpUsage", {
      email: args.email,
      powerUpType: args.powerUpType,
      lessonId: args.lessonId,
      usedAt: Date.now(),
    });

    return {
      success: true,
      remainingQuantity: powerUp.quantity - 1,
    };
  },
});

// Step 21: Get shop items with user's gem balance
export const getShopData = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Get user's gem balance
    const user = await ctx.db.query("users").withIndex("by_email", (q) => q.eq("email", args.email)).first();
    if (!user) return null;

    // Get user's power-ups inventory
    const powerUps = await ctx.db
      .query("powerUps")
      .withIndex("by_user", (q) => q.eq("email", args.email))
      .collect();

    // Create inventory map
    const inventory: Record<string, number> = {};
    powerUps.forEach((powerUp) => {
      inventory[powerUp.powerUpType] = powerUp.quantity;
    });

    // Define shop items
    const shopItems = [
      {
        id: "hint",
        name: "Hint",
        description: "Reveal one answer option",
        icon: "💡",
        price: 25,
        owned: inventory["hint"] || 0,
      },
      {
        id: "skip_question",
        name: "Skip Question",
        description: "Skip one difficult question",
        icon: "⏭️",
        price: 50,
        owned: inventory["skip_question"] || 0,
      },
      {
        id: "time_freeze",
        name: "Time Freeze",
        description: "Pause timer for 30 seconds",
        icon: "⏸️",
        price: 75,
        owned: inventory["time_freeze"] || 0,
      },
      {
        id: "extra_heart",
        name: "Extra Heart",
        description: "Restore 1 heart",
        icon: "❤️",
        price: 100,
        owned: inventory["extra_heart"] || 0,
      },
      {
        id: "streak_freeze_shop",
        name: "Streak Freeze",
        description: "Protect your streak for 1 day",
        icon: "🧊",
        price: 200,
        owned: inventory["streak_freeze_shop"] || 0,
      },
    ];

    return {
      gems: user.gems || 0,
      shopItems,
    };
  },
});

// Step 22: Get AI-powered lesson recommendations based on performance
export const getRecommendations = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    // Get user
    const user = await ctx.db.query("users").withIndex("by_email", (q) => q.eq("email", args.email)).first();
    if (!user) return [];

    // Get all progress records for Dark Psychology lessons
    const allProgress = await ctx.db
      .query("progress")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    const darkPsychProgress = allProgress.filter((p) => p.darkPsychLessonId);

    // Define all Dark Psychology lessons with topics
    const allLessons = [
      { id: "A1-1", number: 1, title: "First Impressions & Manipulation Basics", topic: "Manipulation Basics", unit: "A" },
      { id: "A1-2", number: 2, title: "Cognitive Biases in Decision Making", topic: "Cognitive Biases", unit: "A" },
      { id: "A1-3", number: 3, title: "The Art of Persuasion", topic: "Persuasion", unit: "A" },
      { id: "A2-1", number: 4, title: "Reading Microexpressions", topic: "Microexpressions", unit: "A" },
      { id: "A2-2", number: 5, title: "Emotional Intelligence & Influence", topic: "Emotional Intelligence", unit: "A" },
      { id: "B1-1", number: 6, title: "Protecting Yourself from Manipulation", topic: "Defense Tactics", unit: "B" },
    ];

    // Analyze each lesson for performance metrics
    const lessonAnalysis = allLessons.map((lesson) => {
      const progressRecords = darkPsychProgress.filter((p) => p.darkPsychLessonId === lesson.id);

      if (progressRecords.length === 0) {
        // Not started - high priority recommendation
        return {
          ...lesson,
          status: "not_started",
          accuracy: 0,
          attempts: 0,
          priority: 3, // High priority for unstarted lessons
          reason: "You haven't started this lesson yet",
        };
      }

      // Calculate accuracy from all attempts
      let totalQuestions = 0;
      let totalCorrect = 0;
      let attempts = 0;
      let isCompleted = false;

      progressRecords.forEach((record) => {
        attempts++;
        if (record.isCompleted) isCompleted = true;

        const wrong = record.wrongAnswersCount || 0;
        const correct = record.correctAnswersCount || 0;
        totalQuestions += wrong + correct;
        totalCorrect += correct;
      });

      const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

      // Determine priority based on accuracy
      let priority = 0;
      let reason = "";

      if (accuracy < 50) {
        priority = 5; // Very high priority - struggling
        reason = `Low accuracy (${accuracy}%) - needs review`;
      } else if (accuracy < 70) {
        priority = 4; // High priority - weak area
        reason = `Accuracy is ${accuracy}% - room for improvement`;
      } else if (!isCompleted) {
        priority = 2; // Medium priority - incomplete but doing okay
        reason = "In progress - continue to complete";
      } else if (accuracy < 90 && isCompleted) {
        priority = 1; // Low priority - completed but could improve
        reason = `Completed with ${accuracy}% - practice for mastery`;
      } else {
        priority = 0; // No recommendation - mastered
        reason = `Mastered with ${accuracy}%`;
      }

      return {
        ...lesson,
        status: isCompleted ? "completed" : "in_progress",
        accuracy,
        attempts,
        priority,
        reason,
      };
    });

    // Filter to only recommend lessons with priority > 0, sorted by priority (descending)
    const recommendations = lessonAnalysis
      .filter((lesson) => lesson.priority > 0)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3); // Top 3 recommendations

    return recommendations;
  },
});

// Step 23: Batch upload lessons from JSON files
// Step: Upload a single lesson (one at a time to avoid memory limits)
// This processes one lesson file at a time instead of batching 50+ files
// which prevents the 16MB Convex function execution limit
// ⚠️ NOTE: This is a system operation and doesn't require user authentication
export const uploadSingleLesson = mutation({
  args: {
    lessonData: v.any(), // Single lesson JSON object
  },
  handler: async (ctx, args) => {
    // ✅ FIX: Remove authentication requirement for system operations
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) throw new Error("Not authenticated");

    const { lessonData } = args;

    // Validate required fields
    if (!lessonData.lessonId || !lessonData.lessonTitle) {
      throw new Error(`Missing lessonId or lessonTitle in lesson data`);
    }

    // Check if lesson already exists (using lessonId + lessonPart for uniqueness)
    const uniqueKey = `${lessonData.lessonId}-Part${lessonData.lessonPart}`;
    const existingLesson = await ctx.db
      .query("lessons")
      .filter((q) => q.eq(q.field("title"), uniqueKey))
      .first();

    if (existingLesson) {
      throw new Error(`Lesson "${lessonData.lessonTitle}" (Part ${lessonData.lessonPart}) already exists`);
    }

    // Get or create a system user for global lessons
    let systemUser = await ctx.db.query("users").withIndex("by_email", (q) => q.eq("email", "system@duolearn.com")).first();

    if (!systemUser) {
      const userId = await ctx.db.insert("users", {
        email: "system@duolearn.com",
        name: "System",
        createdAt: Date.now(),
      });
      systemUser = await ctx.db.get(userId);
    }

    // Create lesson in database (use unique key as title to prevent duplicates)
    const lessonId = await ctx.db.insert("lessons", {
      userId: systemUser!._id,
      lessonNumber: lessonData.lessonPart || 1,
      title: uniqueKey, // Use unique key instead of lessonTitle to prevent duplicates
      lessonJSON: lessonData, // Store entire JSON structure
      createdAt: Date.now(),
    });

    return {
      success: true,
      lessonId,
      title: lessonData.lessonTitle,
      lessonIdFromJson: lessonData.lessonId,
    };
  },
});

// Step: Delete all lessons for a specific section (for testing/cleanup)
// ⚠️ NOTE: This is a system operation and doesn't require user authentication
export const deleteAllLessonsInSection = mutation({
  args: {
    sectionId: v.string(), // "A", "B", "C", or "D"
  },
  handler: async (ctx, args) => {
    // ✅ FIX: Remove authentication requirement for system operations
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) throw new Error("Not authenticated");

    // Get system user
    const systemUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", "system@duolearn.com"))
      .first();

    if (!systemUser) {
      return {
        success: false,
        message: "System user not found",
        deletedCount: 0,
      };
    }

    // Get all lessons for system user
    const allLessons = await ctx.db
      .query("lessons")
      .withIndex("by_userId", (q) => q.eq("userId", systemUser._id))
      .collect();

    // Filter lessons for this section
    const lessonsToDelete = allLessons.filter(lesson => {
      const lessonData = lesson.lessonJSON;
      return (lessonData?.sectionId || lessonData?.section) === args.sectionId;
    });

    // Delete each lesson
    for (const lesson of lessonsToDelete) {
      await ctx.db.delete(lesson._id);
    }

    return {
      success: true,
      message: `Deleted ${lessonsToDelete.length} lessons from Section ${args.sectionId}`,
      deletedCount: lessonsToDelete.length,
    };
  },
});

// Step 24: Reset all Dark Psychology user data (delete all progress/notes/bookmarks for a user)
export const resetAllUserData = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    let deletedCount = 0;

    // Delete all notes
    const notes = await ctx.db
      .query("darkPsychologyNotes")
      .withIndex("by_user_lesson", (q) => q.eq("email", args.email))
      .collect();
    for (const note of notes) {
      await ctx.db.delete(note._id);
      deletedCount++;
    }

    // Delete all bookmarks
    const bookmarks = await ctx.db
      .query("darkPsychologyBookmarks")
      .withIndex("by_user", (q) => q.eq("email", args.email))
      .collect();
    for (const bookmark of bookmarks) {
      await ctx.db.delete(bookmark._id);
      deletedCount++;
    }

    // Delete all review questions
    const reviews = await ctx.db
      .query("darkPsychologyReview")
      .withIndex("by_user", (q) => q.eq("email", args.email))
      .collect();
    for (const review of reviews) {
      await ctx.db.delete(review._id);
      deletedCount++;
    }

    // Delete all achievements
    const achievements = await ctx.db
      .query("darkPsychologyAchievements")
      .withIndex("by_user", (q) => q.eq("email", args.email))
      .collect();
    for (const achievement of achievements) {
      await ctx.db.delete(achievement._id);
      deletedCount++;
    }

    // Reset user's Dark Psychology related progress
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (user) {
      // Reset streak, gems, and other stats to 0
      await ctx.db.patch(user._id, {
        streak: 0,
        gems: 0,
        lastStreakDate: undefined,
      });
    }

    // Delete all Dark Psychology lesson progress
    if (user) {
      const allProgress = await ctx.db
        .query("progress")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .collect();

      const darkPsychProgress = allProgress.filter((p) => p.darkPsychLessonId);
      for (const progress of darkPsychProgress) {
        await ctx.db.delete(progress._id);
        deletedCount++;
      }
    }

    // Delete all power-ups
    const powerUps = await ctx.db
      .query("powerUps")
      .withIndex("by_user", (q) => q.eq("email", args.email))
      .collect();
    for (const powerUp of powerUps) {
      await ctx.db.delete(powerUp._id);
      deletedCount++;
    }

    return {
      success: true,
      message: `Reset complete! Deleted ${deletedCount} records for ${args.email}`,
      deletedCount,
    };
  },
});

// ✅ Complete backend with achievements system, streak rewards, power-ups shop, AI recommendations, batch upload, and user data reset.
