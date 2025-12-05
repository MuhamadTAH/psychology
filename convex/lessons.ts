import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Save upload and lessons (deletes old lessons first)
export const saveUploadAndLessons = mutation({
  args: {
    userText: v.string(),
    gptRawResponse: v.string(),
    lessons: v.array(v.any()), // Array of parsed lesson objects
    email: v.optional(v.string()), // Email from localStorage
  },
  handler: async (ctx, args) => {
    // Try Clerk auth first, fallback to email parameter
    const identity = await ctx.auth.getUserIdentity();
    const userEmail = args.email || identity?.email;

    if (!userEmail) {
      throw new Error("Not authenticated");
    }

    // Get or create user
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", userEmail))
      .first();

    if (!user) {
      const userId = await ctx.db.insert("users", {
        email: userEmail,
        name: identity?.name,
        streak: 0, // Default streak for new users
        hearts: 5,
        gems: 0,
        xp: 0,
        createdAt: Date.now(),
      });
      user = await ctx.db.get(userId);
    } else if (user.streak === undefined) {
      // Update old users to have streak field
      await ctx.db.patch(user._id, { streak: 0 });
    }

    // DELETE ALL OLD LESSONS for this user
    const oldLessons = await ctx.db
      .query("lessons")
      .withIndex("by_userId", (q) => q.eq("userId", user!._id))
      .collect();

    for (const lesson of oldLessons) {
      await ctx.db.delete(lesson._id);
    }

    // DELETE ALL OLD PROGRESS for this user
    const oldProgress = await ctx.db
      .query("progress")
      .withIndex("by_userId", (q) => q.eq("userId", user!._id))
      .collect();

    for (const prog of oldProgress) {
      await ctx.db.delete(prog._id);
    }

    // Save upload record
    const uploadId = await ctx.db.insert("uploads", {
      userId: user!._id,
      userText: args.userText,
      gptRawResponse: args.gptRawResponse,
      lessonCount: args.lessons.length,
      createdAt: Date.now(),
    });

    // Save each lesson
    const lessonIds = [];
    for (const lesson of args.lessons) {
      const lessonId = await ctx.db.insert("lessons", {
        userId: user!._id,
        uploadId: uploadId,
        lessonNumber: lesson.number,
        title: lesson.title,
        lessonJSON: lesson,
        createdAt: Date.now(),
      });
      lessonIds.push(lessonId);
    }

    return { success: true, uploadId, lessonIds, lessonCount: args.lessons.length, deletedOldLessons: oldLessons.length };
  },
});

// Get all lessons for the current user
export const getUserLessons = query({
  args: {
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userEmail = args.email || identity?.email;

    if (!userEmail) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", userEmail))
      .first();

    if (!user) {
      return [];
    }

    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    return lessons;
  },
});

// Get lessons by upload
export const getLessonsByUpload = query({
  args: { uploadId: v.id("uploads") },
  handler: async (ctx, args) => {
    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_uploadId", (q) => q.eq("uploadId", args.uploadId))
      .collect();

    return lessons;
  },
});

// Get progress for all lessons
export const getUserProgress = query({
  args: {
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userEmail = args.email || identity?.email;

    if (!userEmail) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", userEmail))
      .first();

    if (!user) {
      return [];
    }

    const progress = await ctx.db
      .query("progress")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    return progress;
  },
});

