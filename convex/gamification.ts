import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Require an authenticated identity and optionally verify the provided email matches
const requireIdentity = async (ctx: any, providedEmail?: string) => {
  const identity = await ctx.auth.getUserIdentity();
  const email = identity?.email;

  if (!email) {
    throw new Error("Not authenticated");
  }

  if (providedEmail && providedEmail !== email) {
    throw new Error("Forbidden");
  }

  return identity;
};

// Get user stats (hearts, gems, xp, streak)
export const getUserStats = query({
  args: {
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx, args.email);
    const userEmail = identity.email!;

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
    const identity = await requireIdentity(ctx, args.email);
    const userEmail = identity.email!;

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
    const identity = await requireIdentity(ctx, args.email);
    const userEmail = identity.email!;

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
    const identity = await requireIdentity(ctx, args.email);
    const userEmail = identity.email!;

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", userEmail))
      .first();

    if (!user) throw new Error("User not found");

    // Get today's date (YYYY-MM-DD format)
    const today = new Date().toISOString().split("T")[0];
    const lastDate = user.lastLessonDate;

    let newStreak = user.streak ?? 0;
    let longestStreak = user.longestStreak ?? 0;
    let streakFreezesUsed = 0;

    if (!lastDate) {
      // First lesson ever
      newStreak = 1;
    } else if (lastDate === today) {
      // Already did lesson today, no change
      return {
        streak: newStreak,
        isToday: true,
        longestStreak,
        streakFreezesUsed: 0
      };
    } else {
      // Check if yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (lastDate === yesterdayStr) {
        // Did lesson yesterday, increment streak
        newStreak = newStreak + 1;
      } else {
        // Missed days - check if we have streak freezes
        const daysMissed = Math.floor((new Date(today).getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24));
        const currentFreezes = user.streakFreezes ?? 0;

        if (daysMissed === 1 && currentFreezes > 0) {
          // Use one freeze to maintain streak (missed exactly 1 day)
          streakFreezesUsed = 1;
          await ctx.db.patch(user._id, {
            streakFreezes: currentFreezes - 1,
          });
          // Streak stays the same (protected by freeze)
        } else {
          // Reset streak (either no freezes, or missed more than 1 day)
          newStreak = 1;
        }
      }
    }

    // Update longest streak if current is higher
    if (newStreak > longestStreak) {
      longestStreak = newStreak;
    }

    // Update user
    await ctx.db.patch(user._id, {
      streak: newStreak,
      lastLessonDate: today,
      longestStreak,
    });

    return {
      streak: newStreak,
      isToday: lastDate === today,
      longestStreak,
      streakFreezesUsed
    };
  },
});

// Equip streak freeze (purchase with gems)
export const equipStreakFreeze = mutation({
  args: {
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx, args.email);
    const userEmail = identity.email!;

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", userEmail))
      .first();

    if (!user) throw new Error("User not found");

    // Cost: 10 gems per freeze
    const FREEZE_COST = 10;
    const currentGems = user.gems ?? 0;

    if (currentGems < FREEZE_COST) {
      return { success: false, error: "Not enough gems" };
    }

    // Deduct gems and add freeze
    const currentFreezes = user.streakFreezes ?? 0;
    await ctx.db.patch(user._id, {
      gems: currentGems - FREEZE_COST,
      streakFreezes: currentFreezes + 1,
    });

    return {
      success: true,
      gems: currentGems - FREEZE_COST,
      streakFreezes: currentFreezes + 1,
    };
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
    // Step 1: Get user
    const identity = await requireIdentity(ctx, args.email);
    const userEmail = identity.email!;

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", userEmail))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Step 2: Calculate completion bonus XP (only if not already completed)
    // Award 10 XP bonus for completing the lesson
    const bonusXP = 10;

    // Step 3: Check if this is a global lesson or user lesson
    const isGlobalLesson = args.lessonId.startsWith("global-");

    // Step 4: For non-global lessons, update progress in database
    if (!isGlobalLesson) {
      const existingProgress = await ctx.db
        .query("progress")
        .withIndex("by_userId_and_lessonId", (q) =>
          q.eq("userId", user._id).eq("lessonId", args.lessonId as any)
        )
        .first();

      // Only award bonus if not already completed
      if (!existingProgress?.isCompleted) {
        const currentXP = user.xp ?? 0;
        const newXP = currentXP + bonusXP;

        await ctx.db.patch(user._id, {
          xp: newXP,
        });

        // Update weekly XP in leagues
        const userLeague = await ctx.db
          .query("leagues")
          .withIndex("by_userId", (q) => q.eq("userId", user._id))
          .first();

        if (userLeague) {
          const newWeeklyXP = userLeague.weeklyXP + bonusXP;
          await ctx.db.patch(userLeague._id, {
            weeklyXP: newWeeklyXP,
            lastUpdated: Date.now(),
          });
        }

        // Mark lesson as completed
        if (existingProgress) {
          await ctx.db.patch(existingProgress._id, {
            isCompleted: true,
            updatedAt: Date.now(),
          });
        } else {
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

        return { bonusXP, totalXP: newXP, alreadyCompleted: false };
      } else {
        return { bonusXP: 0, totalXP: user.xp ?? 0, alreadyCompleted: true };
      }
    } else {
      // Step 5: For global lessons, track completion in progress table
      const existingProgress = await ctx.db
        .query("progress")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .filter((q) => q.eq(q.field("lessonNumber"), args.lessonNumber))
        .first();

      // Only award bonus if not already completed
      if (!existingProgress?.isCompleted) {
        const currentXP = user.xp ?? 0;
        const newXP = currentXP + bonusXP;

        await ctx.db.patch(user._id, {
          xp: newXP,
        });

        // Update weekly XP in leagues
        const userLeague = await ctx.db
          .query("leagues")
          .withIndex("by_userId", (q) => q.eq("userId", user._id))
          .first();

        if (userLeague) {
          const newWeeklyXP = userLeague.weeklyXP + bonusXP;
          await ctx.db.patch(userLeague._id, {
            weeklyXP: newWeeklyXP,
            lastUpdated: Date.now(),
          });
        }

        // Create or update progress for global lesson
        if (existingProgress) {
          await ctx.db.patch(existingProgress._id, {
            isCompleted: true,
            updatedAt: Date.now(),
          });
        } else {
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

        return { bonusXP, totalXP: newXP, alreadyCompleted: false };
      } else {
        return { bonusXP: 0, totalXP: user.xp ?? 0, alreadyCompleted: true };
      }
    }
  },
});

// Step 1: Subscription Management

// Set subscription status (called from paywall)
export const setSubscriptionStatus = mutation({
  args: {
    status: v.string(), // "free" or "premium"
    plan: v.optional(v.string()), // "monthly" or "annual"
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) throw new Error("User not found");

    const now = Date.now();
    const updates: any = {
      subscriptionStatus: args.status,
      subscriptionStartDate: now,
    };

    if (args.status === "premium") {
      updates.subscriptionPlan = args.plan;
      // Set end date based on plan (for now, far future)
      // In production, this would be managed by payment processor
      const endDate = args.plan === "annual"
        ? now + (365 * 24 * 60 * 60 * 1000) // 1 year
        : now + (30 * 24 * 60 * 60 * 1000);  // 1 month
      updates.subscriptionEndDate = endDate;
    }

    await ctx.db.patch(user._id, updates);

    return { success: true, subscriptionStatus: args.status };
  },
});

