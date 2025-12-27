// FILE PURPOSE
// Final (and only) celebration screen shown after a lesson. The previous
// "regular results" view has been removed so this celebration always renders.

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { WrongAnswer } from "../types";
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
  firstTryWrongCount: number;
  hasMoreParts?: boolean;
  currentPart?: number;
  totalParts?: number;
  onRetry: () => void;
  onBackToLessons: () => void;
  onContinueNextPart?: () => void;
}

export function FinalScore({
  correctAnswers,
  totalQuestions,
  wrongAnswers, // kept for signature compatibility
  totalXP,
  lessonTime,
  lessonId,
  lessonNumber,
  userEmail,
  firstTryWrongCount,
  hasMoreParts,
  currentPart,
  totalParts,
  onRetry, // kept for signature compatibility
  onBackToLessons,
  onContinueNextPart,
}: FinalScoreProps) {
  const [animatedXP, setAnimatedXP] = useState(0);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [animatedTime, setAnimatedTime] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // Step: Pre-load counting sound for instant playback
  // This sound plays while numbers are counting up
  const [countingSound] = useState(() => {
    if (typeof window !== 'undefined') {
      const sound = new Audio('/sounds/counting-sound.mp3');
      sound.volume = 0.6;
      return sound;
    }
    return null;
  });

  const completeLessonMutation = useMutation(api.gamification.completeLesson);

  const firstTryCorrectCount = totalQuestions - firstTryWrongCount;
  const scorePercentage =
    totalQuestions > 0 ? (firstTryCorrectCount / totalQuestions) * 100 : 0;

  useEffect(() => {
    setIsAnimating(true);

    // Step: Play counting sound when animation starts
    // Sound plays immediately as numbers begin counting
    if (countingSound) {
      countingSound.currentTime = 0;
      countingSound.play().catch(() => {});
    }

    const ANIMATION_DURATION = 2000;
    const FRAME_RATE = 60;
    const FRAME_INTERVAL = 1000 / FRAME_RATE;
    const TOTAL_FRAMES = ANIMATION_DURATION / FRAME_INTERVAL;

    const xpIncrement = totalXP / TOTAL_FRAMES;
    const percentIncrement = scorePercentage / TOTAL_FRAMES;
    const timeIncrement = lessonTime / TOTAL_FRAMES;

    let frameCount = 0;

    const animationInterval = setInterval(() => {
      frameCount++;

      setAnimatedXP(Math.min(Math.round(xpIncrement * frameCount), totalXP));
      setAnimatedPercentage(
        Math.min(Math.round(percentIncrement * frameCount), Math.round(scorePercentage))
      );
      setAnimatedTime(Math.min(Math.round(timeIncrement * frameCount), lessonTime));

      if (frameCount >= TOTAL_FRAMES) {
        clearInterval(animationInterval);
        setIsAnimating(false);
        setAnimatedXP(totalXP);
        setAnimatedPercentage(Math.round(scorePercentage));
        setAnimatedTime(lessonTime);
      }
    }, FRAME_INTERVAL);

    return () => {
      clearInterval(animationInterval);
      // Stop sound if component unmounts during animation
      if (countingSound) {
        countingSound.pause();
        countingSound.currentTime = 0;
      }
    };
  }, [totalXP, scorePercentage, lessonTime, countingSound]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Celebration Area - Space for mascot */}
      <div className="flex-1 flex flex-col justify-start pt-16">
        <div className="h-40 w-full flex items-center justify-center mb-8">
          <div className="text-6xl animate-bounce">🎉</div>
        </div>

        {/* Completion Message */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {firstTryWrongCount === 0 ? "0 mistakes!" : "Lesson Complete!"}
          </h2>
          <p className="text-gray-300 text-lg">
            {firstTryWrongCount === 0
              ? "Scientists should study your big, beautiful brain."
              : `You got ${firstTryCorrectCount} out of ${totalQuestions} correct on first try!`}
          </p>
        </div>

        {/* Performance Metrics Cards */}
        <div className="w-full max-w-md grid grid-cols-3 gap-3 mx-auto">
          <div className="bg-yellow-500/20 rounded-xl p-4 text-center">
            <div className="text-yellow-300 text-xs mb-1">TOTAL XP</div>
            <div className="text-white text-2xl font-bold">{animatedXP}</div>
            <div className="text-yellow-300 text-2xl">XP</div>
          </div>

          <div className="bg-green-500/20 rounded-xl p-4 text-center">
            <div className="text-green-300 text-xs mb-1">
              {animatedPercentage >= 90
                ? "AMAZING"
                : animatedPercentage >= 70
                ? "GREAT"
                : "GOOD"}
            </div>
            <div className="text-white text-2xl font-bold">{animatedPercentage}%</div>
            <div className="text-green-300 text-2xl">%</div>
          </div>

          <div className="bg-blue-500/20 rounded-xl p-4 text-center">
            <div className="text-blue-300 text-xs mb-1">SPEEDY</div>
            <div className="text-white text-2xl font-bold">
              {Math.floor(animatedTime / 60)}:{(animatedTime % 60).toString().padStart(2, "0")}
            </div>
            <div className="text-blue-300 text-2xl">TIME</div>
          </div>
        </div>
      </div>

      {/* Bottom Options */}
      <div className="p-4 space-y-3">
        {hasMoreParts ? (
          <>
            <Button
              onClick={() => {
                if (onContinueNextPart) onContinueNextPart();
              }}
              className="w-full bg-blue-400 hover:bg-blue-500 text-lg py-6 rounded-lg"
              size="lg"
            >
              CONTINUE TO PART {(currentPart || 0) + 1}
            </Button>
            <Button
              onClick={onBackToLessons}
              variant="outline"
              className="w-full text-lg py-6 rounded-lg border-gray-600 text-gray-300 hover:bg-gray-800"
              size="lg"
            >
              CANCEL
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => {
                if (onContinueNextPart) onContinueNextPart();
              }}
              className="w-full bg-purple-500 hover:bg-purple-600 text-lg py-6 rounded-lg"
              size="lg"
            >
              REVIEW FOR 5 XP
            </Button>
            <Button
              onClick={async () => {
                const isDarkPsychLesson = lessonId?.startsWith("dark-psych-");

                if (lessonId && lessonNumber && userEmail && !isCompleting && !isDarkPsychLesson) {
                  setIsCompleting(true);
                  try {
                    await completeLessonMutation({
                      lessonId,
                      lessonNumber,
                      correctAnswers,
                      totalQuestions,
                      email: userEmail,
                    });
                  } catch (error) {
                  }
                }

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
