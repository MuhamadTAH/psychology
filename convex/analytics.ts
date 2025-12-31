// 🧠 FILE PURPOSE
// Analytics functions for the AI Assistant to query app data.
// Provides insights into users, lessons, engagement, progress, and overall app health.
// These functions are called by the AI to answer questions about app performance and user behavior.

import { query } from "./_generated/server";
import { v } from "convex/values";

// Restrict analytics to admins only
const requireAdmin = async (ctx: any) => {
  const identity = await ctx.auth.getUserIdentity();
  const adminEnv = process.env.ADMIN_EMAILS || "";
  const ADMIN_EMAILS = adminEnv
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  // Always include system fallback
  if (!ADMIN_EMAILS.includes("system@duolearn.com")) {
    ADMIN_EMAILS.push("system@duolearn.com");
  }
  if (!identity) throw new Error("Not authenticated");
  if (!ADMIN_EMAILS.includes(identity.email!)) {
    throw new Error("Forbidden");
  }
  return identity;
};

// ========================================
// USER ANALYTICS
// ========================================

// Step 1: Get total number of users
// Returns the count of all registered users in the app
export const getTotalUsers = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const users = await ctx.db.query("users").collect();
    return {
      total: users.length,
      users: users.map(u => ({
        email: u.email,
        name: u.name,
        xp: u.xp || 0,
        gems: u.gems || 0,
        hearts: u.hearts || 5,
        streak: u.streak || 0,
        createdAt: u.createdAt,
      }))
    };
  },
});

// Step 2: Get active users in last N days
// Returns users who have logged in within specified days
export const getActiveUsers = query({
  args: { days: v.optional(v.number()) }, // Default: 7 days
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const daysAgo = args.days || 7;
    const cutoffTime = Date.now() - (daysAgo * 24 * 60 * 60 * 1000);

    const users = await ctx.db.query("users").collect();

    // Filter users who logged in after cutoff
    const activeUsers = users.filter(u => {
      const lastLogin = u.lastLoginDate
        ? new Date(u.lastLoginDate).getTime()
        : u.createdAt;
      return lastLogin >= cutoffTime;
    });

    return {
      total: activeUsers.length,
      percentage: users.length > 0 ? (activeUsers.length / users.length * 100).toFixed(2) : 0,
      users: activeUsers.map(u => ({
        email: u.email,
        name: u.name,
        lastLogin: u.lastLoginDate,
      }))
    };
  },
});

// Step 3: Get user engagement overview
// Returns comprehensive stats about user activity and engagement
export const getEngagementOverview = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const users = await ctx.db.query("users").collect();
    const progress = await ctx.db.query("progress").collect();
    const notes = await ctx.db.query("darkPsychologyNotes").collect();
    const bookmarks = await ctx.db.query("darkPsychologyBookmarks").collect();
    const achievements = await ctx.db.query("darkPsychologyAchievements").collect();

    // Calculate averages
    const totalXP = users.reduce((sum, u) => sum + (u.xp || 0), 0);
    const totalGems = users.reduce((sum, u) => sum + (u.gems || 0), 0);
    const totalStreaks = users.reduce((sum, u) => sum + (u.streak || 0), 0);
    const avgXP = users.length > 0 ? (totalXP / users.length).toFixed(2) : 0;
    const avgGems = users.length > 0 ? (totalGems / users.length).toFixed(2) : 0;
    const avgStreak = users.length > 0 ? (totalStreaks / users.length).toFixed(2) : 0;

    // Get unique users with different engagement types
    const usersWithProgress = new Set(progress.map(p => p.userId)).size;
    const usersWithNotes = new Set(notes.map(n => n.email)).size;
    const usersWithBookmarks = new Set(bookmarks.map(b => b.email)).size;
    const usersWithAchievements = new Set(achievements.map(a => a.email)).size;

    // Get streak stats
    const usersWithStreak = users.filter(u => (u.streak || 0) > 0).length;
    const longestStreak = Math.max(...users.map(u => u.longestStreak || 0), 0);

    return {
      totalUsers: users.length,
      totalLessonsAttempted: progress.length,
      usersWithProgress,
      usersWithNotes,
      usersWithBookmarks,
      usersWithAchievements,
      usersWithStreak,
      longestStreak,
      averages: {
        xp: avgXP,
        gems: avgGems,
        streak: avgStreak,
      },
      totals: {
        xp: totalXP,
        gems: totalGems,
        notes: notes.length,
        bookmarks: bookmarks.length,
        achievements: achievements.length,
      }
    };
  },
});

