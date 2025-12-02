// 🧠 FILE PURPOSE
// Individual section page for Dark Psychology.
// Shows all lessons for a specific section in a winding path layout like the learn page.
// ✨ Enhanced with immersive, ethical, and attention-grabbing UI — no logic changed.

"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Trash2, Edit, ArrowLeft, Star, Check, Lock } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// Position calculation — unchanged
const REFERENCE_WIDTH = 672;

interface LessonPosition {
  x: number;
  y: number;
}

const BASE_X_POSITIONS_IN_PIXELS = {
  1: 336,
  2: 425,
  3: 336,
  4: 247,
  5: 336,
  6: 425,
  7: 336,
  8: 247,
  9: 336,
  10: 425,
};

const BASE_Y_POSITIONS = {
  1: 60,
  2: 160,
  3: 260,
  4: 360,
  5: 460,
  6: 560,
  7: 660,
  8: 760,
  9: 860,
  10: 960,
};

const CYCLE_HEIGHT = 1100;

const getLessonPosition = (positionNumber: number): LessonPosition => {
  const cycle = Math.floor((positionNumber - 1) / 10);
  const positionInCycle = ((positionNumber - 1) % 10) + 1;

  const baseX = BASE_X_POSITIONS_IN_PIXELS[positionInCycle as keyof typeof BASE_X_POSITIONS_IN_PIXELS];
  const baseY = BASE_Y_POSITIONS[positionInCycle as keyof typeof BASE_Y_POSITIONS];

  const actualY = baseY + (cycle * CYCLE_HEIGHT);

  return {
    x: (baseX / REFERENCE_WIDTH) * 100,
    y: actualY
  };
};

