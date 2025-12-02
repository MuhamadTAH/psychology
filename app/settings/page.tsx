// 🧠 FILE PURPOSE
// This page allows users to manage their account settings and preferences.
// Users can update profile information, learning preferences, and view account details.

"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ArrowLeft, Settings as SettingsIcon, User, BookOpen, Clock, Target, Save } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  // Step 1: Get user settings
  const userSettings = useQuery(api.settings.getUserSettings);
  const updateProfile = useMutation(api.settings.updateProfile);
  const updatePreferences = useMutation(api.settings.updatePreferences);

  // Step 2: Form state
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [school, setSchool] = useState("");
  const [favoriteSubject, setFavoriteSubject] = useState("");
  const [studyTime, setStudyTime] = useState("");
  const [motivation, setMotivation] = useState("");

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
      setSchool(userSettings.school || "");
      setFavoriteSubject(userSettings.favoriteSubject || "");
      setStudyTime(userSettings.studyTime || "");
      setMotivation(userSettings.motivation || "");
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
        school: school || undefined,
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

  // Step 6: Handle preferences save
  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    try {
      await updatePreferences({
        favoriteSubject: favoriteSubject || undefined,
        studyTime: studyTime || undefined,
        motivation: motivation || undefined,
      });

      setSaveMessage({
        type: "success",
        message: "✅ Preferences updated successfully!",
      });
    } catch (error: any) {
      setSaveMessage({
        type: "error",
        message: error.message || "Failed to update preferences",
      });
    } finally {
      setIsSaving(false);
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
            Manage your account and learning preferences
          </p>
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

            {/* School */}
            <div>
              <label className="block text-gray-300 font-semibold mb-2">
                School/Organization
              </label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="Enter your school or organization"
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

        {/* Step 11: Learning preferences */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border-2 border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-400" />
            Learning Preferences
          </h2>

          <form onSubmit={handleSavePreferences} className="space-y-4">
            {/* Favorite Subject */}
            <div>
              <label className="block text-gray-300 font-semibold mb-2">
                Favorite Subject
              </label>
              <select
                value={favoriteSubject}
                onChange={(e) => setFavoriteSubject(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border-2 border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
              >
                <option value="">Select a subject</option>
                <option value="math">Math</option>
                <option value="science">Science</option>
                <option value="english">English</option>
                <option value="history">History</option>
                <option value="art">Art</option>
                <option value="music">Music</option>
              </select>
            </div>

            {/* Study Time */}
            <div>
              <label className="block text-gray-300 font-semibold mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Preferred Study Time
              </label>
              <select
                value={studyTime}
                onChange={(e) => setStudyTime(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border-2 border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
              >
                <option value="">Select a time</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="anytime">Anytime</option>
              </select>
            </div>

            {/* Motivation */}
            <div>
              <label className="block text-gray-300 font-semibold mb-2 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Learning Motivation
              </label>
              <select
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border-2 border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
              >
                <option value="">Select motivation</option>
                <option value="fun">For Fun</option>
                <option value="education">Education</option>
                <option value="connect">Connect with Others</option>
                <option value="productive">Be More Productive</option>
                <option value="career">Career Advancement</option>
                <option value="travel">Travel</option>
              </select>
            </div>

            {/* Save button */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-xl border-2 border-purple-500/50 hover:from-purple-500 hover:to-pink-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              <span>{isSaving ? "Saving..." : "Save Preferences"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ✅ In this page we achieved:
// A comprehensive settings page for managing profile and learning preferences.
// Separate forms for profile and preferences with individual save buttons.
// Real-time feedback on save actions with success/error messages.
