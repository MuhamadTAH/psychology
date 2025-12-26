// 🧠 FILE PURPOSE
// This page allows users to manage their account settings.
// Users can update profile information (name, age) and view account details.

"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ArrowLeft, Settings as SettingsIcon, User, Save, LogOut, Bell, Globe, Moon, Volume2, Zap, Lock, Shield, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

export default function SettingsPage() {
  const router = useRouter();
  const { signOut } = useClerk();

  // Step 1: Get user settings
  const userSettings = useQuery(api.settings.getUserSettings);
  const updateProfile = useMutation(api.settings.updateProfile);
  const updateAppSettings = useMutation(api.settings.updateAppSettings);

  // Step 2: Form state
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");

  // Notification settings
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [streakReminders, setStreakReminders] = useState(true);

  // App preferences
  const [soundEffects, setSoundEffects] = useState(true);
  const [animations, setAnimations] = useState(true);

  // Privacy settings
  const [profileVisibility, setProfileVisibility] = useState("public");
  const [showStats, setShowStats] = useState(true);

  // Step 3: Feedback state
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Step 4: Initialize form with user data
  useEffect(() => {
    if (userSettings) {
      setName(userSettings.name || "");
      setAge(userSettings.age || "");
      // Initialize all app settings from Convex
      setPushNotifications(userSettings.pushNotifications ?? true);
      setEmailNotifications(userSettings.emailNotifications ?? true);
      setStreakReminders(userSettings.streakReminders ?? true);
      setSoundEffects(userSettings.soundEffects ?? true);
      setAnimations(userSettings.animations ?? true);
      setProfileVisibility(userSettings.profileVisibility ?? "public");
      setShowStats(userSettings.showStats ?? true);
    }
  }, [userSettings]);

  // Step 5: Handle profile save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    try {
      await updateProfile({
        name: name || undefined,
        age: age ? Number(age) : undefined,
      });

      setSaveMessage({
        type: "success",
        message: "✅ Profile updated successfully!",
      });
    } catch (error: any) {
      setSaveMessage({
        type: "error",
        message: error.message || "Failed to update profile",
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  // Step 6: Handle sign out
  const handleSignOut = async () => {
    if (confirm("Are you sure you want to sign out?")) {
      await signOut();
      router.push("/");
    }
  };

  const handleSwitchAccount = async () => {
    await signOut();
    router.push("/sign-in");
  };

  // Step 6.5: Handle delete account
  const handleDeleteAccount = () => {
    alert("Account deletion is not implemented yet. Contact support to delete your account.");
  };

  // Step 6.6: Handle settings updates (save to Convex immediately)
  const handleToggleSetting = async (settingName: string, newValue: boolean | string | number) => {
    try {
      await updateAppSettings({ [settingName]: newValue });
    } catch (error) {
      console.error("Error updating setting:", error);
      setSaveMessage({
        type: "error",
        message: "Failed to save setting. Please try again.",
      });
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  // Step 7: Loading state
  if (!userSettings) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pb-20">
      {/* Step 8: Header with back button */}
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

      {/* Step 9: Main content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <SettingsIcon className="w-10 h-10 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Settings</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Manage your account information
          </p>
        </div>

        {/* Account actions */}
        <div className="mb-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border-2 border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <LogOut className="w-6 h-6 text-blue-400" />
            Account
          </h2>
          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={handleSwitchAccount}
              className="flex-1 bg-gray-700 text-white font-semibold py-3 px-4 rounded-xl border-2 border-gray-600 hover:border-blue-400 hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
            >
              <User className="w-5 h-5" />
              Switch account
            </button>
            <button
              onClick={handleSignOut}
              className="flex-1 bg-red-600 text-white font-semibold py-3 px-4 rounded-xl border-2 border-red-700 hover:bg-red-500 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Sign out
            </button>
          </div>
        </div>

        {/* Save message */}
        {saveMessage && (
          <div
            className={`mb-6 p-4 rounded-xl border-2 ${
              saveMessage.type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            <p className="text-center font-semibold">{saveMessage.message}</p>
          </div>
        )}

        {/* Step 10: Profile settings */}
        <div className="mb-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border-2 border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <User className="w-6 h-6 text-blue-400" />
            Profile Information
          </h2>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-gray-300 font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border-2 border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-gray-300 font-semibold mb-2">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                placeholder="Enter your age"
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border-2 border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-gray-300 font-semibold mb-2">
                Email (Read-only)
              </label>
              <input
                type="email"
                value={userSettings.email || ""}
                disabled
                className="w-full bg-gray-600 text-gray-400 rounded-lg px-4 py-3 border-2 border-gray-600 cursor-not-allowed"
              />
              <p className="text-gray-500 text-sm mt-1">
                Email cannot be changed. Contact support to update.
              </p>
            </div>

            {/* Save button */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl border-2 border-blue-500/50 hover:from-blue-500 hover:to-purple-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              <span>{isSaving ? "Saving..." : "Save Profile"}</span>
            </button>
          </form>
        </div>

        {/* Step 11: Notifications section */}
        <div className="mb-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border-2 border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-400" />
            Notifications
          </h2>

          <div className="space-y-4">
            {/* Push Notifications */}
            <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl border border-gray-600">
              <div>
                <p className="text-white font-semibold">Push Notifications</p>
                <p className="text-gray-400 text-sm">Get notified about your progress</p>
              </div>
              <button
                onClick={() => {
                  const newValue = !pushNotifications;
                  setPushNotifications(newValue);
                  handleToggleSetting("pushNotifications", newValue);
                }}
                className={`w-14 h-8 rounded-full transition-colors ${
                  pushNotifications ? "bg-blue-600" : "bg-gray-600"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    pushNotifications ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Email Notifications */}
            <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl border border-gray-600">
              <div>
                <p className="text-white font-semibold">Email Notifications</p>
                <p className="text-gray-400 text-sm">Receive updates via email</p>
              </div>
              <button
                onClick={() => {
                  const newValue = !emailNotifications;
                  setEmailNotifications(newValue);
                  handleToggleSetting("emailNotifications", newValue);
                }}
                className={`w-14 h-8 rounded-full transition-colors ${
                  emailNotifications ? "bg-blue-600" : "bg-gray-600"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    emailNotifications ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Streak Reminders */}
            <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl border border-gray-600">
              <div>
                <p className="text-white font-semibold">Streak Reminders</p>
                <p className="text-gray-400 text-sm">Don't lose your streak!</p>
              </div>
              <button
                onClick={() => {
                  const newValue = !streakReminders;
                  setStreakReminders(newValue);
                  handleToggleSetting("streakReminders", newValue);
                }}
                className={`w-14 h-8 rounded-full transition-colors ${
                  streakReminders ? "bg-blue-600" : "bg-gray-600"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    streakReminders ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Step 12: App Preferences section */}
        <div className="mb-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border-2 border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-400" />
            App Preferences
          </h2>

          <div className="space-y-4">
            {/* Sound Effects */}
            <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl border border-gray-600">
              <div>
                <p className="text-white font-semibold">Sound Effects</p>
                <p className="text-gray-400 text-sm">Play sounds during lessons</p>
              </div>
              <button
                onClick={() => {
                  const newValue = !soundEffects;
                  setSoundEffects(newValue);
                  handleToggleSetting("soundEffects", newValue);
                }}
                className={`w-14 h-8 rounded-full transition-colors ${
                  soundEffects ? "bg-blue-600" : "bg-gray-600"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    soundEffects ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Animations */}
            <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl border border-gray-600">
              <div>
                <p className="text-white font-semibold">Animations</p>
                <p className="text-gray-400 text-sm">Enable visual animations</p>
              </div>
              <button
                onClick={() => {
                  const newValue = !animations;
                  setAnimations(newValue);
                  handleToggleSetting("animations", newValue);
                }}
                className={`w-14 h-8 rounded-full transition-colors ${
                  animations ? "bg-blue-600" : "bg-gray-600"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    animations ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Step 13: Privacy & Data section */}
        <div className="mb-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border-2 border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-400" />
            Privacy & Data
          </h2>

          <div className="space-y-4">
            {/* Profile Visibility */}
            <div className="p-4 bg-gray-700/50 rounded-xl border border-gray-600">
              <label className="block text-white font-semibold mb-2">
                Profile Visibility
              </label>
              <select
                value={profileVisibility}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setProfileVisibility(newValue);
                  handleToggleSetting("profileVisibility", newValue);
                }}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border-2 border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
              >
                <option value="public">Public - Anyone can see</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private - Only me</option>
              </select>
              <p className="text-gray-400 text-sm mt-2">Control who can view your profile</p>
            </div>

            {/* Show Stats */}
            <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl border border-gray-600">
              <div>
                <p className="text-white font-semibold">Show Stats on Profile</p>
                <p className="text-gray-400 text-sm">Display XP and streak publicly</p>
              </div>
              <button
                onClick={() => {
                  const newValue = !showStats;
                  setShowStats(newValue);
                  handleToggleSetting("showStats", newValue);
                }}
                className={`w-14 h-8 rounded-full transition-colors ${
                  showStats ? "bg-blue-600" : "bg-gray-600"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    showStats ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Step 14: Account Actions section */}
        <div className="mb-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border-2 border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Lock className="w-6 h-6 text-blue-400" />
            Account Actions
          </h2>

          <div className="space-y-4">
            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl border-2 border-blue-500/50 hover:from-blue-500 hover:to-purple-500 transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>

            {/* Delete Account */}
            <button
              onClick={handleDeleteAccount}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3 px-6 rounded-xl border-2 border-red-500/50 hover:from-red-500 hover:to-red-600 transition-all flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ In this page we achieved:
// A comprehensive settings page with multiple sections:
// 1. Profile Information - Update name, age, and view email
// 2. Notifications - Control push notifications, email, and streak reminders
// 3. App Preferences - Toggle sound effects and animations
// 4. Privacy & Data - Manage profile visibility and stats display
// 5. Account Actions - Sign out or delete account functionality
// Real-time feedback on save actions with success/error messages.
// All settings use toggle switches and dropdowns for easy configuration.
// All settings are persisted to Convex database and sync across sessions.