// ✅ In this section we achieved:
// Basic user analytics - counts, active users, and engagement metrics

// ========================================
// LESSON & PROGRESS ANALYTICS
// ========================================

// Step 4: Get lesson completion stats
// Returns detailed statistics for a specific lesson
export const getLessonStats = query({
  args: { lessonId: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const progress = await ctx.db
      .query("progress")
      .filter((q) => q.eq(q.field("darkPsychLessonId"), args.lessonId))
      .collect();

    if (progress.length === 0) {
      return {
        lessonId: args.lessonId,
        totalAttempts: 0,
        completed: 0,
        completionRate: 0,
        avgScore: 0,
        avgCorrectAnswers: 0,
        avgWrongAnswers: 0,
      };
    }

    const completed = progress.filter(p => p.isCompleted).length;
    const totalScore = progress.reduce((sum, p) => sum + (p.score || 0), 0);
    const totalCorrect = progress.reduce((sum, p) => sum + (p.correctAnswersCount || 0), 0);
    const totalWrong = progress.reduce((sum, p) => sum + (p.wrongAnswersCount || 0), 0);

    return {
      lessonId: args.lessonId,
      totalAttempts: progress.length,
      completed,
      completionRate: ((completed / progress.length) * 100).toFixed(2),
      avgScore: (totalScore / progress.length).toFixed(2),
      avgCorrectAnswers: (totalCorrect / progress.length).toFixed(2),
      avgWrongAnswers: (totalWrong / progress.length).toFixed(2),
    };
  },
});

// Step 5: Get all Dark Psychology lesson statistics
// Returns stats for all Dark Psychology lessons
export const getAllDarkPsychLessonStats = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const progress = await ctx.db.query("progress").collect();

    // Group by darkPsychLessonId
    const lessonMap = new Map();

    progress.forEach(p => {
      if (p.darkPsychLessonId) {
        if (!lessonMap.has(p.darkPsychLessonId)) {
          lessonMap.set(p.darkPsychLessonId, {
            attempts: [],
            completed: 0,
          });
        }

        const stats = lessonMap.get(p.darkPsychLessonId);
        stats.attempts.push(p);
        if (p.isCompleted) stats.completed++;
      }
    });

    // Calculate stats per lesson
    const lessonStats = Array.from(lessonMap.entries()).map(([lessonId, data]) => {
      const totalScore = data.attempts.reduce((sum: number, p: any) => sum + (p.score || 0), 0);
      const totalCorrect = data.attempts.reduce((sum: number, p: any) => sum + (p.correctAnswersCount || 0), 0);
      const totalWrong = data.attempts.reduce((sum: number, p: any) => sum + (p.wrongAnswersCount || 0), 0);

      return {
        lessonId,
        totalAttempts: data.attempts.length,
        completed: data.completed,
        completionRate: ((data.completed / data.attempts.length) * 100).toFixed(2),
        avgScore: (totalScore / data.attempts.length).toFixed(2),
        avgCorrectAnswers: (totalCorrect / data.attempts.length).toFixed(2),
        avgWrongAnswers: (totalWrong / data.attempts.length).toFixed(2),
      };
    });

    // Sort by most attempted
    return lessonStats.sort((a, b) => b.totalAttempts - a.totalAttempts);
  },
});

// Step 6: Get top performing lessons
// Returns lessons with highest average scores
export const getTopLessons = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const limit = args.limit || 10;
    const progress = await ctx.db.query("progress").collect();

    // Group by lesson
    const lessonMap = new Map();

    progress.forEach(p => {
      const lessonKey = p.darkPsychLessonId || `lesson_${p.lessonNumber}`;

      if (!lessonMap.has(lessonKey)) {
        lessonMap.set(lessonKey, { attempts: 0, totalScore: 0 });
      }

      const stats = lessonMap.get(lessonKey);
      stats.attempts++;
      stats.totalScore += (p.score || 0);
    });

    // Calculate avg and sort
    const lessons = Array.from(lessonMap.entries())
      .map(([lessonId, stats]) => ({
        lessonId,
        attempts: stats.attempts,
        avgScore: (stats.totalScore / stats.attempts).toFixed(2),
      }))
      .sort((a, b) => parseFloat(b.avgScore) - parseFloat(a.avgScore))
      .slice(0, limit);

    return lessons;
  },
});

