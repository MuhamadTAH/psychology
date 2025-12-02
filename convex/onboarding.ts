import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Save onboarding answers
export const saveOnboardingAnswers = mutation({
  args: {
    favoriteSubject: v.string(),
    studyTime: v.string(),
    motivation: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) throw new Error("User not found");

    // Check if onboarding already exists
    const existing = await ctx.db
      .query("onboarding")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (existing) {
      // Update existing
      await ctx.db.patch(existing._id, {
        favoriteSubject: args.favoriteSubject,
        studyTime: args.studyTime,
        motivation: args.motivation,
      });
    } else {
      // Create new
      await ctx.db.insert("onboarding", {
        userId: user._id,
        favoriteSubject: args.favoriteSubject,
        studyTime: args.studyTime,
        motivation: args.motivation,
        createdAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// Get user's onboarding answers
export const getOnboardingAnswers = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) return null;

    const onboarding = await ctx.db
      .query("onboarding")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    return onboarding;
  },
});
