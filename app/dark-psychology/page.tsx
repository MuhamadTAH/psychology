// 🧠 FILE PURPOSE
// Dark Psychology lessons page - displays 4 sections as clickable cards.
// Clicking a section navigates to that section's dedicated page.

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, Brain, ChevronRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SECTIONS } from "@/lib/darkPsychologyLessons";

export default function DarkPsychologyPage() {
  const router = useRouter();
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  // Step 1: Load user progress
  const progress = useQuery(api.lessons.getUserProgress, userEmail ? { email: userEmail } : "skip");

  // Step 2: Load all Dark Psychology lessons from database (same as section page)
  const dbLessons = useQuery(api.lessons.getAllDarkPsychologyLessons);

  // Step 3: Navigate to section page
  const goToSection = (sectionId: string) => {
    router.push(`/dark-psychology/section/${sectionId}`);
  };

  // Step 4: Calculate section stats from database lessons
  const getSectionStats = (sectionId: string) => {
    if (!dbLessons) return { total: 0, completed: 0, percentage: 0 };

    // Filter database lessons for this section
    const filteredLessons = dbLessons.filter(lesson => {
      const lessonData = lesson.lessonJSON;
      return (lessonData?.sectionId || lessonData?.section) === sectionId;
    });

    // Group by lessonId to count unique lessons (not parts)
    const groupedLessonsMap = filteredLessons.reduce((acc, lesson) => {
      const lessonData = lesson.lessonJSON;
      const lessonId = lessonData.lessonId || lesson._id;

      if (!acc[lessonId]) {
        acc[lessonId] = {
          lessonId,
          parts: [],
        };
      }

      acc[lessonId].parts.push({
        partNumber: lessonData.lessonPart || 1,
      });

      return acc;
    }, {} as Record<string, any>);

    const uniqueLessons = Object.values(groupedLessonsMap);
    const totalLessons = uniqueLessons.length;

    // Count completed lessons (all parts must be completed)
    let completedCount = 0;
    for (const lesson of uniqueLessons) {
      const totalParts = lesson.parts.length;
      let completedParts = 0;

      // Check each part
      for (let partNum = 1; partNum <= totalParts; partNum++) {
        const partKey = `${lesson.lessonId}-Part${partNum}`;
        const partProgress = progress?.find(p => p.darkPsychLessonId === partKey);

        if (partProgress?.isCompleted) {
          completedParts++;
        }
      }

      // Lesson is completed if ALL parts are completed
      if (completedParts === totalParts) {
        completedCount++;
      }
    }

    return {
      total: totalLessons,
      completed: completedCount,
      percentage: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
    };
  };

  // ✅ Section navigation ready

  // Step 5: Show loading state while database lessons are loading
  if (!dbLessons) {
    return (
      <div className="min-h-screen bg-[#1F2937] flex items-center justify-center">
        <div className="text-white text-xl">Loading sections...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1F2937]">
      {/* Header */}
      <div className="bg-[#1F2937] border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-purple-500" />
            <h1 className="text-2xl font-bold text-white">Dark Psychology</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/add-dark-psychology-lesson")}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Add Lesson
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/dark-psychology-dashboard")}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 bg-purple-900/30 border border-purple-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-2">
            📚 Understanding Dark Psychology
          </h2>
          <p className="text-gray-300">
            Learn to recognize and defend against manipulation tactics. These lessons are designed for defensive purposes only.
          </p>
        </div>

        {/* Section Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(["A", "B", "C", "D"] as const).map((sectionId) => {
            const sectionTitle = SECTIONS[sectionId];
            const stats = getSectionStats(sectionId);

            return (
              <button
                key={sectionId}
                onClick={() => goToSection(sectionId)}
                className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:bg-gray-750 transition-all hover:border-purple-500 group text-left"
              >
                {/* Section Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-2xl group-hover:bg-purple-500 transition-colors">
                      {sectionId}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{sectionTitle}</h3>
                      <p className="text-sm text-gray-400">{stats.total} lessons</p>
                    </div>
                  </div>
                  <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </div>

                {/* Progress Bar */}
                {stats.total > 0 && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-purple-400 font-semibold">{stats.completed}/{stats.total}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${stats.percentage}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Completion Badge */}
                {stats.percentage === 100 && stats.total > 0 && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-yellow-900/30 border border-yellow-700 rounded-full">
                    <span className="text-yellow-400 text-sm font-semibold">✓ Section Completed</span>
                  </div>
                )}

                {/* Empty State */}
                {stats.total === 0 && (
                  <div className="text-gray-500 text-sm italic">No lessons yet</div>
                )}
              </button>
            );
          })}
        </div>

        {/* Empty State */}
        {dbLessons && dbLessons.length === 0 && (
          <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700 mt-8">
            <Brain className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No Lessons Yet</h2>
            <p className="text-gray-400 mb-4">
              Dark Psychology lessons will appear here once they are added.
            </p>
            <Button
              onClick={() => router.push("/admin/add-dark-psychology-lesson")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Add First Lesson
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ Dark Psychology main page complete:
// - Displays 4 sections as clickable cards (A, B, C, D)
// - Loads lessons from DATABASE (same as section pages) - now properly connected!
// - Groups lessons by lessonId to count unique lessons (handles multi-part lessons)
// - Shows lesson count and completion progress for each section
// - Progress tracking: lesson completed only when ALL parts are done
// - Clicking a section navigates to /dark-psychology/section/{sectionId}
// - Progress bar shows completion percentage
// - Empty state when no lessons exist in database
