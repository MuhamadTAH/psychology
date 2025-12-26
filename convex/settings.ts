// 🧠 FILE PURPOSE
// This file handles user settings and preferences.
// Users can update their profile information, email, and learning preferences.

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Step 1: Get user settings
export const getUserSettings = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) return null;

    // Get onboarding preferences if they exist
    const onboarding = await ctx.db
      .query("onboarding")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    return {
      name: user.name,
      email: user.email,
      age: user.age,
      school: user.school,
      image: user.image,
      avatar: user.avatar,
      favoriteSubject: onboarding?.favoriteSubject,
      studyTime: onboarding?.studyTime,
      motivation: onboarding?.motivation,
      // New settings with defaults
      pushNotifications: user.pushNotifications ?? true,
      emailNotifications: user.emailNotifications ?? true,
      streakReminders: user.streakReminders ?? true,
      soundEffects: user.soundEffects ?? true,
      animations: user.animations ?? true,
      profileVisibility: user.profileVisibility ?? "public",
      showStats: user.showStats ?? true,
    };
  },
});

// Step 2: Update user profile
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    age: v.optional(v.number()),
    school: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) throw new Error("User not found");

    // Update user fields (only update provided fields)
    const updates: any = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.age !== undefined) updates.age = args.age;
    if (args.school !== undefined) updates.school = args.school;

    await ctx.db.patch(user._id, updates);

    return { success: true, message: "Profile updated successfully" };
  },
});

// Step 3: Update learning preferences
export const updatePreferences = mutation({
  args: {
    favoriteSubject: v.optional(v.string()),
    studyTime: v.optional(v.string()),
    motivation: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) throw new Error("User not found");

    // Check if onboarding record exists
    const existingOnboarding = await ctx.db
      .query("onboarding")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (existingOnboarding) {
      // Update existing preferences
      const updates: any = {};
      if (args.favoriteSubject !== undefined) updates.favoriteSubject = args.favoriteSubject;
      if (args.studyTime !== undefined) updates.studyTime = args.studyTime;
      if (args.motivation !== undefined) updates.motivation = args.motivation;

      await ctx.db.patch(existingOnboarding._id, updates);
    } else {
      // Create new onboarding record
      await ctx.db.insert("onboarding", {
        userId: user._id,
        favoriteSubject: args.favoriteSubject || "english",
        studyTime: args.studyTime || "anytime",
        motivation: args.motivation || "learning",
        createdAt: Date.now(),
      });
    }

    return { success: true, message: "Preferences updated successfully" };
  },
});

// Step 4: Update app settings (notifications, preferences, privacy)
export const updateAppSettings = mutation({
  args: {
    pushNotifications: v.optional(v.boolean()),
    emailNotifications: v.optional(v.boolean()),
    streakReminders: v.optional(v.boolean()),
    soundEffects: v.optional(v.boolean()),
    animations: v.optional(v.boolean()),
    profileVisibility: v.optional(v.string()),
    showStats: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) throw new Error("User not found");

    // Update user settings (only update provided fields)
    const updates: any = {};
    if (args.pushNotifications !== undefined) updates.pushNotifications = args.pushNotifications;
    if (args.emailNotifications !== undefined) updates.emailNotifications = args.emailNotifications;
    if (args.streakReminders !== undefined) updates.streakReminders = args.streakReminders;
    if (args.soundEffects !== undefined) updates.soundEffects = args.soundEffects;
    if (args.animations !== undefined) updates.animations = args.animations;
    if (args.profileVisibility !== undefined) updates.profileVisibility = args.profileVisibility;
    if (args.showStats !== undefined) updates.showStats = args.showStats;

    await ctx.db.patch(user._id, updates);

    return { success: true, message: "Settings updated successfully" };
  },
});

// ✅ In this file we achieved:
// Queries and mutations for managing user settings and preferences.
// Support for updating profile information and learning preferences.
// Support for app settings: notifications, preferences, and privacy.