// Update lesson progress
export const updateLessonProgress = mutation({
  args: {
    lessonId: v.optional(v.union(v.id("lessons"), v.string())), // Optional - can be Convex ID or string ID for Dark Psychology
    lessonNumber: v.number(),
    darkPsychLessonId: v.optional(v.string()), // For Dark Psychology lessons: "A1-1", "A2-1", etc.
    stage: v.string(), // "introduction", "practice", "quiz", "reinforcement"
    mistakes: v.optional(v.array(v.any())),
    score: v.optional(v.number()),
    isCompleted: v.boolean(),
    email: v.optional(v.string()),
    currentPart: v.optional(v.number()), // For multi-part lessons
    completedParts: v.optional(v.array(v.number())), // Track which parts are completed
    reviewedParts: v.optional(v.array(v.number())), // Track which parts have been reviewed
    totalParts: v.optional(v.number()), // Total number of parts in the lesson
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userEmail = args.email || identity?.email;

    if (!userEmail) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", userEmail))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Step 1: Check if progress exists
    // Priority: darkPsychLessonId > lessonId > lessonNumber
    let existingProgress;

    if (args.darkPsychLessonId) {
      // Use darkPsychLessonId for Dark Psychology lessons (most specific)
      existingProgress = await ctx.db
        .query("progress")
        .withIndex("by_userId_and_darkPsychLessonId", (q) =>
          q.eq("userId", user._id).eq("darkPsychLessonId", args.darkPsychLessonId)
        )
        .first();
    } else {
      // Fallback to lessonNumber for user-generated lessons
      existingProgress = await ctx.db
        .query("progress")
        .withIndex("by_userId_and_lessonNumber", (q) =>
          q.eq("userId", user._id).eq("lessonNumber", args.lessonNumber)
        )
        .first();
    }

    if (existingProgress) {
      // Update existing progress
      const updatedStages = existingProgress.completedStages.includes(args.stage)
        ? existingProgress.completedStages
        : [...existingProgress.completedStages, args.stage];

      await ctx.db.patch(existingProgress._id, {
        completedStages: updatedStages,
        mistakes: args.mistakes || existingProgress.mistakes,
        score: args.score || existingProgress.score,
        isCompleted: args.isCompleted,
        currentPart: args.currentPart,
        completedParts: args.completedParts || existingProgress.completedParts || [],
        reviewedParts: args.reviewedParts || existingProgress.reviewedParts || [],
        totalParts: args.totalParts,
        updatedAt: Date.now(),
      });
    } else {
      // Step 2: Create new progress
      // For Dark Psychology lessons, lessonId is a string like "dark-psych-1", not a Convex ID
      // So we only save it if it's a valid Convex ID
      const isConvexId = typeof args.lessonId === 'string' && args.lessonId.length > 10 && !args.lessonId.includes('-');

      await ctx.db.insert("progress", {
        userId: user._id,
        lessonId: isConvexId ? args.lessonId : undefined,
        lessonNumber: args.lessonNumber,
        darkPsychLessonId: args.darkPsychLessonId, // Save Dark Psychology lesson ID
        completedStages: [args.stage],
        mistakes: args.mistakes || [],
        score: args.score,
        isCompleted: args.isCompleted,
        currentPart: args.currentPart,
        completedParts: args.completedParts || [],
        reviewedParts: args.reviewedParts || [],
        totalParts: args.totalParts,
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// Create a mock lesson with sentence-building question type
export const createMockSentenceBuildingLesson = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Get or create user
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      const userId = await ctx.db.insert("users", {
        email: args.email,
        name: "Demo User",
        streak: 0,
        hearts: 5,
        gems: 0,
        xp: 0,
        createdAt: Date.now(),
      });
      user = await ctx.db.get(userId);
    }

    // Delete old lessons
    const oldLessons = await ctx.db
      .query("lessons")
      .withIndex("by_userId", (q) => q.eq("userId", user!._id))
      .collect();

    for (const lesson of oldLessons) {
      await ctx.db.delete(lesson._id);
    }

    // Mock lesson data with sentence-building question
    const mockLesson = {
      number: 1,
      title: "Sentence Building Practice",
      practice: [
        {
          type: "sentence-building",
          question: "Create a present simple question",
          words: ["hello", "was", "were", "goes", "I", "to", "school"],
          correctSentence: "I goes to school"
        },
        {
          type: "sentence-building",
          question: "Build a correct English sentence",
          words: ["is", "the", "cat", "on", "mat", "dog", "table"],
          correctSentence: "the cat is on mat"
        }
      ],
      quiz: [
        {
          type: "fill-in-blank",
          question: "Complete the sentence",
          sentence: "She ___ to the market yesterday.",
          correctAnswer: "went",
          wrongOptions: ["go", "goes", "going"],
          explanation: "We use 'went' for past tense."
        }
      ]
    };

    // Create upload record
    const uploadId = await ctx.db.insert("uploads", {
      userId: user!._id,
      userText: "Mock sentence building lesson",
      gptRawResponse: JSON.stringify(mockLesson),
      lessonCount: 1,
      createdAt: Date.now(),
    });

    // Create lesson
    const lessonId = await ctx.db.insert("lessons", {
      userId: user!._id,
      uploadId: uploadId,
      lessonNumber: 1,
      title: "Sentence Building Practice",
      lessonJSON: mockLesson,
      createdAt: Date.now(),
    });

    return { success: true, lessonId };
  },
});

// Delete all lessons for current user
export const deleteAllMyLessons = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Delete all lessons
    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    for (const lesson of lessons) {
      await ctx.db.delete(lesson._id);
    }

    // Delete all progress
    const progress = await ctx.db
      .query("progress")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    for (const prog of progress) {
      await ctx.db.delete(prog._id);
    }

    return { success: true, deletedLessons: lessons.length, deletedProgress: progress.length };
  },
});

