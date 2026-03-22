import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Simulant Bot Logic for Social Interactions

// 1. Follow a Bot (Send Friend Request)
export const followBot = mutation({
    args: {
        botId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", identity.email!))
            .first();

        if (!user) throw new Error("User not found");

        // Check if already following
        const currentFollowing = user.followingBots || [];
        if (currentFollowing.includes(args.botId)) {
            return { success: false, message: "Already following this bot", status: "following" };
        }

        // Add to followingBots
        let newFollowing = [...currentFollowing, args.botId];
        await ctx.db.patch(user._id, { followingBots: newFollowing });

        // Determine Bot Reaction (Acceptance Logic)
        const bot = await ctx.db
            .query("bots")
            .withIndex("by_botId", (q) => q.eq("botId", args.botId))
            .first();

        // Note: The index name "by_botId" exists in schema.
        // If bot not found, just return (maybe deleted bot?)
        if (!bot) return { success: true, message: "Followed unknown bot", accepted: false };

        let acceptanceChance = 0.5; // Default

        // Logic based on archetype/stats
        if (bot.archetype === "rager") acceptanceChance = 0.2;
        else if (bot.archetype === "pleaser") acceptanceChance = 0.9;
        else if (bot.archetype === "sniper") acceptanceChance = 0.1;
        else if (bot.rankTier === "Diamond") acceptanceChance = 0.3; // Elite bots are picky
        else if (bot.rankTier === "Bronze") acceptanceChance = 0.8; // New bots are friendly

        // Random roll
        const accepted = Math.random() < acceptanceChance;

        if (accepted) {
            // Add bot to user's followersBots (Mutual Friend)
            const currentFollowers = user.followersBots || [];
            if (!currentFollowers.includes(args.botId)) {
                await ctx.db.patch(user._id, {
                    followersBots: [...currentFollowers, args.botId],
                });
            }
        }

        return {
            success: true,
            message: accepted ? `${bot.username} accepted your request!` : `You are following ${bot.username}.`,
            accepted
        };
    },
});

// 2. Unfollow a Bot
export const unfollowBot = mutation({
    args: {
        botId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", identity.email!))
            .first();

        if (!user) throw new Error("User not found");

        // Remove from followingBots
        const currentFollowing = user.followingBots || [];
        const newFollowing = currentFollowing.filter(id => id !== args.botId);

        // Remove from followersBots (Mutual break)
        const currentFollowers = user.followersBots || [];
        const newFollowers = currentFollowers.filter(id => id !== args.botId);

        await ctx.db.patch(user._id, {
            followingBots: newFollowing,
            followersBots: newFollowers,
        });

        return { success: true };
    },
});

// 3. Get Relationship Status
export const getBotRelationship = query({
    args: {
        botId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return { isFollowing: false, isFollowedBy: false };

        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", identity.email!))
            .first();

        if (!user) return { isFollowing: false, isFollowedBy: false };

        const isFollowing = (user.followingBots || []).includes(args.botId);
        const isFollowedBy = (user.followersBots || []).includes(args.botId);

        return { isFollowing, isFollowedBy };
    },
});

// 4. Get List of Bot Friends (Mutual)
export const getBotFriends = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", identity.email!))
            .first();

        if (!user) return [];

        const friendIds = user.followersBots || []; // Only mutuals count as "Friends" usually? 
        // Or maybe list all followed bots?
        // Let's return objects for all followed bots, with status.

        const followingIds = user.followingBots || [];

        // Fetch all followed bots
        const bots = await Promise.all(followingIds.map(async (botId) => {
            const bot = await ctx.db
                .query("bots")
                .withIndex("by_botId", (q) => q.eq("botId", botId))
                .unique();

            if (!bot) return null;

            const isMutual = (user.followersBots || []).includes(botId);

            // Simulant Online Status
            // 30% chance online
            const isOnline = Math.random() < 0.3;

            return {
                ...bot,
                isMutual,
                status: isOnline ? "online" : "offline"
            };
        }));

        return bots.filter(b => b !== null);
    }
});
