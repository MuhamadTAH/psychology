// 🧠 FILE PURPOSE
// This is the complete, single-file profile page, now powered by REAL data from Clerk and Convex.

"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Settings, Pencil, Calendar, RefreshCw, Flame, Zap, Gem, Trophy, UserPlus, X, Home, BookOpen, ShoppingBag, Crown, User, CreditCard, Sparkles, Infinity } from "lucide-react";
import { useState } from "react";

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
const UserHero = ({ user, friendsCount, onEditClick }: { user: any; friendsCount: number; onEditClick: () => void }) => {
  const joinDate = user.createdAt?.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <section className="bg-[#1a2332] p-6 rounded-2xl border border-gray-700">
      <div className="relative w-32 h-32 mx-auto mb-4">
        <img src={user.imageUrl} alt={user.fullName} className="w-full h-full rounded-full border-4 border-gray-600" />
        <button
          onClick={onEditClick}
          className="absolute top-0 right-0 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
        >
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
    { icon: <Flame className="w-6 h-6 text-orange-500" />, value: stats?.streak ?? 0, label: "Day streak" },
    { icon: <Zap className="w-6 h-6 text-yellow-400" />, value: stats?.xp ?? 0, label: "Total XP" },
    { icon: <Gem className="w-6 h-6 text-pink-400" />, value: leagueName.replace(' League', ''), label: "League" },
    { icon: <Trophy className="w-6 h-6 text-yellow-500" />, value: "3", label: "Top 3 finishes" },
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

const AchievementsSection = ({ stats, onViewAll }: { stats: any; onViewAll: () => void }) => {
  return (
    <section className="bg-[#1a2332] p-6 rounded-2xl border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-4">Achievements</h3>
      <div className="space-y-4">
        <AchievementCard badgeColor="bg-red-500" title="Wildfire" level={4} progress={stats?.streak ?? 0} goal={30} description="Reach a 30 day streak" />
        <AchievementCard badgeColor="bg-green-500" title="Sage" level={7} progress={stats?.xp ?? 0} goal={7500} description="Earn 7500 XP" />
        <AchievementCard badgeColor="bg-red-500" title="Scholar" level={7} progress={586} goal={750} description="Learn 750 new words" />
      </div>
      <div className="border-t border-gray-700 mt-4 pt-4">
        <button
          onClick={onViewAll}
          className="w-full flex items-center justify-between hover:bg-white/10 p-2 rounded-lg transition-colors"
        >
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

const FriendSuggestions = ({ suggestions, onFollow, onViewAll }: { suggestions: any[]; onFollow: (userId: string) => void; onViewAll: () => void }) => {
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
          <button
            onClick={onViewAll}
            className="w-full flex items-center justify-between hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <span className="font-bold text-white">View all</span>
            <span className="text-gray-400 text-2xl font-light">&rsaquo;</span>
          </button>
        </div>
      )}
    </section>
  );
};

