import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

const requireIdentity = async (ctx: any) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");
  return identity;
};

// Get leaderboard for user's current league
export const getLeagueLeaderboard = query({
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) return [];

    // Get user's league entry
    const userLeague = await ctx.db
      .query("leagues")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (!userLeague) return [];

    // Get all users in the same league, ordered by weeklyXP descending
    const leagueMembers = await ctx.db
      .query("leagues")
      .withIndex("by_leagueName_and_weeklyXP", (q) =>
        q.eq("leagueName", userLeague.leagueName)
      )
      .order("desc")
      .collect();

    // Get user details for each league member
    const leaderboard = await Promise.all(
      leagueMembers.map(async (member, index) => {
        const memberUser = await ctx.db.get(member.userId);
        const rank = index + 1;

        // Determine zone based on rank
        let zone = "safe";
        if (rank <= 5) zone = "promotion";
        else if (rank >= 96) zone = "demotion";

        return {
          rank,
          name: memberUser?.name || "User",
          flag: "🌍", // Default flag, can be added to user schema later
          xp: member.weeklyXP,
          avatar: memberUser?.avatar || "default",
          zone,
        };
      })
    );

    return leaderboard;
  },
});

// Get user's current rank
export const getUserRank = query({
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) return null;

    const userLeague = await ctx.db
      .query("leagues")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (!userLeague) return null;

    // Get all users in the same league with higher XP
    const higherRankedUsers = await ctx.db
      .query("leagues")
      .withIndex("by_leagueName_and_weeklyXP", (q) =>
        q.eq("leagueName", userLeague.leagueName)
      )
      .filter((q) => q.gt(q.field("weeklyXP"), userLeague.weeklyXP))
      .collect();

    return higherRankedUsers.length + 1; // Rank is count of higher users + 1
  },
});

// Get user's league info (league name and end date)
export const getUserLeagueInfo = query({
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) return null;

    const userLeague = await ctx.db
      .query("leagues")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (!userLeague) return null;

    return {
      leagueName: userLeague.leagueName,
      weekEndDate: userLeague.weekEndDate,
      weeklyXP: userLeague.weeklyXP,
    };
  },
});

// Initialize user in a league (call when user first joins)
export const initializeUserLeague = mutation({
  args: {
    email: v.string(), // Add this
  },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);

    // Step 1: Get or create user in Convex database
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) {
      // Create user if they don't exist (new Clerk user)
      const userId = await ctx.db.insert("users", {
        email: identity.email!,
        name: identity.name || identity.email!.split('@')[0],
        streak: 0,
        hearts: 5,
        gems: 0,
        xp: 0,
        createdAt: Date.now(),
      });
      user = await ctx.db.get(userId);
    }

    // Check if user already has a league entry
    const existingLeague = await ctx.db
      .query("leagues")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (existingLeague) {
      return existingLeague;
    }

    // Step 1: Check if there's an active Bronz League with available slots
    const activeBronzLeagues = await ctx.db
      .query("leagues")
      .withIndex("by_leagueName_and_weeklyXP", (q) =>
        q.eq("leagueName", "Bronz League")
      )
      .collect();

    // Get the current week info from an existing league or create new one
    let weekStartDate, weekEndDate;
    if (activeBronzLeagues.length > 0) {
      // Use the same week as existing league members
      weekStartDate = activeBronzLeagues[0].weekStartDate;
      weekEndDate = activeBronzLeagues[0].weekEndDate;
    } else {
      // Create new week
      const now = Date.now();
      weekStartDate = now;
      weekEndDate = now + 7 * 24 * 60 * 60 * 1000; // 7 days from now
    }

    // Step 2: Create league entry for this user
    const leagueId = await ctx.db.insert("leagues", {
      userId: user._id,
      leagueName: "Bronz League",
      weeklyXP: user.xp ?? 0, // Initialize with user's current total XP
      weekStartDate,
      weekEndDate,
      lastUpdated: Date.now(),
    });

    return await ctx.db.get(leagueId);
  },
});

