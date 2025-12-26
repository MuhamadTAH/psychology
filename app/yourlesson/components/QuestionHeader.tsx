// 🧠 FILE PURPOSE
// This component renders the top header of the lesson page.
// Shows X button, progress bar with XP, and hearts counter.

"use client";

import { X } from "lucide-react";
import { UserStats } from '../types';

interface QuestionHeaderProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  correctAnswers: number;
  userStats: UserStats | undefined;
  isPremium?: boolean;
  onClose: () => void;
}

export function QuestionHeader({
  currentQuestionIndex,
  totalQuestions,
  correctAnswers,
  userStats,
  isPremium = false,
  onClose
}: QuestionHeaderProps) {
  // Calculate XP earned (5 XP per correct answer)
  const xpEarned = correctAnswers * 5;

  // Calculate progress percentage based on correct answers only
  // This ensures the bar only fills when answers are correct, not when moving to next question
  const progressPercentage = (correctAnswers / totalQuestions) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 bg-[#2f3947] z-50 border-b-2 border-gray-700">
      <div className="max-w-4xl mx-auto px-6 py-3">
        <div className="flex items-center gap-4">
          {/* Close Button - X */}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close lesson"
          >
            <X className="h-6 w-6" strokeWidth={3} />
          </button>

          {/* Progress Bar with XP Counter */}
          <div className="flex-1 relative">
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden border-2 border-gray-600">
              <div
                className="bg-[#58CC02] h-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            {/* XP text overlay - always visible, positioned in center of bar */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {xpEarned} XP
              </span>
            </div>
          </div>

          {/* Hearts Counter - ⚡ style */}
          <div className="flex items-center gap-1">
            <span className="text-2xl" aria-label="Hearts">⚡</span>
            <span className="text-white font-bold text-lg">
              {isPremium ? "∞" : (userStats?.hearts || 5)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ In this component we achieved:
// A clean, reusable header component that displays lesson progress and user stats.
// Matches the plan.md design with X button, progress bar showing XP, and hearts.
