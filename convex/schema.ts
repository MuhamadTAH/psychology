import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User accounts
  users: defineTable({
    email: v.string(),
    password: v.optional(v.string()), // Hashed password for Convex auth
    name: v.optional(v.string()),
    age: v.optional(v.number()),
    school: v.optional(v.string()),
    image: v.optional(v.string()),
    avatar: v.optional(v.string()), // Avatar theme: default, red-black, bold, shadow, etc.

    // Gamification fields
    hearts: v.optional(v.number()), // Default: 5, range: 0-5
    gems: v.optional(v.number()), // Default: 0, no limit
    xp: v.optional(v.number()), // Default: 0, no limit
    streak: v.optional(v.number()), // Default: 0, consecutive days
    lastLessonDate: v.optional(v.string()), // Format: "YYYY-MM-DD"

    // Streak rewards system
    lastLoginDate: v.optional(v.string()), // Format: "YYYY-MM-DD", track daily login
    streakFreezes: v.optional(v.number()), // Number of streak freeze items available (default: 0)
    longestStreak: v.optional(v.number()), // Highest streak ever achieved (default: 0)
    totalStreakDays: v.optional(v.number()), // Total days with streak maintained (default: 0)
    streakBonusXP: v.optional(v.number()), // Total bonus XP earned from streaks (default: 0)

    // Social features
    following: v.optional(v.array(v.id("users"))), // Array of user IDs this user follows

    createdAt: v.number(),
  }).index("by_email", ["email"]),

  // Onboarding answers
  onboarding: defineTable({
    userId: v.id("users"),
    favoriteSubject: v.string(), // "math", "science", "english", etc.
    studyTime: v.string(), // "morning", "afternoon", "evening", "anytime"
    motivation: v.string(), // "competition", "rewards", "learning", "fun"
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  // Track what user uploaded and GPT response
  uploads: defineTable({
    userId: v.id("users"),
    userText: v.string(), // The paragraph/PDF text user sent
    gptRawResponse: v.string(), // Full GPT response text
    lessonCount: v.number(), // How many lessons created (usually 10)
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  // Individual lessons (10 rows per upload)
  lessons: defineTable({
    userId: v.id("users"),
    uploadId: v.optional(v.id("uploads")), // Link to the upload that created this (optional for old data)
    lessonNumber: v.number(), // 1-10
    title: v.string(),
    lessonJSON: v.optional(v.any()), // Full lesson data - optional for migration
    content: v.optional(v.any()), // Old field name - keep for backward compatibility
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_uploadId", ["uploadId"])
    .index("by_userId_and_lessonNumber", ["userId", "lessonNumber"]),

  // Track completion per lesson
  progress: defineTable({
    userId: v.id("users"),
    lessonId: v.optional(v.id("lessons")), // Optional for global lessons
    lessonNumber: v.number(),
    darkPsychLessonId: v.optional(v.string()), // For Dark Psychology lessons: "A1-1", "A2-1", etc.
    completedStages: v.array(v.string()), // ["introduction", "practice", "quiz", "reinforcement"]
    mistakes: v.array(v.any()), // Array of wrong answers/questions

    // Track answers for XP/hearts logic
    wrongAnswersCount: v.optional(v.number()), // How many wrong answers in this lesson
    correctAnswersCount: v.optional(v.number()), // How many correct answers

    // Multi-part lesson tracking
    currentPart: v.optional(v.number()), // Which part user is on (1, 2, 3, etc.)
    completedParts: v.optional(v.array(v.number())), // [1, 2] means parts 1 and 2 are done
    reviewedParts: v.optional(v.array(v.number())), // [1] means part 1 has been reviewed
    totalParts: v.optional(v.number()), // Total parts in this lesson (defaults to 1)

    score: v.optional(v.number()),
    isCompleted: v.boolean(),
    firstCompletionDate: v.optional(v.number()), // Track when first completed
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_lessonId", ["lessonId"])
    .index("by_userId_and_lessonId", ["userId", "lessonId"])
    .index("by_userId_and_lessonNumber", ["userId", "lessonNumber"])
    .index("by_userId_and_darkPsychLessonId", ["userId", "darkPsychLessonId"]),

  // Track treasure chest status
  chests: defineTable({
    userId: v.id("users"),
    chestPosition: v.number(), // 3, 6, 9, 12, etc.
    isOpened: v.boolean(),
    openedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_position", ["userId", "chestPosition"]),

  // Leagues system
  leagues: defineTable({
    userId: v.id("users"),
    leagueName: v.string(), // "Bronze", "Silver", "Gold", "Emerald", "Diamond", etc.
    weeklyXP: v.number(), // XP earned this week for ranking
    weekStartDate: v.number(), // Timestamp when this league week started
    weekEndDate: v.number(), // Timestamp when this league week ends
    lastUpdated: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_leagueName_and_weeklyXP", ["leagueName", "weeklyXP"]), // For ranking queries

  // Character customization groups (Head, Hair, Eyes, etc.)
  customizationGroups: defineTable({
    name: v.string(), // "Head", "Hair", "Eyes", "Top", "Bottom", etc.
    position: v.number(), // Order to display
    removable: v.optional(v.boolean()), // Can be removed (e.g., hats, glasses)
    colorPaletteId: v.optional(v.id("colorPalettes")),
    createdAt: v.number(),
  }).index("by_position", ["position"]),

  // Color palettes for customization
  colorPalettes: defineTable({
    name: v.string(), // "Skin tones", "Hair colors", etc.
    colors: v.array(v.string()), // ["#f5c6a5", "#e8b298", ...]
    createdAt: v.number(),
  }),

  // Character assets (3D models)
  customizationAssets: defineTable({
    groupId: v.id("customizationGroups"),
    name: v.string(), // "Hair Style 1", "T-Shirt Red", etc.
    assetUrl: v.string(), // Convex storage URL for .glb file
    thumbnailUrl: v.optional(v.string()), // Preview image
    lockedGroups: v.optional(v.array(v.id("customizationGroups"))), // Groups this asset hides
    createdAt: v.number(),
  }).index("by_groupId", ["groupId"]),

  // User's saved character customization
  userCharacters: defineTable({
    userId: v.id("users"),
    customization: v.any(), // JSON object with selected assets and colors
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  // Dark Psychology: User notes for lessons
  darkPsychologyNotes: defineTable({
    email: v.string(),
    lessonId: v.string(), // Dark Psychology lesson ID (e.g., "A1-1", "A2-1")
    lessonTitle: v.string(),
    note: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user_lesson", ["email", "lessonId"]),

  // Dark Psychology: Bookmarked questions
  darkPsychologyBookmarks: defineTable({
    email: v.string(),
    lessonId: v.string(), // Dark Psychology lesson ID
    lessonTitle: v.string(),
    question: v.string(), // The question text
    questionIndex: v.number(), // Index of question in lesson
    createdAt: v.number(),
  }).index("by_user_lesson", ["email", "lessonId"])
    .index("by_user_question", ["email", "lessonId", "questionIndex"]),

  // Dark Psychology: Questions for review (spaced repetition)
  darkPsychologyReview: defineTable({
    email: v.string(),
    lessonId: v.string(),
    question: v.string(),
    userAnswer: v.string(),
    correctAnswer: v.string(),
    questionType: v.string(), // "multiple-choice", "fill-in", "matching", etc.
    reviewCount: v.number(), // How many times reviewed
    lastReviewed: v.number(), // Timestamp of last review
    nextReview: v.number(), // Timestamp when to review next (spaced repetition)
    createdAt: v.number(),
  }).index("by_user_lesson", ["email", "lessonId"]),

  // Dark Psychology: User achievements/badges
  darkPsychologyAchievements: defineTable({
    email: v.string(),
    achievementId: v.string(), // "unit_a_complete", "manipulation_master", etc.
    achievementName: v.string(),
    achievementDescription: v.string(),
    achievementIcon: v.string(), // Emoji or icon name
    unlockedAt: v.number(),
  }).index("by_user", ["email"])
    .index("by_user_achievement", ["email", "achievementId"]),

  // Power-ups: User inventory of purchased power-ups
  powerUps: defineTable({
    email: v.string(),
    powerUpType: v.string(), // "skip_question", "extra_heart", "streak_freeze", "time_freeze", "hint"
    quantity: v.number(), // How many of this power-up the user owns
    updatedAt: v.number(),
  }).index("by_user", ["email"])
    .index("by_user_type", ["email", "powerUpType"]),

  // Power-ups: Purchase history
  powerUpPurchases: defineTable({
    email: v.string(),
    powerUpType: v.string(),
    powerUpName: v.string(),
    gemsCost: v.number(),
    quantity: v.number(), // How many were purchased in this transaction
    purchasedAt: v.number(),
  }).index("by_user", ["email"]),

  // Power-ups: Usage history
  powerUpUsage: defineTable({
    email: v.string(),
    powerUpType: v.string(),
    lessonId: v.optional(v.string()), // Which lesson it was used in
    usedAt: v.number(),
  }).index("by_user", ["email"]),

  // Analytics AI: Query history
  analyticsQueries: defineTable({
    email: v.string(),
    question: v.string(),
    answer: v.string(),
    functionsUsed: v.array(v.string()), // Which analytics functions were called
    dataSnapshot: v.optional(v.any()), // Raw data returned
    timestamp: v.number(),
    favorite: v.optional(v.boolean()), // Mark important queries
  })
    .index("by_user", ["email"])
    .index("by_user_timestamp", ["email", "timestamp"]),

  // Analytics Alerts: Automated monitoring
  analyticsAlerts: defineTable({
    alertType: v.string(), // "user_drop", "low_retention", "lesson_struggle", etc.
    severity: v.string(), // "info", "warning", "critical"
    message: v.string(),
    data: v.optional(v.any()), // Related data
    timestamp: v.number(),
    read: v.optional(v.boolean()), // Mark as read
    dismissed: v.optional(v.boolean()),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_severity", ["severity"]),
});