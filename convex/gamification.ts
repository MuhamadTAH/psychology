import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get user stats (hearts, gems, xp, streak)
export const getUserStats = query({
  args: {
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Try Clerk auth first (for backward compatibility)
    const identity = await ctx.auth.getUserIdentity();
    const userEmail = args.email || identity?.email;

    if (!userEmail) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", userEmail))
      .first();

    if (!user) return null;

    return {
      hearts: user.hearts ?? 5,
      gems: user.gems ?? 0,
      xp: user.xp ?? 0,
      streak: user.streak ?? 0,
    };
  },
});

// Initialize user stats if not set
export const initializeUserStats = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) throw new Error("User not found");

    // Only initialize if fields are undefined
    if (user.hearts === undefined || user.gems === undefined || user.xp === undefined) {
      await ctx.db.patch(user._id, {
        hearts: user.hearts ?? 5,
        gems: user.gems ?? 0,
        xp: user.xp ?? 0,
        streak: user.streak ?? 0,
      });
    }

    return {
      hearts: user.hearts ?? 5,
      gems: user.gems ?? 0,
      xp: user.xp ?? 0,
      streak: user.streak ?? 0,
    };
  },
});

// Lose heart (on wrong answer)
export const loseHeart = mutation({
  args: {
    lessonId: v.id("lessons"),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Try Clerk auth first (for backward compatibility)
    const identity = await ctx.auth.getUserIdentity();
    const userEmail = args.email || identity?.email;

    if (!userEmail) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", userEmail))
      .first();

    if (!user) throw new Error("User not found");

    // Check if lesson is already completed (don't lose hearts)
    const progress = await ctx.db
      .query("progress")
      .withIndex("by_userId_and_lessonId", (q) =>
        q.eq("userId", user._id).eq("lessonId", args.lessonId)
      )
      .first();

    if (progress?.isCompleted) {
      // Lesson already completed, don't lose hearts
      return { hearts: user.hearts ?? 5, wasCompleted: true };
    }

    // Lose 1 heart (minimum 0)
    const currentHearts = user.hearts ?? 5;
    const newHearts = Math.max(0, currentHearts - 1);

    await ctx.db.patch(user._id, {
      hearts: newHearts,
    });

    return { hearts: newHearts, wasCompleted: false };
  },
});

// Restore hearts to 5
export const restoreHearts = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      hearts: 5,
    });

    return { hearts: 5 };
  },
});

// Add or subtract XP
export const addXP = mutation({
  args: {
    amount: v.number(), // +5 or -5
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Try Clerk auth first (for backward compatibility)
    const identity = await ctx.auth.getUserIdentity();
    const userEmail = args.email || identity?.email;

    if (!userEmail) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", userEmail))
      .first();

    if (!user) throw new Error("User not found");

    // Add/subtract XP (minimum 0)
    const currentXP = user.xp ?? 0;
    const newXP = Math.max(0, currentXP + args.amount);

    await ctx.db.patch(user._id, {
      xp: newXP,
    });

    // Also update weeklyXP in leagues table if user is in a league
    const userLeague = await ctx.db
      .query("leagues")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (userLeague) {
      const newWeeklyXP = Math.max(0, userLeague.weeklyXP + args.amount);
      await ctx.db.patch(userLeague._id, {
        weeklyXP: newWeeklyXP,
        lastUpdated: Date.now(),
      });
    }

    return { xp: newXP, change: args.amount };
  },
});

// Open treasure chest
export const openChest = mutation({
  args: {
    chestPosition: v.number(), // 3, 6, 9, etc.
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) throw new Error("User not found");

    // Check if chest already opened
    const existingChest = await ctx.db
      .query("chests")
      .withIndex("by_userId_and_position", (q) =>
        q.eq("userId", user._id).eq("chestPosition", args.chestPosition)
      )
      .first();

    if (existingChest?.isOpened) {
      return { gems: user.gems ?? 0, alreadyOpened: true };
    }

    // Add 5 gems
    const currentGems = user.gems ?? 0;
    const newGems = currentGems + 5;

    await ctx.db.patch(user._id, {
      gems: newGems,
    });

    // Mark chest as opened
    if (existingChest) {
      await ctx.db.patch(existingChest._id, {
        isOpened: true,
        openedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("chests", {
        userId: user._id,
        chestPosition: args.chestPosition,
        isOpened: true,
        openedAt: Date.now(),
      });
    }

    return { gems: newGems, alreadyOpened: false };
  },
});

// Check if chest is opened
export const isChestOpened = query({
  args: {
    chestPosition: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) return false;

    const chest = await ctx.db
      .query("chests")
      .withIndex("by_userId_and_position", (q) =>
        q.eq("userId", user._id).eq("chestPosition", args.chestPosition)
      )
      .first();

    return chest?.isOpened ?? false;
  },
});