// Update user's weekly XP (call when user completes lessons)
export const updateWeeklyXP = mutation({
  args: {
    xpToAdd: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) throw new Error("User not found");

    const userLeague = await ctx.db
      .query("leagues")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (!userLeague) throw new Error("User not in a league");

    // Update weekly XP
    await ctx.db.patch(userLeague._id, {
      weeklyXP: userLeague.weeklyXP + args.xpToAdd,
      lastUpdated: Date.now(),
    });

    return { weeklyXP: userLeague.weeklyXP + args.xpToAdd };
  },
});

// Fix/sync user's weeklyXP with their current total XP (one-time fix)
export const syncWeeklyXP = mutation({
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) throw new Error("User not found");

    const userLeague = await ctx.db
      .query("leagues")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (!userLeague) throw new Error("User not in a league");

    // Update weeklyXP to match user's current total XP
    await ctx.db.patch(userLeague._id, {
      weeklyXP: user.xp ?? 0,
      lastUpdated: Date.now(),
    });

    return { weeklyXP: user.xp ?? 0 };
  },
});

// Seed test users for leagues (for testing/demo purposes)
export const seedTestUsers = mutation({
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) throw new Error("User not found");

    // Get user's league
    const userLeague = await ctx.db
      .query("leagues")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (!userLeague) throw new Error("User not in a league");

    // Check if test users already exist
    const existingLeagues = await ctx.db
      .query("leagues")
      .withIndex("by_leagueName_and_weeklyXP", (q) =>
        q.eq("leagueName", userLeague.leagueName)
      )
      .collect();

    // Only seed if we have less than 10 users
    if (existingLeagues.length >= 10) {
      return { message: "Test users already exist" };
    }

    const now = Date.now();
    const weekEnd = userLeague.weekEndDate;

    // Create test users with varying XP
    const testUsers = [
      { name: "Sarah Chen", email: "sarah@test.com", avatar: "neon", xp: 245 },
      { name: "Alex Rivera", email: "alex@test.com", avatar: "sunrise", xp: 238 },
      { name: "Emma Wilson", email: "emma@test.com", avatar: "sunset", xp: 230 },
      { name: "Yuki Tanaka", email: "yuki@test.com", avatar: "bold", xp: 225 },
      { name: "Marco Rossi", email: "marco@test.com", avatar: "red-black", xp: 220 },
      { name: "Marie Lapierre", email: "marie@test.com", avatar: "mono-blue", xp: 184 },
      { name: "Lisa Park", email: "lisa@test.com", avatar: "outline", xp: 42 },
      { name: "Ahmed Ali", email: "ahmed@test.com", avatar: "shadow", xp: 38 },
      { name: "Sofia Lopez", email: "sofia@test.com", avatar: "grayscale", xp: 35 },
    ];

    for (const testUser of testUsers) {
      // Check if user already exists
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", testUser.email))
        .first();

      let userId;
      if (existingUser) {
        userId = existingUser._id;
      } else {
        // Create test user
        userId = await ctx.db.insert("users", {
          email: testUser.email,
          name: testUser.name,
          avatar: testUser.avatar,
          createdAt: now,
        });
      }

      // Add to league
      await ctx.db.insert("leagues", {
        userId,
        leagueName: userLeague.leagueName,
        weeklyXP: testUser.xp,
        weekStartDate: userLeague.weekStartDate,
        weekEndDate: weekEnd,
        lastUpdated: now,
      });
    }

    return { message: "Test users seeded successfully" };
  },
});

