// 🧠 FILE PURPOSE
// This is the complete, single-file profile page, now powered by REAL data from Clerk and Convex.

"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Settings, Pencil, Calendar, RefreshCw, Flame, Zap, Gem, Trophy, UserPlus, X, Home, BookOpen, ShoppingBag, Crown, User } from "lucide-react";
import Avatar from "@/components/Avatar";

// --- Sub-Components (Now accept props for real data) ---

// 1. Profile Header Component
const ProfileHeader = () => (
    <header className="sticky top-0 bg-[#1F2937]/80 backdrop-blur-sm z-10 border-b border-gray-700">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <button className="text-gray-400 hover:text-white transition-colors">
          <Settings className="h-6 w-6" />
        </button>
      </div>
    </header>
);

// 2. User Hero Section - Now takes the Clerk user object and friend count
const UserHero = ({ user, friendsCount }: { user: any; friendsCount: number }) => {
  const joinDate = user.createdAt?.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <section className="bg-[#1a2332] p-6 rounded-2xl border border-gray-700">
      <div className="relative w-32 h-32 mx-auto mb-4">
        <img src={user.imageUrl} alt={user.fullName} className="w-full h-full rounded-full border-4 border-gray-600" />
        <button className="absolute top-0 right-0 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center">
          <Pencil className="w-4 h-4 text-white" />
        </button>
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">{user.fullName}</h2>
        <p className="text-gray-400">{user.primaryEmailAddress?.emailAddress}</p>
        <div className="flex items-center justify-center gap-4 text-gray-400 mt-2">
            <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {joinDate}</span>
            </div>
        </div>
        {friendsCount > 0 && (
          <a href="#friends" className="text-blue-400 font-bold mt-2 inline-block">
            {friendsCount} {friendsCount === 1 ? 'Friend' : 'Friends'}
          </a>
        )}
      </div>
    </section>
  );
};

// 3. Statistics Grid - Now takes userStats and league from Convex
const StatsGrid = ({ stats, leagueName }: { stats: any; leagueName: string }) => {
  const statsData = [
    { icon: <Flame className="w-6 h-6 text-orange-500"/>, value: stats?.streak ?? 0, label: "Day streak" },
    { icon: <Zap className="w-6 h-6 text-yellow-400"/>, value: stats?.xp ?? 0, label: "Total XP" },
    { icon: <Gem className="w-6 h-6 text-pink-400"/>, value: leagueName.replace(' League', ''), label: "League" },
    { icon: <Trophy className="w-6 h-6 text-yellow-500"/>, value: "3", label: "Top 3 finishes" },
  ];
  return (
    <section>
        <h3 className="text-xl font-bold text-white mb-4">Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {statsData.map(stat => (
              <div key={stat.label} className="bg-[#1a2332] p-4 rounded-xl border border-gray-700 flex flex-col items-start gap-1">
                  {stat.icon}
                  <span className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</span>
                  <span className="text-sm text-gray-400">{stat.label}</span>
              </div>
            ))}
        </div>
    </section>
  );
};

// 4. Achievements Section - Using real XP and streak
const AchievementCard = ({ badgeColor, title, level, progress, goal, description }: any) => {
    const percentage = Math.min((progress / goal) * 100, 100);
    return (
        <div className="flex items-center gap-4">
            <div className={`w-20 h-20 rounded-xl flex flex-col items-center justify-center ${badgeColor}`}>
                <Flame className="w-8 h-8 text-white" />
                <span className="text-xs font-bold text-white mt-1">LEVEL {level}</span>
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-baseline">
                    <p className="font-bold text-white">{title}</p>
                    <p className="text-xs text-gray-400">{progress}/{goal}</p>
                </div>
                <p className="text-sm text-gray-400">{description}</p>
                <div className="w-full bg-gray-600 rounded-full h-2.5 mt-2">
                    <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
            </div>
        </div>
    );
};

const AchievementsSection = ({ stats }: { stats: any }) => {
    return (
        <section className="bg-[#1a2332] p-6 rounded-2xl border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Achievements</h3>
            <div className="space-y-4">
                <AchievementCard badgeColor="bg-red-500" title="Wildfire" level={4} progress={stats?.streak ?? 0} goal={30} description="Reach a 30 day streak"/>
                <AchievementCard badgeColor="bg-green-500" title="Sage" level={7} progress={stats?.xp ?? 0} goal={7500} description="Earn 7500 XP"/>
                <AchievementCard badgeColor="bg-red-500" title="Scholar" level={7} progress={586} goal={750} description="Learn 750 new words"/>
            </div>
            <div className="border-t border-gray-700 mt-4 pt-4">
                <button className="w-full flex items-center justify-between hover:bg-white/10 p-2 rounded-lg transition-colors">
                    <span className="font-bold text-white">View all</span>
                    <span className="text-gray-400 text-2xl font-light">&rsaquo;</span>
                </button>
            </div>
        </section>
    );
};

