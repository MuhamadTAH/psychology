// Email/password auth is disabled. Use Clerk instead.

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const signup = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
    age: v.optional(v.number()),
    school: v.optional(v.string()),
  },
  handler: async () => {
    throw new Error("Email/password signup is disabled. Please sign in with Clerk.");
  },
});

export const signin = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async () => {
    throw new Error("Email/password signin is disabled. Please use Clerk.");
  },
});

export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async () => {
    throw new Error("getUserByEmail is disabled; use Clerk session/user APIs.");
  },
});