// Update streak
export const updateStreak = mutation({
  args: {
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Try Clerk auth first (for backward compatibility)
    const identity = await ctx.auth.getUserIdentity();
    const userEmail = args.email || identity?.email;

    if (!userEmail) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", userEmail))
      .first();

    if (!user) throw new Error("User not found");

    // Get today's date (YYYY-MM-DD format)
    const today = new Date().toISOString().split("T")[0];
    const lastDate = user.lastLessonDate;

    let newStreak = user.streak ?? 0;

    if (!lastDate) {
      // First lesson ever
      newStreak = 1;
    } else if (lastDate === today) {
      // Already did lesson today, no change
      return { streak: newStreak, isToday: true };
    } else {
      // Check if yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (lastDate === yesterdayStr) {
        // Did lesson yesterday, increment streak
        newStreak = newStreak + 1;
      } else {
        // Missed days, reset streak
        newStreak = 1;
      }
    }

    // Update user
    await ctx.db.patch(user._id, {
      streak: newStreak,
      lastLessonDate: today,
    });

    return { streak: newStreak, isToday: lastDate === today };
  },
});

// Get user avatar
export const getUserAvatar = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) return null;

    return user.avatar ?? "default";
  },
});

// Update user avatar
export const updateAvatar = mutation({
  args: {
    avatar: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      avatar: args.avatar,
    });

    return { avatar: args.avatar };
  },
});