// Step 7: Get struggling lessons (lowest scores)
// Returns lessons where users are having difficulty
export const getStrugglingLessons = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const limit = args.limit || 10;
    const progress = await ctx.db.query("progress").collect();

    // Group by lesson
    const lessonMap = new Map();

    progress.forEach(p => {
      const lessonKey = p.darkPsychLessonId || `lesson_${p.lessonNumber}`;

      if (!lessonMap.has(lessonKey)) {
        lessonMap.set(lessonKey, {
          attempts: 0,
          totalScore: 0,
          totalWrong: 0,
          completions: 0,
        });
      }

      const stats = lessonMap.get(lessonKey);
      stats.attempts++;
      stats.totalScore += (p.score || 0);
      stats.totalWrong += (p.wrongAnswersCount || 0);
      if (p.isCompleted) stats.completions++;
    });

    // Calculate metrics and sort by lowest score
    const lessons = Array.from(lessonMap.entries())
      .map(([lessonId, stats]) => ({
        lessonId,
        attempts: stats.attempts,
        avgScore: (stats.totalScore / stats.attempts).toFixed(2),
        avgWrongAnswers: (stats.totalWrong / stats.attempts).toFixed(2),
        completionRate: ((stats.completions / stats.attempts) * 100).toFixed(2),
      }))
      .sort((a, b) => parseFloat(a.avgScore) - parseFloat(b.avgScore))
      .slice(0, limit);

    return lessons;
  },
});

// Step 8: Get lesson completion by section
// Returns completion stats grouped by Dark Psychology sections (A, B, C, D)
export const getLessonCompletionBySection = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const progress = await ctx.db.query("progress").collect();

    const sections = { A: 0, B: 0, C: 0, D: 0 };
    const sectionAttempts = { A: 0, B: 0, C: 0, D: 0 };

    progress.forEach(p => {
      if (p.darkPsychLessonId) {
        const section = p.darkPsychLessonId[0]; // First character is section
        if (section in sections) {
          sectionAttempts[section as keyof typeof sections]++;
          if (p.isCompleted) {
            sections[section as keyof typeof sections]++;
          }
        }
      }
    });

    return Object.entries(sections).map(([section, completed]) => ({
      section,
      sectionName: section === 'A' ? 'Foundations' :
                   section === 'B' ? 'Tactics' :
                   section === 'C' ? 'Defense' : 'Ethics',
      completed,
      attempts: sectionAttempts[section as keyof typeof sectionAttempts],
      completionRate: sectionAttempts[section as keyof typeof sectionAttempts] > 0
        ? ((completed / sectionAttempts[section as keyof typeof sectionAttempts]) * 100).toFixed(2)
        : 0,
    }));
  },
});

// ✅ In this section we achieved:
// Lesson analytics - completion rates, top/struggling lessons, section breakdowns

// ========================================
// GAMIFICATION ANALYTICS
// ========================================

// Step 9: Get streak statistics
// Returns detailed stats about user streaks
export const getStreakStats = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const users = await ctx.db.query("users").collect();

    const streakData = {
      usersWithStreak: 0,
      averageStreak: 0,
      longestCurrentStreak: 0,
      longestEverStreak: 0,
      totalStreakDays: 0,
      streakFreezeTotal: 0,
      distribution: {
        '1-3 days': 0,
        '4-7 days': 0,
        '8-14 days': 0,
        '15-30 days': 0,
        '30+ days': 0,
      }
    };

    users.forEach(u => {
      const streak = u.streak || 0;
      if (streak > 0) streakData.usersWithStreak++;

      streakData.totalStreakDays += (u.totalStreakDays || 0);
      streakData.longestCurrentStreak = Math.max(streakData.longestCurrentStreak, streak);
      streakData.longestEverStreak = Math.max(streakData.longestEverStreak, u.longestStreak || 0);
      streakData.streakFreezeTotal += (u.streakFreezes || 0);

      // Distribution
      if (streak >= 1 && streak <= 3) streakData.distribution['1-3 days']++;
      else if (streak >= 4 && streak <= 7) streakData.distribution['4-7 days']++;
      else if (streak >= 8 && streak <= 14) streakData.distribution['8-14 days']++;
      else if (streak >= 15 && streak <= 30) streakData.distribution['15-30 days']++;
      else if (streak > 30) streakData.distribution['30+ days']++;
    });

    streakData.averageStreak = users.length > 0
      ? parseFloat((users.reduce((sum, u) => sum + (u.streak || 0), 0) / users.length).toFixed(2))
      : 0;

    return streakData;
  },
});

