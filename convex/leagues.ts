import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

const requireIdentity = async (ctx: any) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");
  return identity;
};

// Get leaderboard for user's current league
// Get leaderboard for user's current league (Mixed Humans + Bots)
export const getLeagueLeaderboard = query({
  args: { leagueName: v.optional(v.string()) },
  handler: async (ctx, args) => {
    // Graceful auth check avoiding "Uncaught Error"
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) return [];

    const userLeague = await ctx.db
      .query("leagues")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (!userLeague) return [];

    const targetLeagueName = args.leagueName || userLeague.leagueName;

    // 1. Get Real Users
    const leagueMembers = await ctx.db
      .query("leagues")
      .withIndex("by_leagueName_and_weeklyXP", (q) =>
        q.eq("leagueName", targetLeagueName)
      )
      .collect();

    // 2. Get Bots for this tier
    let botTier = "Bronze";
    if (targetLeagueName.includes("Silver")) botTier = "Silver";
    if (targetLeagueName.includes("Gold")) botTier = "Gold";
    if (targetLeagueName.includes("Bronz")) botTier = "Bronze";

    const botMembers = await ctx.db
      .query("bots")
      .withIndex("by_rankTier", (q) => q.eq("rankTier", botTier))
      .collect();

    // 3. Merge and Sort
    const allMembers: any[] = [
      ...leagueMembers.map((m) => ({ type: "user", ...m })),
      ...botMembers.map((b) => ({ type: "bot", ...b })),
    ];

    allMembers.sort((a: any, b: any) => {
      const xpA = a.type === "user" ? a.weeklyXP : (a.points || 0);
      const xpB = b.type === "user" ? b.weeklyXP : (b.points || 0);
      if (xpB !== xpA) return xpB - xpA;
      return (b._creationTime || 0) - (a._creationTime || 0);
    });

    // 4. Map to UI format
    const leaderboard = await Promise.all(
      allMembers.map(async (member: any, index) => {
        let name = "Unknown";
        let avatar = "default";
        let xp = 0;
        let isCurrentUser = false;
        let id: string = "";
        let type: string = member.type;

        if (member.type === "user") {
          // Fetch user details
          if (!member.userId) {
            // Should not happen for type user
          } else {
            const userDoc: any = await ctx.db.get(member.userId);
            name = userDoc?.name || "User";
            avatar = userDoc?.avatar || "default";
            xp = member.weeklyXP;
            isCurrentUser = userDoc?._id === user._id; // safe check
            id = userDoc?._id || "";
          }
        } else {
          // Bot details
          name = member.username;
          avatar = member.avatar;
          xp = member.points || 0;
          isCurrentUser = false;
          id = member.botId || ""; // use bot string ID
        }

        const rank = index + 1;
        let zone = "safe";
        if (rank <= 5) zone = "promotion";
        else if (rank >= 25 && rank < 100) zone = "demotion";

        return {
          rank,
          name,
          flag: "🌍",
          xp,
          avatar,
          zone,
          isCurrentUser,
          id,
          type
        };
      })
    );

    return leaderboard;
  },
});

// Get user's current rank
export const getUserRank = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

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

// Internal function to run transitions (shared logic)
const runLeagueTransitions = async (ctx: any) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");

  const now = Date.now();

  // Get all leagues (users) that have ended
  const endedLeagues = await ctx.db
    .query("leagues")
    .filter((q: any) => q.lte(q.field("weekEndDate"), now))
    .collect();

  if (endedLeagues.length === 0) {
    return { message: "No leagues have ended yet" };
  }

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

  // Group users by league
  const leagueGroups = new Map<string, any[]>();
  for (const league of endedLeagues) {
    const existing = leagueGroups.get(league.leagueName) || [];
    existing.push({ ...league, type: 'user' });
    leagueGroups.set(league.leagueName, existing);
  }

  // Process each league group (Users + Bots)
  for (const [leagueName, users] of leagueGroups.entries()) {
    // 1. Fetch Bots for this tier
    let botTier = "Bronze";
    if (leagueName.includes("Silver")) botTier = "Silver";
    if (leagueName.includes("Gold")) botTier = "Gold";
    if (leagueName.includes("Bronz")) botTier = "Bronze";

    const bots = await ctx.db
      .query("bots")
      .withIndex("by_rankTier", (q: any) => q.eq("rankTier", botTier))
      .collect();

    // 2. Merge Users and Bots
    const allMembers = [
      ...users,
      ...bots.map((b: any) => ({ ...b, type: 'bot' }))
    ];

    // 3. Sort by XP/Points
    const sorted = allMembers.sort((a: any, b: any) => {
      const xpA = a.type === "user" ? a.weeklyXP : (a.points || 0);
      const xpB = b.type === "user" ? b.weeklyXP : (b.points || 0);
      return xpB - xpA; // Descending
    });

    // 4. Determine new ranks
    const currentLeagueIndex = leagueOrder.indexOf(leagueName);

    for (let i = 0; i < sorted.length; i++) {
      const member = sorted[i];
      const rank = i + 1;

      let newLeagueName = leagueName;
      let newBotTier = botTier;

      // Promotion (Top 5)
      if (rank <= 5 && currentLeagueIndex < leagueOrder.length - 1) {
        newLeagueName = leagueOrder[currentLeagueIndex + 1];
        newBotTier = newLeagueName.split(' ')[0].replace('Bronz', 'Bronze');
      }
      // Demotion (Bottom 5)
      else if (rank > sorted.length - 5 && currentLeagueIndex > 0) {
        newLeagueName = leagueOrder[currentLeagueIndex - 1];
        newBotTier = newLeagueName.split(' ')[0].replace('Bronz', 'Bronze');
      }

      // Apply Updates
      if (member.type === 'user') {
        const newWeekStart = now;
        const newWeekEnd = now + 7 * 24 * 60 * 60 * 1000;

        await ctx.db.patch(member._id, {
          leagueName: newLeagueName,
          weeklyXP: 0, // Reset for new week
          weekStartDate: newWeekStart,
          weekEndDate: newWeekEnd,
          lastUpdated: now,
        });
      } else            // Update Bot Tier if changed
        if (newBotTier !== botTier) {
          await ctx.db.patch(member._id, {
            rankTier: newBotTier,
            rank: `${newBotTier} I`
          });
        }
    }
  }

  return { message: "League transitions processed successfully", count: endedLeagues.length };
};

// Process league promotion/demotion (run when league week ends)
export const processLeagueTransitions = mutation({
  handler: async (ctx) => {
    return await runLeagueTransitions(ctx);
  },
});

// Force End League Week (For Testing)
export const forceEndLeagueWeek = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const allLeagues = await ctx.db.query("leagues").collect();
    const now = Date.now();

    for (const league of allLeagues) {
      await ctx.db.patch(league._id, {
        weekEndDate: now - 10000, // Ended 10 seconds ago
      });
    }

    return { message: `Forced ${allLeagues.length} leagues to end.` };
  }
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
      await runLeagueTransitions(ctx);
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
