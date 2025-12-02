// 🧠 FILE PURPOSE
// This component renders the final score modal after lesson completion.
// Shows results, wrong answer review, and navigation options.
// Now supports both perfect score celebration and regular results.

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { WrongAnswer } from '../types';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface FinalScoreProps {
  correctAnswers: number;
  totalQuestions: number;
  wrongAnswers: WrongAnswer[];
  totalXP: number;
  lessonTime: number;
  lessonId?: string;
  lessonNumber?: number;
  userEmail?: string | null;
  firstTryWrongCount: number; // Number of questions wrong on first attempt
  hasMoreParts?: boolean; // Whether there are more parts in this lesson
  currentPart?: number; // Current part number
  totalParts?: number; // Total number of parts
  onRetry: () => void;
  onBackToLessons: () => void;
  onContinueNextPart?: () => void; // Callback to continue to next part
}

export function FinalScore({
  correctAnswers,
  totalQuestions,
  wrongAnswers,
  totalXP,
  lessonTime,
  lessonId,
  lessonNumber,
  userEmail,
  firstTryWrongCount,
  hasMoreParts,
  currentPart,
  totalParts,
  onRetry,
  onBackToLessons,
  onContinueNextPart,
}: FinalScoreProps) {

  const [animatedXP, setAnimatedXP] = useState(0);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [animatedTime, setAnimatedTime] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const completeLessonMutation = useMutation(api.gamification.completeLesson);

  // Calculate percentage based on first-try correct answers only
  // This ensures mistakes count against the percentage even if corrected later
  const firstTryCorrectCount = totalQuestions - firstTryWrongCount;
  const scorePercentage = totalQuestions > 0 ? (firstTryCorrectCount / totalQuestions) * 100 : 0;

  console.log('📊 [SCORE] Percentage calculation:', {
    totalQuestions,
    firstTryWrongCount,
    firstTryCorrectCount,
    scorePercentage
  });

  // Always show success screen - user wanted to remove retry option
  // Percentage is based on first-try performance
  const isPerfectScore = true; // Always show celebration screen

  // Animation effect for final score - all animations complete in exactly 2 seconds
  useEffect(() => {
    setIsAnimating(true);

    // Animation duration in milliseconds (2 seconds)
    const ANIMATION_DURATION = 2000;
    const FRAME_RATE = 60; // 60fps
    const FRAME_INTERVAL = 1000 / FRAME_RATE; // ~16.67ms
    const TOTAL_FRAMES = ANIMATION_DURATION / FRAME_INTERVAL; // ~120 frames

    // Calculate increment per frame for each value
    const xpIncrement = totalXP / TOTAL_FRAMES;
    const percentIncrement = scorePercentage / TOTAL_FRAMES;
    const timeIncrement = lessonTime / TOTAL_FRAMES;

    let frameCount = 0;

    const animationInterval = setInterval(() => {
      frameCount++;

      // Update all values simultaneously
      setAnimatedXP(Math.min(Math.round(xpIncrement * frameCount), totalXP));
      setAnimatedPercentage(Math.min(Math.round(percentIncrement * frameCount), Math.round(scorePercentage)));
      setAnimatedTime(Math.min(Math.round(timeIncrement * frameCount), lessonTime));

      // Stop after 2 seconds
      if (frameCount >= TOTAL_FRAMES) {
        clearInterval(animationInterval);
        setIsAnimating(false);
        // Ensure final values are exact
        setAnimatedXP(totalXP);
        setAnimatedPercentage(Math.round(scorePercentage));
        setAnimatedTime(lessonTime);
      }
    }, FRAME_INTERVAL);

    return () => {
      clearInterval(animationInterval);
    };
  }, [totalXP, scorePercentage, lessonTime]);

  if (isPerfectScore) {
    // Duolingo-style perfect score celebration
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        {/* Celebration Area - Space for Duo mascot */}
        <div className="flex-1 flex flex-col justify-start pt-16">
          <div className="h-40 w-full flex items-center justify-center mb-8">
            {/* This space (40px from top) is reserved for Duo mascot */}
            <div className="text-6xl animate-bounce">⭐</div>
          </div>

          {/* Completion Message */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {firstTryWrongCount === 0 ? '0 mistakes!' : 'Lesson Complete!'}
            </h2>
            <p className="text-gray-300 text-lg">
              {firstTryWrongCount === 0
                ? "Scientists should study your big, beautiful brain."
                : `You got ${firstTryCorrectCount} out of ${totalQuestions} correct on first try!`
              }
            </p>
          </div>

          {/* Performance Metrics Cards */}
          <div className="w-full max-w-md grid grid-cols-3 gap-3 mx-auto">
            {/* TOTAL XP Card */}
            <div className="bg-yellow-500/20 rounded-xl p-4 text-center">
              <div className="text-yellow-300 text-xs mb-1">TOTAL XP</div>
              <div className="text-white text-2xl font-bold">{animatedXP}</div>
              <div className="text-yellow-300 text-2xl">⚡</div>
            </div>

            {/* AMAZING Card */}
            <div className="bg-green-500/20 rounded-xl p-4 text-center">
              <div className="text-green-300 text-xs mb-1">
                {animatedPercentage >= 90 ? 'AMAZING' : animatedPercentage >= 70 ? 'GREAT' : 'GOOD'}
              </div>
              <div className="text-white text-2xl font-bold">{animatedPercentage}%</div>
              <div className="text-green-300 text-2xl">✅</div>
            </div>

            {/* SPEEDY Card */}
            <div className="bg-blue-500/20 rounded-xl p-4 text-center">
              <div className="text-blue-300 text-xs mb-1">SPEEDY</div>
              <div className="text-white text-2xl font-bold">
                {Math.floor(animatedTime / 60)}:{(animatedTime % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-blue-300 text-2xl">⏱️</div>
            </div>
          </div>
        </div>

        {/* Bottom Options - Show different options based on progress */}
        <div className="p-4 space-y-3">
          {hasMoreParts ? (
            // Has more parts - show continue and cancel options
            <>
              <Button
                onClick={() => {
                  console.log("🚀 [CONTINUE] Continuing to next part...");
                  if (onContinueNextPart) {
                    onContinueNextPart();
                  }
                }}
                className="w-full bg-blue-400 hover:bg-blue-500 text-lg py-6 rounded-lg"
                size="lg"
              >
                CONTINUE TO PART {(currentPart || 0) + 1}
              </Button>
              <Button
                onClick={() => {
                  console.log("🚀 [CANCEL] Returning to lessons...");
                  onBackToLessons();
                }}
                variant="outline"
                className="w-full text-lg py-6 rounded-lg border-gray-600 text-gray-300 hover:bg-gray-800"
                size="lg"
              >
                CANCEL
              </Button>
            </>
          ) : (
            // All parts completed - show review or claim XP
            <>
              <Button
                onClick={() => {
                  console.log("🔄 [REVIEW] Starting review for 5XP...");
                  if (onContinueNextPart) {
                    onContinueNextPart();
                  }
                }}
                className="w-full bg-purple-500 hover:bg-purple-600 text-lg py-6 rounded-lg"
                size="lg"
              >
                REVIEW FOR 5 XP
              </Button>
              <Button
                onClick={async () => {
                  console.log("🎯 [CLAIM XP] Button clicked!");

                  // Skip Convex mutation for Dark Psychology lessons (they use localStorage)
                  const isDarkPsychLesson = lessonId?.startsWith('dark-psych-');

                  if (lessonId && lessonNumber && userEmail && !isCompleting && !isDarkPsychLesson) {
                    console.log("✅ [CLAIM XP] All conditions met, calling mutation...");
                    setIsCompleting(true);
                    try {
                      const result = await completeLessonMutation({
                        lessonId,
                        lessonNumber,
                        correctAnswers,
                        totalQuestions,
                        email: userEmail,
                      });
                      console.log("🎉 [CLAIM XP] Mutation successful!", result);
                    } catch (error) {
                      console.error("❌ [CLAIM XP] Error completing lesson:", error);
                    }
                  } else if (isDarkPsychLesson) {
                    console.log("📝 [CLAIM XP] Dark Psychology lesson - using localStorage tracking");
                  }

                  console.log("🚀 [CLAIM XP] Navigating back to lessons...");
                  onBackToLessons();
                }}
                variant="outline"
                className="w-full text-lg py-6 rounded-lg border-gray-600 text-gray-300 hover:bg-gray-800"
                size="lg"
                disabled={isCompleting}
              >
                {isCompleting ? "CLAIMING..." : "CANCEL"}
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Regular score display (existing functionality)
  return (
    <div className="min-h-screen bg-[#1F2937] flex flex-col">
      {/* Content area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          {/* Trophy Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-6xl">🏆</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Lesson Complete!
          </h2>

          {/* Score */}
          <p className="text-center text-gray-600 mb-4">
            You got <span className="text-2xl font-bold text-blue-600">{correctAnswers}</span> out of{" "}
            <span className="text-2xl font-bold">{totalQuestions}</span> correct!
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-8">
            <div
              className="bg-green-500 h-4 rounded-full transition-all"
              style={{ width: `${(correctAnswers / totalQuestions) * 100}%` }}
            ></div>
          </div>

          {/* Wrong Answers Review */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-orange-800 mb-4">
              📚 Review Wrong Answers
            </h3>
            <p className="text-gray-700 mb-4">
              You got {wrongAnswers.length} question{wrongAnswers.length > 1 ? 's' : ''} wrong:
            </p>

            <div className="space-y-6">
              {wrongAnswers.map((mistake, index) => (
                <div key={index} className="bg-white rounded-lg p-6 border-2 border-orange-200">
                  <p className="font-semibold text-gray-800 mb-2">❌ {mistake.question}</p>
                  <p className="text-sm text-red-600 mb-1">Your answer: {mistake.userAnswer}</p>
                  <p className="text-sm text-green-600 font-semibold">✅ Correct: {mistake.correctAnswer}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <Button
                onClick={onRetry}
                className="w-full bg-orange-600 hover:bg-orange-700"
                size="lg"
              >
                Retry Lesson
              </Button>
              <Button
                onClick={async () => {
                  console.log("🎯 [BACK TO LESSONS] Button clicked!");
                  console.log("📊 [BACK TO LESSONS] Data:", {
                    lessonId,
                    lessonNumber,
                    userEmail,
                    isCompleting,
                    correctAnswers,
                    totalQuestions
                  });

                  // Step 1: Mark lesson as completed and award bonus XP
                  // Skip Convex mutation for Dark Psychology lessons (they use localStorage)
                  const isDarkPsychLesson = lessonId?.startsWith('dark-psych-');

                  if (lessonId && lessonNumber && userEmail && !isCompleting && !isDarkPsychLesson) {
                    console.log("✅ [BACK TO LESSONS] All conditions met, calling mutation...");
                    setIsCompleting(true);
                    try {
                      const result = await completeLessonMutation({
                        lessonId,
                        lessonNumber,
                        correctAnswers,
                        totalQuestions,
                        email: userEmail,
                      });
                      console.log("🎉 [BACK TO LESSONS] Mutation successful!", result);
                    } catch (error) {
                      console.error("❌ [BACK TO LESSONS] Error completing lesson:", error);
                    }
                  } else if (isDarkPsychLesson) {
                    console.log("📝 [BACK TO LESSONS] Dark Psychology lesson - using localStorage tracking");
                  } else {
                    console.log("⚠️ [BACK TO LESSONS] Missing required data:", {
                      hasLessonId: !!lessonId,
                      hasLessonNumber: !!lessonNumber,
                      hasUserEmail: !!userEmail,
                      isCompleting
                    });
                  }

                  // Step 2: Navigate back to lessons
                  console.log("🚀 [BACK TO LESSONS] Navigating back to lessons...");
                  onBackToLessons();
                }}
                variant="secondary"
                className="w-full"
                size="lg"
                disabled={isCompleting}
              >
                {isCompleting ? "Completing..." : "Back to Lessons"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ In this component we achieved:
// A complete final score screen with both Duolingo-style perfect score celebration and regular results display.
// Content is now positioned more towards the top with the button at the very bottom of the screen.
// Added animated counters for XP, percentage, and time.