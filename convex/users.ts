// 🧠 FILE PURPOSE
// This file handles user following/friends functionality.
// Users can follow/unfollow other users and get friend suggestions.

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Step 1: Follow a user
// Adds a user ID to the current user's following array
export const followUser = mutation({
  args: {
    friendId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Prevent following self
    if (args.friendId === identity.subject) {
      throw new Error("Cannot follow yourself");
    }

    // Get current user
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!currentUser) throw new Error("User not found");

    // Check if already following
    const currentFollowing = currentUser.following || [];
    if (currentFollowing.includes(args.friendId)) {
      return { success: false, message: "Already following this user" };
    }

    // Add to following array
    await ctx.db.patch(currentUser._id, {
      following: [...currentFollowing, args.friendId],
    });

    return { success: true, message: "User followed successfully" };
  },
});

// Step 2: Unfollow a user
// Removes a user ID from the current user's following array
export const unfollowUser = mutation({
  args: {
    friendId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Prevent unfollowing self (no-op)
    if (args.friendId === identity.subject) {
      return { success: false, message: "Cannot unfollow yourself" };
    }

    // Get current user
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!currentUser) throw new Error("User not found");

    // Remove from following array
    const currentFollowing = currentUser.following || [];
    const updatedFollowing = currentFollowing.filter(
      (id) => id !== args.friendId
    );

    await ctx.db.patch(currentUser._id, {
      following: updatedFollowing,
    });

    return { success: true, message: "User unfollowed successfully" };
  },
});

// Step 3: Get users that the current user is following
// Returns full user objects for everyone the current user follows
export const getFollowing = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    // Get current user
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!currentUser || !currentUser.following) return [];

    // Get full user objects for each followed user
    const followingUsers = await Promise.all(
      currentUser.following.map(async (userId) => {
        const user = await ctx.db.get(userId);
        if (!user) return null;

        return {
          _id: user._id,
          name: user.name || "User",
          email: user.email,
          avatar: user.avatar || "default",
          xp: user.xp || 0,
          streak: user.streak || 0,
        };
      })
    );

    // Filter out null values (deleted users)
    return followingUsers.filter((user) => user !== null);
  },
});

// Step 4: Get friend suggestions
// Returns users that the current user is NOT already following
export const getFriendSuggestions = query({
  args: {
    limit: v.optional(v.number()), // How many suggestions to return (default: 10)
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const limit = args.limit || 10;

    // Get current user
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!currentUser) return [];

    const currentFollowing = currentUser.following || [];

    // Get all users except current user
    const allUsers = await ctx.db.query("users").collect();

    // Filter out: current user + already following
    const suggestions = allUsers
      .filter(
        (user) =>
          user._id !== currentUser._id && // Not self
          !currentFollowing.includes(user._id) // Not already following
      )
      .slice(0, limit) // Limit results
      .map((user) => ({
        _id: user._id,
        name: user.name || "User",
        email: user.email,
        avatar: user.avatar || "default",
        xp: user.xp || 0,
        streak: user.streak || 0,
        school: user.school,
      }));

    return suggestions;
  },
});

// Step 5: Get user's followers (who follows this user)
// Returns users who have the current user in their following array
export const getFollowers = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    // Get current user
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!currentUser) return [];

    // Find all users who have current user in their following array
    const allUsers = await ctx.db.query("users").collect();

    const followers = allUsers
      .filter(
        (user) =>
          user.following && user.following.includes(currentUser._id)
      )
      .map((user) => ({
        _id: user._id,
        name: user.name || "User",
        email: user.email,
        avatar: user.avatar || "default",
        xp: user.xp || 0,
        streak: user.streak || 0,
      }));

    return followers;
  },
});

// Step 6: Check if current user follows a specific user
// Returns true/false
export const isFollowing = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!currentUser) return false;

    const currentFollowing = currentUser.following || [];
    return currentFollowing.includes(args.userId);
  },
});

// Step 7: Get following count
// Returns number of users the current user follows
export const getFollowingCount = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!currentUser) return 0;

    return (currentUser.following || []).length;
  },
});

// Step 8: Get followers count
// Returns number of users who follow the current user
export const getFollowersCount = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!currentUser) return 0;

    // Count users who have current user in their following array
    const allUsers = await ctx.db.query("users").collect();
    const followersCount = allUsers.filter(
      (user) => user.following && user.following.includes(currentUser._id)
    ).length;

    return followersCount;
  },
});

// Step 9: Update user profile name
// Updates the user's name in the database (persists across sessions)
export const updateUserName = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Get current user
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!currentUser) throw new Error("User not found");

    // Update name in database
    await ctx.db.patch(currentUser._id, {
      name: args.name,
    });

    return { success: true, message: "Name updated successfully" };
  },
});

// Step 10: Search users by name or email
// Returns users matching the search query (case-insensitive)
export const searchUsers = query({
  args: {
    searchQuery: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    // Get current user
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!currentUser) return [];

    // Search query (trim and lowercase)
    const query = args.searchQuery.trim().toLowerCase();
    if (query.length < 2) return []; // Minimum 2 characters

    // Get all users
    const allUsers = await ctx.db.query("users").collect();

    // Filter by name or email (case-insensitive) and exclude current user
    const matchingUsers = allUsers
      .filter((user) => {
        if (user._id === currentUser._id) return false; // Exclude self

        const name = (user.name || "").toLowerCase();
        const email = (user.email || "").toLowerCase();

        return name.includes(query) || email.includes(query);
      })
      .map((user) => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        xp: user.xp ?? 0,
        streak: user.streak ?? 0,
        isFollowing: currentUser.following?.includes(user._id) || false,
      }))
      .slice(0, 20); // Limit to 20 results

    return matchingUsers;
  },
});
