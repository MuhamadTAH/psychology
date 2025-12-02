// 🧠 FILE PURPOSE
// Convex functions for managing Analytics AI query history.
// Allows saving user questions, retrieving past queries, and managing favorites.
// This enables users to track their analytics exploration over time.

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Step 1: Save a query to history
// Stores the question, answer, and metadata when a user asks the AI
export const saveQuery = mutation({
  args: {
    email: v.string(),
    question: v.string(),
    answer: v.string(),
    functionsUsed: v.array(v.string()),
    dataSnapshot: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Insert the query into history
    await ctx.db.insert("analyticsQueries", {
      email: args.email,
      question: args.question,
      answer: args.answer,
      functionsUsed: args.functionsUsed,
      dataSnapshot: args.dataSnapshot,
      timestamp: Date.now(),
      favorite: false,
    });

    return { success: true };
  },
});

// Step 2: Get all queries for a user (sorted by most recent)
// Returns the user's query history with optional limit
export const getUserQueries = query({
  args: {
    email: v.string(),
    limit: v.optional(v.number()), // Default: 50
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const limit = args.limit || 50;

    const queries = await ctx.db
      .query("analyticsQueries")
      .withIndex("by_user_timestamp", (q) => q.eq("email", args.email))
      .order("desc") // Most recent first
      .take(limit);

    return queries;
  },
});

// Step 3: Get favorite queries
// Returns only queries marked as favorite
export const getFavoriteQueries = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const queries = await ctx.db
      .query("analyticsQueries")
      .withIndex("by_user", (q) => q.eq("email", args.email))
      .collect();

    // Filter favorites
    return queries.filter((q) => q.favorite === true);
  },
});

// Step 4: Toggle favorite status
// Marks a query as favorite or removes the favorite flag
export const toggleFavorite = mutation({
  args: {
    queryId: v.id("analyticsQueries"),
    favorite: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    await ctx.db.patch(args.queryId, {
      favorite: args.favorite,
    });

    return { success: true };
  },
});

// Step 5: Delete a query from history
// Removes a specific query
export const deleteQuery = mutation({
  args: { queryId: v.id("analyticsQueries") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    await ctx.db.delete(args.queryId);
    return { success: true };
  },
});

// Step 6: Clear all query history for a user
// Deletes all queries (use with caution!)
export const clearAllQueries = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const queries = await ctx.db
      .query("analyticsQueries")
      .withIndex("by_user", (q) => q.eq("email", args.email))
      .collect();

    // Delete all queries
    for (const query of queries) {
      await ctx.db.delete(query._id);
    }

    return { success: true, deletedCount: queries.length };
  },
});

// ✅ In this file we achieved:
// Complete query history management with save, retrieve, favorite, and delete operations
