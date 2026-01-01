// 🧠 FILE PURPOSE
// This is the Quests/Challenge page that displays monthly quests, daily quests, and friend quests.
// Users can track their progress on various challenges and earn rewards (gems, XP, chests).

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, BookOpen, Trophy, Target, Crown, Flame, Gem, Heart, Star, Clock, X } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Avatar from "@/components/Avatar";
import Script from "next/script";

// Declare custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'dotlottie-wc': any;
    }
  }
}

export default function ChallengePage() {
  const router = useRouter();

  // Get user email from localStorage
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('userEmail');
      setUserEmail(email);
    }
  }, []);

  const userStats = useQuery(api.gamification.getUserStats, userEmail ? { email: userEmail } : "skip");
  const userAvatar = useQuery(api.gamification.getUserAvatar);

  // Step 1: Define all challenge types as mock data
  // This includes daily, weekly, monthly, mastery, and social challenges

  // Monthly quest tracks overall progress for the month
  const monthlyQuest = {
    title: "October Quest",
    daysRemaining: 16,
    goal: 30,
    current: 22
  };

  // 🏆 DAILY CHALLENGES (reset every 24 hours)
  const dailyQuests = [
    { id: 1, category: "🔤 Vocabulary", title: "Learn 10 new words today", current: 7, goal: 10, xpReward: 10, gemsReward: 5 },
    { id: 2, category: "🧠 Quick Quiz", title: "Answer 5 questions correctly in a row", current: 3, goal: 5, xpReward: 15, gemsReward: 5 },
    { id: 3, category: "🕒 Speed Drill", title: "Finish a lesson under 2 minutes", current: 0, goal: 1, xpReward: 20, gemsReward: 10 },
    { id: 4, category: "🎯 Accuracy", title: "Score 90%+ in one quiz", current: 0, goal: 1, xpReward: 15, gemsReward: 5 },
    { id: 5, category: "🔁 Retry", title: "Replay one failed lesson and improve your score", current: 0, goal: 1, xpReward: 10, gemsReward: 5 },
    { id: 6, category: "🪙 XP Hunter", title: "Earn 50 XP today", current: 35, goal: 50, xpReward: 10, gemsReward: 10 },
    { id: 7, category: "🔍 Perfect Streak", title: "Finish a session without a single mistake", current: 0, goal: 1, xpReward: 25, gemsReward: 15 },
    { id: 8, category: "📘 Concept Review", title: "Review yesterday's topic", current: 1, goal: 1, xpReward: 10, gemsReward: 5 },
  ];

  // 📅 WEEKLY CHALLENGES (reset every Monday)
  const weeklyQuests = [
    { id: 1, category: "📈 Progress", title: "Complete 7 lessons this week", current: 4, goal: 7, daysRemaining: 3, xpReward: 50, gemsReward: 20 },
    { id: 2, category: "🧩 Combo", title: "Get 3 gold stars in any subject", current: 1, goal: 3, daysRemaining: 3, xpReward: 40, gemsReward: 15 },
    { id: 3, category: "⚔️ League Race", title: "Reach top 10 in your league", current: 15, goal: 10, daysRemaining: 3, xpReward: 100, gemsReward: 50 },
    { id: 4, category: "💪 Endurance", title: "Study 5 consecutive days", current: 3, goal: 5, daysRemaining: 3, xpReward: 60, gemsReward: 25 },
    { id: 5, category: "🎓 Mastery", title: "Complete all Level 1 lessons", current: 8, goal: 10, daysRemaining: 3, xpReward: 80, gemsReward: 30 },
    { id: 6, category: "🧭 Exploration", title: "Try a new subject you haven't opened yet", current: 0, goal: 1, daysRemaining: 3, xpReward: 30, gemsReward: 10 },
  ];

  // 🌟 MASTERY / EVENT CHALLENGES (special goals)
  const masteryQuests = [
    { id: 1, category: "🏅 Streak God", title: "Keep your streak for 30 days", current: 12, goal: 30, xpReward: 200, gemsReward: 100, badgeName: "Streak Master" },
    { id: 2, category: "👑 League Promotion", title: "Move up one league by Sunday", current: 0, goal: 1, xpReward: 150, gemsReward: 75, badgeName: "League Champion" },
    { id: 3, category: "🧠 Quiz Marathon", title: "Answer 100 questions without failing", current: 45, goal: 100, xpReward: 250, gemsReward: 125, badgeName: "Quiz Master" },
    { id: 4, category: "🎉 Weekend Blitz", title: "Double XP challenge — finish 3 lessons today", current: 1, goal: 3, xpReward: 100, gemsReward: 50, isEvent: true },
  ];

  // 💬 SOCIAL / COMPETITIVE CHALLENGES (friend & class based)
  const socialQuests = [
    { id: 1, category: "⚔️ Duel", title: "Beat a friend in a quiz battle", current: 0, goal: 1, xpReward: 30, gemsReward: 15 },
    { id: 2, category: "🏁 Race", title: "Be the first in your class to reach 1000 XP", current: 750, goal: 1000, xpReward: 200, gemsReward: 100 },
    { id: 3, category: "🤝 Teamwork", title: "Work with your class to complete 20 lessons total", current: 12, goal: 20, xpReward: 50, gemsReward: 25 },
  ];

  // Friend suggestions for team-up feature
  const friendSuggestions = [
    { id: 1, name: "Lam Nguy...", avatar: "L", followedBy: "Đinh Tú Anh" },
    { id: 2, name: "Nguyễn V...", avatar: "default", followedBy: "Đinh Tú Anh" },
    { id: 3, name: "he he", avatar: "H", followedBy: "Đinh Tú Anh" }
  ];

  // State to control which challenge tab is active
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "mastery" | "social">("daily");

  // ✅ In this section we achieved: Complete challenge data structure with all types

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f1419] pb-24">
      <Script
        src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.7.1/dist/dotlottie-wc.js"
        type="module"
        strategy="lazyOnload"
      />

      {/* Step 2: Monthly Quest Header Section */}
      {/* This section displays the current month's main quest with character graphic and progress */}
      <div className="bg-gradient-to-r from-[#5B4FB5] to-[#7B68C7] px-4 pt-8 pb-6 relative overflow-hidden">
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">October Quest</h1>
              <div className="flex items-center gap-2 text-white/80">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-semibold">{monthlyQuest.daysRemaining} DAYS</span>
              </div>
            </div>

            {/* Character graphic placeholder */}
            <div className="w-32 h-32 bg-purple-400/30 rounded-full flex items-center justify-center">
              <dotlottie-wc
                src="https://lottie.host/embed/b6cecf37-11c7-4fa5-8b5b-6d0aa5b0a32c/LySzVcTnmM.json"
                speed="1"
                style={{ width: '120px', height: '120px' }}
                loop
                autoplay
              />
            </div>
          </div>

          {/* Monthly quest goal card */}
          <div className="bg-[#1F1F1F] rounded-2xl p-5 mt-6 shadow-xl">
            <h3 className="text-white font-bold text-lg mb-3">Earn {monthlyQuest.goal} Quest Points</h3>
            <div className="relative">
              <div className="h-10 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] rounded-full flex items-center justify-center transition-all duration-500"
                  style={{ width: `${(monthlyQuest.current / monthlyQuest.goal) * 100}%` }}
                >
                  <span className="text-white font-bold text-sm">{monthlyQuest.current} / {monthlyQuest.goal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ In this section we achieved: Monthly quest header with progress tracking */}

      {/* Step 3: Challenge Tabs Navigation */}
      {/* This allows users to switch between different challenge types */}
      <div className="max-w-2xl mx-auto px-4 mt-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6">
          <button
            onClick={() => setActiveTab("daily")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${activeTab === "daily"
              ? "bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] text-white"
              : "bg-[#2B2B2B] text-gray-400 hover:text-white"
              }`}
          >
            🏆 Daily
          </button>
          <button
            onClick={() => setActiveTab("weekly")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${activeTab === "weekly"
              ? "bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] text-white"
              : "bg-[#2B2B2B] text-gray-400 hover:text-white"
              }`}
          >
            📅 Weekly
          </button>
          <button
            onClick={() => setActiveTab("mastery")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${activeTab === "mastery"
              ? "bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] text-white"
              : "bg-[#2B2B2B] text-gray-400 hover:text-white"
              }`}
          >
            🌟 Mastery
          </button>
          <button
            onClick={() => setActiveTab("social")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${activeTab === "social"
              ? "bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] text-white"
              : "bg-[#2B2B2B] text-gray-400 hover:text-white"
              }`}
          >
            💬 Social
          </button>
        </div>

        {/* Step 4: Display challenges based on active tab */}
        {/* Each tab shows different types of challenges with their own rewards and timing */}

        {/* DAILY CHALLENGES TAB */}
        {activeTab === "daily" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-400 text-sm font-bold uppercase">Daily Challenges</h2>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-semibold">8H</span>
              </div>
            </div>

            <div className="space-y-4">
              {dailyQuests.map((quest) => {
                const isCompleted = quest.current >= quest.goal;
                const progress = (quest.current / quest.goal) * 100;

                return (
                  <div key={quest.id} className="bg-[#1F1F1F] rounded-xl p-4 flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-purple-400 text-xs font-semibold mb-1">{quest.category}</p>
                      <h3 className="text-white font-semibold mb-3">{quest.title}</h3>

                      <div className="relative">
                        <div className="h-8 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] rounded-full flex items-center justify-center transition-all duration-500"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          >
                            {progress > 20 && (
                              <span className="text-white font-bold text-sm">{quest.current} / {quest.goal}</span>
                            )}
                          </div>
                        </div>
                        {progress <= 20 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{quest.current} / {quest.goal}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Chest reward icon */}
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${isCompleted ? 'opacity-100' : 'opacity-60 grayscale'
                      }`}>
                      <dotlottie-wc
                        src="https://lottie.host/6cc8c7f1-638c-45a6-9a64-b4a2260ac821/5GaLgCNDcv.lottie"
                        speed="1"
                        style={{ width: '64px', height: '64px' }}
                        mode="forward"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* WEEKLY CHALLENGES TAB */}
        {activeTab === "weekly" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-400 text-sm font-bold uppercase">Weekly Challenges</h2>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-semibold">3 DAYS</span>
              </div>
            </div>

            <div className="space-y-4">
              {weeklyQuests.map((quest) => {
                const isCompleted = quest.current >= quest.goal;
                const progress = (quest.current / quest.goal) * 100;

                return (
                  <div key={quest.id} className="bg-[#1F1F1F] rounded-xl p-4 flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-purple-400 text-xs font-semibold mb-1">{quest.category}</p>
                      <h3 className="text-white font-semibold mb-3">{quest.title}</h3>

                      <div className="relative">
                        <div className="h-8 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] rounded-full flex items-center justify-center transition-all duration-500"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          >
                            {progress > 20 && (
                              <span className="text-white font-bold text-sm">{quest.current} / {quest.goal}</span>
                            )}
                          </div>
                        </div>
                        {progress <= 20 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{quest.current} / {quest.goal}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Chest reward icon */}
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${isCompleted ? 'opacity-100' : 'opacity-60 grayscale'
                      }`}>
                      <dotlottie-wc
                        src="https://lottie.host/6cc8c7f1-638c-45a6-9a64-b4a2260ac821/5GaLgCNDcv.lottie"
                        speed="1"
                        style={{ width: '64px', height: '64px' }}
                        mode="forward"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MASTERY CHALLENGES TAB */}
        {activeTab === "mastery" && (
          <div>
            <div className="mb-4">
              <h2 className="text-gray-400 text-sm font-bold uppercase">Mastery & Event Challenges</h2>
              <p className="text-gray-500 text-xs mt-1">Complete special goals for exclusive rewards</p>
            </div>

            <div className="space-y-4">
              {masteryQuests.map((quest) => {
                const isCompleted = quest.current >= quest.goal;
                const progress = (quest.current / quest.goal) * 100;

                return (
                  <div key={quest.id} className={`rounded-xl p-4 flex items-center gap-4 ${quest.isEvent ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53]' : 'bg-[#1F1F1F]'}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`text-xs font-semibold ${quest.isEvent ? 'text-white' : 'text-purple-400'}`}>{quest.category}</p>
                        {quest.badgeName && (
                          <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded">🏆 {quest.badgeName}</span>
                        )}
                      </div>
                      <h3 className={`font-semibold mb-3 ${quest.isEvent ? 'text-white' : 'text-white'}`}>{quest.title}</h3>

                      <div className="relative">
                        <div className={`h-8 rounded-full overflow-hidden ${quest.isEvent ? 'bg-white/30' : 'bg-gray-700'}`}>
                          <div
                            className={`h-full rounded-full flex items-center justify-center transition-all duration-500 ${quest.isEvent ? 'bg-white' : 'bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6]'
                              }`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          >
                            {progress > 20 && (
                              <span className={`font-bold text-sm ${quest.isEvent ? 'text-[#FF6B6B]' : 'text-white'}`}>{quest.current} / {quest.goal}</span>
                            )}
                          </div>
                        </div>
                        {progress <= 20 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`font-bold text-sm ${quest.isEvent ? 'text-white' : 'text-white'}`}>{quest.current} / {quest.goal}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Chest reward icon */}
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${isCompleted ? 'opacity-100' : 'opacity-60 grayscale'
                      }`}>
                      <dotlottie-wc
                        src="https://lottie.host/6cc8c7f1-638c-45a6-9a64-b4a2260ac821/5GaLgCNDcv.lottie"
                        speed="1"
                        style={{ width: '64px', height: '64px' }}
                        mode="forward"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SOCIAL CHALLENGES TAB */}
        {activeTab === "social" && (
          <div>
            <div className="mb-4">
              <h2 className="text-gray-400 text-sm font-bold uppercase">Social & Competitive</h2>
              <p className="text-gray-500 text-xs mt-1">Team up with friends and compete</p>
            </div>

            <div className="space-y-4">
              {socialQuests.map((quest) => {
                const isCompleted = quest.current >= quest.goal;
                const progress = (quest.current / quest.goal) * 100;

                return (
                  <div key={quest.id} className="bg-[#1F1F1F] rounded-xl p-4 flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-purple-400 text-xs font-semibold mb-1">{quest.category}</p>
                      <h3 className="text-white font-semibold mb-3">{quest.title}</h3>

                      <div className="relative">
                        <div className="h-8 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] rounded-full flex items-center justify-center transition-all duration-500"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          >
                            {progress > 20 && (
                              <span className="text-white font-bold text-sm">{quest.current} / {quest.goal}</span>
                            )}
                          </div>
                        </div>
                        {progress <= 20 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{quest.current} / {quest.goal}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Chest reward icon */}
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${isCompleted ? 'opacity-100' : 'opacity-60 grayscale'
                      }`}>
                      <dotlottie-wc
                        src="https://lottie.host/6cc8c7f1-638c-45a6-9a64-b4a2260ac821/5GaLgCNDcv.lottie"
                        speed="1"
                        style={{ width: '64px', height: '64px' }}
                        mode="forward"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ✅ In this section we achieved: Tabbed challenge system with all challenge types displayed */}

      {/* Step 4: Friends Quest Section */}
      {/* This section shows friend suggestions for team-up and social features */}
      <div className="max-w-2xl mx-auto px-4 mt-8">
        <h2 className="text-gray-400 text-sm font-bold uppercase mb-2">Friends Quest</h2>
        <p className="text-white text-lg font-semibold mb-4">Follow new friends to team up</p>

        {/* Horizontal scrollable friend cards */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {friendSuggestions.map((friend) => (
            <div key={friend.id} className="bg-[#1F1F1F] rounded-xl p-4 min-w-[200px] relative">
              {/* Dismiss button */}
              <button className="absolute top-3 right-3 text-gray-500 hover:text-white">
                <X className="h-5 w-5" />
              </button>

              <div className="flex flex-col items-center">
                {/* Friend avatar */}
                <div className="w-20 h-20 mb-3">
                  {friend.avatar === "L" ? (
                    <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-3xl font-bold">L</span>
                    </div>
                  ) : friend.avatar === "H" ? (
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-3xl font-bold">H</span>
                    </div>
                  ) : (
                    <Avatar theme="default" size={80} animate={false} />
                  )}
                </div>

                <h3 className="text-white font-bold text-center mb-1">{friend.name}</h3>
                <p className="text-gray-400 text-xs text-center mb-3">
                  Followed by<br />{friend.followedBy}
                </p>

                {/* Follow button */}
                <button className="w-full bg-gradient-to-r from-[#58B4F5] to-[#4A9FE0] text-white font-bold py-2 px-6 rounded-xl hover:scale-105 transition-transform">
                  FOLLOW
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ In this section we achieved: Friend suggestions with follow buttons */}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1F1F1F] shadow-2xl z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-around">
          <button onClick={() => router.push('/dark-psychology-dashboard')} className="flex flex-col items-center gap-1 group hover:opacity-80">
            <Home className="h-7 w-7 text-gray-500" />
          </button>
          <button className="flex flex-col items-center gap-1 group hover:opacity-80">
            <BookOpen className="h-7 w-7 text-gray-500" />
          </button>
          <button onClick={() => router.push('/leagues')} className="flex flex-col items-center gap-1 group hover:opacity-80">
            <Trophy className="h-7 w-7 text-gray-500" />
          </button>
          <button className="flex flex-col items-center gap-1 group">
            <Target className="h-7 w-7 text-[#58CC02]" strokeWidth={2.5} />
            <div className="w-8 h-1 bg-[#58CC02] rounded-full" />
          </button>
          <button onClick={() => router.push('/profile')} className="flex flex-col items-center gap-1 group hover:opacity-80">
            <Avatar theme={userAvatar || "default"} size={28} animate={false} />
          </button>
          <button className="flex flex-col items-center gap-1 group hover:opacity-80">
            <Crown className="h-7 w-7 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ✅ In this file we achieved:
// A complete quests/challenge page with monthly quests, daily quests, and friend suggestions
// Progress tracking with animated progress bars
// Chest rewards for completed daily quests
// Social features for following and teaming up with friends
