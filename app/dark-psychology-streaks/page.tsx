// 🧠 FILE PURPOSE
// Dark Psychology Streak Rewards page showing daily streak progress.
// Displays current streak, milestones, bonus XP, and streak freeze items.
// Users earn bonus XP for maintaining streaks and can use freeze items.

"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ArrowLeft, Flame, Award, Zap, Clock, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { StreakBadgeWithFx } from "@/components/StreakBadgeWithFx";

export default function DarkPsychologyStreaks() {
  const router = useRouter();
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || "";

  // Step 1: Load streak rewards data
  const streakData = useQuery(api.darkPsychology.getStreakRewards, { email: userEmail });
  const updateStreak = useMutation(api.darkPsychology.updateDailyStreak);

  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardInfo, setRewardInfo] = useState<{ bonusXP: number; usedFreeze: boolean } | null>(null);

  // Step 2: Update streak on page load (if user hasn't logged in today)
  useEffect(() => {
    if (userEmail && streakData) {
      updateStreak({ email: userEmail }).then((result) => {
        if (result.bonusXP > 0 || result.usedFreeze) {
          setRewardInfo({ bonusXP: result.bonusXP, usedFreeze: result.usedFreeze });
          setShowRewardModal(true);
        }
      });
    }
  }, [userEmail, streakData?.currentStreak]);

  if (!streakData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading streak data...</div>
      </div>
    );
  }

  // Step 3: Calculate progress to next milestone
  const progressPercentage = ((streakData.currentStreak % 10) / 10) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-sm border-b-2 border-gray-700">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <button
            onClick={() => router.push("/dark-psychology-dashboard")}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-3">
            <Flame className="w-8 h-8 text-orange-400" />
            <h1 className="text-3xl font-bold text-white">Daily Streak Rewards</h1>
          </div>
          <p className="text-gray-400 mt-2">Keep learning daily to earn bonus XP!</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Current Streak Display */}
        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl border-2 border-orange-500/30 p-8 mb-8">
          <div className="flex flex-col items-center">
            {/* Animated Streak Badge */}
            <div className="relative mb-6">
              <StreakBadgeWithFx
                streakCount={streakData.currentStreak}
                triggerType="onView"
                size={160}
              />
            </div>

            <h2 className="text-white text-4xl font-bold mb-2">
              {streakData.currentStreak} Day Streak!
            </h2>
            <p className="text-orange-300 text-lg mb-6">
              {streakData.currentStreak === 0
                ? "Complete a lesson today to start your streak!"
                : `Keep it going! ${streakData.daysUntilMilestone} days until next milestone`}
            </p>

            {/* Progress to Next Milestone */}
            {streakData.currentStreak > 0 && (
              <div className="w-full max-w-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">Next milestone: {streakData.nextMilestone} days</span>
                  <span className="text-orange-400 text-sm font-bold">
                    {streakData.daysUntilMilestone} days to go
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Streak Freezes */}
          <div className="bg-gray-800/50 rounded-xl border-2 border-blue-500/30 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-6 h-6 text-blue-400" />
                  <h3 className="text-white font-bold text-xl">Streak Freezes</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Protect your streak if you miss a day
                </p>
                <div className="text-blue-400 text-4xl font-bold">{streakData.streakFreezes}</div>
                <p className="text-gray-500 text-xs mt-2">
                  Earn 1 freeze every 7 days of streak
                </p>
              </div>
            </div>
          </div>

          {/* Bonus XP Earned */}
          <div className="bg-gray-800/50 rounded-xl border-2 border-yellow-500/30 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-white font-bold text-xl">Bonus XP</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Total XP earned from streaks
                </p>
                <div className="text-yellow-400 text-4xl font-bold">{streakData.streakBonusXP}</div>
                <p className="text-gray-500 text-xs mt-2">
                  +5 XP per day, more on milestones
                </p>
              </div>
            </div>
          </div>

          {/* Longest Streak */}
          <div className="bg-gray-800/50 rounded-xl border-2 border-purple-500/30 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-6 h-6 text-purple-400" />
                  <h3 className="text-white font-bold text-xl">Longest Streak</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Your personal best
                </p>
                <div className="text-purple-400 text-4xl font-bold">{streakData.longestStreak}</div>
                <p className="text-gray-500 text-xs mt-2">
                  Keep going to beat this record!
                </p>
              </div>
            </div>
          </div>

          {/* Total Streak Days */}
          <div className="bg-gray-800/50 rounded-xl border-2 border-green-500/30 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                  <h3 className="text-white font-bold text-xl">Total Streak Days</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  All-time days with active streak
                </p>
                <div className="text-green-400 text-4xl font-bold">{streakData.totalStreakDays}</div>
                <p className="text-gray-500 text-xs mt-2">
                  Your dedication is paying off!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Badges */}
        <div className="bg-gray-800/50 rounded-xl border-2 border-gray-700 p-6">
          <h3 className="text-white font-bold text-xl mb-6">Streak Milestones</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 7 Day Milestone */}
            <div
              className={`rounded-lg p-6 border-2 transition-all ${
                streakData.milestones.day7
                  ? "bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/30"
                  : "bg-gray-800/50 border-gray-700 opacity-60"
              }`}
            >
              <div className="text-center">
                <div className={`text-6xl mb-3 ${streakData.milestones.day7 ? "" : "grayscale opacity-50"}`}>
                  🔥
                </div>
                <h4 className="text-white font-bold text-lg mb-2">7-Day Warrior</h4>
                <p className="text-gray-400 text-sm mb-3">Complete 7 days in a row</p>
                {streakData.milestones.day7 ? (
                  <div className="bg-orange-500/20 rounded-lg py-2 px-4">
                    <p className="text-orange-300 font-bold">+50 XP Earned!</p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-xs">🔒 Locked</p>
                )}
              </div>
            </div>

            {/* 30 Day Milestone */}
            <div
              className={`rounded-lg p-6 border-2 transition-all ${
                streakData.milestones.day30
                  ? "bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30"
                  : "bg-gray-800/50 border-gray-700 opacity-60"
              }`}
            >
              <div className="text-center">
                <div className={`text-6xl mb-3 ${streakData.milestones.day30 ? "" : "grayscale opacity-50"}`}>
                  ⚡
                </div>
                <h4 className="text-white font-bold text-lg mb-2">30-Day Champion</h4>
                <p className="text-gray-400 text-sm mb-3">Complete 30 days in a row</p>
                {streakData.milestones.day30 ? (
                  <div className="bg-purple-500/20 rounded-lg py-2 px-4">
                    <p className="text-purple-300 font-bold">+200 XP Earned!</p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-xs">🔒 Locked</p>
                )}
              </div>
            </div>

            {/* 100 Day Milestone */}
            <div
              className={`rounded-lg p-6 border-2 transition-all ${
                streakData.milestones.day100
                  ? "bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-500/30"
                  : "bg-gray-800/50 border-gray-700 opacity-60"
              }`}
            >
              <div className="text-center">
                <div className={`text-6xl mb-3 ${streakData.milestones.day100 ? "" : "grayscale opacity-50"}`}>
                  👑
                </div>
                <h4 className="text-white font-bold text-lg mb-2">100-Day Legend</h4>
                <p className="text-gray-400 text-sm mb-3">Complete 100 days in a row</p>
                {streakData.milestones.day100 ? (
                  <div className="bg-yellow-500/20 rounded-lg py-2 px-4">
                    <p className="text-yellow-300 font-bold">+1000 XP Earned!</p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-xs">🔒 Locked</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* How Streaks Work */}
        <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-xl p-6 mt-8">
          <h3 className="text-white font-bold text-lg mb-4">📚 How Streaks Work</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span>Complete at least one lesson each day to maintain your streak</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span>Earn +5 XP for each day you maintain your streak</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span>Get special bonuses at milestones: 7 days (+50 XP), 30 days (+200 XP), 100 days (+1000 XP)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span>Earn 1 Streak Freeze every 7 consecutive days</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span>Streak Freezes automatically protect your streak if you miss one day</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Reward Modal */}
      {showRewardModal && rewardInfo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-orange-500 p-8 max-w-md w-full">
            <div className="text-center">
              <Flame className="w-24 h-24 text-orange-400 mx-auto mb-4 animate-pulse" />
              <h2 className="text-white text-3xl font-bold mb-4">
                {rewardInfo.usedFreeze ? "Streak Protected!" : "Streak Continued!"}
              </h2>
              {rewardInfo.usedFreeze ? (
                <p className="text-orange-300 text-lg mb-6">
                  You missed a day, but your Streak Freeze saved you! Keep learning to maintain your streak.
                </p>
              ) : (
                <>
                  <p className="text-orange-300 text-lg mb-4">
                    You're {streakData.currentStreak} days strong!
                  </p>
                  {rewardInfo.bonusXP > 0 && (
                    <div className="bg-yellow-500/20 rounded-lg py-4 px-6 mb-6">
                      <p className="text-yellow-300 text-2xl font-bold">+{rewardInfo.bonusXP} XP</p>
                      <p className="text-yellow-200 text-sm">Bonus XP earned!</p>
                    </div>
                  )}
                </>
              )}
              <button
                onClick={() => setShowRewardModal(false)}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-6 rounded-lg hover:from-orange-400 hover:to-red-400 transition-all"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ✅ In this page we achieved:
// Complete streak rewards page with visual flame animation.
// Current streak display with animated flame icon.
// Progress bar showing days until next milestone.
// Stats cards for streak freezes, bonus XP, longest streak, and total days.
// Milestone badges for 7, 30, and 100 day streaks.
// Automatic streak checking and reward modal on page load.
// Informational section explaining how streaks work.
