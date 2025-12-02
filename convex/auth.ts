// 🧠 FILE PURPOSE
// This file handles user authentication using Convex directly
// Provides signup and signin functions with password hashing

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Step 1: Simple password hashing function
// Uses a simple reversible encoding for now
// In production, you should use a proper hashing library
function hashPassword(password: string): string {
  // Simple encoding - converts password to hex format
  // This is NOT secure for production! Upgrade to bcrypt/argon2 later
  let hash = '';
  for (let i = 0; i < password.length; i++) {
    hash += password.charCodeAt(i).toString(16).padStart(2, '0');
  }
  return hash;
}

function verifyPassword(password: string, hashedPassword: string): boolean {
  return hashPassword(password) === hashedPassword;
}

// ✅ In this section we achieved:
// Basic password hashing utilities for authentication

// Step 2: Sign up new user
// Creates a new user account with email, password, and optional profile data
export const signup = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
    age: v.optional(v.number()),
    school: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const hashedPassword = hashPassword(args.password);

    // Create new user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      password: hashedPassword,
      name: args.name,
      age: args.age,
      school: args.school,
      // Initialize gamification stats
      hearts: 5,
      gems: 0,
      xp: 0,
      streak: 0,
      createdAt: Date.now(),
    });

    return {
      success: true,
      userId,
      user: {
        email: args.email,
        name: args.name,
      },
    };
  },
});

// ✅ In this section we achieved:
// User registration with email/password and initial stats

// Step 3: Sign in existing user
// Validates credentials and returns user data
export const signin = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    if (!user.password) {
      throw new Error("This account uses social login. Please sign in with Google or GitHub.");
    }

    if (!verifyPassword(args.password, user.password)) {
      throw new Error("Invalid email or password");
    }

    // Return user data (excluding password)
    return {
      success: true,
      userId: user._id,
      user: {
        email: user.email,
        name: user.name,
        age: user.age,
        school: user.school,
        hearts: user.hearts || 5,
        gems: user.gems || 0,
        xp: user.xp || 0,
        streak: user.streak || 0,
      },
    };
  },
});

// ✅ In this section we achieved:
// User login with credential validation

// Step 4: Get current user by email
// Helper query to fetch user data (used after signin to maintain session)
export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      return null;
    }

    // Return user without password
    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      age: user.age,
      school: user.school,
      hearts: user.hearts || 5,
      gems: user.gems || 0,
      xp: user.xp || 0,
      streak: user.streak || 0,
      avatar: user.avatar,
      image: user.image,
    };
  },
});

// ✅ In this section we achieved:
// Complete Convex authentication system with signup, signin, and user retrieval
