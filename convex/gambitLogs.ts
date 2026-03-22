import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Save an AI interaction log (called from the API route)
export const saveLog = mutation({
    args: {
        topic: v.string(),
        model: v.string(),
        promptSent: v.string(),
        rawAIResponse: v.optional(v.string()),
        parsedData: v.optional(v.any()),
        roundsCount: v.optional(v.number()),
        success: v.boolean(),
        error: v.optional(v.string()),
        durationMs: v.number(),
    },
    handler: async (ctx, args) => {
        const logId = await ctx.db.insert("gambitLogs", {
            ...args,
            timestamp: Date.now(),
        });
        return logId;
    },
});

// Get recent logs (for viewing in Convex dashboard)
export const getRecentLogs = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 20;
        const logs = await ctx.db
            .query("gambitLogs")
            .withIndex("by_timestamp")
            .order("desc")
            .take(limit);
        return logs;
    },
});

// Get a single log by ID
export const getLog = query({
    args: {
        logId: v.id("gambitLogs"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.logId);
    },
});

// Get summary stats
export const getLogStats = query({
    args: {},
    handler: async (ctx) => {
        const allLogs = await ctx.db.query("gambitLogs").collect();
        const total = allLogs.length;
        const successful = allLogs.filter((l) => l.success).length;
        const failed = total - successful;
        const avgDuration =
            total > 0
                ? Math.round(allLogs.reduce((sum, l) => sum + l.durationMs, 0) / total)
                : 0;

        return {
            total,
            successful,
            failed,
            avgDurationMs: avgDuration,
            successRate: total > 0 ? `${Math.round((successful / total) * 100)}%` : "N/A",
        };
    },
});