// Copy current user's lessons to all other users
export const copyLessonsToAllUsers = mutation({
  args: {
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Step 1: Get the current user (the one who created the lessons)
    const identity = await ctx.auth.getUserIdentity();
    const userEmail = args.email || identity?.email;

    if (!userEmail) {
      throw new Error("Not authenticated");
    }

    const sourceUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", userEmail))
      .first();

    if (!sourceUser) {
      throw new Error("User not found");
    }

    // Step 2: Get all lessons from this user
    const sourceLessons = await ctx.db
      .query("lessons")
      .withIndex("by_userId", (q) => q.eq("userId", sourceUser._id))
      .collect();

    if (sourceLessons.length === 0) {
      return { success: false, message: "No lessons found to copy" };
    }

    // Step 3: Get all other users in the database
    const allUsers = await ctx.db.query("users").collect();
    const otherUsers = allUsers.filter(u => u._id !== sourceUser._id);

    let usersUpdated = 0;
    let lessonsCreated = 0;

    // Step 4: For each user, copy the lessons
    for (const targetUser of otherUsers) {
      // Delete existing lessons for this user (optional - clean slate)
      const existingLessons = await ctx.db
        .query("lessons")
        .withIndex("by_userId", (q) => q.eq("userId", targetUser._id))
        .collect();

      for (const lesson of existingLessons) {
        await ctx.db.delete(lesson._id);
      }

      // Copy each lesson from source user to target user
      for (const sourceLesson of sourceLessons) {
        await ctx.db.insert("lessons", {
          userId: targetUser._id,
          uploadId: sourceLesson.uploadId, // Keep reference to original upload
          lessonNumber: sourceLesson.lessonNumber,
          title: sourceLesson.title,
          lessonJSON: sourceLesson.lessonJSON,
          createdAt: Date.now(),
        });
        lessonsCreated++;
      }

      usersUpdated++;
    }

    return {
      success: true,
      message: `Copied ${sourceLessons.length} lessons to ${usersUpdated} users`,
      lessonsCreated,
      usersUpdated
    };
  },
});

