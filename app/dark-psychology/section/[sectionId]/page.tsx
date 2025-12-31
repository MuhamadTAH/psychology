// 🧠 FILE PURPOSE
// Individual section page for Dark Psychology.
// Shows all lessons for a specific section in a winding path layout like the learn page.
// ✨ Enhanced with immersive, ethical, and attention-grabbing UI — no logic changed.

"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { BookOpen, Trash2, Edit, ArrowLeft, Star, Check, Lock } from "lucide-react";
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

  const { user, isLoaded, isSignedIn } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const shouldLoad = isLoaded && isSignedIn;

  // Redirect unauthenticated users to sign-in
  if (isLoaded && !isSignedIn) {
    router.push("/sign-in");
    return null;
  }

  const progress = useQuery(api.lessons.getUserProgress, shouldLoad && userEmail ? { email: userEmail } : "skip");

  // Step: Query subscription status to check if user is premium
  // Free users can only access lessons 1-5, premium users get all lessons
  const subscriptionData = useQuery(api.gamification.getSubscriptionStatus);
  const isPremium = subscriptionData?.isPremium ?? false;

  useEffect(() => {
    // Progress data updated
  }, [progress, userEmail]);

  // Step: Pre-load click sound for instant playback
  // Loading sound once makes it play immediately when clicked
  const [buttonSound] = useState(() => {
    if (typeof window !== 'undefined') {
      const sound = new Audio('/sounds/button-click.mp3');
      sound.volume = 0.5;
      return sound;
    }
    return null;
  });

  const playClickSound = () => {
    if (buttonSound) {
      buttonSound.currentTime = 0; // Reset to start
      buttonSound.play().catch(() => {});
    }
  };

  // Step: Load all Dark Psychology lessons from database
  const dbLessons = useQuery(api.lessons.getAllDarkPsychologyLessons, shouldLoad ? {} : "skip");

  // Step: Mutation to delete all lessons in this section
  const deleteAllInSection = useMutation(api.darkPsychology.deleteAllLessonsInSection);

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
    } else {
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

  // Step: Convert grouped lessons map to array and calculate final properties
  const unsortedLessons = Object.values(groupedLessonsMap)
    .map((lesson, index) => {
      // Sort parts by part number
      const sortedParts = lesson.parts.sort((a: any, b: any) => a.partNumber - b.partNumber);

      return {
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
        totalParts: sortedParts.length,
        contentScreens: lesson.allContentScreens,
      };
    });

  const sectionLessons = unsortedLessons.sort((a, b) => {
      // Sort by unitId first, then by lessonId
      const unitA = a.unitId || '';
      const unitB = b.unitId || '';

      if (unitA !== unitB) {
        return unitA.localeCompare(unitB);
      }

      return a.lessonId.localeCompare(b.lessonId);
    })
    .map((lesson, index) => ({
      ...lesson,
      number: index + 1, // Reassign numbers after sorting
    }));

  // Step: Group lessons by unit for better organization
  const lessonsByUnit = sectionLessons.reduce((acc, lesson) => {
    const unitId = lesson.unitId || 'Unknown';

    if (!acc[unitId]) {
      acc[unitId] = {
        unitId,
        unitTitle: lesson.unitTitle || 'Unknown Unit',
        lessons: []
      };
    }

    acc[unitId].lessons.push(lesson);
    return acc;
  }, {} as Record<string, { unitId: string; unitTitle: string; lessons: typeof sectionLessons }>);

  const units = Object.values(lessonsByUnit);

  // Review dialog state
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [selectedLessonForReview, setSelectedLessonForReview] = useState<{ number: number; id?: string } | null>(null);

  // ✅ FIX: Check if lesson is completed and show review dialog
  const handleStartLesson = (lessonNumber: number, lessonId?: string) => {
    // Step: Play click sound when clicking on a lesson
    playClickSound();

    // Step: Check if lesson is locked for free users
    // Free users can only access lessons 1-5
    if (!isPremium && lessonNumber > 5) {
      // Show premium upgrade dialog for locked lessons
      alert('This lesson is locked. Upgrade to premium to unlock all lessons!');
      router.push('/welcome'); // Redirect to paywall
      return;
    }

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
    localStorage.setItem('darkPsychSectionId', sectionId); // Store section ID for back navigation
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
    return progress?.find(p => p.darkPsychLessonId === lessonId);
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
              onClick={() => {
                playClickSound();
                router.push("/dark-psychology");
              }}
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

                    // ✅ FIX: Use lessonId instead of number to avoid collision
                    const lessonUniqueId = lesson.lessonId || `${lesson.section}-${lesson.number}`;
                    const totalParts = lesson.totalParts || lesson.parts?.length || 1;
                    const completedParts = getCompletedParts(lessonUniqueId, totalParts);
                    // Check if ALL parts are completed
                    const completed = completedParts.length === totalParts;

                    // Step: Check if lesson is locked for free users
                    // Free users can only access lessons 1-5
                    const isLocked = !isPremium && lesson.number > 5;

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
                            {/* Progress circle (purple for normal, gray for locked) - only show if completed */}
                            {completedParts.includes(1) && (
                              <circle
                                cx="40"
                                cy="40"
                                r="36"
                                fill="none"
                                stroke={isLocked ? '#6B7280' : (completed ? '#C084FC' : '#A78BFA')}
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
                                    stroke={isLocked ? '#6B7280' : (completed ? '#C084FC' : '#A78BFA')}
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
                          isLocked
                            ? 'bg-gradient-to-br from-gray-600 to-gray-700'
                            : completed
                            ? 'bg-gradient-to-br from-purple-600 to-indigo-600'
                            : 'bg-gradient-to-br from-purple-600 to-indigo-700'
                        }`}
                      >
                        {isLocked ? (
                          <Lock className="h-8 w-8 text-gray-300" />
                        ) : completed ? (
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
                  playClickSound();
                  startLesson(selectedLessonForReview.number, selectedLessonForReview.id, true);
                  setShowReviewDialog(false);
                }}
                className="flex-1 bg-[#58CC02] hover:bg-[#46A302] text-white font-bold py-4 rounded-xl border-b-4 border-[#46A302] active:border-b-0 active:mt-1 transition-all"
              >
                Review for 5 XP
              </button>
              <button
                onClick={() => {
                  playClickSound();
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