export default function SectionPage() {
  const router = useRouter();
  const params = useParams();
  const sectionId = params.sectionId as string;

  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  const progress = useQuery(api.lessons.getUserProgress, userEmail ? { email: userEmail } : "skip");

  // Step: Load all Dark Psychology lessons from database
  const dbLessons = useQuery(api.lessons.getAllDarkPsychologyLessons);

  // Step: Mutation to delete all lessons in this section
  const deleteAllInSection = useMutation(api.darkPsychology.deleteAllLessonsInSection);

  // 🐛 DEBUG: Comprehensive logging for database query
  useEffect(() => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔍 [DB QUERY STATUS CHECK]');
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔍 [DB LESSONS] Type:', typeof dbLessons);
    console.log('🔍 [DB LESSONS] Is undefined:', dbLessons === undefined);
    console.log('🔍 [DB LESSONS] Is null:', dbLessons === null);
    console.log('🔍 [DB LESSONS] Is array:', Array.isArray(dbLessons));
    console.log('🔍 [DB LESSONS] Length:', dbLessons?.length);
    console.log('🔍 [DB LESSONS] Raw value:', dbLessons);

    if (dbLessons && Array.isArray(dbLessons)) {
      console.log('✅ [DB LESSONS] Successfully loaded', dbLessons.length, 'lessons');
      dbLessons.forEach((lesson, i) => {
        console.log(`📄 [LESSON ${i}]`, {
          _id: lesson._id,
          title: lesson.title,
          userId: lesson.userId,
          lessonJSON: lesson.lessonJSON ? {
            sectionId: lesson.lessonJSON.sectionId,
            unitId: lesson.lessonJSON.unitId,
            lessonId: lesson.lessonJSON.lessonId,
            lessonPart: lesson.lessonJSON.lessonPart,
            lessonTitle: lesson.lessonJSON.lessonTitle,
          } : 'NO JSON DATA'
        });
      });
    } else if (dbLessons === undefined) {
      console.log('⚠️ [DB LESSONS] Still loading (undefined)...');
    } else {
      console.log('❌ [DB LESSONS] Unexpected state:', dbLessons);
    }
    console.log('═══════════════════════════════════════════════════════');
  }, [dbLessons]);

  // 🐛 DEBUG: Log all progress data on load
  useEffect(() => {
    if (progress && progress.length > 0) {
      console.log('🔍 [ALL PROGRESS DATA]', progress);
      console.log('🔍 [PROGRESS COUNT]', progress.length);
      progress.forEach((p, i) => {
        console.log(`🔍 [PROGRESS ${i}] lessonNumber: ${p.lessonNumber}, darkPsychLessonId: ${p.darkPsychLessonId}, isCompleted: ${p.isCompleted}`);
      });
    }
  }, [progress]);

  // Step: Define section titles
  const SECTIONS = {
    A: "The Foundations of the Dark Mind",
    B: "Psychological Tactics",
    C: "Defense Strategies",
    D: "Ethical Applications"
  };

  const sectionTitle = SECTIONS[sectionId as keyof typeof SECTIONS] || "Unknown Section";

  // Step: Filter database lessons for this section
  const filteredLessons = (dbLessons || [])
    .filter(lesson => {
      const lessonData = lesson.lessonJSON;
      return (lessonData?.sectionId || lessonData?.section) === sectionId;
    });

  // 🐛 DEBUG: Log filtered lessons count
  console.log('🔍 [FILTER] Total DB lessons:', dbLessons?.length || 0);
  console.log('🔍 [FILTER] Filtered lessons for section', sectionId, ':', filteredLessons.length);

  // 🐛 DEBUG: Log each filtered lesson's lessonId and lessonPart
  filteredLessons.forEach((lesson, i) => {
    const lessonData = lesson.lessonJSON;
    console.log(`🔍 [FILTER ${i}] lessonId: ${lessonData.lessonId}, lessonPart: ${lessonData.lessonPart}, title: "${lessonData.lessonTitle}"`);
  });

  // Step: GROUP lessons by lessonId to combine multiple part files into one logical lesson
  // This handles the case where each lesson has 3 separate JSON files (Part_1.json, Part_2.json, Part_3.json)
  const groupedLessonsMap = filteredLessons.reduce((acc, lesson) => {
    const lessonData = lesson.lessonJSON;
    const lessonId = lessonData.lessonId || lesson._id;

    // If this lessonId doesn't exist yet, create it
    if (!acc[lessonId]) {
      acc[lessonId] = {
        lessonId,
        title: lessonData.lessonTitle || lesson.title,
        lessonTitle: lessonData.lessonTitle || lesson.title,
        sectionId: lessonData.sectionId || lessonData.section,
        unitId: lessonData.unitId,
        unitTitle: lessonData.unitTitle,
        section: lessonData.sectionId || lessonData.section,
        practice: lessonData.exercises || [],
        parts: [], // Will collect all parts here
        allContentScreens: [], // Collect all content screens from all parts
      };
      console.log(`🟢 [GROUP] Created new group for lessonId: ${lessonId}`);
    } else {
      console.log(`🔵 [GROUP] Adding to existing group for lessonId: ${lessonId}`);
    }

    // Add this part's data to the collection
    acc[lessonId].parts.push({
      partNumber: lessonData.lessonPart || 1,
      contentScreens: lessonData.contentScreens || [],
    });

    // Also collect all content screens
    if (lessonData.contentScreens) {
      acc[lessonId].allContentScreens.push(...lessonData.contentScreens);
    }

    return acc;
  }, {} as Record<string, any>);

  // 🐛 DEBUG: Log grouped lessons
  console.log('═══════════════════════════════════════════════════════');
  console.log('🔍 [GROUP] Total unique lessons after grouping:', Object.keys(groupedLessonsMap).length);
  console.log('🔍 [GROUP] Lesson IDs:', Object.keys(groupedLessonsMap));
  Object.entries(groupedLessonsMap).forEach(([lessonId, lesson]: [string, any]) => {
    console.log(`🔍 [GROUP] Lesson ${lessonId}: "${lesson.title}" has ${lesson.parts.length} parts, unitId: ${lesson.unitId}`);
  });
  console.log('═══════════════════════════════════════════════════════');

  // Step: Convert grouped lessons map to array and calculate final properties
  console.log('🔄 [TRANSFORM] Converting grouped map to array...');
  const unsortedLessons = Object.values(groupedLessonsMap)
    .map((lesson, index) => {
      // Sort parts by part number
      const sortedParts = lesson.parts.sort((a: any, b: any) => a.partNumber - b.partNumber);

      const mappedLesson = {
        number: index + 1, // Temporary number, will be reassigned after sorting
        title: lesson.title,
        lessonTitle: lesson.lessonTitle,
        lessonId: lesson.lessonId,
        sectionId: lesson.sectionId,
        unitId: lesson.unitId,
        unitTitle: lesson.unitTitle,
        section: lesson.section,
        practice: lesson.practice,
        parts: sortedParts,
        totalParts: sortedParts.length, // ✅ FIX: This will now be 3 instead of 2
        contentScreens: lesson.allContentScreens, // All content screens from all parts
      };

      console.log(`🔄 [TRANSFORM] Mapped lesson ${index + 1}: lessonId=${mappedLesson.lessonId}, unitId=${mappedLesson.unitId}`);

      return mappedLesson;
    });

  console.log('═══════════════════════════════════════════════════════');
  console.log('📊 [SORT] Sorting lessons by unitId then lessonId...');
  console.log('📊 [SORT] Before sort - lesson count:', unsortedLessons.length);

  const sectionLessons = unsortedLessons.sort((a, b) => {
      // Sort by unitId first, then by lessonId
      const unitA = a.unitId || '';
      const unitB = b.unitId || '';

      console.log(`🔍 [SORT COMPARE] "${a.lessonId}" (unit: ${unitA}) vs "${b.lessonId}" (unit: ${unitB})`);

      if (unitA !== unitB) {
        const result = unitA.localeCompare(unitB);
        console.log(`  → Different units: ${unitA} vs ${unitB}, result: ${result}`);
        return result;
      }

      const result = a.lessonId.localeCompare(b.lessonId);
      console.log(`  → Same unit, comparing lessonIds: ${a.lessonId} vs ${b.lessonId}, result: ${result}`);
      return result;
    })
    .map((lesson, index) => ({
      ...lesson,
      number: index + 1, // Reassign numbers after sorting
    }));

  console.log('═══════════════════════════════════════════════════════');
  console.log('✅ [SORT] After sort - Final lesson order:');
  sectionLessons.forEach((lesson, i) => {
    console.log(`  ${i + 1}. ${lesson.lessonId} (${lesson.unitId}) - "${lesson.title}"`);
  });
  console.log('═══════════════════════════════════════════════════════');

  // 🐛 DEBUG: Log all lessons in this section
  useEffect(() => {
    console.log('📚 [ALL LESSONS IN SECTION]', sectionId);
    console.log('📚 [DB LESSONS RAW]', dbLessons);
    console.log('📚 [FILTERED SECTION LESSONS]', sectionLessons);
    sectionLessons.forEach((lesson, i) => {
      console.log(`📚 [LESSON ${i}] number: ${lesson.number}, lessonId: ${lesson.lessonId}, unitId: ${lesson.unitId}, title: "${lesson.title}"`);
    });
  }, [sectionId, sectionLessons, dbLessons]);

  // Step: Group lessons by unit for better organization
  console.log('═══════════════════════════════════════════════════════');
  console.log('🗂️ [UNIT GROUPING] Grouping lessons by unit...');

  const lessonsByUnit = sectionLessons.reduce((acc, lesson) => {
    const unitId = lesson.unitId || 'Unknown';

    console.log(`🗂️ [UNIT GROUPING] Processing lesson ${lesson.number}: "${lesson.title}", unitId: ${unitId}`);

    if (!acc[unitId]) {
      acc[unitId] = {
        unitId,
        unitTitle: lesson.unitTitle || 'Unknown Unit',
        lessons: []
      };
      console.log(`  → Created new unit group: ${unitId}`);
    }

    acc[unitId].lessons.push(lesson);
    console.log(`  → Added to unit ${unitId}, total lessons in unit: ${acc[unitId].lessons.length}`);

    return acc;
  }, {} as Record<string, { unitId: string; unitTitle: string; lessons: typeof sectionLessons }>);

  const units = Object.values(lessonsByUnit);

  console.log('═══════════════════════════════════════════════════════');
  console.log('✅ [UNIT GROUPING] Final unit groups:');
  units.forEach((unit, i) => {
    console.log(`  Unit ${i + 1}: ${unit.unitId} - "${unit.unitTitle}" with ${unit.lessons.length} lessons`);
    unit.lessons.forEach((lesson, j) => {
      console.log(`    ${j + 1}. ${lesson.lessonId} - "${lesson.title}"`);
    });
  });
  console.log('═══════════════════════════════════════════════════════');

  // Review dialog state
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [selectedLessonForReview, setSelectedLessonForReview] = useState<{ number: number; id?: string } | null>(null);

  // ✅ FIX: Check if lesson is completed and show review dialog
  const handleStartLesson = (lessonNumber: number, lessonId?: string) => {
    const isCompleted = lessonId ? isLessonCompleted(lessonId) : false;

    if (isCompleted) {
      // Show review dialog for completed lessons
      setSelectedLessonForReview({ number: lessonNumber, id: lessonId });
      setShowReviewDialog(true);
    } else {
      // Start lesson normally
      startLesson(lessonNumber, lessonId);
    }
  };

  // Start the lesson (called from dialog or directly)
  const startLesson = (lessonNumber: number, lessonId?: string, isReview: boolean = false) => {
    localStorage.setItem('currentLessonNumber', lessonNumber.toString());
    localStorage.setItem('lessonCategory', 'dark-psychology');
    if (lessonId) {
      localStorage.setItem('darkPsychLessonId', lessonId);
    }
    if (isReview) {
      localStorage.setItem('isReviewMode', 'true');
    } else {
      localStorage.removeItem('isReviewMode');
    }
    router.push('/yourlesson');
  };

  // ✅ FIX: Use lessonId instead of lessonNumber
  const handleDeleteLesson = async (lessonId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!confirm('Are you sure you want to delete this lesson?')) return;

    try {
      const response = await fetch('/api/delete-dark-psychology-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId }),
      });

      if (response.ok) {
        alert('Lesson deleted successfully!');
        window.location.reload();
      } else {
        alert('Failed to delete lesson');
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
      alert('Error deleting lesson');
    }
  };

  // ✅ FIX: Use lessonId instead of lessonNumber
  const handleEditLesson = (lessonId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    router.push(`/admin/edit-dark-psychology-lesson?lessonId=${lessonId}`);
  };

  // Step: Get lesson progress from Convex
  // ✅ FIX: Use lessonId instead of lessonNumber to avoid collision between units
  const getLessonProgress = (lessonId: string) => {
    const foundProgress = progress?.find(p => p.darkPsychLessonId === lessonId);
    // 🐛 DEBUG: Log progress lookup
    if (foundProgress) {
      console.log(`[PROGRESS DEBUG] Found progress for lessonId: ${lessonId}`, foundProgress);
    }
    return foundProgress;
  };

  const isLessonCompleted = (lessonId: string) => {
    const lessonProgress = getLessonProgress(lessonId);
    return lessonProgress?.isCompleted || false;
  };

  // ✅ FIX: Get completed parts by checking progress for each part file (B1-1-Part1, B1-1-Part2, etc.)
  const getCompletedParts = (lessonId: string, totalParts: number): number[] => {
    const completedParts: number[] = [];

    // Check each part separately (since each part is stored as separate database entry)
    for (let partNum = 1; partNum <= totalParts; partNum++) {
      const partKey = `${lessonId}-Part${partNum}`;
      const partProgress = progress?.find(p => p.darkPsychLessonId === partKey);

      if (partProgress?.isCompleted) {
        completedParts.push(partNum);
      }
    }

    return completedParts;
  };

  const getReviewedParts = (lessonId: string, totalParts: number): number[] => {
    const reviewedParts: number[] = [];

    // Check each part separately
    for (let partNum = 1; partNum <= totalParts; partNum++) {
      const partKey = `${lessonId}-Part${partNum}`;
      const partProgress = progress?.find(p => p.darkPsychLessonId === partKey);

      if (partProgress?.reviewedParts && partProgress.reviewedParts.length > 0) {
        reviewedParts.push(partNum);
      }
    }

    return reviewedParts;
  };

  // Calculate path height considering all lessons and unit offsets
  // ✅ FIX: Must account for unitVerticalOffset (680px per unit) added to each unit
  const pathHeight = (() => {
    if (units.length === 0) return 800;

    // Get the last unit
    const lastUnit = units[units.length - 1];
    const lastUnitIndex = units.length - 1;
    const lastUnitOffset = lastUnitIndex * 680;

    // Get the last lesson position within that unit
    const lastLessonIndexInUnit = lastUnit.lessons.length;
    const lastLessonBasePosition = getLessonPosition(lastLessonIndexInUnit);

    // Total height = base position + unit offset + extra padding
    const totalHeight = lastLessonBasePosition.y + lastUnitOffset + 300;

    console.log('🔍 [PATH HEIGHT] Calculation:');
    console.log('  → Last unit index:', lastUnitIndex);
    console.log('  → Last unit offset:', lastUnitOffset);
    console.log('  → Last lesson base Y:', lastLessonBasePosition.y);
    console.log('  → Total path height:', totalHeight);

    return totalHeight;
  })();

  // Scroll-triggered fade-in refs
  const lessonRefs = useRef<(HTMLDivElement | null)[]>([]);
  const unitHeaderRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Step: Add smooth scroll to unit function
  const scrollToUnit = (unitIndex: number) => {
    const unitHeader = unitHeaderRefs.current[unitIndex];
    if (unitHeader) {
      unitHeader.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Step: Handle delete all lessons in section
  const handleDeleteAllInSection = async () => {
    if (!confirm(`Are you sure you want to delete ALL ${sectionLessons.length} lessons in Section ${sectionId}? This cannot be undone!`)) {
      return;
    }

    try {
      const result = await deleteAllInSection({ sectionId });
      alert(result.message);
      window.location.reload();
    } catch (error: any) {
      console.error('Error deleting lessons:', error);
      alert('Failed to delete lessons: ' + error.message);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    lessonRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    unitHeaderRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionLessons.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#1F2937] to-gray-950 relative overflow-hidden">
      {/* Subtle animated gradient overlay */}
      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .bg-animated {
          background: linear-gradient(125deg, #111827 0%, #1F2937 30%, #1E1B4B 70%, #0F172A 100%);
          background-size: 400% 400%;
          animation: gradientShift 20s ease infinite;
        }
      `}</style>

      {/* Header */}
      <div className="bg-animated border-b border-gray-800/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/dark-psychology")}
              className="flex items-center gap-2 border-gray-700 text-gray-200 hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {sectionId}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{sectionTitle}</h1>
              <p className="text-xs text-gray-400">{sectionLessons.length} lessons</p>
            </div>
          </div>

          {/* Delete All Button */}
          {sectionLessons.length > 0 && (
            <Button
              variant="outline"
              onClick={handleDeleteAllInSection}
              className="flex items-center gap-2 border-red-600/70 text-red-400 hover:bg-red-900/60"
            >
              <Trash2 className="h-4 w-4" />
              Clear Section
            </Button>
          )}
        </div>
      </div>

      {/* Main Content - Path Layout */}
      <div className="max-w-2xl mx-auto px-4 py-8 relative">
        {sectionLessons.length === 0 ? (
          <div className="text-center py-16 bg-gray-800/40 backdrop-blur rounded-xl border border-gray-700/50 shadow-lg">
            <Brain className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No Lessons Yet</h2>
            <p className="text-gray-400 mb-4 max-w-md mx-auto px-4">
              Even shadows begin with a single step.  
              Create your first lesson in the art of influence.
            </p>
            <Button
              onClick={() => router.push("/admin/add-dark-psychology-lesson")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md"
            >
              Add First Lesson
            </Button>
          </div>
        ) : (
          <div className="relative" style={{ minHeight: `${pathHeight}px` }}>
            {/* Step: Render lessons grouped by units with unit headers */}
            {units.map((unit, unitIndex) => {
              // Calculate starting position for this unit
              const prevUnitsLessonCount = units
                .slice(0, unitIndex)
                .reduce((sum, u) => sum + u.lessons.length, 0);

              return (
                <React.Fragment key={unit.unitId}>
                  {/* Unit Header Separator - DISABLED TO SEE ALL LESSONS */}
                  {false && unitIndex > 0 && (
                    <div
                      ref={(el) => { unitHeaderRefs.current[unitIndex] = el; }}
                      className="absolute left-1/2 -translate-x-1/2 opacity-0 translate-y-4 transition-all duration-500 ease-out z-20 w-full max-w-md"
                      style={{
                        // ✅ FIX: Position at the top of each unit (before first lesson)
                        top: `${(unitIndex * 550) +50}px`,
                      }}
                    >
                      <div className="bg-gradient-to-r from-transparent via-purple-500/20 to-transparent h-px w-full mb-4" />
                      <div className="text-center bg-gray-800/60 backdrop-blur-sm rounded-full px-6 py-2 mx-auto w-fit border border-purple-500/30">
                        <p className="text-purple-400 font-bold text-sm">{unit.unitTitle}</p>
                        <p className="text-gray-400 text-xs">{unit.lessons.length} lessons</p>
                      </div>
                      <div className="bg-gradient-to-r from-transparent via-purple-500/20 to-transparent h-px w-full mt-4" />
                    </div>
                  )}

                  {/* Unit Lessons */}
                  {unit.lessons.map((lesson, lessonIndexInUnit) => {
                    const globalLessonIndex = prevUnitsLessonCount + lessonIndexInUnit;
                    // ✅ FIX: Use lesson.number for position pattern, but add unit offset for vertical spacing
                    const positionIndex = lessonIndexInUnit + 1; // 1-based position within this unit
                    const unitVerticalOffset = unitIndex * 680; // Each unit adds 680px vertical space
                    const basePosition = getLessonPosition(positionIndex);
                    const position = {
                      x: basePosition.x,
                      y: basePosition.y + unitVerticalOffset
                    };

                    // 🐛 DEBUG: Log lesson position calculation
                    console.log(`🎯 [POSITION] Lesson ${lesson.number} (${lesson.lessonId}):`);
                    console.log(`  → Unit index: ${unitIndex}, Position in unit: ${positionIndex}`);
                    console.log(`  → Base position: x=${basePosition.x}%, y=${basePosition.y}px`);
                    console.log(`  → Unit offset: ${unitVerticalOffset}px`);
                    console.log(`  → Final position: x=${position.x}%, y=${position.y}px`);

                    // ✅ FIX: Use lessonId instead of number to avoid collision
                    const lessonUniqueId = lesson.lessonId || `${lesson.section}-${lesson.number}`;
                    const totalParts = lesson.totalParts || lesson.parts?.length || 1;
                    const completedParts = getCompletedParts(lessonUniqueId, totalParts);
                    // Check if ALL parts are completed
                    const completed = completedParts.length === totalParts;

                    // 🐛 DEBUG: Log lesson details
                    console.log(`[LESSON DEBUG] Unit: ${unit.unitId}, Lesson Number: ${lesson.number}, Unique ID: ${lessonUniqueId}`);
                    console.log(`[LESSON DEBUG] Is Completed: ${completed}, Completed Parts:`, completedParts);
                    console.log(`[LESSON DEBUG] Lesson Title: "${lesson.title}"`);
                    console.log('---');

                    return (
                      <div
                        ref={(el) => { lessonRefs.current[globalLessonIndex] = el; }}
                        key={`${unit.unitId}-${lesson.lessonId}`}
                        className="absolute opacity-0 translate-y-4 transition-all duration-500 ease-out"
                        style={{
                          left: `${position.x}%`,
                          top: `${position.y}px`,
                          transform: 'translate(-50%, -50%)',
                          zIndex: 10,
                        }}
                      >
                  <div className="relative group">
                    <button
                      onClick={() => handleStartLesson(lesson.number, lessonUniqueId)}
                      className="relative w-20 h-20 outline-none"
                    >
                      {/* Progress Ring - ✅ FIX: Always show ring for all lessons */}
                      <svg
                        className="absolute inset-0 w-20 h-20"
                        style={{ transform: 'rotate(-90deg)', pointerEvents: 'none' }}
                        viewBox="0 0 80 80"
                        ref={(svg) => {
                          if (svg) {
                            console.log(`🔵 [RING] Lesson ${lesson.number}: "${lesson.title}"`);
                            console.log(`🔵 [RING] Total parts: ${totalParts}`);
                            console.log(`🔵 [RING] Completed parts array:`, completedParts);
                          }
                        }}
                      >
                        {/* Step: Draw progress ring using circle with stroke-dasharray */}
                        {totalParts === 1 ? (
                          // Single-part lesson: Full circle ring
                          <>
                            {/* Background circle (gray) */}
                            <circle
                              cx="40"
                              cy="40"
                              r="36"
                              fill="none"
                              stroke="#374151"
                              strokeWidth="4"
                            />
                            {/* Progress circle (purple) - only show if completed */}
                            {completedParts.includes(1) && (
                              <circle
                                cx="40"
                                cy="40"
                                r="36"
                                fill="none"
                                stroke={completed ? '#C084FC' : '#A78BFA'}
                                strokeWidth="4"
                                className="transition-all duration-500"
                              />
                            )}
                          </>
                        ) : (
                          // Multi-part lesson: Segmented arcs
                          Array.from({ length: totalParts }).map((_, partIndex) => {
                            const partNumber = partIndex + 1;
                            const isPartCompleted = completedParts.includes(partNumber);

                            console.log(`🔵 [RING] Part ${partNumber}: ${isPartCompleted ? '✅ FILLED' : '⭕ EMPTY'}`);
                            const anglePerPart = 360 / totalParts;
                            const startAngle = anglePerPart * partIndex;
                            const endAngle = anglePerPart * (partIndex + 1);
                            const startRad = (startAngle * Math.PI) / 180;
                            const endRad = (endAngle * Math.PI) / 180;
                            const radius = 36;
                            const centerX = 40;
                            const centerY = 40;
                            // Round to 2 decimal places to avoid hydration errors
                            const x1 = Math.round((centerX + radius * Math.cos(startRad)) * 100) / 100;
                            const y1 = Math.round((centerY + radius * Math.sin(startRad)) * 100) / 100;
                            const x2 = Math.round((centerX + radius * Math.cos(endRad)) * 100) / 100;
                            const y2 = Math.round((centerY + radius * Math.sin(endRad)) * 100) / 100;
                            const largeArc = anglePerPart > 180 ? 1 : 0;

                            return (
                              <g key={partIndex}>
                                {/* Background arc */}
                                <path
                                  d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`}
                                  fill="none"
                                  stroke="#374151"
                                  strokeWidth="4"
                                />
                                {/* Progress arc if completed */}
                                {isPartCompleted && (
                                  <path
                                    d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`}
                                    fill="none"
                                    stroke={completed ? '#C084FC' : '#A78BFA'}
                                    strokeWidth="4"
                                    className="transition-all duration-500"
                                  />
                                )}
                              </g>
                            );
                          })
                        )}

                        {/* Step: Draw divider lines on top - from center to START of each segment */}
                        {totalParts > 1 && Array.from({ length: totalParts }).map((_, partIndex) => {
                          const anglePerPart = 360 / totalParts;
                          const startAngle = anglePerPart * partIndex;
                          const startRad = (startAngle * Math.PI) / 180;
                          const radius = 38; // Slightly longer than ring radius
                          const centerX = 40;
                          const centerY = 40;
                          const x1 = Math.round((centerX + radius * Math.cos(startRad)) * 100) / 100;
                          const y1 = Math.round((centerY + radius * Math.sin(startRad)) * 100) / 100;

                          return (
                            <line
                              key={`divider-${partIndex}`}
                              x1={centerX}
                              y1={centerY}
                              x2={x1}
                              y2={y1}
                              stroke="#1F2937"
                              strokeWidth="2.5"
                            />
                          );
                        })}
                      </svg>

                      {/* Inner Lesson Icon - Centered inside the ring */}
                      <div
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 transform group-hover:scale-105 active:scale-95 shadow-lg ${
                          completed
                            ? 'bg-gradient-to-br from-purple-600 to-indigo-600'
                            : 'bg-gradient-to-br from-purple-600 to-indigo-700'
                        }`}
                      >
                        {completed ? (
                          <Check className="h-8 w-8 text-white font-bold" strokeWidth={3} />
                        ) : (
                          <Star className="h-8 w-8 text-white" />
                        )}
                      </div>
                    </button>

                    {/* Lesson Info */}
                    <div className="absolute top-22 left-1/2 transform -translate-x-1/2 w-64 text-center mt-0">
                      <p className="text-white font-bold text-sm mb-1">
                        Lesson {lesson.number}
                      </p>
                      <p className="text-gray-300 text-xs font-medium line-clamp-2 mb-3">
                        {lesson.lessonTitle || lesson.title}
                      </p>

                      <div className="flex items-center justify-center gap-2">
                        <Button
                          onClick={(e) => handleEditLesson(lessonUniqueId, e)}
                          variant="outline"
                          size="sm"
                          className="border-gray-600 hover:bg-gray-700 text-gray-200 h-7 px-2"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={(e) => handleDeleteLesson(lessonUniqueId, e)}
                          variant="outline"
                          size="sm"
                          className="border-red-600/70 hover:bg-red-900/60 text-red-400 h-7 px-2"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>

      {/* Review Dialog */}
      {showReviewDialog && selectedLessonForReview && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#1F2937] rounded-2xl p-8 max-w-md w-full mx-4 border-2 border-purple-500/30 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">Lesson Completed!</h3>
            <p className="text-gray-300 mb-6">
              You've already completed this lesson. Would you like to review it for 5 XP?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  startLesson(selectedLessonForReview.number, selectedLessonForReview.id, true);
                  setShowReviewDialog(false);
                }}
                className="flex-1 bg-[#58CC02] hover:bg-[#46A302] text-white font-bold py-4 rounded-xl border-b-4 border-[#46A302] active:border-b-0 active:mt-1 transition-all"
              >
                Review for 5 XP
              </button>
              <button
                onClick={() => {
                  setShowReviewDialog(false);
                  setSelectedLessonForReview(null);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-4 rounded-xl border-b-4 border-gray-700 active:border-b-0 active:mt-1 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}