// Step 10: Get XP/Gems/Hearts distribution
// Returns how resources are distributed among users
export const getResourceDistribution = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const users = await ctx.db.query("users").collect();

    const xpRanges = { '0-100': 0, '101-500': 0, '501-1000': 0, '1001-5000': 0, '5000+': 0 };
    const gemRanges = { '0-50': 0, '51-200': 0, '201-500': 0, '501-1000': 0, '1000+': 0 };
    const heartCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    users.forEach(u => {
      // XP distribution
      const xp = u.xp || 0;
      if (xp <= 100) xpRanges['0-100']++;
      else if (xp <= 500) xpRanges['101-500']++;
      else if (xp <= 1000) xpRanges['501-1000']++;
      else if (xp <= 5000) xpRanges['1001-5000']++;
      else xpRanges['5000+']++;

      // Gems distribution
      const gems = u.gems || 0;
      if (gems <= 50) gemRanges['0-50']++;
      else if (gems <= 200) gemRanges['51-200']++;
      else if (gems <= 500) gemRanges['201-500']++;
      else if (gems <= 1000) gemRanges['501-1000']++;
      else gemRanges['1000+']++;

      // Hearts distribution
      const hearts = u.hearts !== undefined ? u.hearts : 5;
      if (hearts in heartCounts) heartCounts[hearts as keyof typeof heartCounts]++;
    });

    return {
      xpDistribution: xpRanges,
      gemDistribution: gemRanges,
      heartsDistribution: heartCounts,
    };
  },
});

// Step 11: Get league statistics
// Returns info about league participation and rankings
export const getLeagueStats = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const leagues = await ctx.db.query("leagues").collect();

    const leagueMap = new Map();

    leagues.forEach(l => {
      if (!leagueMap.has(l.leagueName)) {
        leagueMap.set(l.leagueName, {
          participants: 0,
          totalWeeklyXP: 0,
          highestXP: 0,
        });
      }

      const stats = leagueMap.get(l.leagueName);
      stats.participants++;
      stats.totalWeeklyXP += l.weeklyXP;
      stats.highestXP = Math.max(stats.highestXP, l.weeklyXP);
    });

    return Array.from(leagueMap.entries()).map(([name, stats]) => ({
      leagueName: name,
      participants: stats.participants,
      avgWeeklyXP: (stats.totalWeeklyXP / stats.participants).toFixed(2),
      highestXP: stats.highestXP,
    }));
  },
});

// ✅ In this section we achieved:
// Gamification analytics - streaks, XP/gems/hearts, leagues

// ========================================
// DARK PSYCHOLOGY SPECIFIC ANALYTICS
// ========================================

