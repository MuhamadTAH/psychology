import { query } from "./_generated/server";
import { v } from "convex/values";

export const getPublicProfile = query({
    args: {
        profileId: v.string(),
        type: v.string(), // "user" | "bot"
    },
    handler: async (ctx, args) => {
        // =========================================================================
        // BOT PROFILE
        // =========================================================================
        if (args.type === "bot") {
            const bot = await ctx.db
                .query("bots")
                .withIndex("by_botId", (q) => q.eq("botId", args.profileId))
                .unique();

            if (!bot) return null;

            return {
                _id: bot.botId,
                name: bot.username,
                username: bot.username,
                avatar: bot.avatar,

                joinDate: bot._creationTime,
                isBot: true,
                stats: {
                    xp: bot.points || 0,
                    streak: Math.floor(Math.random() * 50), // Fake streak
                    league: `${bot.rankTier} League`,
                    top3Finishes: Math.floor(Math.random() * 10),
                    totalGames: 150 + Math.floor(Math.random() * 200),
                    winRate: bot.winRate,
                },
                badges: [
                    { icon: "⚔️", name: "Gladiator", description: "Arena Veteran" },
                    ...(Math.random() > 0.4 ? [{ icon: "🔥", name: "Wildfire", description: "Reached 30 day streak" }] : []),
                    ...(Math.random() > 0.6 ? [{ icon: "⚡", name: "Sage", description: "Earned 1000 XP" }] : []),
                    ...(Math.random() > 0.8 ? [{ icon: "🦉", name: "Scholar", description: "Learned 500 new words" }] : [])
                ],
                friends: [],
            };
        }

        // =========================================================================
        // USER PROFILE
        // =========================================================================
        if (args.type === "user") {
            const userId = ctx.db.normalizeId("users", args.profileId);
            if (!userId) return null;

            const user = await ctx.db.get(userId);
            if (!user) return null;

            // Fetch League Info
            const league = await ctx.db
                .query("leagues")
                .withIndex("by_userId", (q) => q.eq("userId", user._id))
                .unique();

            // Fetch Friends Count
            const friendsCount = (user.following || []).length;

            return {
                _id: user._id,
                name: user.name || "Unknown User",
                username: user.email.split('@')[0], // Fallback username
                avatar: user.avatar || "default",

                joinDate: user.createdAt,
                isBot: false,
                stats: {
                    xp: user.xp || 0,
                    streak: user.streak || 0,
                    league: league?.leagueName || "Unranked",
                    top3Finishes: 0, // Not tracked yet
                    totalGames: 42, // Placeholder or need to count matches
                    winRate: 0, // Placeholder
                },
                badges: [
                    // Generate badges based on logic
                    ...(user.streak && user.streak > 7 ? [{ icon: "🔥", name: "On Fire", description: "7+ Day Streak" }] : []),
                    ...(user.xp && user.xp > 1000 ? [{ icon: "⚡", name: "High Voltage", description: "1000+ XP" }] : [])
                ],
                friendsCount,
            };
        }

        return null;
    },
});
