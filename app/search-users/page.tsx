// 🧠 FILE PURPOSE
// This page allows users to search for other users by name or email.
// Users can follow/unfollow others directly from the search results.

"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ArrowLeft, Search, UserPlus, UserMinus, Trophy, Flame, User } from "lucide-react";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";

export default function SearchUsersPage() {
  // Step 1: Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Step 2: Search results query (only runs if query length >= 2)
  const searchResults = useQuery(
    api.users.searchUsers,
    debouncedQuery.length >= 2 ? { searchQuery: debouncedQuery } : "skip"
  );

  // Step 3: Follow/unfollow mutations
  const followUser = useMutation(api.users.followUser);
  const unfollowUser = useMutation(api.users.unfollowUser);

  // Step 4: Handle search input with debouncing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Debounce: update query after 500ms
    setTimeout(() => {
      setDebouncedQuery(value);
    }, 500);
  };

  // Step 5: Handle follow/unfollow
  const handleFollowToggle = async (userId: Id<"users">, isFollowing: boolean) => {
    try {
      if (isFollowing) {
        await unfollowUser({ friendId: userId });
      } else {
        await followUser({ friendId: userId });
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pb-20">
      {/* Step 6: Header with back button */}
      <div className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b-2 border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            href="/profile"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </Link>
        </div>
      </div>

      {/* Step 7: Main content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Search className="w-10 h-10 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Find Friends</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Search for users by name or email to connect with them
          </p>
        </div>

        {/* Step 8: Search input */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name or email..."
              className="w-full bg-gray-800 text-white rounded-xl pl-12 pr-4 py-4 border-2 border-gray-700 focus:border-blue-500 focus:outline-none transition-colors text-lg"
            />
          </div>
          <p className="text-gray-500 text-sm mt-2 ml-2">
            Enter at least 2 characters to search
          </p>
        </div>

        {/* Step 9: Search results */}
        {debouncedQuery.length < 2 ? (
          <div className="text-center text-gray-400 py-12">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-lg">Start typing to search for users</p>
          </div>
        ) : searchResults === undefined ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-lg">Searching...</p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-lg">No users found matching "{debouncedQuery}"</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-400 mb-4">
              Found {searchResults.length} user{searchResults.length !== 1 ? "s" : ""}
            </p>

            {searchResults.map((user) => (
              <div
                key={user._id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-gray-700 p-6 hover:border-blue-500/50 transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  {/* User info */}
                  <div className="flex items-center gap-4 flex-1">
                    {/* Avatar */}
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border-2 border-blue-500/30">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name || "User"}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-blue-400" />
                      )}
                    </div>

                    {/* Name and email */}
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg mb-1">
                        {user.name || "Anonymous User"}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">{user.email}</p>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Trophy className="w-4 h-4" />
                          <span>{user.xp} XP</span>
                        </div>
                        <div className="flex items-center gap-1 text-orange-400">
                          <Flame className="w-4 h-4" />
                          <span>{user.streak} day streak</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Follow/Unfollow button */}
                  <button
                    onClick={() => handleFollowToggle(user._id, user.isFollowing)}
                    className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                      user.isFollowing
                        ? "bg-gray-700 text-white border-2 border-gray-600 hover:bg-gray-600"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-2 border-blue-500/50 hover:from-blue-500 hover:to-purple-500"
                    }`}
                  >
                    {user.isFollowing ? (
                      <>
                        <UserMinus className="w-5 h-5" />
                        <span>Unfollow</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ In this page we achieved:
// A complete user search system with real-time results.
// Follow/unfollow functionality directly from search results.
// Responsive design with user stats display (XP, streak).
