// 🧠 FILE PURPOSE
// Dark Psychology Dashboard - Complete learning hub with all features.
// Shows progress, notes, bookmarks, search, review mode, and certificate.

"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  BookOpen,
  Star,
  TrendingUp,
  Award,
  Search,
  StickyNote,
  Bookmark,
  Clock,
  Target,
  ArrowLeft,
  Trophy,
  Flame,
  ShoppingCart,
} from "lucide-react";

export default function DarkPsychologyDashboard() {
  const { user, isLoaded } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || "";

  // Step 1: Redirect to welcome page if not authenticated
  // This ensures users see the onboarding flow
  useEffect(() => {
    if (isLoaded && !user) {
      window.location.href = "/welcome";
    }
  }, [isLoaded, user]);

  // Step 2: Load dashboard data only if user is authenticated
  const dashboard = useQuery(
    api.darkPsychology.getDashboard,
    userEmail ? { email: userEmail } : "skip"
  );
  const notes = useQuery(
    api.darkPsychology.getNotes,
    userEmail ? { email: userEmail } : "skip"
  );
  const bookmarks = useQuery(
    api.darkPsychology.getBookmarks,
    userEmail ? { email: userEmail } : "skip"
  );
  const reviewQuestions = useQuery(
    api.darkPsychology.getReviewQuestions,
    userEmail ? { email: userEmail } : "skip"
  );
  const recommendations = useQuery(
    api.darkPsychology.getRecommendations,
    userEmail ? { email: userEmail } : "skip"
  );
  const updateStreak = useMutation(api.darkPsychology.updateDailyStreak);

  const [activeTab, setActiveTab] = useState<"overview" | "notes" | "bookmarks" | "review">("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // Step 3: Auto-update streak on dashboard load
  useEffect(() => {
    if (userEmail) {
      updateStreak({ email: userEmail }).catch((error) => {
        console.error("Failed to update streak:", error);
      });
    }
  }, [userEmail]);

  // Step 4: Show loading state while checking authentication or loading data
  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  // Step 2: Calculate progress percentage
  const progressPercentage = (dashboard.completedLessons / dashboard.totalLessons) * 100;
  const isComplete = dashboard.completedLessons === dashboard.totalLessons;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-sm border-b-2 border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Dark Psychology Hub</h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Progress Overview */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border-2 border-purple-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Your Progress</h2>
              {isComplete && (
                <Award className="w-12 h-12 text-yellow-400 animate-pulse" />
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-lg">
                  {dashboard.completedLessons} / {dashboard.totalLessons} Lessons Complete
                </span>
                <span className="text-purple-400 text-lg font-bold">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <div className="text-yellow-400 text-3xl font-bold">{dashboard.totalXP}</div>
                <div className="text-gray-400 text-sm">Total XP</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <div className="text-green-400 text-3xl font-bold">{dashboard.accuracy}%</div>
                <div className="text-gray-400 text-sm">Accuracy</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <div className="text-white text-3xl font-bold">{dashboard.streak}</div>
                <div className="text-gray-400 text-sm">Day Streak</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <div className="text-red-400 text-3xl font-bold">{dashboard.reviewCount}</div>
                <div className="text-gray-400 text-sm">To Review</div>
              </div>
            </div>

            {/* Certificate Message */}
            {isComplete && (
              <div className="mt-6 bg-yellow-500/20 border-2 border-yellow-500/50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-yellow-400" />
                  <div>
                    <p className="text-yellow-300 font-bold text-lg">Congratulations! Course Complete!</p>
                    <p className="text-yellow-200 text-sm">
                      You've mastered all Dark Psychology lessons. Your certificate is ready!
                    </p>
                  </div>
                </div>
                <Link
                  href="/dark-psychology-certificate"
                  className="mt-4 block w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-lg text-center hover:from-yellow-400 hover:to-yellow-500 transition-all"
                >
                  View Your Certificate
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* AI Recommendations Section */}
        {recommendations && recommendations.length > 0 && (
          <div className="mb-8">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-xl border-2 border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">Recommended for You</h2>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Based on your performance, we recommend focusing on these lessons:
              </p>
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <Link
                    key={rec.id}
                    href={`/yourlesson?category=dark-psychology&lessonNumber=${rec.number}&lessonId=${rec.id}`}
                    className="block bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-gray-500 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-gray-700 text-gray-300 text-xs font-bold px-2 py-1 rounded">
                            {rec.topic}
                          </span>
                          {rec.status === "not_started" && (
                            <span className="bg-gray-700 text-gray-300 text-xs font-bold px-2 py-1 rounded">
                              Not Started
                            </span>
                          )}
                          {rec.status === "in_progress" && (
                            <span className="bg-yellow-500/20 text-yellow-300 text-xs font-bold px-2 py-1 rounded">
                              In Progress
                            </span>
                          )}
                          {rec.status === "completed" && rec.accuracy < 90 && (
                            <span className="bg-green-500/20 text-green-300 text-xs font-bold px-2 py-1 rounded">
                              Needs Review
                            </span>
                          )}
                        </div>
                        <h3 className="text-white font-semibold mb-1">Lesson {rec.number}: {rec.title}</h3>
                        <p className="text-gray-400 text-sm mb-2">{rec.reason}</p>
                        {rec.accuracy > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  rec.accuracy >= 70 ? "bg-green-500" : "bg-red-500"
                                }`}
                                style={{ width: `${rec.accuracy}%` }}
                              ></div>
                            </div>
                            <span className="text-gray-400 text-xs">{rec.accuracy}%</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            rec.priority >= 5
                              ? "bg-red-500/20 text-red-400"
                              : rec.priority >= 4
                              ? "bg-orange-500/20 text-orange-400"
                              : rec.priority >= 3
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-gray-700 text-white"
                          }`}
                        >
                          <span className="text-xl font-bold">!</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeTab === "overview"
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            <BookOpen className="w-5 h-5 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeTab === "notes"
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            <StickyNote className="w-5 h-5 inline mr-2" />
            Notes ({dashboard.notesCount})
          </button>
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeTab === "bookmarks"
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            <Bookmark className="w-5 h-5 inline mr-2" />
            Bookmarks ({dashboard.bookmarksCount})
          </button>
          <button
            onClick={() => setActiveTab("review")}
            className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeTab === "review"
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            <Clock className="w-5 h-5 inline mr-2" />
            Review ({reviewQuestions?.length || 0})
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800/50 rounded-xl border-2 border-gray-700 p-6 min-h-[400px]">
          {activeTab === "overview" && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href={
                    dashboard.nextLesson
                      ? `/yourlesson?category=dark-psychology&lessonNumber=${dashboard.nextLesson.lessonNumber}&lessonId=${dashboard.nextLesson.lessonId}&part=${dashboard.nextLesson.nextPart}`
                      : "/yourlesson?category=dark-psychology&lessonNumber=1"
                  }
                  className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg p-6 hover:from-gray-600 hover:to-gray-700 transition-all"
                >
                  <Target className="w-8 h-8 text-white mb-2" />
                  <h4 className="text-white font-bold text-lg mb-1">Continue Learning</h4>
                  <p className="text-gray-300 text-sm">
                    {dashboard.nextLesson
                      ? `Lesson ${dashboard.nextLesson.lessonNumber}, Part ${dashboard.nextLesson.nextPart}`
                      : "Start first lesson"}
                  </p>
                </Link>
                <Link
                  href="/dark-psychology-review"
                  className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6 hover:from-purple-500 hover:to-purple-600 transition-all"
                >
                  <Clock className="w-8 h-8 text-white mb-2" />
                  <h4 className="text-white font-bold text-lg mb-1">Review Mode</h4>
                  <p className="text-purple-200 text-sm">Practice {dashboard.reviewCount} questions</p>
                </Link>
                <Link
                  href="/dark-psychology-quiz"
                  className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 hover:from-green-500 hover:to-green-600 transition-all"
                >
                  <TrendingUp className="w-8 h-8 text-white mb-2" />
                  <h4 className="text-white font-bold text-lg mb-1">Random Quiz</h4>
                  <p className="text-green-200 text-sm">Test your knowledge</p>
                </Link>
                <Link
                  href="/dark-psychology/search"
                  className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-6 hover:from-orange-500 hover:to-orange-600 transition-all"
                >
                  <Search className="w-8 h-8 text-white mb-2" />
                  <h4 className="text-white font-bold text-lg mb-1">Search Lessons</h4>
                  <p className="text-orange-200 text-sm">Find specific topics</p>
                </Link>
                <Link
                  href="/dark-psychology-leaderboard"
                  className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-lg p-6 hover:from-yellow-500 hover:to-yellow-600 transition-all"
                >
                  <Trophy className="w-8 h-8 text-white mb-2" />
                  <h4 className="text-white font-bold text-lg mb-1">Leaderboard</h4>
                  <p className="text-yellow-200 text-sm">See top learners</p>
                </Link>
                <Link
                  href="/dark-psychology-achievements"
                  className="bg-gradient-to-r from-pink-600 to-pink-700 rounded-lg p-6 hover:from-pink-500 hover:to-pink-600 transition-all"
                >
                  <Award className="w-8 h-8 text-white mb-2" />
                  <h4 className="text-white font-bold text-lg mb-1">Achievements</h4>
                  <p className="text-pink-200 text-sm">View your badges</p>
                </Link>
                <Link
                  href="/dark-psychology-streaks"
                  className="bg-gradient-to-r from-orange-600 to-red-700 rounded-lg p-6 hover:from-orange-500 hover:to-red-600 transition-all"
                >
                  <Flame className="w-8 h-8 text-white mb-2" />
                  <h4 className="text-white font-bold text-lg mb-1">Daily Streaks</h4>
                  <p className="text-orange-200 text-sm">{dashboard.streak} day streak 🔥</p>
                </Link>
                <Link
                  href="/dark-psychology-shop"
                  className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-lg p-6 hover:from-cyan-500 hover:to-blue-600 transition-all"
                >
                  <ShoppingCart className="w-8 h-8 text-white mb-2" />
                  <h4 className="text-white font-bold text-lg mb-1">Power-ups Shop</h4>
                  <p className="text-cyan-200 text-sm">Spend gems for advantages</p>
                </Link>
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Your Notes</h3>
              {notes && notes.length > 0 ? (
                <div className="space-y-4">
                  {notes.map((note) => (
                    <Link
                      key={note._id}
                      href={`/yourlesson?category=dark-psychology&lessonId=${note.lessonId}`}
                      className="block bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-yellow-500 transition-all cursor-pointer"
                    >
                      <h4 className="text-white font-semibold mb-2">{note.lessonTitle}</h4>
                      <p className="text-gray-300 text-sm whitespace-pre-wrap">{note.note}</p>
                      <p className="text-gray-500 text-xs mt-2">
                        Last updated: {new Date(note.updatedAt).toLocaleDateString()}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-12">
                  <StickyNote className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No notes yet. Start taking notes during lessons!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "bookmarks" && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Bookmarked Questions</h3>
              {bookmarks && bookmarks.length > 0 ? (
                <div className="space-y-4">
                  {bookmarks.map((bookmark) => (
                    <Link
                      key={bookmark._id}
                      href={`/yourlesson?category=dark-psychology&lessonId=${bookmark.lessonId}`}
                      className="block bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-purple-500 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1 fill-yellow-400" />
                        <div className="flex-1">
                          <h4 className="text-white font-semibold mb-1">{bookmark.lessonTitle}</h4>
                          <p className="text-gray-300 text-sm mb-2">{bookmark.question}</p>
                          <p className="text-gray-500 text-xs">Question #{bookmark.questionIndex + 1}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-12">
                  <Bookmark className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No bookmarks yet. Star your favorite questions!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "review" && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Questions to Review</h3>
              {reviewQuestions && reviewQuestions.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 mb-4">
                    <p className="text-gray-300 text-sm">
                      These questions are ready for review based on spaced repetition. Practice them to strengthen your memory!
                    </p>
                  </div>
                  <Link
                    href="/dark-psychology-review"
                    className="block w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold py-4 rounded-lg text-center hover:from-purple-500 hover:to-purple-600 transition-all"
                  >
                    Start Review Session ({reviewQuestions.length} questions)
                  </Link>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-12">
                  <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No questions to review right now. Great work!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ✅ In this page we achieved:
// Complete Dark Psychology dashboard with all features in one place.
// Progress tracking with visual progress bar and stats.
// Tabbed interface for notes, bookmarks, and review questions.
// Quick action buttons for all main features.
// Certificate message when course is complete.
