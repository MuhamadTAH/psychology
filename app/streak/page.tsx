// 🧠 FILE PURPOSE
// This page displays the user's streak statistics and progress in a single scrollable view.
// It shows a celebration banner, calendar with streak highlighting, goals, and milestones.
// The page combines two sections: the top shows current streak stats, the bottom shows streak goals.

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { X, Share2, ChevronLeft, ChevronRight, Shield, Flame } from "lucide-react";

export default function StreakPage() {
  const router = useRouter();

  // Step 1: Get user data and stats from Convex
  // We need the user's email to fetch their streak data and progress
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('userEmail');
      setUserEmail(email);
    }
  }, []);

  const userStats = useQuery(api.gamification.getUserStats, userEmail ? { email: userEmail } : "skip");
  const progress = useQuery(api.lessons.getUserProgress, userEmail ? { email: userEmail } : "skip");

  // Step 2: Calendar state management
  // Track current month and year for the calendar display
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const today = new Date().getDate();
  const currentMonthYear = `${currentMonth}-${currentYear}`;

  // ✅ In this section we achieved: Initial setup and data fetching from Convex

  // Step 3: Calculate calendar data
  // Generate array of days in the current month and determine which days have streaks
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  // Step 4: Calculate streak days based on current streak count
  // If user has a 2-day streak, show today and yesterday as streak days
  const currentStreak = userStats?.streak || 0;
  const daysPracticed = userStats?.streak || 0;
  const freezesUsed = 0;

  // Calculate which days should show the streak in the current month
  const streakDays: number[] = [];
  if (currentStreak > 0) {
    const todayDate = new Date();
    const todayMonth = todayDate.getMonth();
    const todayYear = todayDate.getFullYear();
    const todayDay = todayDate.getDate();

    console.log('Today:', todayDay, 'Streak:', currentStreak);

    // Only show streak days if we're viewing the current month
    if (currentMonth === todayMonth && currentYear === todayYear) {
      // Add consecutive days going backwards from today
      for (let i = 0; i < currentStreak; i++) {
        const streakDate = new Date(todayYear, todayMonth, todayDay - i);
        const dayNum = streakDate.getDate();
        console.log('Adding streak day:', dayNum);

        // Only add if it's in the current month
        if (streakDate.getMonth() === currentMonth) {
          streakDays.push(dayNum);
        }
      }
    }
  }

  console.log('Final streakDays:', JSON.stringify(streakDays));

  const freezeDays: number[] = []; // Days where streak freeze was used
  const goalDays: number[] = []; // Future goal days


  // ✅ In this section we achieved: Calendar calculations and mock data setup

  // Step 5: Helper function to check if a day is in the streak
  // Returns true if the day number is part of the current streak
  const isStreakDay = (day: number) => streakDays.includes(day);
  const isFreezeDay = (day: number) => freezeDays.includes(day);
  const isGoalDay = (day: number) => goalDays.includes(day);
  const isToday = (day: number) => day === today;

  // Step 6: Month navigation handlers
  // Allow users to view previous and next months
  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // ✅ In this section we achieved: Helper functions for calendar logic

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f1419]">
      {/* Step 7: Header with close and share buttons */}
      {/* Standard header matching the app's design pattern */}
      <div className="bg-[#1F1F1F] shadow-lg sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-[#2B2B2B] rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold text-white">Streak</h1>
          <button className="w-10 h-10 flex items-center justify-center text-white hover:bg-[#2B2B2B] rounded-full transition-colors">
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        {/* Step 8: Navigation tabs */}
        {/* Tabs to switch between personal and friends views */}
        <div className="max-w-2xl mx-auto px-4 flex gap-8 border-b border-gray-700">
          <button className="pb-3 text-sm font-bold text-white border-b-2 border-blue-500">PERSONAL</button>
          <button className="pb-3 text-sm font-bold text-gray-500 hover:text-gray-300">FRIENDS</button>
        </div>
      </div>

      {/* ✅ In this section we achieved: Header and navigation tabs */}

      {/* Main scrollable content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Step 9: Streak Society celebration banner */}
        {/* Large orange banner showing current streak with mascot graphic */}
        <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 overflow-hidden">
          <div className="relative z-10">
            <p className="text-orange-900 text-sm font-bold mb-2">STREAK SOCIETY</p>
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-black text-white">{currentStreak}</span>
              <span className="text-2xl font-bold text-white">day streak!</span>
            </div>
          </div>

          {/* Mascot graphic placeholder - using a flame icon as substitute */}
          <div className="absolute -right-4 -bottom-4 opacity-20">
            <Flame className="h-48 w-48 text-white" strokeWidth={1.5} />
          </div>
        </div>

        {/* ✅ In this section we achieved: Celebration banner with streak count */}

        {/* Step 10: Streak reminder box */}
        {/* Motivational message to keep the streak going */}
        <div className="bg-[#1F1F1F] border-2 border-[#2B2B2B] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <p className="text-white text-sm">
            Keep your <span className="font-bold">Perfect Streak</span> flame by doing a lesson every day!
          </p>
        </div>

        {/* ✅ In this section we achieved: Motivational reminder box */}


        {/* Step 11: Month header with navigation */}
        {/* Display current month/year with arrows to navigate */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePreviousMonth}
            className="w-8 h-8 flex items-center justify-center text-white hover:bg-[#2B2B2B] rounded-full transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-bold text-white">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <button
            onClick={handleNextMonth}
            className="w-8 h-8 flex items-center justify-center text-white hover:bg-[#2B2B2B] rounded-full transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Step 12: Stats cards for days practiced and freezes used */}
        {/* Two side-by-side cards showing monthly statistics */}
        <div className="grid grid-cols-2 gap-4">
          {/* Days practiced card */}
          <div className="bg-[#1F1F1F] rounded-2xl p-4 relative">
            <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              GREAT
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
            <div className="text-4xl font-black text-white mb-1">{daysPracticed}</div>
            <div className="text-sm text-gray-400">days practiced</div>
          </div>

          {/* Freezes used card */}
          <div className="bg-[#1F1F1F] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">1</span>
              </div>
            </div>
            <div className="text-4xl font-black text-white mb-1">{freezesUsed}</div>
            <div className="text-sm text-gray-400">Freeze used</div>
          </div>
        </div>

        {/* ✅ In this section we achieved: Monthly statistics cards */}

        {/* Step 13: Calendar grid */}
        {/* Display the full month calendar with streak highlighting */}
        <div className="bg-[#1F1F1F] rounded-2xl p-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2 relative">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Actual days of the month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const inStreak = isStreakDay(day);
              const hasFreeze = isFreezeDay(day);
              const hasGoal = isGoalDay(day);
              const currentDay = isToday(day);

              // Calculate which row this day is in
              const positionInGrid = (day - 1) + firstDay;
              const currentRow = Math.floor(positionInGrid / 7);
              const currentCol = positionInGrid % 7;

              // Find which streak days are in the same row as this day
              const streakDaysInThisRow = streakDays.filter(d => {
                const pos = (d - 1) + firstDay;
                return Math.floor(pos / 7) === currentRow;
              }).sort((a, b) => a - b); // Sort in ascending order (14, 15 not 15, 14)

              // Check if this is the FIRST streak day in this row
              const isFirstInRow = streakDaysInThisRow.length > 0 && day === streakDaysInThisRow[0];

              if (isFirstInRow) {
                console.log(`Day ${day}, Row ${currentRow}, streakDaysInThisRow:`, streakDaysInThisRow);
              }

              // Calculate animation delay based on row number
              const animationDelay = `${currentRow * 0.5}s`;

              return (
                <div key={day} className="relative flex items-center justify-center">
                  {/* ONE continuous line per row - only spans within the same row */}
                  {isFirstInRow && streakDaysInThisRow.length > 0 && (
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-[50px] bg-yellow-500 rounded-full transition-all duration-500 ease-in-out z-[15] overflow-hidden"
                      style={{
                        left: '0',
                        width: `calc(${streakDaysInThisRow.length * 100}% + ${(streakDaysInThisRow.length - 1) * 0.5}rem)`,
                      }}
                    >
                      {/* Animated sweep overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                           style={{
                             animation: `sweep 6s ease-in-out infinite`,
                             animationDelay: animationDelay,
                             backgroundSize: '200% 100%'
                           }}
                      />
                    </div>
                  )}

                  {/* Step 14: Day circle - shows deep orange for current day */}
                  <div
                    className={`
                      relative rounded-full flex items-center justify-center text-sm font-semibold
                      ${currentDay ? 'w-21 h-12.5 bg-gradient-to-br from-orange-600 to-orange-800 z-20' : 'aspect-square w-full bg-transparent z-10'}
                      ${inStreak ? 'text-white' : 'text-gray-400'}
                      ${hasGoal ? 'bg-gradient-to-br from-orange-500 to-orange-700 text-white' : ''}
                    `}
                  >
                    {/* Freeze indicator overlay */}
                    {hasFreeze && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center border-2 border-[#1F1F1F] z-20">
                        <span className="text-white text-[10px] font-bold">1</span>
                      </div>
                    )}
                  </div>

                  {/* Day number - SEPARATE from circle */}
                  <span className={`absolute z-20 text-sm font-semibold ${currentDay ? 'text-white' : inStreak ? 'text-white' : 'text-gray-400'}`}>
                    {day}
                  </span>
                </div>
              );
            })}

          </div>
        </div>

        {/* ✅ In this section we achieved: Interactive calendar with streak visualization */}

        {/* Step 15: Streak Goal progress section */}
        {/* Horizontal progress bar showing milestones at 1, 7, 14, 30, 50 days */}
        <div className="bg-[#1F1F1F] rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Streak Goal</h3>

          <div className="relative">
            {/* Progress bar background */}
            <div className="h-2 bg-[#2B2B2B] rounded-full overflow-hidden">
              {/* Filled portion based on current streak */}
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((currentStreak / 50) * 100, 100)}%` }}
              />
            </div>

            {/* Step 16: Milestone markers */}
            {/* Show achievement points at specific day counts */}
            <div className="relative flex justify-between mt-4">
              {[1, 7, 14, 30, 50].map((milestone) => {
                const achieved = currentStreak >= milestone;
                return (
                  <div key={milestone} className="flex flex-col items-center">
                    <div
                      className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                        ${achieved ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' : 'bg-[#2B2B2B] text-gray-600'}
                      `}
                    >
                      {achieved ? '✓' : milestone}
                    </div>
                    <span className="text-xs text-gray-400 mt-1">{milestone}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ✅ In this section we achieved: Streak goal progress tracker */}

        {/* Step 17: Streak Society milestone card */}
        {/* Congratulations card for reaching a milestone (14 days) */}
        <div className="bg-[#1F1F1F] rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Streak Society</h3>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-2 border-orange-500/30 rounded-2xl p-4 flex items-center gap-4">
            {/* Chest icon placeholder - using a trophy emoji */}
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
              🎁
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-1">Special Milestone Chest</h4>
              <p className="text-sm text-gray-300">Congrats on reaching a {currentStreak} day streak!</p>
            </div>
          </div>
        </div>

        {/* ✅ In this section we achieved: Milestone celebration card */}

      </div>
    </div>
  );
}