// Auto-initialize demo lessons for new users
export const initializeDemoLessonsForUser = mutation({
  args: {
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Step 1: Get or create the current user
    const identity = await ctx.auth.getUserIdentity();
    const userEmail = args.email || identity?.email;

    if (!userEmail) {
      throw new Error("Not authenticated");
    }

    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", userEmail))
      .first();

    if (!user) {
      // Create new user
      const userId = await ctx.db.insert("users", {
        email: userEmail,
        name: identity?.name,
        streak: 0,
        hearts: 5,
        gems: 0,
        xp: 0,
        createdAt: Date.now(),
      });
      user = await ctx.db.get(userId);
    }

    // Step 2: Check if user already has lessons
    const existingLessons = await ctx.db
      .query("lessons")
      .withIndex("by_userId", (q) => q.eq("userId", user!._id))
      .collect();

    if (existingLessons.length > 0) {
      return { success: false, message: "User already has lessons" };
    }

    // Step 3: Define the demo lessons (same as create-demo-lessons page)
    const lesson1 = {
      number: 1,
      title: "Birthday Party — Match the Sentences",
      practice: [
        {
          type: "matching",
          question: "Match the pictures to what happened during the party.",
          pairs: {
            "/images/party1.png": "It was my birthday party on Saturday. I invited all my friends.",
            "/images/party2.png": "My mother cooked the food.",
            "/images/party3.png": "The party started in the afternoon."
          }
        },
        {
          type: "matching",
          question: "Match the pictures to what happened during the party.",
          pairs: {
            "/images/party4.png": "I opened my presents.",
            "/images/party5.png": "We played party games.",
            "/images/party6.png": "We danced."
          }
        },
        {
          type: "matching",
          question: "Match the pictures to what happened during the party.",
          pairs: {
            "/images/party7.png": "The party finished in the evening.",
            "/images/party3.png": "The party started in the afternoon.",
            "/images/party5.png": "We played party games."
          }
        }
      ],
    };

    const lesson2 = {
      number: 2,
      title: "Objects in the Room (Image Matching)",
      practice: [
        {
          type: "matching",
          pairs: {
            "/images/room1.jpg": "Window",
            "/images/room2.jpg": "Television",
            "/images/room3.jpg": "Door",
            "/images/room4.jpg": "Radio"
          }
        }
      ]
    };

    const fillItems = [
      { sentence: "_____ the television", correct: "Turn on" },
      { sentence: "_____ the door", correct: "Open" },
      { sentence: "_____ the window", correct: "Close" },
      { sentence: "_____ the radio", correct: "Turn off" },
    ];

    const distractorPool = ["Turn on", "Turn off", "Open", "Close", "Press", "Start"];

    const fillPractice = fillItems.map(it => {
      const wrongs = distractorPool.filter(w => w !== it.correct).slice(0, 3);
      return {
        type: "fill-in-blank",
        sentence: it.sentence,
        correctAnswer: it.correct,
        wrongOptions: wrongs,
        explanation: `Use "${it.correct}" for this action.`
      };
    });

    const lesson3 = {
      number: 3,
      title: "Actions — TV / Door / Window / Radio",
      practice: fillPractice
    };

    const lesson4 = {
      number: 4,
      title: "Describing Images",
      practice: [
        {
          type: "multiple-choice",
          question: "Describe the image.",
          image: "/images/party1.png",
          options: [
            { id: "A", text: "The TV is on." },
            { id: "B", text: "The TV is off." },
            { id: "C", text: "The TV is flying." },
            { id: "D", text: "The TV is eating food." }
          ],
          correctAnswer: "A",
          explanation: "The TV is on.",
          difficulty: "easy"
        },
        {
          type: "multiple-choice",
          question: "Describe the image.",
          image: "/images/party1.png",
          options: [
            { id: "A", text: "The window is open." },
            { id: "B", text: "The window is closed." },
            { id: "C", text: "The window is broken." },
            { id: "D", text: "The window is moving." }
          ],
          correctAnswer: "A",
          explanation: "The window is open.",
          difficulty: "easy"
        },
        {
          type: "multiple-choice",
          question: "Describe the image.",
          image: "/images/party1.png",
          options: [
            { id: "A", text: "The radio is playing music." },
            { id: "B", text: "The radio is cooking food." },
            { id: "C", text: "The radio is broken." },
            { id: "D", text: "The radio is flying." }
          ],
          correctAnswer: "A",
          explanation: "The radio is playing music.",
          difficulty: "easy"
        },
        {
          type: "sentence-building",
          question: "Arrange the words to make a correct sentence.",
          words: ["She", "is", "watching", "TV", "sleeping", "running"],
          correctSentence: "She is watching TV"
        },
        {
          type: "sentence-building",
          question: "Arrange the words to make a correct sentence.",
          words: ["He", "is", "listening", "to", "music", "eating", "walking"],
          correctSentence: "He is listening to music"
        },
      ],
    };

    const DEMO_LESSONS = [lesson1, lesson2, lesson3, lesson4];

    // Step 4: Create a demo upload record
    const uploadId = await ctx.db.insert("uploads", {
      userId: user!._id,
      userText: "Demo Lessons (Auto-initialized)",
      gptRawResponse: JSON.stringify(DEMO_LESSONS),
      lessonCount: DEMO_LESSONS.length,
      createdAt: Date.now(),
    });

    // Step 5: Save each lesson for this user
    const lessonIds = [];
    for (const lesson of DEMO_LESSONS) {
      const lessonId = await ctx.db.insert("lessons", {
        userId: user!._id,
        uploadId: uploadId,
        lessonNumber: lesson.number,
        title: lesson.title,
        lessonJSON: lesson,
        createdAt: Date.now(),
      });
      lessonIds.push(lessonId);
    }

    return {
      success: true,
      message: "Demo lessons initialized successfully",
      lessonCount: DEMO_LESSONS.length,
    };
  },
});

