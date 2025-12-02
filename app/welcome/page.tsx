// 🧠 FILE PURPOSE
// Welcome/Landing page that simulates the first-time app opening experience.
// Shows exactly what a new user sees when they download and open the app.

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Star,
  TrendingUp,
  Award,
  Flame,
  Trophy,
  Target,
  ShoppingCart,
  ArrowRight,
  Brain,
  Zap,
  Users
} from "lucide-react";

export default function WelcomePage() {
  const router = useRouter();
  const [step, setStep] = useState<"splash" | "signin" | "dashboard">("splash");
  const [progress, setProgress] = useState(0);

  // Step 1: Auto-progress through the first-time experience
  useEffect(() => {
    if (step === "splash") {
      const timer = setTimeout(() => {
        setStep("signin");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Simulate progress animation
  useEffect(() => {
    if (step === "dashboard" && progress < 60) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 60) {
            clearInterval(interval);
            return 60;
          }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [step, progress]);

  // Step 2: Render splash screen
  if (step === "splash") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          {/* Animated transparent video */}
          <div className="flex justify-center mb-4">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-64 h-64 object-contain"
            >
              <source src="/welcome-animation.webm" type="video/webm" />
              {/* Fallback to emoji if video doesn't load */}
              <div className="text-6xl">🧠</div>
            </video>
          </div>
          <div className="text-white text-2xl font-bold mb-2">DuoLearn</div>
          <div className="text-gray-400">Master Dark Psychology</div>

          {/* Loading indicator */}
          <div className="mt-8 flex justify-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Render sign-in screen simulation
  if (step === "signin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f1419]">
        <div className="w-full max-w-md px-6">
          {/* Mock Clerk Sign-In Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              {/* Animated transparent video */}
              <div className="flex justify-center mb-3">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-24 h-24 object-contain"
                >
                  <source src="/welcome-animation.webm" type="video/webm" />
                  {/* Fallback to emoji if video doesn't load */}
                  <div className="text-4xl">🧠</div>
                </video>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to DuoLearn</h1>
              <p className="text-gray-600">Sign in to start learning</p>
            </div>

            {/* Sign-in form simulation */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  disabled
                />
              </div>
            </div>

            {/* Sign-in button */}
            <button
              onClick={() => setStep("dashboard")}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors mb-4 flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social sign-in buttons */}
            <div className="space-y-2">
              <button className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{" "}
              <button className="text-purple-600 font-medium hover:underline">
                Sign up
              </button>
            </p>
          </div>

          {/* Demo note */}
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Click "Continue" to see the dashboard →
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Render main dashboard (first screen after sign-in)
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-sm border-b-2 border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="text-gray-300 hover:text-white transition-colors text-sm"
          >
            ← Exit Demo
          </button>
          <h1 className="text-2xl font-bold text-white">Dark Psychology Hub</h1>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Message */}
        <div className="mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border-2 border-purple-500/50 p-4">
          <p className="text-white text-center text-lg">
            <span className="font-bold">Welcome!</span> This is what you see when you first open the app 🎉
          </p>
        </div>

        {/* Progress Overview */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border-2 border-purple-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Your Progress</h2>
              <Award className="w-12 h-12 text-gray-600" />
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-lg">
                  12 / 20 Lessons Complete
                </span>
                <span className="text-purple-400 text-lg font-bold">{progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Completed Lessons */}
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-400 text-sm">Completed</span>
                </div>
                <div className="text-2xl font-bold text-white">12</div>
              </div>

              {/* Current Streak */}
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span className="text-gray-400 text-sm">Streak</span>
                </div>
                <div className="text-2xl font-bold text-white">5 days</div>
              </div>

              {/* Accuracy Rate */}
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-green-400" />
                  <span className="text-gray-400 text-sm">Accuracy</span>
                </div>
                <div className="text-2xl font-bold text-white">85%</div>
              </div>

              {/* Total XP */}
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-400 text-sm">Total XP</span>
                </div>
                <div className="text-2xl font-bold text-white">1,240</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium whitespace-nowrap">
            Overview
          </button>
          <button className="px-6 py-3 bg-gray-800 text-gray-400 rounded-lg font-medium hover:bg-gray-700 transition-colors whitespace-nowrap">
            Notes
          </button>
          <button className="px-6 py-3 bg-gray-800 text-gray-400 rounded-lg font-medium hover:bg-gray-700 transition-colors whitespace-nowrap">
            Bookmarks
          </button>
          <button className="px-6 py-3 bg-gray-800 text-gray-400 rounded-lg font-medium hover:bg-gray-700 transition-colors whitespace-nowrap">
            Review
          </button>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Browse Lessons */}
          <button className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 border-2 border-blue-500/50 rounded-xl p-6 transition-all hover:scale-105">
            <BookOpen className="w-12 h-12 text-blue-400 mb-3" />
            <h3 className="text-white font-bold text-xl mb-2">Browse Lessons</h3>
            <p className="text-gray-400 text-sm">Explore Dark Psychology curriculum</p>
          </button>

          {/* Daily Streaks */}
          <button className="bg-gradient-to-br from-orange-500/20 to-red-600/20 hover:from-orange-500/30 hover:to-red-600/30 border-2 border-orange-500/50 rounded-xl p-6 transition-all hover:scale-105">
            <Flame className="w-12 h-12 text-orange-400 mb-3" />
            <h3 className="text-white font-bold text-xl mb-2">Daily Streaks</h3>
            <p className="text-gray-400 text-sm">Track your learning consistency</p>
          </button>

          {/* Achievements */}
          <button className="bg-gradient-to-br from-yellow-500/20 to-orange-600/20 hover:from-yellow-500/30 hover:to-orange-600/30 border-2 border-yellow-500/50 rounded-xl p-6 transition-all hover:scale-105">
            <Trophy className="w-12 h-12 text-yellow-400 mb-3" />
            <h3 className="text-white font-bold text-xl mb-2">Achievements</h3>
            <p className="text-gray-400 text-sm">View unlocked badges</p>
          </button>

          {/* Leaderboard */}
          <button className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 hover:from-purple-500/30 hover:to-pink-600/30 border-2 border-purple-500/50 rounded-xl p-6 transition-all hover:scale-105">
            <Users className="w-12 h-12 text-purple-400 mb-3" />
            <h3 className="text-white font-bold text-xl mb-2">Leaderboard</h3>
            <p className="text-gray-400 text-sm">Compare with other learners</p>
          </button>

          {/* Certificate */}
          <button className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 hover:from-green-500/30 hover:to-emerald-600/30 border-2 border-green-500/50 rounded-xl p-6 transition-all hover:scale-105">
            <Award className="w-12 h-12 text-green-400 mb-3" />
            <h3 className="text-white font-bold text-xl mb-2">Certificate</h3>
            <p className="text-gray-400 text-sm">Complete course to unlock</p>
          </button>

          {/* Power-Up Shop */}
          <button className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 border-2 border-cyan-500/50 rounded-xl p-6 transition-all hover:scale-105">
            <ShoppingCart className="w-12 h-12 text-cyan-400 mb-3" />
            <h3 className="text-white font-bold text-xl mb-2">Power-Up Shop</h3>
            <p className="text-gray-400 text-sm">Buy power-ups with gems</p>
          </button>
        </div>

        {/* AI Recommendations */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border-2 border-indigo-500/30 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-6 h-6 text-indigo-400" />
            <h3 className="text-xl font-bold text-white">Recommended for You</h3>
          </div>

          <div className="space-y-3">
            {/* Recommendation 1 */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 flex items-center justify-between">
              <div>
                <h4 className="text-white font-semibold mb-1">Understanding Persuasion</h4>
                <p className="text-gray-400 text-sm">Section A • 10 questions</p>
              </div>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors whitespace-nowrap">
                Start Lesson
              </button>
            </div>

            {/* Recommendation 2 */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 flex items-center justify-between">
              <div>
                <h4 className="text-white font-semibold mb-1">Manipulation Tactics</h4>
                <p className="text-gray-400 text-sm">Section B • 8 questions</p>
              </div>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors whitespace-nowrap">
                Start Lesson
              </button>
            </div>

            {/* Recommendation 3 */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 flex items-center justify-between">
              <div>
                <h4 className="text-white font-semibold mb-1">Body Language Secrets</h4>
                <p className="text-gray-400 text-sm">Section C • 12 questions</p>
              </div>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors whitespace-nowrap">
                Start Lesson
              </button>
            </div>
          </div>
        </div>

        {/* Demo Navigation */}
        <div className="mt-8 text-center">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-300 mb-4">
              This is the <span className="text-purple-400 font-bold">first screen</span> users see after signing in!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setStep("splash")}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                ← Replay Demo
              </button>
              <button
                onClick={() => router.push("/dark-psychology-dashboard")}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                Go to Real Dashboard →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ In this page we achieved:
// A complete simulation of the first-time app opening experience.
// Shows splash screen → sign-in → main dashboard flow.
// Matches the actual app's visual design and user experience.