// Process league promotion/demotion (run when league week ends)
export const processLeagueTransitions = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Get all leagues that have ended
    const now = Date.now();
    const endedLeagues = await ctx.db
      .query("leagues")
      .filter((q) => q.lte(q.field("weekEndDate"), now))
      .collect();

    if (endedLeagues.length === 0) {
      return { message: "No leagues have ended yet" };
    }

    // Step 7: Define league order for promotions/demotions
    const leagueOrder = [
      "Bronz League",
      "Silver League",
      "Gold League",
      "Emerald League",
      "Sapphire League",
      "Ruby League",
      "Diamond League",
      "Mythic League",
    ];

    // Group by league name
    const leagueGroups = new Map<string, any[]>();
    for (const league of endedLeagues) {
      const existing = leagueGroups.get(league.leagueName) || [];
      existing.push(league);
      leagueGroups.set(league.leagueName, existing);
    }

    // Process each league group
    for (const [leagueName, members] of leagueGroups.entries()) {
      // Sort by weeklyXP descending to get rankings
      const sorted = members.sort((a, b) => b.weeklyXP - a.weeklyXP);

      const currentLeagueIndex = leagueOrder.indexOf(leagueName);

      for (let i = 0; i < sorted.length; i++) {
        const member = sorted[i];
        const rank = i + 1;
        let newLeagueName = leagueName;

        // Top 5 get promoted (unless already in highest league)
        if (rank <= 5 && currentLeagueIndex < leagueOrder.length - 1) {
          newLeagueName = leagueOrder[currentLeagueIndex + 1];
        }
        // Bottom 5 (96-100) get demoted (unless in lowest league)
        else if (rank >= 96 && currentLeagueIndex > 0) {
          newLeagueName = leagueOrder[currentLeagueIndex - 1];
        }

        // Update the league entry with new league and reset weekly XP
        const newWeekStart = now;
        const newWeekEnd = now + 7 * 24 * 60 * 60 * 1000;

        await ctx.db.patch(member._id, {
          leagueName: newLeagueName,
          weeklyXP: 0, // Reset weekly XP for new week
          weekStartDate: newWeekStart,
          weekEndDate: newWeekEnd,
          lastUpdated: now,
        });
      }
    }

    return { message: "League transitions processed successfully" };
  },
});

// Check and auto-process league transitions if week has ended
export const checkAndProcessLeagues = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Get or create user
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) {
      // Create user if they don't exist (new Clerk user)
      const userId = await ctx.db.insert("users", {
        email: identity.email!,
        name: identity.name || identity.email!.split('@')[0],
        streak: 0,
        hearts: 5,
        gems: 0,
        xp: 0,
        createdAt: Date.now(),
      });
      user = await ctx.db.get(userId);
    }

    const userLeague = await ctx.db
      .query("leagues")
      .withIndex("by_userId", (q) => q.eq("userId", user!._id))
      .first();

    // If user not in league yet, just return (they'll be added later)
    if (!userLeague) {
      return { processed: false, message: "User not in a league yet" };
    }

    // Check if league week has ended
    const now = Date.now();
    if (now >= userLeague.weekEndDate) {
      // Process transitions for all users
      await processLeagueTransitions(ctx, {});
      return { processed: true };
    }

    return { processed: false };
  },
});

// Fix league name spelling (Bronze -> Bronz)
export const fixLeagueNameSpelling = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Find all leagues with "Bronze League" (wrong spelling)
    const allLeagues = await ctx.db.query("leagues").collect();

    let fixed = 0;
    for (const league of allLeagues) {
      if (league.leagueName === "Bronze League") {
        await ctx.db.patch(league._id, {
          leagueName: "Bronz League",
        });
        fixed++;
      }
    }

    return { message: `Fixed ${fixed} league entries` };
  },
});

// Reset all users to Bronz League (for testing/development)
export const resetAllUsersToBronzLeague = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Get all league entries
    const allLeagues = await ctx.db.query("leagues").collect();

    // Set common week dates for everyone
    const now = Date.now();
    const weekStart = now;
    const weekEnd = now + 7 * 24 * 60 * 60 * 1000;

    let resetCount = 0;
    for (const league of allLeagues) {
      // Get the user to get their total XP
      const user = await ctx.db.get(league.userId);

      await ctx.db.patch(league._id, {
        leagueName: "Bronz League",
        weeklyXP: user?.xp ?? 0,
        weekStartDate: weekStart,
        weekEndDate: weekEnd,
        lastUpdated: now,
      });
      resetCount++;
    }

    return { message: `Reset ${resetCount} users to Bronz League` };
  },
});
