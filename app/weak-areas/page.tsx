// 🧠 FILE PURPOSE
// This page shows users their most common mistakes and weak areas.
// Helps users identify which questions they got wrong most frequently for targeted practice.

"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ArrowLeft, TrendingDown, Target, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function WeakAreasPage() {
  // Step 1: Get user mistakes and statistics
  const allMistakes = useQuery(api.weakAreas.getUserMistakes);
  const mistakeStats = useQuery(api.weakAreas.getMistakeStats);

  // Step 2: Loading state
  if (!allMistakes || !mistakeStats) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your weak areas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pb-20">
      {/* Step 3: Header with back button */}
      <div className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b-2 border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dark-psychology-dashboard"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </Link>

            <div className="flex items-center gap-2 bg-red-500/20 px-4 py-2 rounded-full border border-red-500/30">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-white font-bold">{mistakeStats.totalMistakes} Total Mistakes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step 4: Main content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <TrendingDown className="w-10 h-10 text-red-400" />
            <h1 className="text-4xl font-bold text-white">Weak Areas Review</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Review your most common mistakes to improve faster
          </p>
        </div>

        {/* Step 5: No mistakes state */}
        {mistakeStats.totalMistakes === 0 ? (
          <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-2xl border-2 border-green-500/30 p-12 text-center">
            <Target className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Perfect Record!</h2>
            <p className="text-gray-300">
              You haven't made any mistakes yet. Keep up the great work!
            </p>
          </div>
        ) : (
          <>
            {/* Step 6: Most common mistakes */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-red-400" />
                Most Common Mistakes
              </h2>

              <div className="space-y-4">
                {mistakeStats.mostCommonMistakes.map((mistake, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-gray-700 p-6 hover:border-red-500/50 transition-all"
                  >
                    {/* Mistake rank */}
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-500/30">
                        <span className="text-red-400 font-bold text-lg">#{index + 1}</span>
                      </div>

                      <div className="flex-1">
                        {/* Question */}
                        <h3 className="text-white font-bold text-lg mb-2">
                          {mistake.question}
                        </h3>

                        {/* Your answer vs correct answer */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                            <p className="text-red-400 text-xs font-semibold mb-1">Your Answer:</p>
                            <p className="text-white">{mistake.userAnswer || "No answer"}</p>
                          </div>

                          <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                            <p className="text-green-400 text-xs font-semibold mb-1">Correct Answer:</p>
                            <p className="text-white">{mistake.correctAnswer}</p>
                          </div>
                        </div>

                        {/* Frequency */}
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>Missed {mistake.count} time{mistake.count > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 7: All mistakes section */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                All Mistakes ({allMistakes.length})
              </h2>

              {allMistakes.length > 10 && (
                <p className="text-gray-400 mb-4">
                  Showing all {allMistakes.length} mistakes from your learning history
                </p>
              )}

              <div className="space-y-3">
                {allMistakes.map((mistake, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/50 rounded-lg border border-gray-700 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-white font-semibold mb-1">{mistake.question}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="text-red-400">
                            Your answer: {mistake.userAnswer || "No answer"}
                          </span>
                          <span className="text-green-400">
                            Correct: {mistake.correctAnswer}
                          </span>
                        </div>
                      </div>

                      {mistake.lessonNumber && (
                        <div className="flex-shrink-0 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30">
                          <span className="text-purple-400 text-sm font-semibold">
                            Lesson {mistake.lessonNumber}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Step 8: Tips section */}
        <div className="mt-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border-2 border-blue-500/30 p-6">
          <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-400" />
            Tips for Improvement
          </h2>
          <ul className="text-gray-300 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Review your most common mistakes regularly to reinforce learning</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Take your time when answering similar questions in future lessons</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Practice lessons that cover these weak areas more frequently</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ✅ In this page we achieved:
// A comprehensive weak areas review system showing all user mistakes.
// Ranked display of most common mistakes for targeted practice.
// Clean UI with visual distinction between user answers and correct answers.
