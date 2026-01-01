// 🧠 FILE PURPOSE
// This component renders the leagues page with leaderboard and league progression.

"use client";

import { useRouter } from "next/navigation";
import { Home, BookOpen, Trophy, ShoppingBag, Crown, ChevronDown, ChevronUp, Lock, User } from "lucide-react";
import Avatar from "@/components/Avatar";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";

export default function LeaguesPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const scrollRef = useRef<HTMLDivElement>(null);

  // State for user's current league and time remaining
  const [userCurrentLeague, setUserCurrentLeague] = useState('Bronze League');
  const [timeRemaining, setTimeRemaining] = useState('');

  // Fetch league data from Convex
  const leagueData = useQuery(api.leagues.getLeagueLeaderboard);
  const userRank = useQuery(api.leagues.getUserRank);
  const userLeagueInfo = useQuery(api.leagues.getUserLeagueInfo);

  // Initialize user in league if not already
  const initializeLeague = useMutation(api.leagues.initializeUserLeague);
  const seedTestUsers = useMutation(api.leagues.seedTestUsers);
  const syncWeeklyXP = useMutation(api.leagues.syncWeeklyXP);
  const checkAndProcessLeagues = useMutation(api.leagues.checkAndProcessLeagues);
  const fixLeagueNameSpelling = useMutation(api.leagues.fixLeagueNameSpelling);
  const resetAllUsersToBronzLeague = useMutation(api.leagues.resetAllUsersToBronzLeague);

  // Step 0: Reset all users to Bronze League (one-time migration)
  useEffect(() => {
    const fix = async () => {
      if (!isLoaded || !user) return;

      try {
        // First fix spelling
        await fixLeagueNameSpelling();
        // Then reset everyone to Bronze League
        const result = await resetAllUsersToBronzLeague();
      } catch (error) {
      }
    };
    fix();
  }, [isLoaded, user, fixLeagueNameSpelling, resetAllUsersToBronzLeague]);

  // Step 1: Initialize league on first load
  useEffect(() => {
    const init = async () => {
      // Wait for Clerk to load and user to be authenticated
      if (!isLoaded || !user?.primaryEmailAddress?.emailAddress) {
        return;
      }

      // Wait for userLeagueInfo to load first
      if (userLeagueInfo === undefined) {
        return;
      }

      // If user doesn't have a league entry, initialize it
      if (userLeagueInfo === null) {
        await initializeLeague({ email: user.primaryEmailAddress.emailAddress });
        return;
      }
    };
    init();
  }, [leagueData, userLeagueInfo, initializeLeague, seedTestUsers, user, isLoaded]);

  // Step 2: Update user's current league from database
  useEffect(() => {
    if (userLeagueInfo) {
      // Fix potential typo from DB
      const leagueName = userLeagueInfo.leagueName === 'Bronz League' ? 'Bronze League' : userLeagueInfo.leagueName;
      setUserCurrentLeague(leagueName);
    }
  }, [userLeagueInfo]);

  // Step 3: Calculate and update time remaining until league ends
  useEffect(() => {
    if (!userLeagueInfo?.weekEndDate) return;

    const updateTimer = () => {
      const now = Date.now();
      const timeLeft = userLeagueInfo.weekEndDate - now;

      if (timeLeft <= 0) {
        setTimeRemaining('League ended');
        return;
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h remaining`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m remaining`);
      } else {
        setTimeRemaining(`${minutes}m remaining`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [userLeagueInfo]);

  // Step 4: Check for league transitions when page loads
  useEffect(() => {
    const checkLeagues = async () => {
      if (!isLoaded || !user) return;

      try {
        await checkAndProcessLeagues();
      } catch (error) {
        // Silently handle - user might not be in league yet
      }
    };

    checkLeagues();
  }, [isLoaded, user, checkAndProcessLeagues]);

  // League Definitions
  const LEAGUES = [
    { name: 'Bronze League', color: 'text-orange-400', bg: 'bg-orange-500', border: 'border-orange-500' },
    { name: 'Silver League', color: 'text-gray-300', bg: 'bg-gray-400', border: 'border-gray-400' },
    { name: 'Gold League', color: 'text-yellow-400', bg: 'bg-yellow-500', border: 'border-yellow-500' },
    { name: 'Emerald League', color: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500' },
    { name: 'Ruby League', color: 'text-red-400', bg: 'bg-red-500', border: 'border-red-500' },
    { name: 'Diamond League', color: 'text-cyan-300', bg: 'bg-cyan-400', border: 'border-cyan-400' },
    { name: 'Obsidian League', color: 'text-purple-400', bg: 'bg-purple-600', border: 'border-purple-600' }
  ];

  const currentLeagueIndex = LEAGUES.findIndex(l => l.name === userCurrentLeague);
  const currentLeagueData = LEAGUES[currentLeagueIndex] || LEAGUES[0];

  // Auto-scroll to current league
  useEffect(() => {
    if (scrollRef.current) {
      const currentElement = scrollRef.current.children[currentLeagueIndex] as HTMLElement;
      if (currentElement) {
        const containerWidth = scrollRef.current.clientWidth;
        const elementWidth = currentElement.clientWidth;
        const elementLeft = currentElement.offsetLeft;

        scrollRef.current.scrollTo({
          left: elementLeft - containerWidth / 2 + elementWidth / 2,
          behavior: 'smooth'
        });
      }
    }
  }, [currentLeagueIndex]);

  return (
    <div className="min-h-screen bg-[#131F24] text-white flex flex-col">
      {/* Header Section with Horizontal League Strip */}
      <div className="bg-[#131F24] border-b border-gray-800 pt-8 pb-4">
        <div className="max-w-4xl mx-auto w-full">

          {/* League Title and Timer */}
          <div className="text-center mb-4">
            <h1 className={`text-2xl font-bold tracking-wider uppercase mb-2 ${currentLeagueData.color}`}>
              {userCurrentLeague}
            </h1>
            <div className="inline-flex items-center gap-2 bg-[#1F2937] px-4 py-1 rounded-full border border-gray-700">
              <div className="w-2 h-2 rounded-full bg-[#58CC02] animate-pulse" />
              <p className="text-[#58CC02] font-bold text-xs tracking-wide uppercase">
                {timeRemaining || 'Calculating...'}
              </p>
            </div>
          </div>

          {/* Horizontal League Strip */}
          <div className="relative">
            {/* Left Fade */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#131F24] to-transparent z-10 pointer-events-none"></div>

            {/* Right Fade */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#131F24] to-transparent z-10 pointer-events-none"></div>

            <div
              ref={scrollRef}
              className="flex items-center gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {LEAGUES.map((league, index) => {
                const isUnlocked = index <= currentLeagueIndex;
                const isCurrent = index === currentLeagueIndex;
                const isLocked = index > currentLeagueIndex;

                return (
                  <div
                    key={league.name}
                    className={`flex flex-col items-center flex-shrink-0 snap-center transition-all duration-500 ${isCurrent ? 'scale-110 opacity-100' : 'scale-90 opacity-50'
                      }`}
                  >
                    <div className={`relative flex items-center justify-center transition-all duration-500 overflow-hidden ${isCurrent ? 'w-28 h-28' : 'w-16 h-16'
                      }`}>
                      {/* Glow for current - subtle */}
                      {isCurrent && (
                        <div className={`absolute w-24 h-24 rounded-full opacity-15 ${league.bg} blur-lg animate-pulse`}></div>
                      )}

                      {/* Icon */}
                      <div className="relative z-10 flex items-center justify-center">
                        {isLocked ? (
                          // Uniform Locked Style (Gray Shield ONLY)
                          <div className="relative flex items-center justify-center">
                            <Trophy className="w-10 h-10 text-gray-700 drop-shadow-lg" />
                          </div>
                        ) : (
                          // Unlocked / Current Style
                          <>
                            <img
                              src={`/LEAGUE/${league.name.replace('Bronze', 'Bronz')}.png`}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                              }}
                              alt={league.name}
                              className={`object-contain transition-all duration-500 ${isCurrent ? 'w-24 h-24 brightness-90' : 'w-12 h-12 brightness-100'
                                }`}
                              style={{ filter: 'brightness(0.85)' }}
                            />
                            {/* Fallback Icon if image fails */}
                            <Trophy className={`absolute ${isCurrent ? 'w-16 h-16' : 'w-10 h-10'} hidden ${league.color}`} />
                          </>
                        )}
                      </div>
                    </div>

                    {/* Active Indicator Dot */}
                    {isCurrent && (
                      <div className={`mt-1 w-1.5 h-1.5 rounded-full ${league.bg} shadow-[0_0_8px_currentColor]`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-center text-gray-500 text-xs mt-1">
            Top 5 advance • Bottom 5 demoted
          </p>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 pb-24">
        {!leagueData ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <div className="w-10 h-10 border-4 border-gray-700 border-t-[#58CC02] rounded-full animate-spin mb-4" />
            <p>Loading leaderboard...</p>
          </div>
        ) : leagueData.length === 0 ? (
          <div className="text-center text-gray-400 py-12">Initializing league...</div>
        ) : (
          <div className="space-y-2">
            {leagueData.map((user: any, index: number) => (
              <div key={user.rank}>
                {/* Promotion Zone Label */}
                {user.rank === 1 && (
                  <div className="flex items-center justify-center gap-2 mb-4 mt-2">
                    <div className="h-px bg-green-500/30 flex-1" />
                    <span className="text-[#58CC02] font-bold text-xs tracking-widest uppercase px-2">Promotion Zone</span>
                    <div className="h-px bg-green-500/30 flex-1" />
                  </div>
                )}

                {/* Safe Zone Label */}
                {user.rank === 6 && (
                  <div className="flex items-center justify-center gap-2 mb-4 mt-6">
                    <div className="h-px bg-gray-700 flex-1" />
                    <span className="text-gray-500 font-bold text-xs tracking-widest uppercase px-2">Safe Zone</span>
                    <div className="h-px bg-gray-700 flex-1" />
                  </div>
                )}

                {/* Demotion Zone Label */}
                {user.rank === 26 && ( // Assuming top 30, bottom 5 demoted
                  <div className="flex items-center justify-center gap-2 mb-4 mt-6">
                    <div className="h-px bg-red-500/30 flex-1" />
                    <span className="text-red-500 font-bold text-xs tracking-widest uppercase px-2">Demotion Zone</span>
                    <div className="h-px bg-red-500/30 flex-1" />
                  </div>
                )}

                {/* User Row */}
                <div className={`flex items-center justify-between py-4 px-5 rounded-2xl transition-all hover:bg-[#1F2937] ${user.isCurrentUser
                  ? 'bg-[#1F2937] border-2 border-[#58CC02] shadow-lg scale-[1.02] z-10'
                  : 'bg-[#111b21] border border-gray-800'
                  }`}>
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="w-8 flex justify-center">
                      {user.rank <= 3 ? (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg ${user.rank === 1 ? 'text-yellow-400' :
                          user.rank === 2 ? 'text-gray-300' :
                            'text-orange-400'
                          }`}>
                          {user.rank}
                        </div>
                      ) : (
                        <span className="text-gray-500 font-bold text-lg">{user.rank}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 border-2 border-gray-700">
                      <Avatar theme={user.avatar} size={48} animate={false} />
                    </div>

                    {/* Name */}
                    <div>
                      <p className={`font-bold ${user.isCurrentUser ? 'text-[#58CC02]' : 'text-white'}`}>
                        {user.name}
                      </p>
                      <p className="text-gray-500 text-xs font-medium">
                        {user.xp} XP this week
                      </p>
                    </div>
                  </div>

                  {/* XP Badge */}
                  <div className="bg-gray-800/50 px-3 py-1 rounded-lg border border-gray-700">
                    <span className="text-gray-300 font-bold">{user.xp} XP</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation (Mobile Only) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#131F24] border-t border-gray-800 z-50 pb-safe">
        <div className="flex items-center justify-around p-3">
          <button onClick={() => router.push('/dark-psychology-dashboard')} className="p-2 text-gray-500 hover:text-gray-300">
            <Home className="w-6 h-6" />
          </button>
          <button className="p-2 text-[#58CC02]">
            <Trophy className="w-6 h-6" />
          </button>
          <button onClick={() => router.push('/profile')} className="p-2 text-gray-500 hover:text-gray-300">
            <User className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Desktop Bottom Navigation (Hidden on Mobile) */}
      <div className="hidden md:block fixed bottom-0 left-0 right-0 bg-[#1F1F1F] shadow-2xl z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-around">
          <button onClick={() => router.push('/dark-psychology-dashboard')} className="flex flex-col items-center gap-1 group hover:opacity-80">
            <Home className="h-7 w-7 text-gray-500" />
          </button>
          <button className="flex flex-col items-center gap-1 group hover:opacity-80">
            <BookOpen className="h-7 w-7 text-gray-500" />
          </button>
          <button className="flex flex-col items-center gap-1 group">
            <Trophy className="h-7 w-7 text-[#58CC02]" strokeWidth={2.5} />
            <div className="w-8 h-1 bg-[#58CC02] rounded-full" />
          </button>
          <button className="flex flex-col items-center gap-1 group hover:opacity-80">
            <ShoppingBag className="h-7 w-7 text-gray-500" />
          </button>
          <button onClick={() => router.push('/profile')} className="flex flex-col items-center gap-1 group hover:opacity-80">
            <Avatar theme="default" size={28} animate={false} />
          </button>
          <button className="flex flex-col items-center gap-1 group hover:opacity-80">
            <Crown className="h-7 w-7 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
}