// Step 12: Get notes and bookmarks stats
// Returns how users are engaging with study features
export const getStudyFeatureStats = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const notes = await ctx.db.query("darkPsychologyNotes").collect();
    const bookmarks = await ctx.db.query("darkPsychologyBookmarks").collect();
    const reviews = await ctx.db.query("darkPsychologyReview").collect();

    const uniqueUsersWithNotes = new Set(notes.map(n => n.email)).size;
    const uniqueUsersWithBookmarks = new Set(bookmarks.map(b => b.email)).size;
    const uniqueUsersWithReviews = new Set(reviews.map(r => r.email)).size;

    // Most noted lessons
    const noteLessonCounts = new Map();
    notes.forEach(n => {
      noteLessonCounts.set(n.lessonId, (noteLessonCounts.get(n.lessonId) || 0) + 1);
    });

    const topNotedLessons = Array.from(noteLessonCounts.entries())
      .map(([lessonId, count]) => ({ lessonId, noteCount: count }))
      .sort((a, b) => b.noteCount - a.noteCount)
      .slice(0, 5);

    // Most bookmarked lessons
    const bookmarkLessonCounts = new Map();
    bookmarks.forEach(b => {
      bookmarkLessonCounts.set(b.lessonId, (bookmarkLessonCounts.get(b.lessonId) || 0) + 1);
    });

    const topBookmarkedLessons = Array.from(bookmarkLessonCounts.entries())
      .map(([lessonId, count]) => ({ lessonId, bookmarkCount: count }))
      .sort((a, b) => b.bookmarkCount - a.bookmarkCount)
      .slice(0, 5);

    return {
      totalNotes: notes.length,
      totalBookmarks: bookmarks.length,
      totalReviewQuestions: reviews.length,
      uniqueUsersWithNotes,
      uniqueUsersWithBookmarks,
      uniqueUsersWithReviews,
      topNotedLessons,
      topBookmarkedLessons,
      avgNotesPerUser: uniqueUsersWithNotes > 0 ? (notes.length / uniqueUsersWithNotes).toFixed(2) : 0,
      avgBookmarksPerUser: uniqueUsersWithBookmarks > 0 ? (bookmarks.length / uniqueUsersWithBookmarks).toFixed(2) : 0,
    };
  },
});

// Step 13: Get achievements stats
// Returns achievement unlock rates
export const getAchievementStats = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const achievements = await ctx.db.query("darkPsychologyAchievements").collect();
    const users = await ctx.db.query("users").collect();

    const achievementCounts = new Map();

    achievements.forEach(a => {
      achievementCounts.set(a.achievementId, {
        id: a.achievementId,
        name: a.achievementName,
        description: a.achievementDescription,
        icon: a.achievementIcon,
        unlocks: (achievementCounts.get(a.achievementId)?.unlocks || 0) + 1,
      });
    });

    const achievementList = Array.from(achievementCounts.values())
      .map(a => ({
        ...a,
        unlockRate: users.length > 0 ? ((a.unlocks / users.length) * 100).toFixed(2) : 0,
      }))
      .sort((a, b) => b.unlocks - a.unlocks);

    const uniqueUsersWithAchievements = new Set(achievements.map(a => a.email)).size;

    return {
      totalAchievements: achievementCounts.size,
      totalUnlocks: achievements.length,
      usersWithAchievements: uniqueUsersWithAchievements,
      avgAchievementsPerUser: uniqueUsersWithAchievements > 0
        ? (achievements.length / uniqueUsersWithAchievements).toFixed(2)
        : 0,
      achievements: achievementList,
    };
  },
});

// Step 14: Get power-up usage statistics
// Returns which power-ups are most popular
export const getPowerUpStats = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const powerUps = await ctx.db.query("powerUps").collect();
    const purchases = await ctx.db.query("powerUpPurchases").collect();
    const usage = await ctx.db.query("powerUpUsage").collect();

    // Group by power-up type
    const typeStats = new Map();

    powerUps.forEach(p => {
      if (!typeStats.has(p.powerUpType)) {
        typeStats.set(p.powerUpType, {
          currentInventory: 0,
          totalPurchased: 0,
          totalUsed: 0,
          revenue: 0,
        });
      }
      const stats = typeStats.get(p.powerUpType);
      stats.currentInventory += p.quantity;
    });

    purchases.forEach(p => {
      if (typeStats.has(p.powerUpType)) {
        const stats = typeStats.get(p.powerUpType);
        stats.totalPurchased += p.quantity;
        stats.revenue += p.gemsCost;
      }
    });

    usage.forEach(u => {
      if (typeStats.has(u.powerUpType)) {
        const stats = typeStats.get(u.powerUpType);
        stats.totalUsed++;
      }
    });

    return Array.from(typeStats.entries()).map(([type, stats]) => ({
      powerUpType: type,
      ...stats,
    })).sort((a, b) => b.totalUsed - a.totalUsed);
  },
});

// ✅ In this section we achieved:
// Dark Psychology specific analytics - notes, bookmarks, achievements, power-ups

// ========================================
// SUMMARY & DASHBOARD QUERIES
// ========================================