// 7. Subscription Section - Shows current plan and upgrade options
const SubscriptionSection = ({ subscriptionStatus, subscriptionPlan, subscriptionEndDate, onUpgrade }: {
  subscriptionStatus?: string;
  subscriptionPlan?: string;
  subscriptionEndDate?: number;
  onUpgrade: () => void;
}) => {
  const isPremium = subscriptionStatus === "premium";
  const endDate = subscriptionEndDate ? new Date(subscriptionEndDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : null;

  return (
    <section className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-6 rounded-2xl border-2 border-purple-500/30">
      <div className="flex items-center gap-3 mb-4">
        {isPremium ? (
          <Crown className="w-6 h-6 text-yellow-400" />
        ) : (
          <CreditCard className="w-6 h-6 text-blue-400" />
        )}
        <h3 className="text-xl font-bold text-white">Subscription</h3>
      </div>

      {isPremium ? (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-yellow-400 mt-1" />
            <div>
              <p className="text-white font-bold text-lg">Premium Active</p>
              <p className="text-gray-300 text-sm">
                {subscriptionPlan === 'annual' ? 'Annual Plan' : 'Monthly Plan'}
              </p>
              {endDate && (
                <p className="text-gray-400 text-xs mt-1">
                  Renews on {endDate}
                </p>
              )}
            </div>
          </div>

          {/* Premium Benefits */}
          <div className="bg-white/5 rounded-xl p-4 space-y-2">
            <p className="text-white font-semibold text-sm mb-3">Your Benefits:</p>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <Infinity className="w-4 h-4 text-green-400" />
              <span>Unlimited hearts</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Unlimited lessons</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span>Premium badge</span>
            </div>
          </div>

          {/* Manage subscription button */}
          <button
            onClick={onUpgrade}
            className="w-full bg-gray-700 text-white font-semibold py-3 px-4 rounded-xl border border-gray-600 hover:bg-gray-600 transition-colors"
          >
            Manage Subscription
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-white font-bold text-lg mb-1">Free Plan</p>
            <p className="text-gray-300 text-sm">
              Limited to 5 lessons • 5 hearts
            </p>
          </div>

          {/* Upgrade CTA */}
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-4 border border-purple-500/30">
            <p className="text-white font-semibold mb-2">Upgrade to Premium</p>
            <ul className="space-y-2 text-sm text-gray-300 mb-4">
              <li className="flex items-center gap-2">
                <Infinity className="w-4 h-4 text-green-400" />
                Unlimited hearts & lessons
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                No ads or interruptions
              </li>
              <li className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-400" />
                Exclusive premium badge
              </li>
            </ul>
            <button
              onClick={onUpgrade}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all"
            >
              Upgrade Now
            </button>
          </div>
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

  // 4. Get friends data from Convex (only when user is loaded)
  const following = useQuery(api.users.getFollowing, isLoaded && user ? {} : "skip");
  const suggestions = useQuery(api.users.getFriendSuggestions, isLoaded && user ? { limit: 10 } : "skip");
  const followingCount = useQuery(api.users.getFollowingCount, isLoaded && user ? {} : "skip");

  // 5. Get league info from Convex (only when user is loaded)
  const userLeagueInfo = useQuery(api.leagues.getUserLeagueInfo, isLoaded && user ? {} : "skip");

  // 6. Mutations
  const followUser = useMutation(api.users.followUser);
  const updateUserName = useMutation(api.users.updateUserName);

  // 7. Modal state management
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Handle follow action
  const handleFollow = async (friendId: string) => {
    try {
      await followUser({ friendId });
    } catch (error) {
    }
  };

  // Handle edit profile click
  const handleEditClick = () => {
    setEditName(user?.fullName || "");
    setShowEditModal(true);
  };

  // Handle save name
  const handleSaveName = async () => {
    if (!editName.trim()) {
      alert("Name cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      // Step 1: Update name in Convex database (persistent)
      await updateUserName({ name: editName.trim() });

      // Step 2: Update name in Clerk (for display)
      await user?.update({
        firstName: editName.split(" ")[0],
        lastName: editName.split(" ").slice(1).join(" ") || "",
      });

      setShowEditModal(false);
    } catch (error) {
      alert("Failed to update name. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle view all achievements
  const handleViewAllAchievements = () => {
    // For now, just alert - you can create a dedicated page later
    alert("View all achievements feature - coming soon!");
  };

  // Handle view all friend suggestions
  const handleViewAllSuggestions = () => {
    router.push('/search-users');
  };

  // Handle upgrade/manage subscription
  const handleUpgradeSubscription = () => {
    // Add query parameter to skip directly to paywall
    router.push('/welcome?skip=true');
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
        <UserHero user={user} friendsCount={followingCount || 0} onEditClick={handleEditClick} />
        <StatsGrid stats={userStats} leagueName={leagueName} />
        <SubscriptionSection
          subscriptionStatus={userStats?.subscriptionStatus}
          subscriptionPlan={userStats?.subscriptionPlan}
          subscriptionEndDate={userStats?.subscriptionEndDate}
          onUpgrade={handleUpgradeSubscription}
        />
        <AchievementsSection stats={userStats} onViewAll={handleViewAllAchievements} />
        <FriendsList friends={following} />
        <FriendSuggestions suggestions={suggestions || []} onFollow={handleFollow} onViewAll={handleViewAllSuggestions} />
      </main>

      {/* Edit Name Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a2332] rounded-2xl border-2 border-gray-700 p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Edit Profile</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 font-semibold mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-[#111b21] text-white rounded-lg px-4 py-3 border-2 border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-gray-700 text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveName}
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1F1F1F] shadow-2xl z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-around">
          {/* Home */}
          <button
            onClick={() => router.push('/dark-psychology-dashboard')}
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
            <User className="h-7 w-7 text-[#58CC02]" />
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