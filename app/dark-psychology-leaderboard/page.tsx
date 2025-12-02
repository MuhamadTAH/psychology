// 🧠 FILE PURPOSE
// Dark Psychology Leaderboard page showing top learners.
// Displays real-time rankings based on completed lessons, XP, and accuracy.

"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trophy, Medal, Award, Flame } from "lucide-react";

export default function DarkPsychologyLeaderboard() {
  const router = useRouter();
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || "";

  // Step 1: Load leaderboard data
  const leaderboard = useQuery(api.darkPsychology.getLeaderboard);

  // Step 2: Find current user's rank
  const userRank = leaderboard?.findIndex((u) => u.email === userEmail) ?? -1;
  const userPosition = userRank >= 0 ? userRank + 1 : null;

  if (!leaderboard) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading leaderboard...</div>
      </div>
    );
  }

  // Step 3: Get medal icon based on rank
  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="text-gray-400 font-bold">#{rank}</span>;
  };

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
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">Dark Psychology Leaderboard</h1>
          </div>
          <p className="text-gray-400 mt-2">Top learners ranked by completed lessons and XP</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* User's Current Rank */}
        {userPosition && (
          <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm mb-1">Your Rank</p>
                <p className="text-white text-3xl font-bold">#{userPosition}</p>
              </div>
              <Award className="w-12 h-12 text-purple-400" />
            </div>
          </div>
        )}

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="mb-8 grid grid-cols-3 gap-4">
            {/* 2nd Place */}
            <div className="flex flex-col items-center pt-8">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mb-3">
                <Medal className="w-10 h-10 text-gray-400" />
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 w-full text-center border-2 border-gray-600">
                <p className="text-white font-bold text-lg mb-1">{leaderboard[1].name}</p>
                <p className="text-gray-400 text-sm mb-2">{leaderboard[1].completedLessons} lessons</p>
                <p className="text-yellow-400 font-bold">{leaderboard[1].totalXP} XP</p>
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-3 animate-pulse">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-lg p-4 w-full text-center border-2 border-yellow-500">
                <p className="text-white font-bold text-xl mb-1">{leaderboard[0].name}</p>
                <p className="text-gray-300 text-sm mb-2">{leaderboard[0].completedLessons} lessons</p>
                <p className="text-yellow-400 font-bold text-lg">{leaderboard[0].totalXP} XP</p>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center pt-8">
              <div className="w-20 h-20 bg-amber-900 rounded-full flex items-center justify-center mb-3">
                <Medal className="w-10 h-10 text-amber-600" />
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 w-full text-center border-2 border-amber-800">
                <p className="text-white font-bold text-lg mb-1">{leaderboard[2].name}</p>
                <p className="text-gray-400 text-sm mb-2">{leaderboard[2].completedLessons} lessons</p>
                <p className="text-yellow-400 font-bold">{leaderboard[2].totalXP} XP</p>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="bg-gray-800/50 rounded-xl border-2 border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr className="text-left">
                  <th className="px-6 py-4 text-gray-300 font-semibold">Rank</th>
                  <th className="px-6 py-4 text-gray-300 font-semibold">Name</th>
                  <th className="px-6 py-4 text-gray-300 font-semibold text-center">Lessons</th>
                  <th className="px-6 py-4 text-gray-300 font-semibold text-center">XP</th>
                  <th className="px-6 py-4 text-gray-300 font-semibold text-center">Accuracy</th>
                  <th className="px-6 py-4 text-gray-300 font-semibold text-center">Streak</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((user, index) => {
                  const rank = index + 1;
                  const isCurrentUser = user.email === userEmail;

                  return (
                    <tr
                      key={user.email}
                      className={`border-t border-gray-700 ${
                        isCurrentUser ? "bg-purple-500/10" : "hover:bg-gray-700/50"
                      } transition-colors`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getMedalIcon(rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${isCurrentUser ? "text-purple-300" : "text-white"}`}>
                          {user.name} {isCurrentUser && "(You)"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-white font-medium">{user.completedLessons}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-yellow-400 font-bold">{user.totalXP}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-green-400 font-medium">{user.accuracy}%</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Flame className="w-4 h-4 text-orange-400" />
                          <span className="text-orange-400 font-medium">{user.streak}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-20">
            <Trophy className="w-24 h-24 text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">No Rankings Yet</h2>
            <p className="text-gray-400">Be the first to complete lessons and claim the top spot!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ In this page we achieved:
// Real-time leaderboard with top 100 users.
// Ranked by completed lessons first, then XP.
// Shows user's current rank highlighted.
// Top 3 podium display with medals.
// Displays lessons, XP, accuracy, and streak for each user.