// Step 15: Get complete app health dashboard
// Returns a comprehensive overview of all key metrics
export const getAppHealthDashboard = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const users = await ctx.db.query("users").collect();
    const progress = await ctx.db.query("progress").collect();
    const notes = await ctx.db.query("darkPsychologyNotes").collect();
    const bookmarks = await ctx.db.query("darkPsychologyBookmarks").collect();
    const achievements = await ctx.db.query("darkPsychologyAchievements").collect();
    const leagues = await ctx.db.query("leagues").collect();

    // Calculate active users (last 7 days)
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const activeUsers = users.filter(u => {
      const lastLogin = u.lastLoginDate
        ? new Date(u.lastLoginDate).getTime()
        : u.createdAt;
      return lastLogin >= sevenDaysAgo;
    });

    // Completed lessons
    const completedLessons = progress.filter(p => p.isCompleted).length;

    // Total XP, gems, hearts
    const totalXP = users.reduce((sum, u) => sum + (u.xp || 0), 0);
    const totalGems = users.reduce((sum, u) => sum + (u.gems || 0), 0);
    const avgHearts = users.reduce((sum, u) => sum + (u.hearts !== undefined ? u.hearts : 5), 0) / users.length;

    // Users with streaks
    const usersWithStreak = users.filter(u => (u.streak || 0) > 0).length;
    const longestStreak = Math.max(...users.map(u => u.longestStreak || 0), 0);

    return {
      timestamp: Date.now(),
      users: {
        total: users.length,
        active: activeUsers.length,
        activePercentage: users.length > 0 ? ((activeUsers.length / users.length) * 100).toFixed(2) : 0,
      },
      engagement: {
        totalLessonsAttempted: progress.length,
        completedLessons,
        completionRate: progress.length > 0 ? ((completedLessons / progress.length) * 100).toFixed(2) : 0,
        usersWithNotes: new Set(notes.map(n => n.email)).size,
        usersWithBookmarks: new Set(bookmarks.map(b => b.email)).size,
        usersWithAchievements: new Set(achievements.map(a => a.email)).size,
      },
      gamification: {
        totalXP,
        avgXP: users.length > 0 ? (totalXP / users.length).toFixed(2) : 0,
        totalGems,
        avgGems: users.length > 0 ? (totalGems / users.length).toFixed(2) : 0,
        avgHearts: avgHearts.toFixed(2),
        usersWithStreak,
        longestStreak,
        leagueParticipants: new Set(leagues.map(l => l.userId)).size,
      },
      content: {
        totalNotes: notes.length,
        totalBookmarks: bookmarks.length,
        totalAchievements: achievements.length,
      }
    };
  },
});

// ✅ In this section we achieved:
// Complete dashboard query for app health overview

// ========================================
// TIME-BASED ANALYTICS & TRENDS
// ========================================

// Step 16: Get user growth over time
// Returns daily user signups for the specified time range
export const getUserGrowthOverTime = query({
  args: { days: v.optional(v.number()) }, // Default: 30 days
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const daysBack = args.days || 30;
    const now = Date.now();
    const startTime = now - (daysBack * 24 * 60 * 60 * 1000);

    const users = await ctx.db.query("users").collect();

    // Group users by signup date
    const dailySignups = new Map();

    // Initialize all days with 0
    for (let i = 0; i < daysBack; i++) {
      const date = new Date(now - (i * 24 * 60 * 60 * 1000));
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
      dailySignups.set(dateKey, { date: dateKey, signups: 0, cumulative: 0 });
    }

    // Count signups per day
    users.forEach(user => {
      const signupDate = new Date(user.createdAt);
      const dateKey = signupDate.toISOString().split('T')[0];

      if (dailySignups.has(dateKey)) {
        const day = dailySignups.get(dateKey);
        day.signups++;
      }
    });

    // Calculate cumulative totals
    const sortedDays = Array.from(dailySignups.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let cumulative = 0;
    sortedDays.forEach(day => {
      cumulative += day.signups;
      day.cumulative = cumulative;
    });

    return sortedDays;
  },
});

