import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all customization groups with their assets
export const getCustomizationGroups = query({
  handler: async (ctx) => {
    const groups = await ctx.db
      .query("customizationGroups")
      .withIndex("by_position")
      .collect();

    // Fetch assets and color palettes for each group
    const groupsWithData = await Promise.all(
      groups.map(async (group) => {
        const assets = await ctx.db
          .query("customizationAssets")
          .withIndex("by_groupId", (q) => q.eq("groupId", group._id))
          .collect();

        let colorPalette = null;
        if (group.colorPaletteId) {
          colorPalette = await ctx.db.get(group.colorPaletteId);
        }

        return {
          ...group,
          assets,
          colorPalette,
        };
      })
    );

    return groupsWithData;
  },
});

// Get user's saved character customization
export const getUserCharacter = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const character = await ctx.db
      .query("userCharacters")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    return character;
  },
});

// Save user's character customization
export const saveUserCharacter = mutation({
  args: {
    userId: v.id("users"),
    customization: v.any(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userCharacters")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        customization: args.customization,
        updatedAt: Date.now(),
      });
      return existing._id;
    } else {
      const id = await ctx.db.insert("userCharacters", {
        userId: args.userId,
        customization: args.customization,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      return id;
    }
  },
});

// Seed initial data (run once to populate database)
export const seedCharacterData = mutation({
  handler: async (ctx) => {
    // Create color palettes
    const skinPalette = await ctx.db.insert("colorPalettes", {
      name: "Skin Tones",
      colors: ["#f5c6a5", "#e8b298", "#c68642", "#8d5524", "#3d2817"],
      createdAt: Date.now(),
    });

    const hairPalette = await ctx.db.insert("colorPalettes", {
      name: "Hair Colors",
      colors: ["#3d2817", "#8d5524", "#c68642", "#e8b298", "#ff6b6b"],
      createdAt: Date.now(),
    });

    const eyePalette = await ctx.db.insert("colorPalettes", {
      name: "Eye Colors",
      colors: ["#3d2817", "#4a90e2", "#51cf66", "#868e96"],
      createdAt: Date.now(),
    });

    // Create customization groups
    const headGroup = await ctx.db.insert("customizationGroups", {
      name: "Head",
      position: 1,
      colorPaletteId: skinPalette,
      createdAt: Date.now(),
    });

    const hairGroup = await ctx.db.insert("customizationGroups", {
      name: "Hair",
      position: 2,
      removable: true,
      colorPaletteId: hairPalette,
      createdAt: Date.now(),
    });

    const eyesGroup = await ctx.db.insert("customizationGroups", {
      name: "Eyes",
      position: 3,
      colorPaletteId: eyePalette,
      createdAt: Date.now(),
    });

    return { success: true, message: "Character data seeded successfully!" };
  },
});
