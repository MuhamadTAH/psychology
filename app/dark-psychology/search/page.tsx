// 🧠 FILE PURPOSE
// Search page for finding Dark Psychology lessons by keyword.
// Users can search by lesson title, ID, or topic keywords.
// ⚠️ TEMPORARILY DISABLED - Feature under construction

"use client";

import { useRouter } from "next/navigation";
import { Search, ArrowLeft, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DarkPsychologySearch() {
  const router = useRouter();

  // DISABLED: Search functionality temporarily unavailable
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-sm border-b-2 border-gray-700">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <button
            onClick={() => router.push("/dark-psychology-dashboard")}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-white mb-4">Search Lessons</h1>
        </div>
      </div>

      {/* Disabled Message */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="text-center py-20">
          <Construction className="w-24 h-24 text-yellow-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl font-bold text-white mb-4">Feature Temporarily Disabled</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
            The search feature is currently under construction and will be available soon.
            Please use the section pages to browse lessons.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => router.push("/dark-psychology-dashboard")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Go to Dashboard
            </Button>
            <Button
              onClick={() => router.push("/dark-psychology")}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Browse Sections
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ⚠️ TEMPORARILY DISABLED
// This page is disabled and shows a "under construction" message.
// Original search functionality has been removed until feature is ready.