// Step 17: Get retention metrics
// Returns Day 1, Day 7, Day 30 retention rates
export const getRetentionMetrics = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const users = await ctx.db.query("users").collect();
    const progress = await ctx.db.query("progress").collect();

    // Group progress by user
    const userProgress = new Map();
    progress.forEach(p => {
      if (!userProgress.has(p.userId)) {
        userProgress.set(p.userId, []);
      }
      userProgress.get(p.userId).push(p);
    });

    const now = Date.now();

    // Calculate retention for different cohorts
    const day1Retention = { total: 0, returned: 0 };
    const day7Retention = { total: 0, returned: 0 };
    const day30Retention = { total: 0, returned: 0 };

    users.forEach(user => {
      const signupDate = user.createdAt;
      const daysSinceSignup = (now - signupDate) / (24 * 60 * 60 * 1000);

      const userProgressList = userProgress.get(user._id) || [];

      // Day 1 retention
      if (daysSinceSignup >= 1) {
        day1Retention.total++;
        // Check if user has activity after day 1
        const hasActivityAfterDay1 = userProgressList.some(p =>
          p.createdAt > signupDate + (24 * 60 * 60 * 1000)
        );
        if (hasActivityAfterDay1) day1Retention.returned++;
      }

      // Day 7 retention
      if (daysSinceSignup >= 7) {
        day7Retention.total++;
        const hasActivityAfterDay7 = userProgressList.some(p =>
          p.createdAt > signupDate + (7 * 24 * 60 * 60 * 1000)
        );
        if (hasActivityAfterDay7) day7Retention.returned++;
      }

      // Day 30 retention
      if (daysSinceSignup >= 30) {
        day30Retention.total++;
        const hasActivityAfterDay30 = userProgressList.some(p =>
          p.createdAt > signupDate + (30 * 24 * 60 * 60 * 1000)
        );
        if (hasActivityAfterDay30) day30Retention.returned++;
      }
    });

    return {
      day1: {
        total: day1Retention.total,
        returned: day1Retention.returned,
        rate: day1Retention.total > 0
          ? ((day1Retention.returned / day1Retention.total) * 100).toFixed(2)
          : 0,
      },
      day7: {
        total: day7Retention.total,
        returned: day7Retention.returned,
        rate: day7Retention.total > 0
          ? ((day7Retention.returned / day7Retention.total) * 100).toFixed(2)
          : 0,
      },
      day30: {
        total: day30Retention.total,
        returned: day30Retention.returned,
        rate: day30Retention.total > 0
          ? ((day30Retention.returned / day30Retention.total) * 100).toFixed(2)
          : 0,
      },
    };
  },
});

// Step 18: Get engagement over time
// Returns daily active users for the specified time range
export const getEngagementOverTime = query({
  args: { days: v.optional(v.number()) }, // Default: 30 days
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const daysBack = args.days || 30;
    const now = Date.now();

    const progress = await ctx.db.query("progress").collect();

    // Group activity by day
    const dailyActivity = new Map();

    // Initialize all days
    for (let i = 0; i < daysBack; i++) {
      const date = new Date(now - (i * 24 * 60 * 60 * 1000));
      const dateKey = date.toISOString().split('T')[0];
      dailyActivity.set(dateKey, {
        date: dateKey,
        activeUsers: new Set(),
        lessonsCompleted: 0,
        totalQuestions: 0,
      });
    }

    // Count activity per day
    progress.forEach(p => {
      // Step 5a: Validate createdAt timestamp before processing
      // Skip records with missing or invalid timestamps to prevent errors
      if (!p.createdAt || typeof p.createdAt !== 'number') {
        return; // Skip records with missing or invalid createdAt
      }

      const activityDate = new Date(p.createdAt);

      // Validate the date is actually valid (not NaN)
      if (isNaN(activityDate.getTime())) {
        return; // Skip invalid dates
      }

      const dateKey = activityDate.toISOString().split('T')[0];

      if (dailyActivity.has(dateKey)) {
        const day = dailyActivity.get(dateKey);
        day.activeUsers.add(p.userId);
        if (p.isCompleted) day.lessonsCompleted++;
        day.totalQuestions += p.totalQuestions || 0;
      }
    });

    // Convert Sets to counts
    return Array.from(dailyActivity.values())
      .map(day => ({
        date: day.date,
        activeUsers: day.activeUsers.size,
        lessonsCompleted: day.lessonsCompleted,
        totalQuestions: day.totalQuestions,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },
});

// ✅ In this section we achieved:
// Time-based analytics - user growth, retention metrics, engagement trends

// ========================================
// END OF ANALYTICS MODULE
// ========================================