// Get subscription status
export const getSubscriptionStatus = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { status: "free", isPremium: false };

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) return { status: "free", isPremium: false };

    const status = user.subscriptionStatus ?? "free";
    const isPremium = status === "premium";

    return {
      status,
      isPremium,
      plan: user.subscriptionPlan,
      startDate: user.subscriptionStartDate,
      endDate: user.subscriptionEndDate,
    };
  },
});

// Step 2: Heart Refill System (1 heart per hour)

// Check and refill hearts based on time elapsed
export const checkAndRefillHearts = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) throw new Error("User not found");

    // Premium users have unlimited hearts
    const isPremium = (user.subscriptionStatus ?? "free") === "premium";
    if (isPremium) {
      return { hearts: 999, isPremium: true, refilled: 0 };
    }

    const now = Date.now();
    const currentHearts = user.hearts ?? 5;
    const lastRefill = user.lastHeartRefill ?? now;

    // If already at max hearts (5), no need to refill
    if (currentHearts >= 5) {
      return { hearts: currentHearts, isPremium: false, refilled: 0 };
    }

    // Calculate hours elapsed since last refill
    const hoursElapsed = Math.floor((now - lastRefill) / (1000 * 60 * 60));

    if (hoursElapsed > 0) {
      // Refill hearts (1 per hour, max 5)
      const heartsToAdd = Math.min(hoursElapsed, 5 - currentHearts);
      const newHearts = Math.min(currentHearts + heartsToAdd, 5);

      await ctx.db.patch(user._id, {
        hearts: newHearts,
        lastHeartRefill: now,
      });

      return { hearts: newHearts, isPremium: false, refilled: heartsToAdd };
    }

    return { hearts: currentHearts, isPremium: false, refilled: 0 };
  },
});

// Get hearts with auto-refill check
export const getHearts = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { hearts: 5, isPremium: false, nextRefillIn: 0 };

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) return { hearts: 5, isPremium: false, nextRefillIn: 0 };

    const isPremium = (user.subscriptionStatus ?? "free") === "premium";
    if (isPremium) {
      return { hearts: 999, isPremium: true, nextRefillIn: 0 };
    }

    const currentHearts = user.hearts ?? 5;
    const lastRefill = user.lastHeartRefill ?? Date.now();
    const now = Date.now();

    // Calculate time until next heart refill (in milliseconds)
    const timeSinceRefill = now - lastRefill;
    const oneHour = 1000 * 60 * 60;
    const nextRefillIn = currentHearts < 5 ? oneHour - (timeSinceRefill % oneHour) : 0;

    return { hearts: currentHearts, isPremium: false, nextRefillIn };
  },
});

// Updated loseHeart to respect premium status
export const loseHeartV2 = mutation({
  args: {
    lessonId: v.optional(v.string()), // Made optional for dark psychology lessons
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx, args.email);
    const userEmail = identity.email!;

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", userEmail))
      .first();

    if (!user) throw new Error("User not found");

    // Premium users don't lose hearts
    const isPremium = (user.subscriptionStatus ?? "free") === "premium";
    if (isPremium) {
      return { hearts: 999, isPremium: true };
    }

    // Lose 1 heart (minimum 0)
    const currentHearts = user.hearts ?? 5;
    const newHearts = Math.max(0, currentHearts - 1);

    // Update last refill time when losing a heart (start the 1-hour timer)
    await ctx.db.patch(user._id, {
      hearts: newHearts,
      lastHeartRefill: newHearts < 5 ? Date.now() : (user.lastHeartRefill ?? Date.now()),
    });

    return { hearts: newHearts, isPremium: false };
  },
});
