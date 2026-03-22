import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const finishGame = mutation({
    args: {
        result: v.string(), // "win" | "loss"
        opponentBotId: v.optional(v.string()), // ID from bots table (botId field, not _id)
        playerScore: v.optional(v.number()), // For future use
        opponentScore: v.optional(v.number()), // For future use
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", identity.email!))
            .unique();

        if (!user) throw new Error("User not found");

        // =========================================================================
        // 1. UPDATE PLAYER XP
        // =========================================================================
        // Win: +20 XP. Loss: -10 XP.
        // (Adjust values as needed. User said "loss xe" implies point loss).

        const xpChange = args.result === "win" ? 20 : -10;
        const currentXP = user.xp || 0;
        const newXP = Math.max(0, currentXP + xpChange); // Prevent negative XP

        const currentWins = user.wins || 0;
        const newWins = args.result === "win" ? currentWins + 1 : currentWins;

        await ctx.db.patch(user._id, { xp: newXP, wins: newWins });

        // Update League XP if applicable
        const leagueEntry = await ctx.db
            .query("leagues")
            .withIndex("by_userId", (q) => q.eq("userId", user._id))
            .unique();

        if (leagueEntry) {
            const newWeeklyXP = Math.max(0, leagueEntry.weeklyXP + xpChange);
            await ctx.db.patch(leagueEntry._id, {
                weeklyXP: newWeeklyXP,
                lastUpdated: Date.now()
            });
        }

        // =========================================================================
        // 2. UPDATE BOT POINTS & RANK
        // =========================================================================
        let botUpdate = null;
        if (args.opponentBotId) {
            const bot = await ctx.db
                .query("bots")
                .withIndex("by_botId", (q) => q.eq("botId", args.opponentBotId!))
                .unique();

            if (bot) {
                // Bot Logic: Inverse of Player result
                // If Player Wins -> Bot Looses matches -> Bot score decreases?
                // Actually, usually in ELO: Winner +Points, Loser -Points.
                // If User Wins (Result=Win): Bot Loses (-Points).
                // If User Loses (Result=Loss): Bot Wins (+Points).

                const botPointsChange = args.result === "win" ? -15 : 25;
                // Bots gain more for winning than losing? Or symmetric?
                // Let's make it symmetric-ish.

                const currentPoints = bot.points || 1000;
                const newPoints = Math.max(0, currentPoints + botPointsChange);

                // Recalculate Win Rate (Approximate)
                // Just drift it slightly based on result
                // New Win Rate = (Old Win Rate * N + Result) / (N + 1)?
                // For now, simple nudge.
                let newWinRate = bot.winRate;
                if (args.result === "win") {
                    // Bot lost
                    newWinRate = Math.max(0, bot.winRate - 0.5);
                } else {
                    // Bot won
                    newWinRate = Math.min(100, bot.winRate + 0.5);
                }

                await ctx.db.patch(bot._id, {
                    points: newPoints,
                    winRate: parseFloat(newWinRate.toFixed(1)),
                    lastActive: Date.now()
                });

                botUpdate = { name: bot.username, points: newPoints, change: botPointsChange };
            }
        }

        return {
            success: true,
            xpChange,
            newXP,
            botUpdate
        };
    }
});
