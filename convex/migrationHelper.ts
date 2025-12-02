// 🧠 FILE PURPOSE
// This file contains helper functions for data migration and cleanup.
// Use these functions to fix old data that doesn't match the new schema.

import { mutation } from "./_generated/server";

// Delete all Dark Psychology progress records that don't have darkPsychLessonId
// This is needed because old progress was created before we added the unique ID field
export const deleteLegacyDarkPsychProgress = mutation({
  args: {},
  handler: async (ctx) => {
    // Get current user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get all progress records for this user
    const allProgress = await ctx.db
      .query("progress")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    // Filter records that don't have darkPsychLessonId (legacy records)
    const legacyRecords = allProgress.filter(p => !p.darkPsychLessonId);

    // Delete them
    for (const record of legacyRecords) {
      await ctx.db.delete(record._id);
    }

    return {
      success: true,
      message: `Deleted ${legacyRecords.length} legacy progress records`,
      deletedRecords: legacyRecords.length
    };
  },
});
