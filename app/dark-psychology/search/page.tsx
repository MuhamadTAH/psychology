// 🧠 FILE PURPOSE
// Search page for finding Dark Psychology lessons by keyword.
// Users can search by lesson title, ID, or topic keywords.

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ArrowLeft, BookOpen } from "lucide-react";
import { DARK_PSYCHOLOGY_LESSONS } from "@/lib/darkPsychologyLessons";

export default function DarkPsychologySearch() {
  const [searchQuery, setSearchQuery] = useState("");

  // Step 1: Filter lessons based on search query
  const filteredLessons = useMemo(() => {
    if (!searchQuery.trim()) return DARK_PSYCHOLOGY_LESSONS;

    const query = searchQuery.toLowerCase();
    return DARK_PSYCHOLOGY_LESSONS.filter((lesson) => {
      const title = (lesson.lessonTitle || lesson.title || "").toLowerCase();
      const lessonId = (lesson.lessonId || "").toLowerCase();
      const section = (lesson.section || "").toLowerCase();

      return title.includes(query) || lessonId.includes(query) || section.includes(query);
    });
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-sm border-b-2 border-gray-700">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link
            href="/dark-psychology-dashboard"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-4">Search Lessons</h1>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, topic, or lesson ID..."
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Results Count */}
        <p className="text-gray-400 mb-4">
          Found {filteredLessons.length} lesson{filteredLessons.length !== 1 ? "s" : ""}
        </p>

        {/* Lesson List */}
        <div className="space-y-4">
          {filteredLessons.map((lesson) => (
            <Link
              key={lesson.lessonId || `${lesson.section}-${lesson.number}`}
              href={`/yourlesson?category=dark-psychology&lessonNumber=${lesson.number}&lessonId=${lesson.lessonId || `${lesson.section}-${lesson.number}`}`}
              className="block bg-gray-800/50 rounded-xl border-2 border-gray-700 p-6 hover:border-purple-500 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-1">
                    {lesson.lessonTitle || lesson.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    Lesson ID: {lesson.lessonId || `${lesson.section}-${lesson.number}`}
                  </p>
                  {lesson.objective && (
                    <p className="text-gray-300 text-sm">{lesson.objective}</p>
                  )}
                  {lesson.parts && lesson.parts.length > 0 && (
                    <p className="text-purple-400 text-sm mt-2">
                      {lesson.parts.length} part{lesson.parts.length !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredLessons.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No lessons found matching "{searchQuery}"</p>
            <p className="text-gray-500 text-sm mt-2">Try different keywords</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ In this page we achieved:
// Search functionality for finding Dark Psychology lessons.
// Real-time filtering as user types.
// Clean search results with lesson details.
// Direct links to start each lesson.
