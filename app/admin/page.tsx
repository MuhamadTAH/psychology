// 🧠 FILE PURPOSE
// This is the main admin dashboard that provides navigation to all admin tools.
// It displays professional cards for each admin page with descriptions and icons.

"use client";

import Link from "next/link";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  BookOpen,
  Upload,
  Globe,
  Share2,
  Database,
  BarChart3,
  MessageSquare,
  Edit3,
  RefreshCw,
  Users,
  Trash2
} from "lucide-react";

// Step 1: Define admin page data structure
// Each card contains the route, title, description, icon, and color theme
interface AdminCard {
  title: string;
  description: string;
  href: string;
  icon: any;
  color: string;
  bgColor: string;
}

const adminPages: AdminCard[] = [
  {
    title: "Batch Upload Lessons",
    description: "Upload multiple JSON lesson files at once from Section B folder",
    href: "/admin/batch-upload-lessons",
    icon: Upload,
    color: "text-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-100",
  },
  {
    title: "Add Dark Psychology Lesson",
    description: "Create a new Dark Psychology lesson manually",
    href: "/admin/add-dark-psychology-lesson",
    icon: BookOpen,
    color: "text-purple-600",
    bgColor: "bg-purple-50 hover:bg-purple-100",
  },
  {
    title: "Edit Dark Psychology Lesson",
    description: "Edit existing Dark Psychology lessons",
    href: "/admin/edit-dark-psychology-lesson",
    icon: Edit3,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 hover:bg-indigo-100",
  },
  {
    title: "Create Demo Lessons",
    description: "Generate demo lessons for testing and development",
    href: "/admin/create-demo-lessons",
    icon: BookOpen,
    color: "text-green-600",
    bgColor: "bg-green-50 hover:bg-green-100",
  },
  {
    title: "Global Lessons",
    description: "Manage globally available lessons for all users",
    href: "/admin/global-lessons",
    icon: Globe,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50 hover:bg-cyan-100",
  },
  {
    title: "Share Lessons",
    description: "Share lessons with other users or make them public",
    href: "/admin/share-lessons",
    icon: Share2,
    color: "text-orange-600",
    bgColor: "bg-orange-50 hover:bg-orange-100",
  },
  {
    title: "Migrate Lessons",
    description: "Upgrade lessons to new format with content screens",
    href: "/admin/migrate-lessons",
    icon: RefreshCw,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 hover:bg-yellow-100",
  },
  {
    title: "Migrate Progress",
    description: "Migrate user progress data to new system",
    href: "/admin/migrate-progress",
    icon: Database,
    color: "text-pink-600",
    bgColor: "bg-pink-50 hover:bg-pink-100",
  },
  {
    title: "Analytics Dashboard",
    description: "View detailed analytics and user statistics",
    href: "/admin/analytics-dashboard",
    icon: BarChart3,
    color: "text-red-600",
    bgColor: "bg-red-50 hover:bg-red-100",
  },
  {
    title: "Analytics Chat",
    description: "Chat interface for analytics and insights",
    href: "/admin/analytics-chat",
    icon: MessageSquare,
    color: "text-teal-600",
    bgColor: "bg-teal-50 hover:bg-teal-100",
  },
];

export default function AdminDashboard() {
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || "";
  const resetUserData = useMutation(api.darkPsychology.resetAllUserData);

  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  const handleResetUserData = async () => {
    if (!confirm("⚠️ WARNING: This will DELETE ALL your Dark Psychology data (progress, notes, bookmarks, achievements, etc.). This cannot be undone! Continue?")) {
      return;
    }

    setIsResetting(true);
    setResetMessage("");

    try {
      const result = await resetUserData({ email: userEmail });
      setResetMessage(`✅ ${result.message}`);
    } catch (error: any) {
      setResetMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Step 2: Create header section */}
      {/* Professional header with title and description */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage lessons, users, analytics, and system configuration
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Create grid of admin cards */}
      {/* Responsive grid that displays all admin tools as clickable cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminPages.map((page) => {
            const Icon = page.icon;
            return (
              <Link
                key={page.href}
                href={page.href}
                className="group block"
              >
                <div
                  className={`${page.bgColor} border-2 border-transparent group-hover:border-gray-300 rounded-xl p-6 transition-all duration-200 shadow-sm hover:shadow-md h-full`}
                >
                  {/* Icon and title */}
                  <div className="flex items-start gap-4 mb-3">
                    <div className={`${page.color} bg-white p-3 rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-gray-700 flex-1">
                      {page.title}
                    </h2>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {page.description}
                  </p>

                  {/* Arrow indicator */}
                  <div className="mt-4 flex items-center text-sm font-medium text-gray-600 group-hover:text-gray-900">
                    Open page
                    <svg
                      className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Step 4: Add quick stats section */}
        {/* Shows summary statistics at the bottom */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Admin Pages</p>
              <p className="text-2xl font-bold text-blue-600">{adminPages.length}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Lesson Management</p>
              <p className="text-2xl font-bold text-purple-600">5 Tools</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Analytics & Data</p>
              <p className="text-2xl font-bold text-green-600">4 Tools</p>
            </div>
          </div>
        </div>

        {/* Reset User Data Section */}
        <div className="mt-8 bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-900 mb-2">Reset Dark Psychology Data</h3>
              <p className="text-sm text-red-700 mb-4">
                Delete ALL your Dark Psychology data including progress, XP, notes, bookmarks, achievements, and power-ups.
                This will completely reset your account as if you're a brand new user.
              </p>
              <button
                onClick={handleResetUserData}
                disabled={isResetting}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${
                  isResetting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {isResetting ? "Resetting..." : "🗑️ Reset All My Data"}
              </button>
              {resetMessage && (
                <p className={`mt-4 text-sm font-semibold ${resetMessage.startsWith("✅") ? "text-green-700" : "text-red-700"}`}>
                  {resetMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ In this file we achieved:
// - Professional admin dashboard with card-based navigation
// - Organized all admin pages with icons, colors, and descriptions
// - Responsive grid layout that works on mobile, tablet, and desktop
// - Hover effects and animations for better user experience
// - Quick stats section showing admin tool categories