// Complete lesson: Mark as completed and award bonus XP
export const completeLesson = mutation({
  args: {
    lessonId: v.string(), // Can be lesson ID or "global-X"
    lessonNumber: v.number(),
    correctAnswers: v.number(),
    totalQuestions: v.number(),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log("🔵 [MUTATION] completeLesson called with args:", args);

    // Step 1: Get user
    const identity = await ctx.auth.getUserIdentity();
    const userEmail = args.email || identity?.email;

    console.log("🔵 [MUTATION] User email:", userEmail);

    if (!userEmail) {
      console.log("❌ [MUTATION] No user email - not authenticated");
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", userEmail))
      .first();

    console.log("🔵 [MUTATION] User found:", user ? `${user.email} (ID: ${user._id})` : "NOT FOUND");

    if (!user) {
      console.log("❌ [MUTATION] User not found in database");
      throw new Error("User not found");
    }

    // Step 2: Calculate completion bonus XP (only if not already completed)
    // Award 10 XP bonus for completing the lesson
    const bonusXP = 10;
    console.log("🔵 [MUTATION] Bonus XP to award:", bonusXP);

    // Step 3: Check if this is a global lesson or user lesson
    const isGlobalLesson = args.lessonId.startsWith("global-");
    console.log("🔵 [MUTATION] Is global lesson:", isGlobalLesson, "| Lesson ID:", args.lessonId);

    // Step 4: For non-global lessons, update progress in database
    if (!isGlobalLesson) {
      console.log("🔵 [MUTATION] Processing user lesson (non-global)");
      const existingProgress = await ctx.db
        .query("progress")
        .withIndex("by_userId_and_lessonId", (q) =>
          q.eq("userId", user._id).eq("lessonId", args.lessonId as any)
        )
        .first();

      console.log("🔵 [MUTATION] Existing progress:", existingProgress ? `Found (completed: ${existingProgress.isCompleted})` : "NOT FOUND");

      // Only award bonus if not already completed
      if (!existingProgress?.isCompleted) {
        console.log("✅ [MUTATION] Lesson not completed yet, awarding XP...");
        const currentXP = user.xp ?? 0;
        const newXP = currentXP + bonusXP;

        console.log("🔵 [MUTATION] Updating user XP:", currentXP, "→", newXP);

        await ctx.db.patch(user._id, {
          xp: newXP,
        });

        console.log("✅ [MUTATION] User XP updated successfully");

        // Update weekly XP in leagues
        const userLeague = await ctx.db
          .query("leagues")
          .withIndex("by_userId", (q) => q.eq("userId", user._id))
          .first();

        console.log("🔵 [MUTATION] User league:", userLeague ? "Found" : "NOT FOUND");

        if (userLeague) {
          const newWeeklyXP = userLeague.weeklyXP + bonusXP;
          console.log("🔵 [MUTATION] Updating league XP:", userLeague.weeklyXP, "→", newWeeklyXP);
          await ctx.db.patch(userLeague._id, {
            weeklyXP: newWeeklyXP,
            lastUpdated: Date.now(),
          });
          console.log("✅ [MUTATION] League XP updated successfully");
        }

        // Mark lesson as completed
        if (existingProgress) {
          console.log("🔵 [MUTATION] Updating existing progress to completed");
          await ctx.db.patch(existingProgress._id, {
            isCompleted: true,
            updatedAt: Date.now(),
          });
        } else {
          console.log("🔵 [MUTATION] Creating new progress record");
          await ctx.db.insert("progress", {
            userId: user._id,
            lessonId: args.lessonId as any,
            lessonNumber: args.lessonNumber,
            completedStages: ["completed"],
            mistakes: [],
            isCompleted: true,
            updatedAt: Date.now(),
          });
        }

        console.log("✅ [MUTATION] Lesson marked as completed");
        console.log("🎉 [MUTATION] Success! Returning:", { bonusXP, totalXP: newXP, alreadyCompleted: false });

        return { bonusXP, totalXP: newXP, alreadyCompleted: false };
      } else {
        console.log("⚠️ [MUTATION] Lesson already completed, no XP awarded");
        return { bonusXP: 0, totalXP: user.xp ?? 0, alreadyCompleted: true };
      }
    } else {
      // Step 5: For global lessons, track completion in progress table
      console.log("🔵 [MUTATION] Processing global lesson");
      const existingProgress = await ctx.db
        .query("progress")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .filter((q) => q.eq(q.field("lessonNumber"), args.lessonNumber))
        .first();

      console.log("🔵 [MUTATION] Existing progress:", existingProgress ? `Found (completed: ${existingProgress.isCompleted})` : "NOT FOUND");

      // Only award bonus if not already completed
      if (!existingProgress?.isCompleted) {
        console.log("✅ [MUTATION] Global lesson not completed yet, awarding XP...");
        const currentXP = user.xp ?? 0;
        const newXP = currentXP + bonusXP;

        console.log("🔵 [MUTATION] Updating user XP:", currentXP, "→", newXP);

        await ctx.db.patch(user._id, {
          xp: newXP,
        });

        console.log("✅ [MUTATION] User XP updated successfully");

        // Update weekly XP in leagues
        const userLeague = await ctx.db
          .query("leagues")
          .withIndex("by_userId", (q) => q.eq("userId", user._id))
          .first();

        console.log("🔵 [MUTATION] User league:", userLeague ? "Found" : "NOT FOUND");

        if (userLeague) {
          const newWeeklyXP = userLeague.weeklyXP + bonusXP;
          console.log("🔵 [MUTATION] Updating league XP:", userLeague.weeklyXP, "→", newWeeklyXP);
          await ctx.db.patch(userLeague._id, {
            weeklyXP: newWeeklyXP,
            lastUpdated: Date.now(),
          });
          console.log("✅ [MUTATION] League XP updated successfully");
        }

        // Create or update progress for global lesson
        if (existingProgress) {
          console.log("🔵 [MUTATION] Updating existing global lesson progress to completed");
          await ctx.db.patch(existingProgress._id, {
            isCompleted: true,
            updatedAt: Date.now(),
          });
        } else {
          console.log("🔵 [MUTATION] Creating new global lesson progress record");
          await ctx.db.insert("progress", {
            userId: user._id,
            lessonId: undefined, // No lessonId for global lessons
            lessonNumber: args.lessonNumber,
            completedStages: ["completed"],
            mistakes: [],
            isCompleted: true,
            updatedAt: Date.now(),
          });
        }

        console.log("✅ [MUTATION] Global lesson marked as completed");
        console.log("🎉 [MUTATION] Success! Returning:", { bonusXP, totalXP: newXP, alreadyCompleted: false });

        return { bonusXP, totalXP: newXP, alreadyCompleted: false };
      } else {
        console.log("⚠️ [MUTATION] Global lesson already completed, no XP awarded");
        return { bonusXP: 0, totalXP: user.xp ?? 0, alreadyCompleted: true };
      }
    }
  },
});
