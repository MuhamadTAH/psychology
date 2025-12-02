// 🧠 FILE PURPOSE
// Analytics Alerts system for monitoring app health.
// Automatically checks key metrics and generates alerts when thresholds are exceeded.
// Helps admins stay informed about critical issues without manual checking.

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Step 1: Generate alerts based on current analytics
// Checks various metrics and creates alerts if issues are detected
export const generateAlerts = mutation({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const progress = await ctx.db.query("progress").collect();
    const alerts: any[] = [];

    // Check 1: User activity drop (less than 20% active in last 7 days)
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const activeUsers = users.filter(u => {
      const lastLogin = u.lastLoginDate
        ? new Date(u.lastLoginDate).getTime()
        : u.createdAt;
      return lastLogin >= sevenDaysAgo;
    });

    const activeRate = users.length > 0 ? (activeUsers.length / users.length) * 100 : 0;

    if (activeRate < 20 && users.length > 10) {
      alerts.push({
        alertType: "low_activity",
        severity: "critical",
        message: `Only ${activeRate.toFixed(1)}% of users active in last 7 days (${activeUsers.length}/${users.length})`,
        data: { activeRate, activeCount: activeUsers.length, totalUsers: users.length },
      });
    } else if (activeRate < 40 && users.length > 10) {
      alerts.push({
        alertType: "low_activity",
        severity: "warning",
        message: `Low user activity: ${activeRate.toFixed(1)}% active (${activeUsers.length}/${users.length})`,
        data: { activeRate, activeCount: activeUsers.length, totalUsers: users.length },
      });
    }

    // Check 2: Retention issues
    const userProgress = new Map();
    progress.forEach(p => {
      if (!userProgress.has(p.userId)) {
        userProgress.set(p.userId, []);
      }
      userProgress.get(p.userId).push(p);
    });

    const day1Retention = { total: 0, returned: 0 };
    const now = Date.now();

    users.forEach(user => {
      const signupDate = user.createdAt;
      const daysSinceSignup = (now - signupDate) / (24 * 60 * 60 * 1000);

      if (daysSinceSignup >= 1) {
        day1Retention.total++;
        const userProgressList = userProgress.get(user._id) || [];
        const hasActivityAfterDay1 = userProgressList.some(p =>
          p.createdAt > signupDate + (24 * 60 * 60 * 1000)
        );
        if (hasActivityAfterDay1) day1Retention.returned++;
      }
    });

    const retentionRate = day1Retention.total > 0
      ? (day1Retention.returned / day1Retention.total) * 100
      : 0;

    if (retentionRate < 20 && day1Retention.total > 10) {
      alerts.push({
        alertType: "low_retention",
        severity: "critical",
        message: `Critical: Day 1 retention only ${retentionRate.toFixed(1)}% (${day1Retention.returned}/${day1Retention.total} users returned)`,
        data: { retentionRate, returned: day1Retention.returned, total: day1Retention.total },
      });
    } else if (retentionRate < 40 && day1Retention.total > 10) {
      alerts.push({
        alertType: "low_retention",
        severity: "warning",
        message: `Low Day 1 retention: ${retentionRate.toFixed(1)}% (${day1Retention.returned}/${day1Retention.total})`,
        data: { retentionRate, returned: day1Retention.returned, total: day1Retention.total },
      });
    }

    // Check 3: Struggling lessons (avg score < 50%)
    const lessonStats = new Map();
    progress.forEach(p => {
      if (!lessonStats.has(p.lessonId)) {
        lessonStats.set(p.lessonId, { scores: [], attempts: 0 });
      }
      const stats = lessonStats.get(p.lessonId);
      if (p.score !== undefined) stats.scores.push(p.score);
      stats.attempts++;
    });

    lessonStats.forEach((stats, lessonId) => {
      if (stats.scores.length > 0 && stats.attempts > 5) {
        const avgScore = stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length;
        if (avgScore < 50) {
          alerts.push({
            alertType: "struggling_lesson",
            severity: "warning",
            message: `Lesson ${lessonId} has low avg score: ${avgScore.toFixed(1)}% (${stats.attempts} attempts)`,
            data: { lessonId, avgScore, attempts: stats.attempts },
          });
        }
      }
    });

    // Check 4: No new users in last 7 days
    const recentSignups = users.filter(u => u.createdAt >= sevenDaysAgo);
    if (recentSignups.length === 0 && users.length > 0) {
      alerts.push({
        alertType: "no_growth",
        severity: "warning",
        message: "No new user signups in the last 7 days",
        data: { lastSignupDays: 7 },
      });
    }

    // Save all alerts to database
    const timestamp = Date.now();
    for (const alert of alerts) {
      await ctx.db.insert("analyticsAlerts", {
        ...alert,
        timestamp,
        read: false,
        dismissed: false,
      });
    }

    return {
      generated: alerts.length,
      alerts: alerts.map(a => ({ type: a.alertType, severity: a.severity })),
    };
  },
});

// Step 2: Get all recent alerts
// Returns alerts from the last N days (default: 7)
export const getRecentAlerts = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const daysBack = args.days || 7;
    const cutoff = Date.now() - (daysBack * 24 * 60 * 60 * 1000);

    const alerts = await ctx.db
      .query("analyticsAlerts")
      .withIndex("by_timestamp")
      .filter((q) => q.gte(q.field("timestamp"), cutoff))
      .collect();

    return alerts.sort((a, b) => b.timestamp - a.timestamp);
  },
});

// Step 3: Get unread alerts count
export const getUnreadAlertsCount = query({
  handler: async (ctx) => {
    const alerts = await ctx.db.query("analyticsAlerts").collect();
    return alerts.filter(a => !a.read && !a.dismissed).length;
  },
});

// Step 4: Mark alert as read
export const markAlertAsRead = mutation({
  args: { alertId: v.id("analyticsAlerts") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.alertId, { read: true });
  },
});

// Step 5: Dismiss alert
export const dismissAlert = mutation({
  args: { alertId: v.id("analyticsAlerts") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.alertId, { dismissed: true });
  },
});

// Step 6: Clear old alerts
// Removes alerts older than N days (default: 30)
export const clearOldAlerts = mutation({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const daysBack = args.days || 30;
    const cutoff = Date.now() - (daysBack * 24 * 60 * 60 * 1000);

    const oldAlerts = await ctx.db
      .query("analyticsAlerts")
      .withIndex("by_timestamp")
      .filter((q) => q.lt(q.field("timestamp"), cutoff))
      .collect();

    for (const alert of oldAlerts) {
      await ctx.db.delete(alert._id);
    }

    return { deleted: oldAlerts.length };
  },
});

// ✅ In this section we achieved:
// Complete alerts system with automatic monitoring and notification management