// Step: Get all Dark Psychology lessons (from database, including system lessons)
// This query returns all lessons created via batch upload or admin panel
export const getAllDarkPsychologyLessons = query({
  args: {},
  handler: async (ctx) => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🟢 [CONVEX QUERY] getAllDarkPsychologyLessons CALLED');
    console.log('🟢 [CONVEX QUERY] Timestamp:', new Date().toISOString());
    console.log('═══════════════════════════════════════════════════════');

    try {
      // Step 1: Get system user
      console.log('🔍 [STEP 1] Searching for system user (system@duolearn.com)...');
      const systemUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", "system@duolearn.com"))
        .first();

      if (!systemUser) {
        console.log('🔴 [ERROR] System user not found!');
        console.log('🔴 [ERROR] Cannot fetch lessons without system user');

        // Try to get ALL users to debug
        const allUsers = await ctx.db.query("users").collect();
        console.log('🔍 [DEBUG] Total users in database:', allUsers.length);
        allUsers.forEach((user, i) => {
          console.log(`🔍 [DEBUG] User ${i + 1}:`, {
            id: user._id,
            email: user.email,
            name: user.name,
          });
        });

        return [];
      }

      console.log('✅ [STEP 1] System user found!');
      console.log('✅ [SYSTEM USER]', {
        _id: systemUser._id,
        email: systemUser.email,
        name: systemUser.name,
      });

      // Step 2: Get all lessons created by system user
      console.log('🔍 [STEP 2] Fetching all lessons for system user...');
      const lessons = await ctx.db
        .query("lessons")
        .withIndex("by_userId", (q) => q.eq("userId", systemUser._id))
        .collect();

      console.log('✅ [STEP 2] Query completed!');
      console.log('✅ [RESULT] Found', lessons.length, 'lessons for system user');

      if (lessons.length === 0) {
        console.log('⚠️ [WARNING] No lessons found for system user!');
        console.log('⚠️ [WARNING] System user has 0 lessons in database');
      } else {
        console.log('📚 [LESSONS] Listing all lessons:');
        lessons.forEach((lesson, i) => {
          const data = lesson.lessonJSON;
          console.log(`📄 [LESSON ${i + 1}/${lessons.length}]`, {
            dbId: lesson._id,
            title: lesson.title,
            sectionId: data?.sectionId,
            unitId: data?.unitId,
            lessonId: data?.lessonId,
            lessonPart: data?.lessonPart,
            lessonTitle: data?.lessonTitle,
          });
        });
      }

      console.log('═══════════════════════════════════════════════════════');
      console.log('✅ [CONVEX QUERY] Returning', lessons.length, 'lessons');
      console.log('═══════════════════════════════════════════════════════');

      // Step 3: Return lesson data with fields at BOTH top level AND in lessonJSON
      // Top level: For edit page (expects lesson.lessonId directly)
      // lessonJSON: For section page (expects lesson.lessonJSON.sectionId)
      return lessons.map(lesson => ({
        ...lesson.lessonJSON,
        _id: lesson._id,
        title: lesson.title,
        lessonJSON: lesson.lessonJSON, // Keep original nested structure for backward compatibility
      }));
    } catch (error) {
      console.log('🔴🔴🔴 [FATAL ERROR] Exception in getAllDarkPsychologyLessons 🔴🔴🔴');
      console.log('🔴 [ERROR]', error);
      console.log('🔴 [ERROR] Stack:', error instanceof Error ? error.stack : 'No stack trace');
      throw error;
    }
  },
});