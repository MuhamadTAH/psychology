// 🧠 FILE PURPOSE
// Client-side component for migrating Dark Psychology lessons.
// Analyzes and downloads upgraded version of darkPsychologyLessons.ts

"use client";

import { useState } from "react";
import { FileDown, AlertTriangle, CheckCircle, Code } from "lucide-react";
import { DARK_PSYCHOLOGY_LESSONS } from "@/md/lib/darkPsychologyLessons";

export function MigrateDarkPsychology() {
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Step 1: Analyze Dark Psychology lessons
  const analyzeDarkPsychLessons = () => {
    let totalLessons = 0;
    let needsMigration = 0;
    const upgradeTypes: { [key: string]: number } = {};
    const lessonsNeedingUpgrade: any[] = [];

    DARK_PSYCHOLOGY_LESSONS.forEach((lesson) => {
      totalLessons++;

      // Check if lesson has parts (multi-part lessons)
      if (lesson.parts && Array.isArray(lesson.parts)) {
        lesson.parts.forEach((part) => {
          const exercises = part.questions || [];
          const upgrades = analyzeExercises(exercises);

          if (upgrades.length > 0) {
            needsMigration++;
            upgrades.forEach((upgrade) => {
              upgradeTypes[upgrade] = (upgradeTypes[upgrade] || 0) + 1;
            });

            lessonsNeedingUpgrade.push({
              lessonId: lesson.lessonId || `${lesson.section}-${lesson.number}`,
              lessonTitle: lesson.lessonTitle || lesson.title,
              partNumber: part.partNumber,
              partTitle: part.partTitle,
              neededUpgrades: upgrades,
            });
          }
        });
      }

      // Check legacy practice field
      if (lesson.practice && Array.isArray(lesson.practice)) {
        const upgrades = analyzeExercises(lesson.practice);

        if (upgrades.length > 0) {
          needsMigration++;
          upgrades.forEach((upgrade) => {
            upgradeTypes[upgrade] = (upgradeTypes[upgrade] || 0) + 1;
          });

          lessonsNeedingUpgrade.push({
            lessonId: lesson.lessonId || `${lesson.section}-${lesson.number}`,
            lessonTitle: lesson.lessonTitle || lesson.title,
            partNumber: null,
            partTitle: "Legacy Practice",
            neededUpgrades: upgrades,
          });
        }
      }
    });

    setAnalysisResult({
      totalLessons,
      needsMigration,
      upgradeTypes,
      lessonsNeedingUpgrade,
    });
  };

  // Step 2: Analyze exercises for needed upgrades
  const analyzeExercises = (exercises: any[]): string[] => {
    const neededUpgrades: string[] = [];

    exercises.forEach((exercise) => {
      // Check matching format
      if (exercise.type === "matching" && exercise.pairs && Array.isArray(exercise.pairs)) {
        neededUpgrades.push("MATCHING_FORMAT_OLD");
      }

      // Check fill-in-blank format
      if (
        (exercise.type === "fill-in-blank" || exercise.type === "fill-in") &&
        !exercise.answers &&
        exercise.correctAnswer
      ) {
        neededUpgrades.push("FILL_IN_FORMAT_OLD");
      }

      // Check multiple choice string options
      if (
        exercise.type === "multiple-choice" &&
        exercise.options &&
        typeof exercise.options[0] === "string"
      ) {
        neededUpgrades.push("MULTIPLE_CHOICE_STRING_OPTIONS");
      }

      // Check correct field
      if ((exercise as any).correct && !exercise.correctAnswer) {
        neededUpgrades.push("CORRECT_FIELD_MIGRATION");
      }
    });

    return [...new Set(neededUpgrades)];
  };

  // Step 3: Apply upgrades to exercises
  const applyUpgrades = (exercises: any[]): any[] => {
    return exercises.map((exercise) => {
      const upgraded = { ...exercise };

      // Upgrade matching pairs
      if (exercise.type === "matching" && exercise.pairs && Array.isArray(exercise.pairs)) {
        const pairsObject: any = {};
        exercise.pairs.forEach((pair: any) => {
          if (pair.term && pair.definition) {
            pairsObject[pair.term] = pair.definition;
          }
        });
        upgraded.pairs = pairsObject;
      }

      // Upgrade fill-in-blank
      if (
        (exercise.type === "fill-in-blank" || exercise.type === "fill-in") &&
        !exercise.answers &&
        exercise.correctAnswer
      ) {
        const correctAnswers = Array.isArray(exercise.correctAnswer)
          ? exercise.correctAnswer
          : [exercise.correctAnswer];
        upgraded.answers = correctAnswers;
      }

      // Upgrade multiple choice options
      if (
        exercise.type === "multiple-choice" &&
        exercise.options &&
        typeof exercise.options[0] === "string"
      ) {
        upgraded.options = exercise.options.map((opt: string, idx: number) => ({
          id: String.fromCharCode(97 + idx),
          text: opt,
        }));
      }

      // Upgrade correct field
      if ((exercise as any).correct && !exercise.correctAnswer) {
        upgraded.correctAnswer = (exercise as any).correct;
        delete upgraded.correct;
      }

      return upgraded;
    });
  };

  // Step 4: Generate upgraded file
  const generateUpgradedFile = () => {
    const upgradedLessons = DARK_PSYCHOLOGY_LESSONS.map((lesson) => {
      const upgradedLesson = { ...lesson };

      // Upgrade parts
      if (lesson.parts && Array.isArray(lesson.parts)) {
        upgradedLesson.parts = lesson.parts.map((part) => ({
          ...part,
          questions: applyUpgrades(part.questions || []),
        }));
      }

      // Upgrade legacy practice
      if (lesson.practice && Array.isArray(lesson.practice)) {
        upgradedLesson.practice = applyUpgrades(lesson.practice);
      }

      return upgradedLesson;
    });

    // Generate TypeScript file content
    const fileContent = `// 🧠 FILE PURPOSE
// This file contains Dark Psychology lessons that all users can access.
// Lessons are added via the admin panel and stored here globally.
// ⚠️ AUTO-GENERATED FILE - DO NOT EDIT MANUALLY

export interface LessonPart {
  partNumber: number;
  partTitle: string;
  questions: any[];
}

export interface DarkPsychologyLesson {
  // Legacy fields (backward compatibility)
  number: number;
  title: string;
  section: string;
  practice: any[];
  parts?: LessonPart[];
  totalParts?: number;

  // New comprehensive structure
  sectionId?: string;
  sectionTitle?: string;
  unitId?: string;
  unitTitle?: string;
  lessonId?: string;
  lessonTitle?: string;
  lessonType?: string;
  lessonPart?: number;
  lessonPartTitle?: string;
  objective?: string;
  gamification?: any;
  contentScreens?: any[];
}

export const DARK_PSYCHOLOGY_LESSONS: DarkPsychologyLesson[] = ${JSON.stringify(
      upgradedLessons,
      null,
      2
    )};
`;

    // Download file
    const blob = new Blob([fileContent], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "darkPsychologyLessons.ts";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border-2 border-purple-500/30 p-6">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <Code className="w-6 h-6 text-purple-400" />
        Dark Psychology Lessons Migration
      </h2>

      <p className="text-gray-300 mb-4">
        Dark Psychology lessons are stored in a static TypeScript file. Click below to analyze and
        download the upgraded version.
      </p>

      <div className="space-y-4">
        {!analysisResult ? (
          <button
            onClick={analyzeDarkPsychLessons}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <AlertTriangle className="w-5 h-5" />
            <span>Analyze Dark Psychology Lessons</span>
          </button>
        ) : (
          <>
            {/* Analysis Results */}
            <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Lessons:</span>
                <span className="text-white font-bold">{analysisResult.totalLessons}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Needs Migration:</span>
                <span className="text-yellow-400 font-bold">{analysisResult.needsMigration}</span>
              </div>

              {Object.keys(analysisResult.upgradeTypes).length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-gray-400 text-sm mb-2">Upgrade Types:</p>
                  {Object.entries(analysisResult.upgradeTypes).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-400">{type.replace(/_/g, " ")}</span>
                      <span className="text-white">{count as number}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lessons Needing Upgrade */}
            {analysisResult.lessonsNeedingUpgrade.length > 0 && (
              <div className="bg-gray-800/50 rounded-lg p-4 max-h-64 overflow-y-auto">
                <p className="text-gray-400 text-sm mb-2">
                  Lessons Needing Upgrade ({analysisResult.lessonsNeedingUpgrade.length}):
                </p>
                <div className="space-y-2">
                  {analysisResult.lessonsNeedingUpgrade.map((lesson: any, idx: number) => (
                    <div key={idx} className="text-sm bg-gray-900/50 rounded p-2">
                      <p className="text-white font-semibold">
                        {lesson.lessonId} - {lesson.lessonTitle}
                      </p>
                      <p className="text-gray-400 text-xs">{lesson.partTitle}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {lesson.neededUpgrades.map((upgrade: string) => (
                          <span
                            key={upgrade}
                            className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded"
                          >
                            {upgrade.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Download Button */}
            <button
              onClick={generateUpgradedFile}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <FileDown className="w-5 h-5" />
              <span>Download Upgraded darkPsychologyLessons.ts</span>
            </button>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-blue-300 text-sm">
                <strong>Instructions:</strong> After downloading, replace the file at{" "}
                <code className="bg-gray-900 px-1 rounded">lib/darkPsychologyLessons.ts</code> with
                the downloaded version.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ✅ In this component we achieved:
// Analysis of Dark Psychology lessons for needed upgrades.
// Automatic generation of upgraded TypeScript file.
// Download functionality with clear instructions.