// 5. Friends Section - REAL DATA from Convex
const FriendsList = ({ friends }: { friends: any[] }) => {
    // Only show if user has friends
    if (!friends || friends.length === 0) {
        return null;
    }

    const colors = ["bg-purple-500", "bg-red-400", "bg-indigo-500", "bg-blue-500", "bg-green-500", "bg-yellow-500"];

    return (
        <section id="friends" className="bg-[#1a2332] p-6 rounded-2xl border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Friends</h3>
            </div>
            <div className="space-y-4">
                {friends.slice(0, 3).map((friend, index) => (
                    <div key={friend._id} className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${colors[index % colors.length]} rounded-full`}></div>
                        <div>
                            <p className="font-bold text-white">{friend.name}</p>
                            <p className="text-sm text-gray-400">{friend.xp?.toLocaleString()} XP</p>
                        </div>
                    </div>
                ))}
            </div>
            {friends.length > 3 && (
                <div className="border-t border-gray-700 mt-4 pt-4">
                    <button className="w-full flex items-center justify-between hover:bg-white/10 p-2 rounded-lg transition-colors">
                        <span className="font-bold text-white">View {friends.length - 3} more</span>
                        <span className="text-gray-400 text-2xl font-light">&rsaquo;</span>
                    </button>
                </div>
            )}
        </section>
    );
};

// 6. Friend Suggestions Section - REAL DATA from Convex
const FriendSuggestionCard = ({ user, onFollow }: any) => {
    const colors = ["bg-purple-400", "bg-teal-400", "bg-pink-300", "bg-blue-400", "bg-green-400"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    return (
        <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${randomColor} rounded-full flex-shrink-0`}></div>
            <div className="flex-grow">
                <p className="font-bold text-white">{user.name}</p>
                <p className="text-sm text-gray-400">{user.school || user.email}</p>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onFollow(user._id)}
                    className="bg-blue-500 hover:bg-blue-600 rounded-lg p-2 transition-colors"
                >
                    <UserPlus className="w-5 h-5 text-white" />
                </button>
            </div>
        </div>
    );
};

const FriendSuggestions = ({ suggestions, onFollow }: { suggestions: any[]; onFollow: (userId: string) => void }) => {
    if (!suggestions || suggestions.length === 0) {
        return null;
    }

    return (
        <section className="bg-[#1a2332] p-6 rounded-2xl border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Friend suggestions</h3>
            <div className="space-y-4">
                {suggestions.slice(0, 3).map(user => (
                    <FriendSuggestionCard key={user._id} user={user} onFollow={onFollow} />
                ))}
            </div>
            {suggestions.length > 3 && (
                <div className="border-t border-gray-700 mt-4 pt-4">
                    <button className="w-full flex items-center justify-between hover:bg-white/10 p-2 rounded-lg transition-colors">
                        <span className="font-bold text-white">View all</span>
                        <span className="text-gray-400 text-2xl font-light">&rsaquo;</span>
                    </button>
                </div>
            )}
        </section>
    );
};

// --- Main Page Component ---

export default function ProfilePage() {
  // ALL HOOKS MUST BE AT THE TOP - BEFORE ANY RETURNS
  // 1. Get user data from Clerk
  const { user, isLoaded } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  // 2. Router hook
  const router = useRouter();

  // 3. Get gamification stats from Convex
  const userStats = useQuery(api.gamification.getUserStats, userEmail ? { email: userEmail } : "skip");

  // 4. Get friends data from Convex
  const following = useQuery(api.users.getFollowing);
  const suggestions = useQuery(api.users.getFriendSuggestions, { limit: 10 });
  const followingCount = useQuery(api.users.getFollowingCount);

  // 5. Get league info from Convex
  const userLeagueInfo = useQuery(api.leagues.getUserLeagueInfo);

  // 6. Get user avatar
  const userAvatar = useQuery(api.gamification.getUserAvatar);

  // 7. Mutations
  const followUser = useMutation(api.users.followUser);

  // Handle follow action
  const handleFollow = async (friendId: string) => {
    try {
      await followUser({ friendId });
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  // NOW we can do conditional returns AFTER all hooks are called
  // Loading state: wait for both Clerk and Convex to be ready
  if (!isLoaded || userStats === undefined || following === undefined) {
    return (
      <div className="min-h-screen bg-[#1F2937] flex items-center justify-center">
        <p className="text-white text-xl">Loading profile...</p>
      </div>
    );
  }

  // Handle case where user is not logged in
  if (!user) {
     return (
      <div className="min-h-screen bg-[#1F2937] flex items-center justify-center">
        <p className="text-white text-xl">Please sign in to view your profile.</p>
      </div>
    );
  }

  const leagueName = userLeagueInfo?.leagueName || "Bronz League";

  return (
    <div className="min-h-screen bg-[#1F2937]">
      <ProfileHeader />

      <main className="max-w-2xl mx-auto px-4 py-8 pb-24 space-y-8">
        <UserHero user={user} friendsCount={followingCount || 0} />
        <StatsGrid stats={userStats} leagueName={leagueName} />
        <AchievementsSection stats={userStats} />
        <FriendsList friends={following} />
        <FriendSuggestions suggestions={suggestions || []} onFollow={handleFollow} />
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1F1F1F] shadow-2xl z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-around">
          {/* Home */}
          <button
            onClick={() => router.push('/learn')}
            className="flex flex-col items-center gap-1 group hover:opacity-80"
          >
            <Home className="h-7 w-7 text-gray-500" />
          </button>

          {/* Practice */}
          <button className="flex flex-col items-center gap-1 group hover:opacity-80">
            <BookOpen className="h-7 w-7 text-gray-500" />
          </button>

          {/* Leagues */}
          <button
            onClick={() => router.push('/leagues')}
            className="flex flex-col items-center gap-1 group hover:opacity-80"
          >
            <Trophy className="h-7 w-7 text-gray-500" />
          </button>

          {/* Shop */}
          <button className="flex flex-col items-center gap-1 group hover:opacity-80">
            <ShoppingBag className="h-7 w-7 text-gray-500" />
          </button>

          {/* Profile - Active */}
          <button className="flex flex-col items-center gap-1 group">
            <Avatar theme={userAvatar || "default"} size={28} animate={false} />
            <div className="w-8 h-1 bg-[#58CC02] rounded-full" />
          </button>

          {/* Premium */}
          <button className="flex flex-col items-center gap-1 group hover:opacity-80">
            <Crown className="h-7 w-7 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
}